const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Stripe configuration
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Supabase Client (backend)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// ============================================
// POST /api/stripe/create-checkout-session
// Crear reservación + Stripe Checkout Session
// ============================================

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { 
            customer_name,
            customer_email,
            customer_phone,
            reservation_date,
            reservation_time,
            party_size,
            special_requests
        } = req.body;

        // Validar datos requeridos
        if (!customer_name || !customer_email || !customer_phone || !reservation_date || !reservation_time || !party_size) {
            return res.status(400).json({ 
                error: 'Faltan datos requeridos para la reservación' 
            });
        }

        const amount = party_size * 2000; // $20 por persona en centavos

        console.log(`💳 Creando reservación y checkout de $${amount/100} para ${customer_email}`);

        // PASO 1: Crear reservación en Supabase
        const { data: reservation, error: reservationError } = await supabase
            .from('reservations')
            .insert([{
                customer_name,
                customer_email,
                customer_phone,
                reservation_date,
                reservation_time,
                party_size,
                special_requests: special_requests || null,
                status: 'pending'
            }])
            .select()
            .single();

        if (reservationError) {
            console.error('❌ Error creando reservación:', reservationError);
            throw new Error('No se pudo crear la reservación');
        }

        console.log(`✅ Reservación creada: ${reservation.id}`);
        console.log(`   Código: ${reservation.confirmation_code}`);

        // PASO 2: Crear Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: customer_email,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Reservación ${reservation.confirmation_code}`,
                        description: `${party_size} personas - ${reservation_date} a las ${reservation_time}`,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            payment_intent_data: {
                capture_method: 'manual', // HOLD, no cobro inmediato
                metadata: {
                    reservation_id: reservation.id,
                    confirmation_code: reservation.confirmation_code,
                    customer_name,
                    party_size: party_size.toString(),
                    reservation_date,
                    reservation_time,
                    type: 'reservation_hold'
                }
            },
            success_url: `${req.headers.origin || 'http://localhost:8080'}/reservation-success.html?session_id={CHECKOUT_SESSION_ID}&code=${reservation.confirmation_code}`,
            cancel_url: `${req.headers.origin || 'http://localhost:8080'}/reservations.html?cancelled=true`,
            metadata: {
                reservation_id: reservation.id,
                confirmation_code: reservation.confirmation_code
            }
        });

        console.log(`✅ Checkout Session creado: ${session.id}`);

        // PASO 3: Guardar pago pendiente en Supabase
        const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
                reservation_id: reservation.id,
                stripe_payment_intent_id: session.id, // Guardar session_id temporalmente
                amount_cents: amount,
                currency: 'usd',
                status: 'pending'
            }]);

        if (paymentError) {
            console.error('❌ Error guardando pago:', paymentError);
        }

        // Retornar URL de checkout
        res.json({
            success: true,
            checkout_url: session.url,
            reservation_id: reservation.id,
            confirmation_code: reservation.confirmation_code
        });

    } catch (error) {
        console.error('❌ Error creando checkout:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// POST /api/stripe/capture-hold
// Capturar hold (cobrar) - para no-shows
// ============================================
router.post('/capture-hold', async (req, res) => {
    try {
        const { reservation_id } = req.body;

        if (!reservation_id) {
            return res.status(400).json({ error: 'Falta reservation_id' });
        }

        // Buscar pago
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .select('stripe_payment_intent_id')
            .eq('reservation_id', reservation_id)
            .single();

        if (paymentError || !payment) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        // Capturar en Stripe
        const paymentIntent = await stripe.paymentIntents.capture(payment.stripe_payment_intent_id);

        // Actualizar en Supabase
        await supabase
            .from('payments')
            .update({ status: 'captured' })
            .eq('reservation_id', reservation_id);

        await supabase
            .from('reservations')
            .update({ status: 'no_show' })
            .eq('id', reservation_id);

        res.json({ success: true, paymentIntent });

    } catch (error) {
        console.error('❌ Error capturando hold:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// POST /api/stripe/release-hold
// Liberar hold (cancelar) - cliente llegó
// ============================================
router.post('/release-hold', async (req, res) => {
    try {
        const { reservation_id } = req.body;

        if (!reservation_id) {
            return res.status(400).json({ error: 'Falta reservation_id' });
        }

        // Buscar pago
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .select('stripe_payment_intent_id')
            .eq('reservation_id', reservation_id)
            .single();

        if (paymentError || !payment) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        // Cancelar en Stripe
        const paymentIntent = await stripe.paymentIntents.cancel(payment.stripe_payment_intent_id);

        // Actualizar en Supabase
        await supabase
            .from('payments')
            .update({ status: 'released' })
            .eq('reservation_id', reservation_id);

        res.json({ success: true, paymentIntent });

    } catch (error) {
        console.error('❌ Error liberando hold:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// POST /api/stripe/webhook
// Webhook de Stripe para eventos
// ============================================
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar eventos
    switch (event.type) {
        case 'payment_intent.succeeded':
            console.log('✅ PaymentIntent succeeded:', event.data.object.id);
            break;
        case 'payment_intent.payment_failed':
            console.log('❌ PaymentIntent failed:', event.data.object.id);
            break;
        default:
            console.log(`ℹ️ Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;
