/**
 * Netlify Function: Create Stripe Payment Hold
 * 
 * Creates a PaymentIntent with manual capture for reservation holds.
 * Hold amount = party_size * 10 USD
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY (Stripe secret key, test mode: sk_test_...)
 * - HOLD_ENABLED (optional, default: false) - Set to "true" to enable holds
 */

const stripe = require('stripe');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Method not allowed. Use POST.' 
            })
        };
    }

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        // Check if holds are enabled
        const holdEnabled = process.env.HOLD_ENABLED === 'true' || process.env.HOLD_ENABLED === '1';
        if (!holdEnabled) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: true, 
                    hold_enabled: false,
                    message: 'Holds are disabled. Proceed with reservation.'
                })
            };
        }

        // Parse request body
        const data = JSON.parse(event.body);

        // Validate required fields
        const partySize = parseInt(data.party_size || data.guests);
        if (!partySize || partySize < 1) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid party size' 
                })
            };
        }

        // Get Stripe secret key
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            console.error('❌ STRIPE_SECRET_KEY not set');
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Payment service not configured' 
                })
            };
        }

        // Initialize Stripe
        const stripeClient = stripe(stripeSecretKey);

        // Calculate hold amount: party_size * 10 USD (in cents)
        const holdAmount = partySize * 10 * 100; // $10 per person in cents

        console.log('💳 Creating Stripe PaymentIntent for hold');
        console.log('  Party size:', partySize);
        console.log('  Hold amount:', holdAmount, 'cents ($' + (holdAmount / 100) + ' USD)');

        // Create PaymentIntent with manual capture
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: holdAmount,
            currency: 'usd',
            capture_method: 'manual', // Hold, not capture immediately
            payment_method_types: ['card'],
            metadata: {
                reservation_type: 'hold',
                party_size: partySize.toString(),
                customer_email: data.email || '',
                customer_name: data.full_name || data.name || ''
            }
        });

        console.log('✅ PaymentIntent created:', paymentIntent.id);
        console.log('  Client secret:', paymentIntent.client_secret ? 'Set' : 'Missing');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                hold_enabled: true,
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.id,
                amount: holdAmount,
                amount_display: `$${(holdAmount / 100).toFixed(2)} USD`
            })
        };

    } catch (error) {
        console.error('❌ Error creating Stripe hold:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Failed to create payment hold' 
            })
        };
    }
};

