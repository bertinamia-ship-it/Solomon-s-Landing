const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Crear Stripe Checkout Session para pago directo
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

        const holdAmount = party_size * 2000; // $20 por persona en centavos

        console.log(`🛒 Creando Checkout Session para ${customer_name}: $${holdAmount/100}`);

        // Crear reservación primero
        const { data: reservation, error: resError } = await supabase
            .from('reservations')
            .insert({
                customer_name,
                customer_email,
                customer_phone,
                reservation_date,
                reservation_time,
                party_size,
                special_requests: special_requests || null,
                status: 'pending'
            })
            .select()
            .single();

        if (resError) {
            console.error('Error creando reservación:', resError);
            return res.status(500).json({ error: 'Error al crear reservación' });
        }

        console.log('✅ Reservación creada:', reservation.id);

        // Crear Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: customer_email,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Reservación Solomon's Landing`,
                        description: `Hold para ${party_size} personas el ${reservation_date} a las ${reservation_time}`,
                        images: ['https://solomonslanding.com/logo-solomons.png']
                    },
                    unit_amount: holdAmount
                },
                quantity: 1
            }],
            metadata: {
                reservation_id: reservation.id,
                reservation_date,
                reservation_time,
                party_size: party_size.toString()
            },
            success_url: `${req.headers.origin || 'http://localhost:8080'}/reservation-success.html?session_id={CHECKOUT_SESSION_ID}&code=${reservation.confirmation_code}`,
            cancel_url: `${req.headers.origin || 'http://localhost:8080'}/reservations.html?cancelled=true`,
            payment_intent_data: {
                capture_method: 'manual', // HOLD - no cobrar aún
                metadata: {
                    reservation_id: reservation.id
                }
            }
        });

        console.log('✅ Checkout Session creada:', session.id);

        res.json({
            sessionId: session.id,
            url: session.url,
            reservation_id: reservation.id,
            confirmation_code: reservation.confirmation_code
        });

    } catch (error) {
        console.error('❌ Error en checkout:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook para manejar eventos de Stripe
router.post('/webhook-checkout', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar el evento
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const reservation_id = session.metadata.reservation_id;

        console.log('✅ Checkout completado para reservación:', reservation_id);

        // Actualizar reservación a confirmada
        const { error } = await supabase
            .from('reservations')
            .update({ status: 'confirmed' })
            .eq('id', reservation_id);

        if (error) {
            console.error('Error actualizando reservación:', error);
        }

        // Guardar información del pago
        const { error: payError } = await supabase
            .from('payments')
            .insert({
                reservation_id,
                stripe_payment_intent_id: session.payment_intent,
                amount_cents: session.amount_total,
                currency: session.currency,
                status: 'authorized'
            });

        if (payError) {
            console.error('Error guardando pago:', payError);
        }
    }

    res.json({ received: true });
});

module.exports = router;
