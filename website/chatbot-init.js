// Chatbot Initialization Script
// This file initializes the chatbot on every page

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
    
    function initChatbot() {
        // Check if chatbot already exists
        if (document.getElementById('chatbotContainer')) {
            return;
        }
        
        // Create chatbot container
        const chatbotHTML = `
        <div class="chatbot-container" id="chatbotContainer">
            <!-- Chatbot Toggle Button -->
            <button class="chatbot-button" id="chatbotToggle" aria-label="Open chat assistant">
                <div class="chatbot-assistant">
                    <div class="chatbot-speech-bubble">Hello! Need help?</div>
                </div>
                <span class="chatbot-notification" id="chatbotNotification">1</span>
            </button>

            <!-- Chatbot Window -->
            <div class="chatbot-window" id="chatbotWindow">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">🏖️</div>
                        <div class="chatbot-title">
                            <h3>Solomon's Landing</h3>
                            <div class="chatbot-status">
                                <span class="status-dot"></span>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose" aria-label="Close chat">
                        ✕
                    </button>
                </div>

                <!-- Messages Area -->
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Welcome message will be added here by JavaScript -->
                </div>

                <!-- Quick Replies -->
                <div class="quick-replies" id="quickReplies" style="display: none;">
                    <!-- Quick reply buttons will be added dynamically -->
                </div>

                <!-- Input Area -->
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbotInput" 
                        placeholder="Type your message..."
                        autocomplete="off"
                    >
                    <button class="chatbot-send" id="chatbotSend" aria-label="Send message">
                        ➤
                    </button>
                </div>
            </div>
        </div>
        `;
        
        // Insert chatbot into body
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Initialize chatbot functionality
        setupChatbot();
    }
    
    function setupChatbot() {
        // Initialize Chatbot
        const chatbot = new RestaurantChatbot();
        let isChatOpen = false;
        let hasShownWelcome = false;

        // DOM ElemenClose = document.getElementById('chatbotClose');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const chatbotInput = document.getElementById('chatbotInput');
        const chatbotSend = document.getElementById('chatbotSend');
        const chatbotNotification = document.getElementById('chatbotNotification');
        const quickRepliesContainer = document.getElementById('quickReplies');

        // Function to close chatbot
        function closeChatbot() {
            isChatOpen = false;
            chatbotWindow.classList.remove('open');
            chatbotToggle.classList.remove('active');
        }

        // Toggle chat window
        chatbotToggle.addEventListener('click', () => {
            isChatOpen = !isChatOpen;
            chatbotWindow.classList.toggle('open', isChatOpen);
            chatbotToggle.classList.toggle('active', isChatOpen);
            
            if (isChatOpen) {
                chatbotInput.focus();
                chatbotNotification.classList.remove('show');
                
                // Show welcome message on first open
                if (!hasShownWelcome) {
                    hasShownWelcome = true;
                    setTimeout(() => {
                        sendBotMessage(chatbot.responses[chatbot.currentLanguage].greeting, true);
                        showQuickReplies();
                    }, 500);
                }
            }
        });

        // Close button click
        chatbotClose.addEventListener('click', closeChatbot);

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isChatOpen) {
                closeChatbot();
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (isChatOpen && 
                !chatbotWindow.contains(e.target) && 
                !chatbotToggle.contains(e.target)) {
                closeChatbot();
            }
        });

        // Send message on button click
        chatbotSend.addEventListener('click', sendUserMessage);

        // Send message on Enter key
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });

        // Send user message
        async function sendUserMessage() {
            const message = chatbotInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Hide quick replies
            quickRepliesContainer.style.display = 'none';
            
            // Show typing animation
            showTyping();
            
            // Process message with chatbot
            setTimeout(async () => {
                const response = await chatbot.processMessage(message);
                hideTyping();
                sendBotMessage(response);
                
                // Show quick replies if in chatting state
                if (chatbot.conversationState === 'chatting') {
                    showQuickReplies();
                }
            }, 800 + Math.random() * 700); // Random delay for natural feel
        }

        // Add message to chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = sender === 'bot' ? '🏖️' : '👤';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            // Convert markdown-style links to actual links
            const formattedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
            // Convert **bold** to <strong>
            const withBold = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            
            content.innerHTML = withBold;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            
            chatbotMessages.appendChild(messageDiv);
            scrollToBottom();
        }

        // Send bot message
        function sendBotMessage(text, isWelcome = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message bot ${isWelcome ? 'welcome-message' : ''}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '🏖️';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            // Format text with links and bold
            const formattedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
            const withBold = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            
            content.innerHTML = withBold;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            
            chatbotMessages.appendChild(messageDiv);
            scrollToBottom();
        }

        // Show typing indicator
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot typing-message';
            typingDiv.id = 'typingMessage';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '🏖️';
            
            const typingDots = document.createElement('div');
            typingDots.className = 'message-content';
            typingDots.innerHTML = '<div class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
            
            typingDiv.appendChild(avatar);
            typingDiv.appendChild(typingDots);
            chatbotMessages.appendChild(typingDiv);
            scrollToBottom();
        }

        // Hide typing indicator
        function hideTyping() {
            const typingMsg = document.getElementById('typingMessage');
            if (typingMsg) {
                typingMsg.remove();
            }
        }

        // Scroll to bottom of messages
        function scrollToBottom() {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        // Show quick reply buttons
        function showQuickReplies() {
            const lang = chatbot.currentLanguage;
            const replies = lang === 'en' 
                ? ['📅 Make Reservation', '📍 Location', '🍽️ View Menu', '⏰ Hours']
                : ['📅 Hacer Reservación', '📍 Ubicación', '🍽️ Ver Menú', '⏰ Horarios'];
            
            quickRepliesContainer.innerHTML = '';
            
            // Only show quick replies if the user hasn't started a conversation yet
            // or if they're in chatting state
            if (chatbot.conversationState !== 'idle' && chatbot.conversationState !== 'chatting') {
                quickRepliesContainer.style.display = 'none';
                return;
            }
            
            replies.forEach(reply => {
                const btn = document.createElement('button');
                btn.className = 'quick-reply-btn';
                btn.textContent = reply;
                btn.onclick = () => {
                    chatbotInput.value = reply.substring(2); // Remove emoji
                    sendUserMessage();
                };
                quickRepliesContainer.appendChild(btn);
            });
            
            quickRepliesContainer.style.display = 'flex';
        }
        
        // Show option buttons for reservation flow
        function showOptionButtons(options) {
            quickRepliesContainer.innerHTML = '';
            
            options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'quick-reply-btn';
                btn.textContent = option;
                btn.onclick = () => {
                    addMessage(option, 'user');
                    quickRepliesContainer.style.display = 'none';
                    showTyping();
                    
                    setTimeout(async () => {
                        const response = await chatbot.processMessage(option);
                        hideTyping();
                        sendBotMessage(response);
                    }, 800 + Math.random() * 700);
                };
                quickRepliesContainer.appendChild(btn);
            });
            
            quickRepliesContainer.style.display = 'flex';
        }
        
        // Make showOptionButtons available to chatbot
        window.showChatbotOptions = showOptionButtons;
        
        // Show date picker
        function showDatePicker() {
            quickRepliesContainer.innerHTML = '';
            
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.className = 'chatbot-date-picker';
            dateInput.style.cssText = `
                width: 100%;
                padding: 0.75rem;
                border: 2px solid var(--yellow-sun, #FFC93C);
                border-radius: 8px;
                font-size: 1rem;
                font-family: inherit;
                background: white;
                color: #1e293b;
                cursor: pointer;
            `;
            
            // Set min date to today
            const today = new Date();
            dateInput.min = today.toISOString().split('T')[0];
            
            // Set max date to 3 months from now
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.max = maxDate.toISOString().split('T')[0];
            
            dateInput.addEventListener('change', (e) => {
                const selectedDate = new Date(e.target.value + 'T00:00:00');
                const formattedDate = selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                addMessage(formattedDate, 'user');
                quickRepliesContainer.style.display = 'none';
                showTyping();
                
                setTimeout(async () => {
                    const response = await chatbot.processMessage(formattedDate);
                    hideTyping();
                    sendBotMessage(response);
                }, 800);
            });
            
            quickRepliesContainer.appendChild(dateInput);
            quickRepliesContainer.style.display = 'flex';
            
            // Auto-open date picker on mobile
            setTimeout(() => {
                dateInput.focus();
                if (dateInput.showPicker) {
                    dateInput.showPicker();
                }
            }, 100);
        }
        
        window.showDatePicker = showDatePicker;

        // Show notification badge after 3 seconds if chat not opened
        setTimeout(() => {
            if (!hasShownWelcome) {
                chatbotNotification.classList.add('show');
            }
        }, 3000);

        // EmailJS Configuration
        const EMAILJS_CONFIG = {
            serviceID: 'service_u021fxi',
            customerTemplateID: 'template_swvqncq',
            restaurantTemplateID: 'template_ij3p83j',
            publicKey: 'gCsJYvChpOqVACgUr'
        };

        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            console.log('✅ EmailJS initialized successfully');
        }

        // Override email sending function
        chatbot.sendReservationEmails = async function() {
            try {
                // Check if EmailJS is configured
                if (typeof emailjs === 'undefined') {
                    console.error('❌ EmailJS SDK not loaded. Please add the EmailJS script to your HTML.');
                    return Promise.reject('EmailJS SDK not loaded');
                }

                const now = new Date();
                
                // Prepare data for customer email
                const customerParams = {
                    customer_name: this.reservationData.name,
                    customer_email: this.reservationData.email,
                    customer_phone: this.reservationData.phone,
                    reservation_date: this.reservationData.date,
                    reservation_time: this.reservationData.time,
                    num_guests: this.reservationData.guests,
                    special_requests: (this.reservationData.celebration || '') + 
                                     (this.reservationData.celebration && this.reservationData.restrictions ? ' | ' : '') +
                                     (this.reservationData.restrictions || '') || 'None'
                };
                
                // Send to customer
                console.log('📧 Sending confirmation email to customer...');
                await emailjs.send(
                    EMAILJS_CONFIG.serviceID,
                    EMAILJS_CONFIG.customerTemplateID,
                    customerParams
                );
                
                console.log('✅ Customer email sent to:', this.reservationData.email);
                
                // Prepare data for restaurant email
                const restaurantParams = {
                    ...customerParams,
                    request_time: now.toLocaleString('en-US', { 
                        dateStyle: 'full', 
                        timeStyle: 'short' 
                    })
                };
                
                // Send to restaurant
                console.log('📧 Sending notification to restaurant...');
                await emailjs.send(
                    EMAILJS_CONFIG.serviceID,
                    EMAILJS_CONFIG.restaurantTemplateID,
                    restaurantParams
                );
                
                console.log('✅ Restaurant notification sent successfully');
                console.log('=== RESERVATION CONFIRMED ===');
                
                return Promise.resolve();
            } catch (error) {
                console.error('❌ Error sending emails:', error);
                console.log('Reservation data:', this.reservationData);
                // Don't fail the reservation if email fails
                return Promise.resolve();
            }
        };
    }
})();
