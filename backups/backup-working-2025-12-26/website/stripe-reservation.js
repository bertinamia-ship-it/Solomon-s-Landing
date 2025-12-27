/**
 * Stripe Payment Integration for Reservations
 * Handles pre-authorization (hold) for no-show protection
 */

class StripeReservationPayment {
    constructor(stripePublishableKey = 'pk_live_51SdT3eCkgxNT4xn7oZQM6supkIubUTYNGuZSEfQq90Ym5OGxhDWWUkdQzeD2L4YTpN18YNWAXqs2eYOEIAbYPxp100AWHUglOa') {
        this.stripe = null;
        this.elements = null;
        this.paymentElement = null;
        this.initKey = stripePublishableKey;
        this.initStripe();
    }

    async initStripe() {
        // Load Stripe.js
        if (!window.Stripe) {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => {
                this.stripe = Stripe(this.initKey);
            };
            document.head.appendChild(script);
        } else {
            this.stripe = Stripe(this.initKey);
        }
    }

    /**
     * Create payment intent with hold (not charge)
     */
    async createPaymentIntent(reservationData) {
        try {
            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: reservationData.guests * 20, // $20 per person hold
                    customerEmail: reservationData.email,
                    customerName: reservationData.name,
                    reservationData: {
                        id: reservationData.id,
                        date: reservationData.date,
                        time: reservationData.time,
                        partySize: reservationData.guests,
                        hotelStaying: reservationData.hotelStaying
                    }
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Create payment intent error:', error);
            throw error;
        }
    }

    /**
     * Initialize payment form
     */
    async initPaymentForm(clientSecret, containerId) {
        if (!this.stripe) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!this.stripe) throw new Error('Stripe not loaded');
        }

        const appearance = {
            theme: 'stripe',
            variables: {
                colorPrimary: '#3b82f6',
                colorBackground: '#ffffff',
                colorText: '#1e293b',
                colorDanger: '#ef4444',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px'
            }
        };

        this.elements = this.stripe.elements({ clientSecret, appearance });

        // Create payment element with Apple Pay and Google Pay
        this.paymentElement = this.elements.create('payment', {
            layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: true,
                spacedAccordionItems: true
            },
            wallets: {
                applePay: 'auto',
                googlePay: 'auto'
            }
        });

        this.paymentElement.mount(containerId);

        return this.paymentElement;
    }

    /**
     * Confirm payment (creates hold)
     */
    async confirmPayment(returnUrl) {
        if (!this.stripe || !this.elements) {
            throw new Error('Stripe not initialized');
        }

        const { error } = await this.stripe.confirmPayment({
            elements: this.elements,
            confirmParams: {
                return_url: returnUrl || window.location.origin + '/reservation-confirmed.html'
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        return { success: true };
    }

    /**
     * Get payment link for chatbot
     */
    async getPaymentLink(reservationData) {
        try {
            const { clientSecret, paymentIntentId } = await this.createPaymentIntent(reservationData);
            
            // Create a payment page URL
            const baseUrl = window.location.origin;
            const params = new URLSearchParams({
                clientSecret,
                reservationId: reservationData.id,
                name: reservationData.name,
                date: reservationData.date,
                time: reservationData.time
            });

            return `${baseUrl}/payment-checkout.html?${params.toString()}`;
        } catch (error) {
            console.error('Get payment link error:', error);
            throw error;
        }
    }
}

// Export for use in chatbot
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StripeReservationPayment;
}
