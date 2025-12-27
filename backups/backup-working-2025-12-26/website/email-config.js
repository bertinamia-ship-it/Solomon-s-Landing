/**
 * EmailJS Configuration
 * 
 * PASOS PARA CONFIGURAR:
 * 1. Ve a https://www.emailjs.com/ y crea una cuenta gratis
 * 2. En el dashboard, ve a "Email Services" y conecta tu Gmail
 * 3. Ve a "Email Templates" y crea 2 templates:
 *    - Template para CLIENTE (confirmation_to_customer)
 *    - Template para RESTAURANTE (new_reservation_alert)
 * 4. Copia tus credenciales aquí:
 */

const EMAIL_CONFIG = {
    // User ID de EmailJS (Public Key)
    USER_ID: 'gCsJYvChpOqVACgUr',
    
    // Service ID (Gmail conectado)
    SERVICE_ID: 'service_u021fxi',
    
    // Template IDs
    TEMPLATES: {
        // Email que recibe el cliente DESPUÉS de que restaurante confirme
        CUSTOMER_CONFIRMATION: 'template_swvqncq',
        
        // Email que recibe el restaurante INMEDIATAMENTE con botón confirmar
        RESTAURANT_ALERT: 'template_ij3p83j',
        
        // Email para solicitudes de catering
        CATERING_QUOTE: 'template_catering_quote'
    },
    
    // Email Recipients
    EMAILS: {
        CATERING: 'samantha@solomonslanding.com.mx',
        RESERVATIONS: 'contact@solomonslanding.com.mx',
        RESTAURANT: 'solomonslanding@gmail.com'
    }
};

// Clase para manejar envío de emails
class EmailService {
    constructor() {
        this.config = EMAIL_CONFIG;
        this.initialized = false;
        this.initEmailJS();
    }

    // Inicializar EmailJS
    initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.config.USER_ID);
            this.initialized = true;
            console.log('✅ EmailJS initialized with User ID:', this.config.USER_ID);
        } else {
            console.warn('⚠️ EmailJS SDK not loaded yet');
        }
    }

    // Enviar solicitud de catering al equipo de catering
    async sendCateringQuote(cateringData) {
        const templateParams = {
            to_email: this.config.EMAILS.CATERING,
            from_name: cateringData.name,
            from_email: cateringData.email,
            phone: cateringData.phone,
            event_date: cateringData.eventDate,
            guest_count: cateringData.guestCount,
            event_type: cateringData.eventType,
            message: cateringData.message || 'No additional details provided'
        };

        try {
            await emailjs.send(
                this.config.SERVICE_ID,
                this.config.TEMPLATES.CATERING_QUOTE,
                templateParams,
                this.config.USER_ID
            );
            console.log('✅ Catering quote sent to:', this.config.EMAILS.CATERING);
            return { success: true };
        } catch (error) {
            console.error('❌ Error sending catering quote:', error);
            return { success: false, error };
        }
    }

    // Enviar alerta al restaurante (INMEDIATO cuando cliente hace reservación)
    async sendRestaurantAlert(reservationData, reservationId) {
        const templateParams = {
            to_email: this.config.EMAILS.RESERVATIONS, // Email para reservaciones
            reservation_id: reservationId,
            customer_name: reservationData.name,
            customer_email: reservationData.email,
            customer_phone: reservationData.phone,
            date: reservationData.date,
            time: reservationData.time,
            guests: reservationData.guests,
            hotel: reservationData.hotelStaying || 'No especificó',
            special_requests: reservationData.specialRequests || 'Ninguna',
            hold_amount: reservationData.guests * 20,
            // Este link es para que el restaurante confirme
            confirmation_link: `http://localhost:3000/api/reservations/confirm/${reservationId}`
        };

        try {
            // EmailJS SDK call
            await emailjs.send(
                this.config.SERVICE_ID,
                this.config.TEMPLATES.RESTAURANT_ALERT,
                templateParams,
                this.config.USER_ID
            );
            console.log('✅ Email enviado al restaurante');
            return { success: true };
        } catch (error) {
            console.error('❌ Error enviando email al restaurante:', error);
            return { success: false, error };
        }
    }

    // Enviar confirmación al cliente (SOLO cuando restaurante confirme)
    async sendCustomerConfirmation(reservationData, paymentLink) {
        const templateParams = {
            to_email: reservationData.customer_email,
            to_name: reservationData.customer_name,
            reservation_date: reservationData.reservation_date,
            reservation_time: reservationData.reservation_time,
            guests: reservationData.party_size,
            hotel: reservationData.hotel_staying || 'No especificó',
            special_requests: reservationData.special_requests || 'Ninguna',
            hold_amount: reservationData.hold_amount,
            payment_link: paymentLink || '#'
        };

        try {
            await emailjs.send(
                this.config.SERVICE_ID,
                this.config.TEMPLATES.CUSTOMER_CONFIRMATION,
                templateParams,
                this.config.USER_ID
            );
            console.log('✅ Confirmación enviada al cliente:', reservationData.customer_email);
            return { success: true };
        } catch (error) {
            console.error('❌ Error enviando confirmación al cliente:', error);
            return { success: false, error };
        }
    }
}

// Export singleton
const emailService = new EmailService();
