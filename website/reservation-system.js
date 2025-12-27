// ============================================
// SISTEMA DE RESERVACIONES CON SUPABASE
// Solomon's Landing Restaurant
// ============================================

class ReservationSystem {
    constructor() {
        this.supabase = null;
        this.stripe = null;
        this.settings = null;
        this.init();
    }

    async init() {
        // Inicializar Supabase
        this.supabase = SupabaseAPI.init();
        
        // Cargar configuración
        this.settings = await SupabaseAPI.getSettings();
        
        // Inicializar Stripe
        this.stripe = Stripe('pk_live_51SdT3eCkgxNT4xn7oZQM6supkIubUTYNGuZSEfQq90Ym5OGxhDWWUkdQzeD2L4YTpN18YNWAXqs2eYOEIAbYPxp100AWHUglOa');
        
        console.log('✅ Sistema de reservaciones inicializado');
    }

    // ============================================
    // VALIDACIÓN Y DISPONIBILIDAD
    // ============================================

    async checkAvailability(formData) {
        const { date, time, partySize } = formData;

        // Validar tamaño del grupo
        const maxGroupSize = this.settings?.policies?.max_group_size_online || 12;
        if (partySize > maxGroupSize) {
            return {
                available: false,
                error: `Grupos mayores a ${maxGroupSize} personas deben contactar directamente al restaurante.`,
                requiresContact: true
            };
        }

        // Verificar disponibilidad con Supabase
        const availability = await SupabaseAPI.checkAvailability(date, time, partySize);
        
        return availability;
    }

    // ============================================
    // CREAR RESERVACIÓN
    // ============================================

    async createReservation(formData) {
        try {
            // 1. Validar disponibilidad
            const availability = await this.checkAvailability(formData);
            
            if (!availability.available) {
                return {
                    success: false,
                    error: availability.reason || 'No hay disponibilidad',
                    requiresContact: availability.requiresContact
                };
            }

            // 2. Crear reservación en Supabase (con lock de 10 min)
            const result = await SupabaseAPI.createReservation({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                partySize: formData.partySize,
                specialRequests: formData.specialRequests,
                tableId: availability.tableId // Mesa asignada automáticamente
            });

            if (!result.success) {
                return {
                    success: false,
                    error: 'Error creando la reservación. Intente nuevamente.'
                };
            }

            const reservation = result.reservation;

            // 3. Crear Payment Intent en Stripe
            const holdAmount = formData.partySize * 20; // $20 por persona
            const paymentIntent = await this.createStripeHold(
                reservation.id,
                holdAmount,
                formData.email,
                formData.name
            );

            if (!paymentIntent.success) {
                // Cancelar reservación si falla el pago
                await SupabaseAPI.updateReservationStatus(reservation.id, 'cancelled');
                
                return {
                    success: false,
                    error: 'Error procesando el pago. Intente nuevamente.'
                };
            }

            // 4. Guardar registro del pago en Supabase
            await SupabaseAPI.createPaymentRecord(
                reservation.id,
                paymentIntent.id,
                holdAmount * 100 // centavos
            );

            // 5. Retornar datos para el frontend
            return {
                success: true,
                reservation: {
                    id: reservation.id,
                    confirmationCode: reservation.confirmation_code,
                    tableNumber: availability.tableNumber,
                    date: formData.date,
                    time: formData.time,
                    partySize: formData.partySize
                },
                payment: {
                    clientSecret: paymentIntent.clientSecret,
                    amount: holdAmount
                }
            };

        } catch (error) {
            console.error('Error en createReservation:', error);
            return {
                success: false,
                error: 'Error inesperado. Por favor intente nuevamente.'
            };
        }
    }

    // ============================================
    // STRIPE PAYMENT INTENT (HOLD)
    // ============================================

    async createStripeHold(reservationId, amountUSD, email, name) {
        try {
            // Llamar a tu backend para crear el Payment Intent
            const response = await fetch('http://localhost:3000/api/stripe/create-hold', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amountUSD * 100, // centavos
                    currency: 'usd',
                    customer_email: email,
                    customer_name: name,
                    reservation_id: reservationId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error creando hold');
            }

            return {
                success: true,
                id: data.paymentIntentId,
                clientSecret: data.clientSecret
            };

        } catch (error) {
            console.error('Error en createStripeHold:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============================================
    // PROCESAR PAGO (FRONTEND)
    // ============================================

    async processPayment(clientSecret, returnUrl) {
        try {
            const elements = this.stripe.elements({ clientSecret });
            
            const paymentElement = elements.create('payment', {
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

            // Montar el elemento de pago
            paymentElement.mount('#payment-element');

            // Retornar función para confirmar
            return {
                confirmPayment: async () => {
                    const { error } = await this.stripe.confirmPayment({
                        elements,
                        confirmParams: {
                            return_url: returnUrl || `${window.location.origin}/reservation-confirmed.html`
                        }
                    });

                    if (error) {
                        throw new Error(error.message);
                    }

                    return { success: true };
                }
            };

        } catch (error) {
            console.error('Error en processPayment:', error);
            throw error;
        }
    }

    // ============================================
    // CONFIRMAR RESERVACIÓN (DESPUÉS DEL PAGO)
    // ============================================

    async confirmReservation(reservationId) {
        try {
            // Actualizar estado a "confirmed"
            await SupabaseAPI.updateReservationStatus(reservationId, 'confirmed');

            // Obtener datos completos
            const reservation = await SupabaseAPI.getReservationById(reservationId);

            // Enviar email al restaurante
            await this.sendRestaurantNotification(reservation);

            // Enviar email al cliente
            await this.sendCustomerConfirmation(reservation);

            return { success: true, reservation };

        } catch (error) {
            console.error('Error confirmando reservación:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // EMAILS
    // ============================================

    async sendRestaurantNotification(reservation) {
        // Usar EmailJS con template #1
        const templateParams = {
            reservation_id: reservation.confirmation_code,
            customer_name: reservation.customer_name,
            customer_email: reservation.customer_email,
            customer_phone: reservation.customer_phone,
            date: reservation.reservation_date,
            time: reservation.reservation_time,
            guests: reservation.party_size,
            special_requests: reservation.special_requests || 'Ninguna',
            hold_amount: `$${reservation.party_size * 20} USD`,
            table_number: reservation.table?.table_number || 'Por asignar',
            logo_url: 'https://solomonslanding.com/logo-solomons.png'
        };

        return emailjs.send(
            'service_u021fxi',
            'template_ij3p83j', // Template restaurante
            templateParams,
            'gCsJYvChpOqVACgUr'
        );
    }

    async sendCustomerConfirmation(reservation) {
        // Usar EmailJS con template #3 (confirmación final)
        const templateParams = {
            to_name: reservation.customer_name,
            confirmation_number: reservation.confirmation_code,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            guests: reservation.party_size,
            hold_amount: `$${reservation.party_size * 20} USD`,
            table_number: reservation.table?.table_number || 'Por asignar',
            logo_url: 'https://solomonslanding.com/logo-solomons.png'
        };

        return emailjs.send(
            'service_u021fxi',
            'template_swvqncq', // Template cliente confirmación
            templateParams,
            'gCsJYvChpOqVACgUr'
        );
    }

    // ============================================
    // BUSCAR RESERVACIÓN
    // ============================================

    async findReservation(confirmationCode) {
        return await SupabaseAPI.getReservationByConfirmation(confirmationCode);
    }

    // ============================================
    // CANCELAR RESERVACIÓN
    // ============================================

    async cancelReservation(reservationId) {
        try {
            // Actualizar estado
            await SupabaseAPI.updateReservationStatus(reservationId, 'cancelled');

            // Liberar el hold en Stripe (esto lo maneja el webhook)
            
            return { success: true };

        } catch (error) {
            console.error('Error cancelando reservación:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializar sistema globalmente
window.ReservationSystem = new ReservationSystem();
