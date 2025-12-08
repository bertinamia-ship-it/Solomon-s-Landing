// Solomon's Landing AI Chatbot
// Bilingual customer service assistant for reservations and inquiries

class RestaurantChatbot {
    constructor() {
        this.conversationState = 'idle';
        this.reservationData = {
            name: null,
            email: null,
            phone: null,
            date: null,
            time: null,
            guests: null,
            specialRequests: null,
            celebration: null
        };
        this.currentLanguage = 'en';
        this.awaitingField = null;
        this.messageHistory = [];
    }

    // Predefined responses for common questions
    responses = {
        en: {
            greeting: "Hello! 👋 Welcome to Solomon's Landing. How can I help you today?\n\nI can assist you with:\n• Making a reservation 📅\n• Directions to our restaurant 📍\n• Menu information 🍽️\n• Hours of operation ⏰\n• General questions ❓",
            
            directions: "📍 We're located at the beautiful Cabo San Lucas Marina!\n\n**Address:**\nBlvd. Paseo de la Marina Centro\nCentro, Marina\n23450 Cabo San Lucas, B.C.S.\nMexico\n\n🗺️ [View our location page](/location.html) for detailed directions and parking information.",
            
            menu: "🍽️ We offer an amazing selection of international cuisine with fresh local seafood!\n\n**Our Menus:**\n• Breakfast (8:00 AM - 12:00 PM)\n• Lunch (12:00 PM - 5:00 PM)\n• Dinner (5:00 PM - 11:00 PM)\n• Sushi & Bar\n\n📖 [View our full menus here](/menus.html)",
            
            hours: "⏰ **Hours of Operation:**\n\nOpen 7 days a week\nMonday - Sunday: 8:00 AM - 11:00 PM\n\n🌅 Breakfast: 8:00 AM - 12:00 PM\n🌞 Lunch: 12:00 PM - 5:00 PM\n🌙 Dinner: 5:00 PM - 11:00 PM",
            
            startReservation: "Perfect! I'll help you make a reservation. 📅\n\nLet me get some information from you.\n\n**What is your full name?**",
            
            askEmail: "Great! **What is your email address?**\n\n(We'll send your confirmation here)",
            
            askPhone: "Thanks! **What is your phone number?**\n\n(For confirmation and updates)",
            
            askDate: "Excellent! **What date would you like to dine with us?**\n\n(Please use format: MM/DD/YYYY or say 'today', 'tomorrow', etc.)",
            
            askTime: "Perfect! **What time would you prefer?**\n\n(We're open 8:00 AM - 11:00 PM)",
            
            askGuests: "Great! **How many guests will be joining?**\n\n(Number of people)",
            
            askSpecialRequests: "Almost done! **Do you have any special requests?**\n\nFor example:\n• Food allergies or dietary restrictions\n• Special occasion (birthday, anniversary)\n• Seating preferences (window, patio)\n• Any other requests\n\n(Type 'none' if no special requests)",
            
            confirmReservation: (data) => {
                return `✅ **Reservation Summary:**\n\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📱 Phone: ${data.phone}\n📅 Date: ${data.date}\n⏰ Time: ${data.time}\n👥 Guests: ${data.guests}\n${data.specialRequests !== 'none' ? `📝 Special Requests: ${data.specialRequests}\n` : ''}\n**Is this information correct?** (Type 'yes' to confirm or 'no' to start over)`;
            },
            
            reservationComplete: "🎉 **Reservation Confirmed!**\n\nThank you for choosing Solomon's Landing!\n\nYou will receive a confirmation email shortly at the address you provided.\n\nWe're looking forward to serving you! 🍽️✨\n\nIs there anything else I can help you with?",
            
            notUnderstood: "I'm not sure I understood that. Could you please rephrase?\n\nYou can ask me about:\n• Reservations\n• Location/Directions\n• Menu\n• Hours\n• Or type 'help' for options",
            
            goodbye: "Thank you for contacting Solomon's Landing! We hope to see you soon! 👋🌊",
            
            help: "I can help you with:\n\n📅 **Reservations** - Type 'reservation' or 'book a table'\n📍 **Directions** - Type 'location' or 'how to get there'\n🍽️ **Menu** - Type 'menu' or 'food'\n⏰ **Hours** - Type 'hours' or 'when are you open'\n\nJust ask me anything!"
        },
        es: {
            greeting: "¡Hola! 👋 Bienvenido a Solomon's Landing. ¿Cómo puedo ayudarte hoy?\n\nPuedo asistirte con:\n• Hacer una reservación 📅\n• Indicaciones al restaurante 📍\n• Información del menú 🍽️\n• Horarios de operación ⏰\n• Preguntas generales ❓",
            
            directions: "📍 ¡Estamos ubicados en la hermosa Marina de Cabo San Lucas!\n\n**Dirección:**\nBlvd. Paseo de la Marina Centro\nCentro, Marina\n23450 Cabo San Lucas, B.C.S.\nMéxico\n\n🗺️ [Ver nuestra página de ubicación](/location.html) para direcciones detalladas e información de estacionamiento.",
            
            menu: "🍽️ ¡Ofrecemos una increíble selección de cocina internacional con mariscos locales frescos!\n\n**Nuestros Menús:**\n• Desayuno (8:00 AM - 12:00 PM)\n• Comida (12:00 PM - 5:00 PM)\n• Cena (5:00 PM - 11:00 PM)\n• Sushi y Bar\n\n📖 [Ver nuestros menús completos aquí](/menus.html)",
            
            hours: "⏰ **Horarios de Operación:**\n\nAbierto los 7 días de la semana\nLunes - Domingo: 8:00 AM - 11:00 PM\n\n🌅 Desayuno: 8:00 AM - 12:00 PM\n🌞 Comida: 12:00 PM - 5:00 PM\n🌙 Cena: 5:00 PM - 11:00 PM",
            
            startReservation: "¡Perfecto! Te ayudaré a hacer una reservación. 📅\n\nDéjame obtener algunos datos.\n\n**¿Cuál es tu nombre completo?**",
            
            askEmail: "¡Genial! **¿Cuál es tu correo electrónico?**\n\n(Enviaremos tu confirmación aquí)",
            
            askPhone: "¡Gracias! **¿Cuál es tu número de teléfono?**\n\n(Para confirmación y actualizaciones)",
            
            askDate: "¡Excelente! **¿Qué fecha te gustaría cenar con nosotros?**\n\n(Usa formato: DD/MM/AAAA o di 'hoy', 'mañana', etc.)",
            
            askTime: "¡Perfecto! **¿Qué hora prefieres?**\n\n(Estamos abiertos 8:00 AM - 11:00 PM)",
            
            askGuests: "¡Genial! **¿Cuántos comensales serán?**\n\n(Número de personas)",
            
            askSpecialRequests: "¡Casi terminamos! **¿Tienes alguna solicitud especial?**\n\nPor ejemplo:\n• Alergias o restricciones alimentarias\n• Ocasión especial (cumpleaños, aniversario)\n• Preferencias de asiento (ventana, patio)\n• Cualquier otra solicitud\n\n(Escribe 'ninguna' si no tienes solicitudes)",
            
            confirmReservation: (data) => {
                return `✅ **Resumen de Reservación:**\n\n👤 Nombre: ${data.name}\n📧 Email: ${data.email}\n📱 Teléfono: ${data.phone}\n📅 Fecha: ${data.date}\n⏰ Hora: ${data.time}\n👥 Comensales: ${data.guests}\n${data.specialRequests !== 'ninguna' && data.specialRequests !== 'none' ? `📝 Solicitudes Especiales: ${data.specialRequests}\n` : ''}\n**¿Es correcta esta información?** (Escribe 'sí' para confirmar o 'no' para empezar de nuevo)`;
            },
            
            reservationComplete: "🎉 **¡Reservación Confirmada!**\n\n¡Gracias por elegir Solomon's Landing!\n\nRecibirás un correo de confirmación en breve en la dirección que proporcionaste.\n\n¡Esperamos servirte pronto! 🍽️✨\n\n¿Hay algo más en lo que pueda ayudarte?",
            
            notUnderstood: "No estoy seguro de haber entendido. ¿Podrías reformular tu pregunta?\n\nPuedes preguntarme sobre:\n• Reservaciones\n• Ubicación/Direcciones\n• Menú\n• Horarios\n• O escribe 'ayuda' para opciones",
            
            goodbye: "¡Gracias por contactar a Solomon's Landing! ¡Esperamos verte pronto! 👋🌊",
            
            help: "Puedo ayudarte con:\n\n📅 **Reservaciones** - Escribe 'reservación' o 'reservar mesa'\n📍 **Direcciones** - Escribe 'ubicación' o 'cómo llegar'\n🍽️ **Menú** - Escribe 'menú' o 'comida'\n⏰ **Horarios** - Escribe 'horarios' o 'cuándo abren'\n\n¡Pregúntame lo que necesites!"
        }
    };

    // Detect language from user input
    detectLanguage(message) {
        const spanishKeywords = [
            'hola', 'buenos', 'días', 'tardes', 'noches', 'gracias', 'por favor',
            'reservación', 'reservacion', 'dónde', 'donde', 'cómo', 'como',
            'cuánto', 'cuanto', 'menú', 'menu', 'horario', 'ubicación', 'ubicacion',
            'ayuda', 'sí', 'si', 'no', 'abierto', 'dirección', 'direccion'
        ];
        
        const lowerMessage = message.toLowerCase();
        const hasSpanishWords = spanishKeywords.some(word => lowerMessage.includes(word));
        
        return hasSpanishWords ? 'es' : 'en';
    }

    // Process user message
    async processMessage(userMessage) {
        this.messageHistory.push({ role: 'user', content: userMessage });
        
        // Auto-detect language if not in reservation flow
        if (this.conversationState === 'idle' || this.conversationState === 'chatting') {
            const detectedLang = this.detectLanguage(userMessage);
            if (detectedLang !== this.currentLanguage) {
                this.currentLanguage = detectedLang;
            }
        }
        
        const message = userMessage.toLowerCase().trim();
        let response = '';

        // Handle different conversation states
        switch (this.conversationState) {
            case 'idle':
            case 'chatting':
                response = this.handleGeneralQuery(message);
                break;
            
            case 'awaiting_name':
                this.reservationData.name = userMessage;
                this.conversationState = 'awaiting_email';
                response = this.responses[this.currentLanguage].askEmail;
                break;
            
            case 'awaiting_email':
                if (this.validateEmail(userMessage)) {
                    this.reservationData.email = userMessage;
                    this.conversationState = 'awaiting_phone';
                    response = this.responses[this.currentLanguage].askPhone;
                } else {
                    response = this.currentLanguage === 'en' 
                        ? "Please enter a valid email address (e.g., name@example.com)"
                        : "Por favor ingresa un correo electrónico válido (ej: nombre@ejemplo.com)";
                }
                break;
            
            case 'awaiting_phone':
                this.reservationData.phone = userMessage;
                this.conversationState = 'awaiting_date';
                response = this.responses[this.currentLanguage].askDate;
                break;
            
            case 'awaiting_date':
                this.reservationData.date = this.parseDate(userMessage);
                this.conversationState = 'awaiting_time';
                response = this.responses[this.currentLanguage].askTime;
                break;
            
            case 'awaiting_time':
                this.reservationData.time = userMessage;
                this.conversationState = 'awaiting_guests';
                response = this.responses[this.currentLanguage].askGuests;
                break;
            
            case 'awaiting_guests':
                const guests = parseInt(userMessage);
                if (guests && guests > 0) {
                    this.reservationData.guests = guests;
                    this.conversationState = 'awaiting_special_requests';
                    response = this.responses[this.currentLanguage].askSpecialRequests;
                } else {
                    response = this.currentLanguage === 'en'
                        ? "Please enter a valid number of guests (e.g., 2, 4, 6)"
                        : "Por favor ingresa un número válido de comensales (ej: 2, 4, 6)";
                }
                break;
            
            case 'awaiting_special_requests':
                this.reservationData.specialRequests = userMessage;
                this.conversationState = 'confirming';
                response = this.responses[this.currentLanguage].confirmReservation(this.reservationData);
                break;
            
            case 'confirming':
                if (message.includes('yes') || message.includes('sí') || message.includes('si') || message === 'y') {
                    await this.sendReservationEmails();
                    response = this.responses[this.currentLanguage].reservationComplete;
                    this.resetReservation();
                } else if (message.includes('no') || message === 'n') {
                    this.resetReservation();
                    response = this.currentLanguage === 'en'
                        ? "No problem! Let's start over. Type 'reservation' when you're ready."
                        : "¡No hay problema! Empecemos de nuevo. Escribe 'reservación' cuando estés listo.";
                } else {
                    response = this.currentLanguage === 'en'
                        ? "Please answer 'yes' or 'no'"
                        : "Por favor responde 'sí' o 'no'";
                }
                break;
        }

        this.messageHistory.push({ role: 'assistant', content: response });
        return response;
    }

    // Handle general queries (not in reservation flow)
    handleGeneralQuery(message) {
        const lang = this.currentLanguage;
        
        // Greetings
        if (this.matchesKeywords(message, ['hello', 'hi', 'hey', 'hola', 'buenos días', 'buenas tardes', 'buenas noches'])) {
            this.conversationState = 'chatting';
            return this.responses[lang].greeting;
        }
        
        // Help
        if (this.matchesKeywords(message, ['help', 'ayuda', 'options', 'opciones'])) {
            return this.responses[lang].help;
        }
        
        // Reservations
        if (this.matchesKeywords(message, [
            'reservation', 'reserve', 'book', 'table', 'reservación', 'reservacion', 
            'reservar', 'mesa', 'booking'
        ])) {
            this.conversationState = 'awaiting_name';
            return this.responses[lang].startReservation;
        }
        
        // Location/Directions
        if (this.matchesKeywords(message, [
            'location', 'where', 'address', 'directions', 'how to get', 'find you',
            'ubicación', 'ubicacion', 'dónde', 'donde', 'dirección', 'direccion', 'cómo llegar', 'como llegar'
        ])) {
            return this.responses[lang].directions;
        }
        
        // Menu
        if (this.matchesKeywords(message, [
            'menu', 'food', 'eat', 'dish', 'cuisine', 'menú', 'comida', 'platillos', 'platos'
        ])) {
            return this.responses[lang].menu;
        }
        
        // Hours
        if (this.matchesKeywords(message, [
            'hours', 'open', 'close', 'when', 'time', 'horario', 'horarios', 'abierto', 'cerrado', 'cuándo', 'cuando'
        ])) {
            return this.responses[lang].hours;
        }
        
        // Goodbye
        if (this.matchesKeywords(message, [
            'bye', 'goodbye', 'thanks', 'thank you', 'adiós', 'adios', 'gracias', 'chao'
        ])) {
            this.conversationState = 'idle';
            return this.responses[lang].goodbye;
        }
        
        // Default - not understood
        return this.responses[lang].notUnderstood;
    }

    // Helper: Check if message matches any keywords
    matchesKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword.toLowerCase()));
    }

    // Helper: Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Helper: Parse date from natural language
    parseDate(input) {
        const message = input.toLowerCase();
        const today = new Date();
        
        if (message.includes('today') || message.includes('hoy')) {
            return today.toLocaleDateString();
        }
        
        if (message.includes('tomorrow') || message.includes('mañana')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toLocaleDateString();
        }
        
        // Otherwise return as-is (user should provide formatted date)
        return input;
    }

    // Reset reservation data
    resetReservation() {
        this.conversationState = 'chatting';
        this.reservationData = {
            name: null,
            email: null,
            phone: null,
            date: null,
            time: null,
            guests: null,
            specialRequests: null,
            celebration: null
        };
    }

    // Send confirmation emails
    async sendReservationEmails() {
        // Email data
        const emailData = {
            to_customer: this.reservationData.email,
            to_restaurant: 'solomonslanding@gmail.com', // Tu correo del restaurante
            reservation: this.reservationData
        };

        // In production, this would call your backend API to send emails
        // For now, we'll use EmailJS or similar service
        try {
            // Send to customer
            await this.sendEmail(
                emailData.to_customer,
                'Reservation Confirmation - Solomon\'s Landing',
                this.generateCustomerEmailTemplate()
            );
            
            // Send to restaurant
            await this.sendEmail(
                emailData.to_restaurant,
                'New Reservation Request',
                this.generateRestaurantEmailTemplate()
            );
            
            console.log('Reservation emails sent successfully');
        } catch (error) {
            console.error('Error sending emails:', error);
        }
    }

    // Generate customer email template
    generateCustomerEmailTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #8B4513, #D4AF37); padding: 20px; text-align: center; color: white; }
        .content { padding: 20px; background: #f9f9f9; }
        .details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .highlight { color: #D4AF37; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌊 Solomon's Landing</h1>
        <p>Reservation Confirmation</p>
    </div>
    <div class="content">
        <h2>Thank you, ${this.reservationData.name}! 🎉</h2>
        <p>Your reservation request has been received. We're excited to serve you!</p>
        
        <div class="details">
            <h3>Reservation Details:</h3>
            <p><strong>📅 Date:</strong> ${this.reservationData.date}</p>
            <p><strong>⏰ Time:</strong> ${this.reservationData.time}</p>
            <p><strong>👥 Number of Guests:</strong> ${this.reservationData.guests}</p>
            ${this.reservationData.specialRequests !== 'none' && this.reservationData.specialRequests !== 'ninguna' 
                ? `<p><strong>📝 Special Requests:</strong> ${this.reservationData.specialRequests}</p>` 
                : ''}
        </div>
        
        <p><strong>We will confirm your reservation within 2 hours.</strong></p>
        
        <p><span class="highlight">Location:</span><br>
        Blvd. Paseo de la Marina Centro<br>
        23450 Cabo San Lucas, B.C.S., Mexico</p>
        
        <p><span class="highlight">Contact:</span><br>
        Phone: +52 624 219 3228<br>
        Email: contact@solomonslanding.com.mx</p>
        
        <p>If you need to modify or cancel your reservation, please contact us directly.</p>
    </div>
    <div class="footer">
        <p>Solomon's Landing - Cabo San Lucas Marina</p>
        <p>Open 7 days a week | 8:00 AM - 11:00 PM</p>
    </div>
</body>
</html>
        `;
    }

    // Generate restaurant email template
    generateRestaurantEmailTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #8B4513; padding: 20px; color: white; }
        .content { padding: 20px; }
        .alert { background: #fff3cd; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .label { font-weight: bold; width: 150px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>🔔 Nueva Reservación - Solomon's Landing</h2>
    </div>
    <div class="content">
        <div class="alert">
            <strong>⏰ Acción Requerida:</strong> Por favor confirmar esta reservación dentro de 2 horas.
        </div>
        
        <h3>Detalles de la Reservación:</h3>
        <table>
            <tr>
                <td class="label">Nombre:</td>
                <td>${this.reservationData.name}</td>
            </tr>
            <tr>
                <td class="label">Email:</td>
                <td>${this.reservationData.email}</td>
            </tr>
            <tr>
                <td class="label">Teléfono:</td>
                <td>${this.reservationData.phone}</td>
            </tr>
            <tr>
                <td class="label">Fecha:</td>
                <td>${this.reservationData.date}</td>
            </tr>
            <tr>
                <td class="label">Hora:</td>
                <td>${this.reservationData.time}</td>
            </tr>
            <tr>
                <td class="label">Comensales:</td>
                <td>${this.reservationData.guests} personas</td>
            </tr>
            ${this.reservationData.specialRequests !== 'none' && this.reservationData.specialRequests !== 'ninguna' 
                ? `<tr><td class="label">Solicitudes Especiales:</td><td>${this.reservationData.specialRequests}</td></tr>` 
                : ''}
        </table>
        
        <p><strong>Hora de solicitud:</strong> ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
        `;
    }

    // Send email using EmailJS or backend
    async sendEmail(to, subject, htmlContent) {
        // This will be implemented with EmailJS in the HTML file
        // For now, just log the email
        console.log('Sending email to:', to);
        console.log('Subject:', subject);
        console.log('Content:', htmlContent);
        
        // In the actual implementation, this will use EmailJS
        return Promise.resolve();
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RestaurantChatbot;
}
