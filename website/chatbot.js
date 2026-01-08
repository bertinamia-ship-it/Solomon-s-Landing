// Solomon's Landing AI Chatbot
// Bilingual customer service assistant for reservations and inquiries

class RestaurantChatbot {
    constructor() {
        this.conversationState = 'idle';
        this.reservationData = {
            full_name: null,
            email: null,
            phone: null,
            date: null,
            time: null,
            party_size: null,
            staying_place: null,
            notes: null
        };
        this.currentLanguage = 'en';
        this.awaitingField = null;
        this.messageHistory = [];
        this.isSubmittingReservation = false;
        
        // Initialize menu search system
        this.menuSearch = typeof MenuSearchSystem !== 'undefined' 
            ? new MenuSearchSystem() 
            : null;
    }

    // Predefined responses for common questions
    responses = {
        en: {
            greeting: "Hi! How can I help? 👋",
            
            catering: "🎉 **Catering Services**\n\nWeddings • Corporate • Parties\n\n📱 Contact:\n**+52 624-217-5935**\n\n[More info](catering.html)",
            
            directions: "📍 **Cabo San Lucas Marina**\n\nBlvd. Paseo de la Marina Centro\n23450 Cabo San Lucas, B.C.S.\n\n🗺️ [View map & directions](location.html)",
            
            menu: "🍽️ **Our Menus:**\n• Breakfast (8 AM - 12 PM)\n• Lunch (12 PM - 5 PM)\n• Dinner (5 PM - 11 PM)\n• Sushi & Bar\n\n📖 [View full menus](menus.html)",
            
            hours: "⏰ **Hours:**\n\nOpen 7 days\nMon-Sun: 8 AM - 11 PM",
            
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
                let summary = `✅ **Reservation Summary:**\n\n👤 Name: ${data.full_name}\n📧 Email: ${data.email}\n📱 Phone: ${data.phone}\n📅 Date: ${data.date}\n⏰ Time: ${data.time}\n👥 Guests: ${data.party_size}`;
                
                if (data.staying_place) {
                    summary += `\n🏨 Staying: ${data.staying_place}`;
                }
                
                if (data.notes) {
                    summary += `\n📝 Notes: ${data.notes}`;
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
            greeting: "¡Hola! ¿En qué te ayudo? 👋",
            
            catering: "🎉 **Catering**\n\nBodas • Corporativo • Fiestas\n\n📱 Contacto:\n**+52 624-217-5935**\n\n[Más info](catering.html)",
            
            directions: "📍 **Marina Cabo San Lucas**\n\nBlvd. Paseo de la Marina Centro\n23450 Cabo San Lucas, B.C.S.\n\n🗺️ [Ver mapa](location.html)",
            
            menu: "🍽️ **Nuestros Menús:**\n• Desayuno (8 AM - 12 PM)\n• Comida (12 PM - 5 PM)\n• Cena (5 PM - 11 PM)\n• Sushi & Bar\n\n📖 [Ver menús completos](menus.html)",
            
            hours: "⏰ **Horario:**\n\nAbierto 7 días\nLun-Dom: 8 AM - 11 PM",
            
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
                let summary = `✅ **Resumen de Reservación:**\n\n👤 Nombre: ${data.full_name}\n📧 Email: ${data.email}\n📱 Teléfono: ${data.phone}\n📅 Fecha: ${data.date}\n⏰ Hora: ${data.time}\n👥 Comensales: ${data.party_size}`;
                
                if (data.staying_place) {
                    summary += `\n🏨 Hospedaje: ${data.staying_place}`;
                }
                
                if (data.notes) {
                    summary += `\n📝 Notas: ${data.notes}`;
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
                this.reservationData.full_name = userMessage;
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
                // Handle date button selections - always store as YYYY-MM-DD
                if (message.includes('tonight') || message.includes('esta noche')) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    this.reservationData.date = today.toISOString().split('T')[0]; // YYYY-MM-DD
                } else if (message.includes('tomorrow') || message.includes('mañana')) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);
                    this.reservationData.date = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD
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
                    const parsedDate = this.parseDate(userMessage);
                    if (!parsedDate) {
                        return this.currentLanguage === 'en'
                            ? "❌ **Invalid date format.**\n\nPlease provide a date in one of these formats:\n• \"today\" or \"tonight\"\n• \"tomorrow\"\n• A specific date (e.g., \"January 15, 2025\")\n\nOr click \"Choose Date\" to use the calendar."
                            : "❌ **Formato de fecha inválido.**\n\nPor favor proporciona una fecha en uno de estos formatos:\n• \"hoy\" o \"esta noche\"\n• \"mañana\"\n• Una fecha específica (ej: \"15 de enero de 2025\")\n\nO haz clic en \"Elegir Fecha\" para usar el calendario.";
                    }
                    this.reservationData.date = parsedDate;
                }
                
                this.conversationState = 'awaiting_time';
                response = this.responses[this.currentLanguage].askTime;
                
                // Show time options (will be filtered by availability after party_size is known)
                setTimeout(() => {
                    if (typeof window.showChatbotOptions === 'function') {
                        const timeOptions = [
                            '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
                            '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
                        ];
                        window.showChatbotOptions(timeOptions);
                    }
                }, 100);
                break;
            
            case 'awaiting_time':
                // Validate time is in 5:30 PM - 9:30 PM range
                const timeMatch = userMessage.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
                if (timeMatch) {
                    let hour = parseInt(timeMatch[1]);
                    const minute = parseInt(timeMatch[2]);
                    const period = timeMatch[3].toUpperCase();
                    
                    if (period === 'PM' && hour !== 12) hour += 12;
                    if (period === 'AM' && hour === 12) hour = 0;
                    
                    const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    // Check if time is between 17:30 and 21:30
                    if (time24 >= '17:30' && time24 <= '21:30') {
                        this.reservationData.time = time24;
                    } else {
                        response = this.currentLanguage === 'en'
                            ? "Please select a time between 5:30 PM and 9:30 PM"
                            : "Por favor selecciona una hora entre 5:30 PM y 9:30 PM";
                        break;
                    }
                } else {
                    // Try to parse as 24-hour format or direct time
                this.reservationData.time = userMessage;
                }
                
                this.conversationState = 'awaiting_guests';
                response = this.responses[this.currentLanguage].askGuests;
                
                // Show guest options
                setTimeout(() => {
                    if (typeof window.showChatbotOptions === 'function') {
                        const lang = this.currentLanguage;
                        const guestOptions = lang === 'en' 
                            ? ['1 pax', '2 pax', '3 pax', '4 pax', '5 pax', '6 pax', '7 pax', '8 pax', '9 pax', '10+ pax']
                            : ['1 pax', '2 pax', '3 pax', '4 pax', '5 pax', '6 pax', '7 pax', '8 pax', '9 pax', '10+ pax'];
                        window.showChatbotOptions(guestOptions);
                    }
                }, 100);
                break;
            
            case 'awaiting_guests':
                // Parse party_size from button text
                const guestMatch = userMessage.match(/(\d+)/);
                const guests = guestMatch ? parseInt(guestMatch[0]) : null;
                
                if (guests && guests > 0) {
                    this.reservationData.party_size = guests.toString();
                    
                    // If time was already selected, check availability now
                    if (this.reservationData.time && this.reservationData.date) {
                        try {
                            const availabilityRes = await fetch('/.netlify/functions/check-availability', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    date: this.reservationData.date,
                                    time: this.reservationData.time,
                                    party_size: this.reservationData.party_size
                                })
                            });

                            const availabilityResult = await availabilityRes.json().catch(() => ({}));

                            if (!availabilityRes.ok || !availabilityResult.success || !availabilityResult.available) {
                                // Time not available, get alternative times
                                const availableTimesRes = await fetch(`/.netlify/functions/get-available-times?date=${this.reservationData.date}&party_size=${this.reservationData.party_size}&area=Main%20Floor`);
                                const availableTimesData = await availableTimesRes.json().catch(() => ({}));

                                if (availableTimesData.ok && availableTimesData.times && availableTimesData.times.length > 0) {
                                    // Convert 24h to 12h format for display
                                    const formatTime = (time24) => {
                                        const [h, m] = time24.split(':');
                                        const hour = parseInt(h);
                                        const period = hour >= 12 ? 'PM' : 'AM';
                                        const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                                        return `${hour12}:${m} ${period}`;
                                    };

                                    const availableTimesFormatted = availableTimesData.times.map(formatTime);
                                    const selectedTimeFormatted = formatTime(this.reservationData.time);
                                    
                                    response = this.currentLanguage === 'en'
                                        ? `❌ **Sorry, ${selectedTimeFormatted} is not available for ${this.reservationData.party_size} guests.**\n\n✅ **Available times:**\n${availableTimesFormatted.map(t => `• ${t}`).join('\n')}\n\nPlease select one of these times:`
                                        : `❌ **Lo sentimos, ${selectedTimeFormatted} no está disponible para ${this.reservationData.party_size} comensales.**\n\n✅ **Horarios disponibles:**\n${availableTimesFormatted.map(t => `• ${t}`).join('\n')}\n\nPor favor selecciona uno de estos horarios:`;

                                    this.conversationState = 'awaiting_time';
                                    
                                    setTimeout(() => {
                                        if (typeof window.showChatbotOptions === 'function') {
                                            window.showChatbotOptions(availableTimesFormatted);
                                        }
                                    }, 100);
                                    break;
                                } else {
                                    // No times available
                                    response = this.currentLanguage === 'es'
                                        ? `❌ **No hay disponibilidad para ${this.reservationData.party_size} comensales en esta fecha.**\n\n💡 **Sugerencias:**\n• Prueba otra fecha\n• Llama al restaurante: **+52 624-217-5935**\n• Considera un grupo más pequeño`
                                        : `❌ **No availability for ${this.reservationData.party_size} guests on this date.**\n\n💡 **Suggestions:**\n• Try another date\n• Call the restaurant: **+52 624-217-5935**\n• Consider a smaller party size`;
                                    
                                    this.conversationState = 'awaiting_date';
                                    break;
                                }
                            }
                        } catch (error) {
                            console.error('Error checking availability:', error);
                            // Continue with flow if check fails
                        }
                    }
                    
                    // If we get here, time is available or wasn't checked yet, continue with flow
                    this.conversationState = 'awaiting_staying_place';
                    response = this.responses[this.currentLanguage].askStayingPlace;
                    
                    // Show staying place options
                    setTimeout(() => {
                        if (typeof window.showChatbotOptions === 'function') {
                            const lang = this.currentLanguage;
                            const stayingOptions = lang === 'en' 
                                ? ['Hotel', 'Airbnb', 'Other', 'None']
                                : ['Hotel', 'Airbnb', 'Otro', 'Ninguno'];
                            window.showChatbotOptions(stayingOptions);
                        }
                    }, 100);
                } else if (userMessage.toLowerCase().includes('more') || userMessage.toLowerCase().includes('más') || userMessage.toLowerCase().includes('10+')) {
                    this.reservationData.party_size = '10';
                    this.conversationState = 'awaiting_staying_place';
                    response = this.responses[this.currentLanguage].askStayingPlace;
                } else {
                    response = this.currentLanguage === 'en'
                        ? "Please select a valid number of guests"
                        : "Por favor selecciona un número válido de comensales";
                }
                break;
            
            case 'awaiting_staying_place':
                // Store staying place type
                const stayingType = userMessage.toLowerCase();
                if (stayingType.includes('hotel')) {
                    this.reservationData.staying_place_type = 'hotel';
                } else if (stayingType.includes('airbnb')) {
                    this.reservationData.staying_place_type = 'airbnb';
                } else if (stayingType.includes('other') || stayingType.includes('otro')) {
                    this.reservationData.staying_place_type = 'other';
                } else {
                    this.reservationData.staying_place_type = '';
                    this.reservationData.staying_place = '';
                    this.conversationState = 'awaiting_notes';
                    response = this.currentLanguage === 'en'
                        ? "**Any special requests or notes?** (optional)\n\nType your requests or 'none' to continue."
                        : "**¿Alguna solicitud especial o nota?** (opcional)\n\nEscribe tus solicitudes o 'ninguna' para continuar.";
                break;
                }
                
                // Ask for name of accommodation
                this.conversationState = 'awaiting_staying_place_name';
                response = this.currentLanguage === 'en'
                    ? "**What is the name of the hotel/accommodation?**\n\nPlease provide the name."
                    : "**¿Cuál es el nombre del hotel/alojamiento?**\n\nPor favor proporciona el nombre.";
                break;
            
            case 'awaiting_staying_place_name':
                // Build staying_place: "Hotel: Name" or "Airbnb: Name" or "Other: Name"
                const typeLabels = {
                    'hotel': this.currentLanguage === 'en' ? 'Hotel' : 'Hotel',
                    'airbnb': this.currentLanguage === 'en' ? 'Airbnb' : 'Airbnb',
                    'other': this.currentLanguage === 'en' ? 'Other' : 'Otro'
                };
                const typeLabel = typeLabels[this.reservationData.staying_place_type] || this.reservationData.staying_place_type;
                this.reservationData.staying_place = `${typeLabel}: ${userMessage}`;
                this.conversationState = 'awaiting_notes';
                response = this.currentLanguage === 'en'
                    ? "**Any special requests or notes?** (optional)\n\nType your requests or 'none' to continue."
                    : "**¿Alguna solicitud especial o nota?** (opcional)\n\nEscribe tus solicitudes o 'ninguna' para continuar.";
                break;
            
            case 'awaiting_notes':
                if (userMessage.toLowerCase() === 'none' || userMessage.toLowerCase() === 'ninguna') {
                    this.reservationData.notes = '';
                } else {
                    this.reservationData.notes = userMessage;
                }
                this.conversationState = 'confirming';
                response = this.responses[this.currentLanguage].confirmReservation(this.reservationData);
                break;
            
            case 'confirming':
                if (message.includes('yes') || message.includes('sí') || message.includes('si') || message === 'y') {
                    // Prevent duplicate submissions
                    if (this.isSubmittingReservation) {
                        response = this.currentLanguage === 'en'
                            ? '⏳ Processing your reservation...'
                            : '⏳ Procesando tu reservación...';
                        return response;
                    }

                    this.isSubmittingReservation = true;
                    this.conversationState = 'submitting';

                    try {
                        // Build payload matching form structure (unified field names)
                        const payload = {
                            full_name: this.reservationData.full_name || '',
                            email: this.reservationData.email || '',
                            phone: this.reservationData.phone || '',
                            date: this.reservationData.date || '',
                            time: this.reservationData.time || '',
                            party_size: this.reservationData.party_size || '',
                            staying_place: this.reservationData.staying_place || '',
                            notes: this.reservationData.notes || '',
                            language: this.currentLanguage || 'en'
                        };

                        // Validate and format date/time
                        // Ensure date is YYYY-MM-DD format
                        if (!payload.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            throw new Error(this.currentLanguage === 'es' 
                                ? 'Fecha inválida' 
                                : 'Invalid date');
                        }

                        // Ensure time is HH:MM format (24-hour)
                        if (!payload.time.match(/^\d{2}:\d{2}$/)) {
                            throw new Error(this.currentLanguage === 'es' 
                                ? 'Hora inválida' 
                                : 'Invalid time');
                        }

                        // Build ISO datetime and validate
                        const isoDatetime = `${payload.date}T${payload.time}:00`;
                        const dateTimeObj = new Date(isoDatetime);
                        if (Number.isNaN(dateTimeObj.getTime())) {
                            throw new Error(this.currentLanguage === 'es' 
                                ? 'Fecha y hora inválidas' 
                                : 'Invalid date and time');
                        }

                        payload.datetime_iso = isoDatetime;

                        // Step 1: Check availability
                        const availabilityRes = await fetch('/.netlify/functions/check-availability', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                date: payload.date,
                                time: payload.time,
                                party_size: payload.party_size
                            })
                        });

                        const availabilityResult = await availabilityRes.json().catch(() => ({}));
                        console.log('🤖 Chatbot availability check:', availabilityRes.status, availabilityResult);

                        if (!availabilityRes.ok) {
                            console.error('❌ Availability check failed:', availabilityRes.status, availabilityResult);
                            throw new Error(this.currentLanguage === 'es'
                                ? `Error al verificar disponibilidad (${availabilityRes.status}). Por favor intenta de nuevo.`
                                : `Error checking availability (${availabilityRes.status}). Please try again.`);
                        }

                        if (!availabilityResult.success || !availabilityResult.available) {
                            const errorMsg = availabilityResult.message || (this.currentLanguage === 'es'
                                ? 'No hay disponibilidad para esta fecha y hora. Por favor selecciona otra opción.'
                                : 'No availability for this date and time. Please select another option.');
                            throw new Error(errorMsg);
                        }

                        // Step 2: Check if holds are enabled and show confirmation
                        const holdCheckRes = await fetch('/.netlify/functions/create-hold', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                party_size: payload.party_size,
                                full_name: payload.full_name,
                                email: payload.email
                            })
                        });

                        const holdCheckResult = await holdCheckRes.json().catch(() => ({}));
                        console.log('🤖 Chatbot hold check:', holdCheckRes.status, holdCheckResult);

                        if (!holdCheckRes.ok) {
                            console.error('❌ Hold check failed:', holdCheckRes.status, holdCheckResult);
                            throw new Error(this.currentLanguage === 'es'
                                ? `Error al verificar el sistema de pagos (${holdCheckRes.status}). Por favor intenta de nuevo.`
                                : `Error checking payment system (${holdCheckRes.status}). Please try again.`);
                        }

                        // Step 3: Process Stripe hold (only if enabled)
                        let paymentIntentId = null;
                        const holdResult = holdCheckResult;

                        // Only run Stripe confirmation if holds are enabled AND client_secret exists
                        if (holdResult.hold_enabled === true && holdResult.client_secret) {
                            if (!holdResult.success) {
                                throw new Error(holdResult.error || 'Failed to create payment hold');
                            }

                            // Load Stripe.js if not already loaded
                            if (typeof window.Stripe === 'undefined') {
                                await new Promise((resolve, reject) => {
                                    const script = document.createElement('script');
                                    script.src = 'https://js.stripe.com/v3/';
                                    script.onload = resolve;
                                    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
                                    document.head.appendChild(script);
                                });
                            }

                            const stripePublishableKey = window.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
                            const stripe = window.Stripe(stripePublishableKey);

                            console.log('💳 Chatbot confirming payment hold with test card...');
                            try {
                                const confirmResult = await stripe.confirmCardPayment(holdResult.client_secret, {
                                    payment_method: {
                                        card: {
                                            number: '4242424242424242',
                                            exp_month: 12,
                                            exp_year: 2025,
                                            cvc: '123'
                                        },
                                        billing_details: {
                                            name: payload.full_name,
                                            email: payload.email
                                        }
                                    }
                                });

                                if (confirmResult.error) {
                                    throw new Error(confirmResult.error.message);
                                }

                                if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === 'requires_capture') {
                                    console.log('✅ Payment hold authorized:', confirmResult.paymentIntent.id);
                                    paymentIntentId = confirmResult.paymentIntent.id;
                                } else {
                                    throw new Error('Payment hold not authorized');
                                }
                            } catch (stripeError) {
                                console.error('❌ Stripe confirmation error:', stripeError);
                                throw new Error(stripeError.message || 'Payment confirmation failed');
                            }
                        } else if (holdResult.hold_enabled === false) {
                            // Holds are disabled - skip Stripe and proceed directly to reservation
                            console.log('ℹ️ Payment holds are disabled, proceeding directly to reservation');
                            paymentIntentId = null;
                        }

                        // Add payment_intent_id, datetime_iso, and source to payload
                        payload.payment_intent_id = paymentIntentId;
                        payload.datetime_iso = isoDatetime;
                        payload.source = 'chatbot';

                        console.log('🤖 Chatbot sending reservation to Netlify Function:', payload);

                        // Step 4: Send to Netlify Function (only after hold is authorized)
                        const netlifyUrl = `/.netlify/functions/send-reservation`;
                        const res = await fetch(netlifyUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload)
                        });

                        const result = await res.json().catch(() => ({}));
                        console.log('🤖 Chatbot reservation response:', res.status, result);

                        if (!res.ok) {
                            console.error('❌ Reservation failed:', res.status, result);
                            throw new Error(result.error || (this.currentLanguage === 'es'
                                ? `Error del servidor (${res.status}). Por favor intenta de nuevo o llámanos al +52 624 219 3228.`
                                : `Server error (${res.status}). Please try again or call us at +52 624 219 3228.`));
                        }

                        if (res.ok && result.success) {
                            // Format date for display
                            const reservationDate = new Date(this.reservationData.date);
                            const formattedDate = reservationDate.toLocaleDateString(
                                this.currentLanguage === 'es' ? 'es-MX' : 'en-US',
                                {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }
                            );
                        
                        response = this.currentLanguage === 'en'
                                ? `✅ **Reservation Confirmed!**\n\n📧 You will receive a confirmation email within 2 hours.\n\n**Reservation ID:** ${result.reservationId}\n\n**Reservation Details:**\n• Name: ${this.reservationData.full_name}\n• Date: ${formattedDate}\n• Time: ${this.reservationData.time}\n• Guests: ${this.reservationData.party_size}\n\n🍽️ We're looking forward to serving you!\n\n📱 **Questions? Call us: +52 624 219 3228**`
                                : `✅ **¡Reservación Confirmada!**\n\n📧 Recibirás un correo de confirmación en las próximas 2 horas.\n\n**ID de Reservación:** ${result.reservationId}\n\n**Detalles de Reservación:**\n• Nombre: ${this.reservationData.full_name}\n• Fecha: ${formattedDate}\n• Hora: ${this.reservationData.time}\n• Comensales: ${this.reservationData.party_size}\n\n🍽️ ¡Esperamos servirte pronto!\n\n📱 **¿Preguntas? Llámanos: +52 624 219 3228**`;
                        } else {
                            throw new Error(result.error || 'Reservation failed');
                        }

                    } catch (error) {
                        console.error('❌ Chatbot reservation error:', error);
                        response = this.currentLanguage === 'en'
                            ? `❌ **Sorry, there was an error processing your reservation.**\n\nPlease try again or call us directly:\n📱 **+52 624 219 3228**\n\nWe're here to help!`
                            : `❌ **Lo siento, hubo un error al procesar tu reservación.**\n\nPor favor intenta de nuevo o llámanos directamente:\n📱 **+52 624 219 3228**\n\n¡Estamos aquí para ayudarte!`;
                    } finally {
                        this.isSubmittingReservation = false;
                    }
                    
                    // Reset reservation data after submission (success or error)
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

    // Helper: Parse date from natural language and return YYYY-MM-DD format
    parseDate(input) {
        if (!input) return null;
        
        const message = input.toLowerCase().trim();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Handle "today" or "tonight"
        if (message.includes('today') || message.includes('hoy') || message.includes('tonight') || message.includes('esta noche')) {
            return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        }
        
        // Handle "tomorrow"
        if (message.includes('tomorrow') || message.includes('mañana')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        }
        
        // If already in YYYY-MM-DD format, return as-is
        if (input.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return input;
        }
        
        // Try to parse as date and convert to YYYY-MM-DD
        const parsed = new Date(input);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toISOString().split('T')[0];
        }
        
        // If can't parse, return null (will trigger error)
        return null;
    }

    // Reset reservation data
    resetReservation() {
        this.conversationState = 'chatting';
        this.isSubmittingReservation = false;
        this.reservationData = {
            full_name: null,
            email: null,
            phone: null,
            date: null,
            time: null,
            party_size: null,
            staying_place: null,
            staying_place_type: null,
            notes: null
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
