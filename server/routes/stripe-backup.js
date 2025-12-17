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
// POST /api/stripe/create-hold
// Crear Payment Intent con hold (capture_method: manual)
// ============================================

router.post('/create-hold', async (req, res) => {
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

        console.log(`💳 Creando reservación y hold de $${amount/100} para ${customer_email}`);

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

        // PASO 2: Crear Payment Intent en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'usd',
            customer_email,
            capture_method: 'manual', // HOLD, no cobro inmediato
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            metadata: {
                reservation_id: reservation.id,
                confirmation_code: reservation.confirmation_code,
                customer_name,
                party_size: party_size.toString(),
                reservation_date,
                reservation_time,
                type: 'reservation_hold'
            },
            description: `Reservación ${reservation.confirmation_code} - ${customer_name} (${party_size} personas)`
        });

        console.log(`✅ PaymentIntent creado: ${paymentIntent.id}`);

        // PASO 3: Guardar pago en Supabase
        const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
                reservation_id: reservation.id,
                stripe_payment_intent_id: paymentIntent.id,
                amount_cents: amount,
                currency: 'usd',
                status: 'pending'
            }]);

        if (paymentError) {
            console.error('❌ Error guardando pago:', paymentError);
        } else {
            console.log(`✅ Pago registrado en Supabase`);
        }

        // Retornar datos
        res.json({
            success: true,
            reservation_id: reservation.id,
            confirmation_code: reservation.confirmation_code,
            clientSecret: paymentIntent.client_secret,
            amount
        });

    } catch (error) {
        console.error('❌ Error creando hold:', error);
        res.status(500).json({ error: error.message });
```
    }
});

// Mantener endpoint legacy para compatibilidad
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, customerEmail, customerName, reservationData } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe uses cents
            currency: 'usd',
            capture_method: 'manual', // This creates a HOLD, not a charge
            payment_method_types: ['card'],
            metadata: {
                reservation_id: reservationData.id,
                customer_name: customerName,
                customer_email: customerEmail,
                party_size: reservationData.partySize,
                date: reservationData.date,
                time: reservationData.time
            },
            description: `Reservation hold for ${customerName} - ${reservationData.date} ${reservationData.time}`,
            receipt_email: customerEmail
        });

        // Save payment intent to database
        db.prepare(`
            INSERT INTO reservation_holds (
                reservation_id, stripe_payment_intent_id, amount, status, 
                customer_email, created_at
            ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(
            reservationData.id,
            paymentIntent.id,
            amount,
            'authorized',
            customerEmail
        );

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

// Capture hold (charge the card) - called on no-show
router.post('/capture-hold', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
        
        // Update database
        db.prepare(`
            UPDATE reservation_holds 
            SET status = 'captured', captured_at = CURRENT_TIMESTAMP 
            WHERE stripe_payment_intent_id = ?
        `).run(paymentIntentId);

        res.json({ success: true, paymentIntent });

    } catch (error) {
        console.error('Capture hold error:', error);
        res.status(500).json({ error: 'Failed to capture hold' });
    }
});

// Cancel hold (release funds) - called when customer shows up
router.post('/cancel-hold', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
        
        // Update database
        db.prepare(`
            UPDATE reservation_holds 
            SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP 
            WHERE stripe_payment_intent_id = ?
        `).run(paymentIntentId);

        res.json({ success: true, paymentIntent });

    } catch (error) {
        console.error('Cancel hold error:', error);
        res.status(500).json({ error: 'Failed to cancel hold' });
    }
});

// Get payment status
router.get('/payment-status/:paymentIntentId', async (req, res) => {
    try {
        const hold = db.prepare(`
            SELECT * FROM reservation_holds 
            WHERE stripe_payment_intent_id = ?
        `).get(req.params.paymentIntentId);

        if (!hold) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(hold);
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({ error: 'Failed to get payment status' });
    }
});

module.exports = router;
