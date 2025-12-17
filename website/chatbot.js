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
            celebration: null,
            allergies: null,
            allergyDetails: null,
            specialRequests: null,
            hotelStaying: null
        };
        this.currentLanguage = 'en';
        this.awaitingField = null;
        this.messageHistory = [];
        
        // Initialize menu search system
        this.menuSearch = typeof MenuSearchSystem !== 'undefined' 
            ? new MenuSearchSystem() 
            : null;
    }

    // Predefined responses for common questions
    responses = {
        en: {
            greeting: "Hello! 👋 Welcome to Solomon's Landing. How can I help you today?\n\nI can assist you with:\n• Making a reservation 📅\n• Catering services 🍽️\n• Directions to our restaurant 📍\n• Menu information 🍴\n• Hours of operation ⏰\n• General questions ❓",
            
            catering: "🎉 **Catering Services**\n\nWe offer professional catering for all types of events:\n\n• **Weddings** 💒\n• **Corporate Events** 🏢\n• **Private Parties** 🎊\n• **Special Celebrations** 🎈\n\nOur catering menu features:\n✨ Fresh seafood & sushi\n✨ International cuisine\n✨ Customizable menus\n✨ Professional service\n\n📱 **For catering inquiries, please contact:**\n**Phone/WhatsApp: +52 624-217-5935**\n\nOr visit our [catering page](/catering.html) for more details!",
            
            directions: "📍 We're located at the beautiful Cabo San Lucas Marina!\n\n**Address:**\nBlvd. Paseo de la Marina Centro\nCentro, Marina\n23450 Cabo San Lucas, B.C.S.\nMexico\n\n🗺️ [View our location page](/location.html) for detailed directions and parking information.",
            
            menu: "🍽️ We offer an amazing selection of international cuisine with fresh local seafood!\n\n**Our Menus:**\n• Breakfast (8:00 AM - 12:00 PM)\n• Lunch (12:00 PM - 5:00 PM)\n• Dinner (5:00 PM - 11:00 PM)\n• Sushi & Bar\n\n📖 [View our full menus here](/menus.html)",
            
            hours: "⏰ **Hours of Operation:**\n\nOpen 7 days a week\nMonday - Sunday: 8:00 AM - 11:00 PM\n\n🌅 Breakfast: 8:00 AM - 12:00 PM\n🌞 Lunch: 12:00 PM - 5:00 PM\n🌙 Dinner: 5:00 PM - 11:00 PM",
            
            startReservation: "Perfect! I'll help you make a reservation. 📅\n\nLet me get some information from you.\n\n**What is your full name?**",
            
            askEmail: "Great! **What is your email address?**\n\n(We'll send your confirmation here)",
            
            askPhone: "Thanks! **What is your phone number?**\n\n(For confirmation and updates)",
            
            askDate: "Excellent! **What date would you like to dine with us?**\n\nPlease choose an option:",
            
            askTime: "Perfect! **What time would you prefer?**\n\nPlease select your preferred time:",
            
            askGuests: "Great! **How many guests will be joining?**\n\nPlease select the number of guests:",
            
            askCelebration: "🎉 **Is this for a special occasion?**\n\nPlease select one:",
            
            askAllergies: "**Do you have any food allergies?**\n\nPlease let us know:",
            
            askAllergyDetails: "Please specify your food allergies:",
            
            askSpecialRequests: "**Any special seating preferences or requests?**\n\n(Type your preference or 'none' if no special requests)",
            
            confirmReservation: (data) => {
                let summary = `✅ **Reservation Summary:**\n\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📱 Phone: ${data.phone}\n📅 Date: ${data.date}\n⏰ Time: ${data.time}\n👥 Guests: ${data.guests}\n🏨 Hotel: ${data.hotelStaying || 'Not specified'}`;
                
                if (data.celebration && data.celebration !== 'None') {
                    summary += `\n🎉 Celebration: ${data.celebration}`;
                }
                
                if (data.allergies && data.allergies !== 'None') {
                    summary += `\n⚠️ Allergies: ${data.allergies}`;
                }
                
                if (data.specialRequests && data.specialRequests !== 'none') {
                    summary += `\n📝 Special Requests: ${data.specialRequests}`;
                }
                
                summary += `\n\n**Is this information correct?** (Type 'yes' to confirm or 'no' to start over)`;
                return summary;
            },
            
            reservationComplete: "🎉 **Reservation Confirmed!**\n\nThank you for choosing Solomon's Landing!\n\nYou will receive a confirmation email shortly at the address you provided.\n\nWe're looking forward to serving you! 🍽️✨\n\nIs there anything else I can help you with?",
            
            notUnderstood: "I'm not sure I understood that. Could you please rephrase?\n\nYou can ask me about:\n• Reservations\n• Catering Services\n• Location/Directions\n• Menu\n• Hours\n• Or type 'help' for options",
            
            goodbye: "Thank you for contacting Solomon's Landing! We hope to see you soon! 👋🌊",
            
            help: "I can help you with:\n\n📅 **Reservations** - Type 'reservation' or 'book a table'\n🍽️ **Catering** - Type 'catering' or 'events'\n📍 **Directions** - Type 'location' or 'how to get there'\n🍴 **Menu** - Type 'menu' or 'food'\n⏰ **Hours** - Type 'hours' or 'when are you open'\n\nJust ask me anything!"
        },
        es: {
            greeting: "¡Hola! 👋 Bienvenido a Solomon's Landing. ¿Cómo puedo ayudarte hoy?\n\nPuedo asistirte con:\n• Hacer una reservación 📅\n• Servicios de catering 🍽️\n• Indicaciones al restaurante 📍\n• Información del menú 🍴\n• Horarios de operación ⏰\n• Preguntas generales ❓",
            
            catering: "🎉 **Servicios de Catering**\n\n¡Ofrecemos catering profesional para todo tipo de eventos!\n\n• **Bodas** 💒\n• **Eventos Corporativos** 🏢\n• **Fiestas Privadas** 🎊\n• **Celebraciones Especiales** 🎈\n\nNuestro menú de catering incluye:\n✨ Mariscos frescos y sushi\n✨ Cocina internacional\n✨ Menús personalizables\n✨ Servicio profesional\n\n📱 **Para consultas de catering, contacta:**\n**Teléfono/WhatsApp: +52 624-217-5935**\n\nO visita nuestra [página de catering](/catering.html) para más detalles!",
            
            directions: "📍 ¡Estamos ubicados en la hermosa Marina de Cabo San Lucas!\n\n**Dirección:**\nBlvd. Paseo de la Marina Centro\nCentro, Marina\n23450 Cabo San Lucas, B.C.S.\nMéxico\n\n🗺️ [Ver nuestra página de ubicación](/location.html) para direcciones detalladas e información de estacionamiento.",
            
            menu: "🍽️ ¡Ofrecemos una increíble selección de cocina internacional con mariscos locales frescos!\n\n**Nuestros Menús:**\n• Desayuno (8:00 AM - 12:00 PM)\n• Comida (12:00 PM - 5:00 PM)\n• Cena (5:00 PM - 11:00 PM)\n• Sushi y Bar\n\n📖 [Ver nuestros menús completos aquí](/menus.html)",
            
            hours: "⏰ **Horarios de Operación:**\n\nAbierto los 7 días de la semana\nLunes - Domingo: 8:00 AM - 11:00 PM\n\n🌅 Desayuno: 8:00 AM - 12:00 PM\n🌞 Comida: 12:00 PM - 5:00 PM\n🌙 Cena: 5:00 PM - 11:00 PM",
            
            startReservation: "¡Perfecto! Te ayudaré a hacer una reservación. 📅\n\nDéjame obtener algunos datos.\n\n**¿Cuál es tu nombre completo?**",
            
            askEmail: "¡Genial! **¿Cuál es tu correo electrónico?**\n\n(Enviaremos tu confirmación aquí)",
            
            askPhone: "¡Gracias! **¿Cuál es tu número de teléfono?**\n\n(Para confirmación y actualizaciones)",
            
            askDate: "¡Excelente! **¿Qué fecha te gustaría cenar con nosotros?**\n\nPor favor elige una opción:",
            
            askTime: "¡Perfecto! **¿Qué hora prefieres?**\n\nSelecciona tu hora preferida:",
            
            askGuests: "¡Genial! **¿Cuántos comensales serán?**\n\nSelecciona el número de personas:",
            
            askCelebration: "🎉 **¿Es para una ocasión especial?**\n\nPor favor selecciona una:",
            
            askAllergies: "**¿Tienes alguna alergia alimentaria?**\n\nPor favor indícanos:",
            
            askAllergyDetails: "Por favor especifica tus alergias alimentarias:",
            
            askSpecialRequests: "**¿Alguna preferencia de asiento o solicitud especial?**\n\n(Escribe tu preferencia o 'ninguna' si no tienes solicitudes)",
            
            confirmReservation: (data) => {
                let summary = `✅ **Resumen de Reservación:**\n\n👤 Nombre: ${data.name}\n📧 Email: ${data.email}\n📱 Teléfono: ${data.phone}\n📅 Fecha: ${data.date}\n⏰ Hora: ${data.time}\n👥 Comensales: ${data.guests}\n🏨 Hotel: ${data.hotelStaying || 'No especificado'}`;
                
                if (data.celebration && data.celebration !== 'None') {
                    summary += `\n🎉 Celebración: ${data.celebration}`;
                }
                
                if (data.allergies && data.allergies !== 'None') {
                    summary += `\n⚠️ Alergias: ${data.allergies}`;
                }
                
                if (data.specialRequests && data.specialRequests !== 'ninguna' && data.specialRequests !== 'none') {
                    summary += `\n📝 Solicitudes Especiales: ${data.specialRequests}`;
                }
                
                summary += `\n\n**¿Es correcta esta información?** (Escribe 'sí' para confirmar o 'no' para empezar de nuevo)`;
                return summary;
            },
            
            reservationComplete: "🎉 **¡Reservación Confirmada!**\n\n¡Gracias por elegir Solomon's Landing!\n\nRecibirás un correo de confirmación en breve en la dirección que proporcionaste.\n\n¡Esperamos servirte pronto! 🍽️✨\n\n¿Hay algo más en lo que pueda ayudarte?",
            
            notUnderstood: "No estoy seguro de haber entendido. ¿Podrías reformular tu pregunta?\n\nPuedes preguntarme sobre:\n• Reservaciones\n• Servicios de Catering\n• Ubicación/Direcciones\n• Menú\n• Horarios\n• O escribe 'ayuda' para opciones",
            
            goodbye: "¡Gracias por contactar a Solomon's Landing! ¡Esperamos verte pronto! 👋🌊",
            
            help: "Puedo ayudarte con:\n\n📅 **Reservaciones** - Escribe 'reservación' o 'reservar mesa'\n🍽️ **Catering** - Escribe 'catering' o 'eventos'\n📍 **Direcciones** - Escribe 'ubicación' o 'cómo llegar'\n🍴 **Menú** - Escribe 'menú' o 'comida'\n⏰ **Horarios** - Escribe 'horarios' o 'cuándo abren'\n\n¡Pregúntame lo que necesites!"
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
                
                // Show date options
                setTimeout(() => {
                    if (typeof window.showChatbotOptions === 'function') {
                        const lang = this.currentLanguage;
                        const dateOptions = lang === 'en' 
                            ? ['🌙 Tonight', '🌙 Tomorrow Night', '📅 Choose Date']
                            : ['🌙 Esta Noche', '🌙 Mañana por la Noche', '📅 Elegir Fecha'];
                        window.showChatbotOptions(dateOptions);
                    }
                }, 100);
                break;
            
            case 'awaiting_date':
                // Handle date button selections
                if (message.includes('tonight') || message.includes('esta noche')) {
                    const today = new Date();
                    this.reservationData.date = today.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                } else if (message.includes('tomorrow') || message.includes('mañana')) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    this.reservationData.date = tomorrow.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                } else if (message.includes('choose') || message.includes('elegir')) {
                    // Trigger date picker
                    setTimeout(() => {
                        if (typeof window.showDatePicker === 'function') {
                            window.showDatePicker();
                        }
                    }, 100);
                    return this.currentLanguage === 'en' 
                        ? "Please select a date from the calendar below:"
                        : "Por favor selecciona una fecha del calendario:";
                } else {
                    this.reservationData.date = this.parseDate(userMessage);
                }
                
                this.conversationState = 'awaiting_time';
                response = this.responses[this.currentLanguage].askTime;
                
                // Show time options
                setTimeout(() => {
                    if (typeof window.showChatbotOptions === 'function') {
                        const timeOptions = [
                            '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
                            '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
                        ];
                        window.showChatbotOptions(timeOptions);
                    }
                }, 100);
                break;
            
            case 'awaiting_time':
                this.reservationData.time = userMessage;
                this.conversationState = 'awaiting_guests';
                response = this.responses[this.currentLanguage].askGuests;
                
                // Show guest options
                setTimeout(() => {
                    if (typeof window.showChatbotOptions === 'function') {
                        const lang = this.currentLanguage;
                        const guestOptions = lang === 'en' 
                            ? ['2 guests', '4 guests', '6 guests', '8 guests', 'More than 8']
                            : ['2 personas', '4 personas', '6 personas', '8 personas', 'Más de 8'];
                        window.showChatbotOptions(guestOptions);
                    }
                }, 100);
                break;
            
            case 'awaiting_guests':
                // Parse guests from button text
                const guestMatch = userMessage.match(/(\d+)/);
                const guests = guestMatch ? parseInt(guestMatch[0]) : null;
                
                if (guests && guests > 0) {
                    this.reservationData.guests = guests;
                    this.conversationState = 'awaiting_celebration';
                    response = this.responses[this.currentLanguage].askCelebration;
                    
                    // Show celebration options
                    setTimeout(() => {
                        if (typeof window.showChatbotOptions === 'function') {
                            const lang = this.currentLanguage;
                            const celebrationOptions = lang === 'en' 
                                ? ['🎂 Birthday', '💍 Anniversary', '🎉 Other', '❌ No celebration']
                                : ['🎂 Cumpleaños', '💍 Aniversario', '🎉 Otra', '❌ Sin celebración'];
                            window.showChatbotOptions(celebrationOptions);
                        }
                    }, 100);
                } else if (userMessage.toLowerCase().includes('more') || userMessage.toLowerCase().includes('más')) {
                    response = this.currentLanguage === 'en'
                        ? "For parties larger than 8 guests, please call us at +52 624 219 3228 or email reservations@solomonslanding.com"
                        : "Para grupos mayores a 8 personas, por favor llámanos al +52 624 219 3228 o envía un email a reservations@solomonslanding.com";
                    this.resetReservation();
                } else {
                    response = this.currentLanguage === 'en'
                        ? "Please select a valid number of guests"
                        : "Por favor selecciona un número válido de comensales";
                }
                break;
            
            case 'awaiting_celebration':
                if (userMessage.toLowerCase().includes('birthday') || userMessage.toLowerCase().includes('cumpleaños')) {
                    this.reservationData.celebration = 'Birthday';
                } else if (userMessage.toLowerCase().includes('anniversary') || userMessage.toLowerCase().includes('aniversario')) {
                    this.reservationData.celebration = 'Anniversary';
                } else if (userMessage.toLowerCase().includes('other') || userMessage.toLowerCase().includes('otra')) {
                    this.reservationData.celebration = 'Other celebration';
                } else {
                    this.reservationData.celebration = 'None';
                }
                
                this.conversationState = 'awaiting_allergies';
                response = this.responses[this.currentLanguage].askAllergies;
                
                // Show allergy options
                setTimeout(() => {
                    if (typeof window.showChatbotOptions === 'function') {
                        const lang = this.currentLanguage;
                        const allergyOptions = lang === 'en' 
                            ? ['✅ Yes, I have allergies', '❌ No allergies']
                            : ['✅ Sí, tengo alergias', '❌ Sin alergias'];
                        window.showChatbotOptions(allergyOptions);
                    }
                }, 100);
                break;
            
            case 'awaiting_allergies':
                if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('sí')) {
                    this.conversationState = 'awaiting_allergy_details';
                    response = this.responses[this.currentLanguage].askAllergyDetails;
                } else {
                    this.reservationData.allergies = 'None';
                    this.conversationState = 'awaiting_special_requests';
                    response = this.responses[this.currentLanguage].askSpecialRequests;
                }
                break;
            
            case 'awaiting_allergy_details':
                this.reservationData.allergyDetails = userMessage;
                this.reservationData.allergies = userMessage;
                this.conversationState = 'awaiting_special_requests';
                response = this.responses[this.currentLanguage].askSpecialRequests;
                break;
            
            case 'awaiting_special_requests':
                this.reservationData.specialRequests = userMessage;
                this.conversationState = 'awaiting_hotel';
                response = this.currentLanguage === 'en'
                    ? "**Where are you staying at?** 🏨\n\nPlease let us know your hotel or accommodation name (or type 'not applicable' if you're a local)."
                    : "**¿Dónde se hospeda?** 🏨\n\nPor favor indícanos el nombre de tu hotel o alojamiento (o escribe 'no aplica' si eres local).";
                break;
            
            case 'awaiting_hotel':
                this.reservationData.hotelStaying = userMessage;
                this.conversationState = 'confirming';
                response = this.responses[this.currentLanguage].confirmReservation(this.reservationData);
                break;
            
            case 'confirming':
                if (message.includes('yes') || message.includes('sí') || message.includes('si') || message === 'y') {
                    try {
                        // Generate confirmation code
                        const confirmationCode = 'SL' + Date.now();
                        
                        // Format date for display
                        const reservationDate = new Date(this.reservationData.date);
                        const formattedDate = reservationDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        
                        // Build confirmation URL with all parameters
                        const confirmUrl = `${window.location.origin}/website/confirm-reservation.html?` + 
                            `code=${encodeURIComponent(confirmationCode)}` +
                            `&name=${encodeURIComponent(this.reservationData.name)}` +
                            `&email=${encodeURIComponent(this.reservationData.email)}` +
                            `&date=${encodeURIComponent(formattedDate)}` +
                            `&time=${encodeURIComponent(this.reservationData.time)}` +
                            `&guests=${encodeURIComponent(this.reservationData.guests)}` +
                            `&language=${encodeURIComponent(this.currentLanguage)}`;
                        
                        // Build special requests text
                        let specialRequestsText = [];
                        if (this.reservationData.celebration && this.reservationData.celebration !== 'None') {
                            specialRequestsText.push(`Celebration: ${this.reservationData.celebration}`);
                        }
                        if (this.reservationData.allergies && this.reservationData.allergies !== 'None') {
                            specialRequestsText.push(`Allergies: ${this.reservationData.allergies}`);
                        }
                        if (this.reservationData.specialRequests && this.reservationData.specialRequests !== 'none' && this.reservationData.specialRequests !== 'ninguna') {
                            specialRequestsText.push(`Preferences: ${this.reservationData.specialRequests}`);
                        }
                        const finalSpecialRequests = specialRequestsText.length > 0 ? specialRequestsText.join(' | ') : 'None';
                        
                        // Send email to restaurant using EmailJS
                        await emailjs.send('service_u021fxi', 'template_ij3p83j', {
                            to_email: 'reservations@solomonslanding.com',
                            customer_name: this.reservationData.name,
                            customer_email: this.reservationData.email,
                            customer_phone: this.reservationData.phone,
                            reservation_date: formattedDate,
                            reservation_time: this.reservationData.time,
                            party_size: this.reservationData.guests,
                            special_requests: finalSpecialRequests,
                            hotel_staying: this.reservationData.hotelStaying || 'Not specified',
                            confirmation_code: confirmationCode,
                            confirm_url: confirmUrl,
                            customer_language: this.currentLanguage === 'en' ? 'English (🇺🇸)' : 'Español (🇲🇽)'
                        });
                        
                        response = this.currentLanguage === 'en'
                            ? `✅ **Perfect! Your reservation request has been sent!**\n\n📧 We've notified our team and will confirm your reservation shortly.\n\n**Confirmation Code:** ${confirmationCode}\n\n**Reservation Details:**\n• Name: ${this.reservationData.name}\n• Date: ${formattedDate}\n• Time: ${this.reservationData.time}\n• Party Size: ${this.reservationData.guests} guests\n• Hotel: ${this.reservationData.hotelStaying || 'Not specified'}\n\n📧 You'll receive a confirmation email once our team approves your reservation.\n\n📱 **Questions? Call us: +52 624 219 3228**`
                            : `✅ **¡Perfecto! Tu solicitud de reservación ha sido enviada!**\n\n📧 Hemos notificado a nuestro equipo y confirmaremos tu reservación pronto.\n\n**Código de Confirmación:** ${confirmationCode}\n\n**Detalles de Reservación:**\n• Nombre: ${this.reservationData.name}\n• Fecha: ${formattedDate}\n• Hora: ${this.reservationData.time}\n• Personas: ${this.reservationData.guests}\n• Hotel: ${this.reservationData.hotelStaying || 'No especificado'}\n\n📧 Recibirás un correo de confirmación una vez que nuestro equipo apruebe tu reservación.\n\n📱 **¿Preguntas? Llámanos: +52 624 219 3228**`;

                    } catch (error) {
                        console.error('Error sending reservation email:', error);
                        response = this.currentLanguage === 'en'
                            ? `❌ Sorry, there was an error sending your reservation. Please try again or call us directly at +52 624 219 3228`
                            : `❌ Lo siento, hubo un error al enviar tu reservación. Por favor intenta de nuevo o llámanos al +52 624 219 3228`;
                    }
                    
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
    async handleGeneralQuery(message) {
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
        
        // Menu search queries - NEW INTELLIGENT SEARCH
        if (this.menuSearch && this.matchesKeywords(message, [
            'find', 'search', 'show', 'recommend', 'suggest', 'want', 'looking for',
            'buscar', 'encontrar', 'mostrar', 'recomendar', 'sugerir', 'quiero', 'buscando',
            'dish', 'food', 'plate', 'meal', 'platillo', 'comida', 'plato',
            'allergy', 'allergic', 'without', 'alergia', 'sin',
            'cheap', 'expensive', 'price', 'barato', 'caro', 'precio',
            'featured', 'popular', 'best', 'destacado', 'popular', 'mejor'
        ])) {
            try {
                const searchResult = await this.menuSearch.naturalLanguageSearch(message, lang);
                return this.menuSearch.formatChatbotResponse(searchResult, lang);
            } catch (error) {
                console.error('Menu search error:', error);
                // Fall through to regular menu response
            }
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
        
        // Catering
        if (this.matchesKeywords(message, [
            'catering', 'event', 'events', 'party', 'parties', 'wedding', 'corporate',
            'celebration', 'private dining', 'grupo', 'grupos', 'evento', 'eventos', 
            'fiesta', 'fiestas', 'boda', 'bodas', 'celebración', 'celebracion'
        ])) {
            return this.responses[lang].catering;
        }
        
        // Menu (general)
        if (this.matchesKeywords(message, [
            'menu', 'cuisine', 'menú'
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
    async sendReservationEmails(reservationId, paymentLink) {
        // IMPORTANTE: Solo enviamos email al RESTAURANTE aquí
        // El email al CLIENTE se envía cuando el restaurante confirma
        
        if (typeof emailService === 'undefined') {
            console.warn('⚠️ EmailJS no configurado - emails no se enviarán');
            return;
        }

        try {
            // SOLO enviar alerta al restaurante
            await emailService.sendRestaurantAlert({
                name: this.reservationData.name,
                email: this.reservationData.email,
                phone: this.reservationData.phone,
                date: this.reservationData.date,
                time: this.reservationData.time,
                guests: this.reservationData.guests,
                hotelStaying: this.reservationData.hotelStaying,
                specialRequests: this.reservationData.specialRequests
            }, reservationId);
            
            console.log('✅ Email de alerta enviado al restaurante');
        } catch (error) {
            console.error('❌ Error enviando email al restaurante:', error);
        }
    }

    // Generate customer email template
    generateCustomerEmailTemplate(paymentLink) {
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
        .payment-btn { display: inline-block; padding: 15px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .payment-btn:hover { background: #059669; }
        .important { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
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
            <p><strong>🏨 Hotel/Staying:</strong> ${this.reservationData.hotelStaying || 'Not specified'}</p>
            ${this.reservationData.specialRequests !== 'none' && this.reservationData.specialRequests !== 'ninguna' 
                ? `<p><strong>📝 Special Requests:</strong> ${this.reservationData.specialRequests}</p>` 
                : ''}
        </div>

        <div class="important">
            <h3>⚠️ Important: Complete Your Reservation</h3>
            <p>To secure your reservation, please complete the pre-authorization hold of <strong>$${this.reservationData.guests * 20} USD</strong> ($20 per person).</p>
            <p><strong>This is NOT a charge</strong> - it's a hold that will be released when you arrive. It's only captured in case of no-show.</p>
            <p style="text-align: center;">
                <a href="${paymentLink}" class="payment-btn">Complete Pre-Authorization →</a>
            </p>
            <p style="font-size: 12px; color: #666;">We accept all major credit cards, Apple Pay, and Google Pay.</p>
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
    generateRestaurantEmailTemplate(reservationId) {
        const holdAmount = this.reservationData.guests * 20;
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 700px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 30px; color: white; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .alert-new { background: #10b981; color: white; padding: 20px; text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; border-radius: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; }
        .info-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .info-value { font-size: 16px; font-weight: bold; color: #333; }
        .special-requests { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .payment-status { background: #d4edda; border: 2px solid #28a745; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .confirm-btn { display: inline-block; background: #10b981; color: white; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .confirm-btn:hover { background: #059669; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; width: 180px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Nueva Reservación</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Solomon's Landing - Marina Cabo San Lucas</p>
        </div>
        
        <div class="content">
            <div class="alert-new">
                ⏰ ACCIÓN REQUERIDA - Confirmar dentro de 2 horas
            </div>
            
            <h2 style="color: #8B4513; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">📋 Información del Cliente</h2>
            
            <table>
                <tr>
                    <td class="label">👤 Nombre Completo:</td>
                    <td><strong style="font-size: 18px;">${this.reservationData.name}</strong></td>
                </tr>
                <tr>
                    <td class="label">📧 Email:</td>
                    <td><a href="mailto:${this.reservationData.email}" style="color: #0066cc;">${this.reservationData.email}</a></td>
                </tr>
                <tr>
                    <td class="label">📱 Teléfono:</td>
                    <td><a href="tel:${this.reservationData.phone}" style="color: #0066cc; font-weight: bold;">${this.reservationData.phone}</a></td>
                </tr>
                <tr>
                    <td class="label">🏨 Hotel/Hospedaje:</td>
                    <td><strong>${this.reservationData.hotelStaying || 'No especificado'}</strong></td>
                </tr>
            </table>
            
            <h2 style="color: #8B4513; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 30px;">📅 Detalles de la Reservación</h2>
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Fecha</div>
                    <div class="info-value">📅 ${this.reservationData.date}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Hora</div>
                    <div class="info-value">⏰ ${this.reservationData.time}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Comensales</div>
                    <div class="info-value">👥 ${this.reservationData.guests} personas</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Hora de Solicitud</div>
                    <div class="info-value">🕒 ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mazatlan' })}</div>
                </div>
            </div>
            
            ${this.reservationData.specialRequests && this.reservationData.specialRequests !== 'none' && this.reservationData.specialRequests !== 'ninguna' 
                ? `<div class="special-requests">
                    <h3 style="margin: 0 0 10px 0;">📝 Solicitudes Especiales:</h3>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6;">${this.reservationData.specialRequests}</p>
                   </div>` 
                : ''}
            
            <div class="payment-status">
                <h3 style="margin: 0 0 10px 0; color: #28a745;">💳 Estado del Hold de Stripe</h3>
                <p style="margin: 0;"><strong>Monto:</strong> $${holdAmount}.00 USD ($20 por persona)</p>
                <p style="margin: 5px 0 0 0;"><strong>Estado:</strong> ✅ Pre-autorización solicitada (pendiente de completar por el cliente)</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">El cliente recibirá un email con el link para autorizar el hold.</p>
            </div>
            
            <div style="text-align: center; padding: 30px 0;">
                <p style="font-size: 16px; margin-bottom: 20px;">Una vez que verifiques disponibilidad y recibas el hold del cliente:</p>
                <a href="${window.location.origin}/api/reservations/confirm/${reservationId}" class="confirm-btn">
                    ✅ CONFIRMAR RESERVACIÓN
                </a>
                <p style="font-size: 14px; color: #666; margin-top: 15px;">Al confirmar, se enviará un email de confirmación final al cliente</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #666;">📊 Resumen Rápido</h3>
                <p style="margin: 5px 0;"><strong>ID Reservación:</strong> #${reservationId}</p>
                <p style="margin: 5px 0;"><strong>Cliente:</strong> ${this.reservationData.name} (${this.reservationData.guests} pax)</p>
                <p style="margin: 5px 0;"><strong>Cuándo:</strong> ${this.reservationData.date} a las ${this.reservationData.time}</p>
                <p style="margin: 5px 0;"><strong>Hold:</strong> $${holdAmount} USD</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Solomon's Landing - Blvd. Paseo de la Marina Centro, Cabo San Lucas</p>
            <p>📞 +52 624 219 3228 | 📧 contact@solomonslanding.com.mx</p>
        </div>
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

    // Mostrar botón de pago con Stripe Checkout
    async showStripePayment() {
        const chatMessages = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
        if (!chatMessages) return;

        const holdAmount = this.reservationData.guests * 20;

        // Crear contenedor para el botón de pago
        const paymentContainer = document.createElement('div');
        paymentContainer.className = 'bot-message stripe-payment-button';
        paymentContainer.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; max-width: 400px;">
                <h3 style="margin: 0 0 10px 0; font-size: 24px;">💳 Pago Seguro</h3>
                <p style="font-size: 18px; margin: 10px 0;">
                    <strong>Hold: $${holdAmount} USD</strong>
                </p>
                <p style="font-size: 14px; margin: 10px 0; opacity: 0.9;">
                    ($20 USD por persona)<br>
                    Se liberará cuando llegues al restaurante
                </p>
                
                <button id="stripe-checkout-btn" style="
                    width: 100%;
                    padding: 15px;
                    background: white;
                    color: #667eea;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 15px;
                    transition: all 0.3s;
                ">
                    🔒 Pagar Ahora
                </button>
                
                <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                    ✓ Aceptamos Tarjeta, Apple Pay, Google Pay<br>
                    ✓ Pago 100% seguro con Stripe
                </p>
            </div>
        `;
        
        chatMessages.appendChild(paymentContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Agregar event listener al botón
        const checkoutBtn = document.getElementById('stripe-checkout-btn');
        checkoutBtn.addEventListener('click', async () => {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirigiendo a pago...';

            try {
                // Crear Checkout Session
                const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_name: this.reservationData.name,
                        customer_email: this.reservationData.email,
                        customer_phone: this.reservationData.phone,
                        reservation_date: this.reservationData.date,
                        reservation_time: this.reservationData.time,
                        party_size: parseInt(this.reservationData.guests),
                        special_requests: this.reservationData.specialRequests
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al crear la sesión de pago');
                }

                // Redirigir a Stripe Checkout
                window.location.href = data.checkout_url;

            } catch (error) {
                console.error('Error:', error);
                this.addMessage(`❌ Error al procesar el pago: ${error.message}. Por favor, intenta de nuevo.`, false);
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = '🔒 Pagar Ahora';
            }
        });
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RestaurantChatbot;
}
