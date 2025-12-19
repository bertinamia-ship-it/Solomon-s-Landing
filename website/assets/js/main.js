/* ============================================
   SOLOMON'S LANDING - MAIN JAVASCRIPT
   Bilingual support + Navbar functionality
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // i18n DICTIONARY
    // ============================================
    const translations = {
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.menus': 'Menus',
            'nav.reviews': 'Reviews',
            'nav.catering': 'Catering',
            'nav.location': 'Location',
            'nav.reserve': 'Reserve',
            
            // Hero
            'hero.title': 'International Cuisine Restaurant',
            'hero.subtitle': 'Enjoy the experience',
            'hero.bookBtn': 'Book a Table',
            'hero.menusBtn': 'View Menus',
            
            // Welcome Section
            'welcome.intro': 'In the heart of the marina in Cabo San Lucas, Solomon\'s Landing is an international cuisine restaurant with a specialty in seafood fresh from Baja California Sur. A place where locals gather and visitors return year after year.',
            'welcome.experience': 'With over 30 years of culinary excellence, we have proudly served the Los Cabos community, creating unforgettable dining experiences on the beautiful marina waterfront.',
            'welcome.commitmentTitle': 'Our Commitment to Your Well-being',
            'welcome.health': 'From day one, your health and satisfaction have been at the heart of everything we do. We believe that exceptional dining begins with exceptional ingredients.',
            'welcome.organicTitle': '100% Organic Products',
            'welcome.organicDesc': 'Only the finest organic ingredients, sourced with care for your health and the environment',
            'welcome.oilTitle': 'Premium Avocado Oil',
            'welcome.oilDesc': 'We cook exclusively with heart-healthy avocado oil, never compromising on quality',
            'welcome.localTitle': 'Supporting Local Businesses',
            'welcome.localDesc': 'Since our founding, we\'ve partnered with local farmers and suppliers to bring you the freshest ingredients',
            'welcome.philosophy': '"Quality isn\'t just our standard—it\'s our promise. Every dish we serve reflects our dedication to your health, happiness, and memorable dining experience."',
            
            // Reservations
            'reservations.title': 'Make a Reservation',
            'reservations.description': 'Reserve your table and enjoy an unforgettable dining experience',
            
            // Form
            'form.name': 'Full Name',
            'form.namePlaceholder': 'John Doe',
            'form.email': 'Email',
            'form.emailPlaceholder': 'john@example.com',
            'form.phone': 'Phone Number',
            'form.phonePlaceholder': '+52 624 123 4567',
            'form.date': 'Date',
            'form.time': 'Time',
            'form.guests': 'Number of Guests',
            'form.notes': 'Special Requests or Notes',
            'form.notesPlaceholder': 'Allergies, special occasions, seating preferences...',
            'form.reserveBtn': 'Reserve Table',
            
            // Menus
            'menus.title': 'Our Menus',
            'menus.description': 'Discover our carefully crafted dishes, made with the finest ingredients',
            
            // Contact
            'contact.title': 'Visit Us in Cabo San Lucas',
            'contact.description': 'Come experience the best waterfront dining in Cabo',
            'contact.address': 'Address',
            'contact.contactInfo': 'Contact',
            'contact.hours': 'Hours',
            'contact.openDays': 'Open 7 days a week'
        },
        es: {
            // Navigation
            'nav.home': 'Inicio',
            'nav.menus': 'Menús',
            'nav.reviews': 'Reseñas',
            'nav.catering': 'Catering',
            'nav.location': 'Ubicación',
            'nav.reserve': 'Reservar',
            
            // Hero
            'hero.title': 'Restaurante de Cocina Internacional',
            'hero.subtitle': 'Disfruta la experiencia',
            'hero.bookBtn': 'Reservar Mesa',
            'hero.menusBtn': 'Ver Menús',
            
            // Welcome Section
            'welcome.intro': 'En el corazón de la marina en Cabo San Lucas, Solomon\'s Landing es un restaurante de cocina internacional con especialidad en mariscos frescos de Baja California Sur. Un lugar donde los locales se reúnen y los visitantes regresan año tras año.',
            'welcome.experience': 'Con más de 30 años de excelencia culinaria, hemos servido con orgullo a la comunidad de Los Cabos, creando experiencias gastronómicas inolvidables en el hermoso malecón de la marina.',
            'welcome.commitmentTitle': 'Nuestro Compromiso con tu Bienestar',
            'welcome.health': 'Desde el primer día, tu salud y satisfacción han estado en el corazón de todo lo que hacemos. Creemos que una experiencia gastronómica excepcional comienza con ingredientes excepcionales.',
            'welcome.organicTitle': '100% Productos Orgánicos',
            'welcome.organicDesc': 'Solo los mejores ingredientes orgánicos, seleccionados con cuidado para tu salud y el medio ambiente',
            'welcome.oilTitle': 'Aceite de Aguacate Premium',
            'welcome.oilDesc': 'Cocinamos exclusivamente con aceite de aguacate saludable para el corazón, sin comprometer la calidad',
            'welcome.localTitle': 'Apoyo a Negocios Locales',
            'welcome.localDesc': 'Desde nuestros inicios, nos hemos asociado con agricultores y proveedores locales para ofrecerte los ingredientes más frescos',
            'welcome.philosophy': '"La calidad no es solo nuestro estándar, es nuestra promesa. Cada platillo que servimos refleja nuestra dedicación a tu salud, felicidad y experiencia gastronómica memorable."',
            
            // Reservations
            'reservations.title': 'Hacer una Reservación',
            'reservations.description': 'Reserve su mesa y disfrute de una experiencia gastronómica inolvidable',
            
            // Form
            'form.name': 'Nombre Completo',
            'form.namePlaceholder': 'Juan Pérez',
            'form.email': 'Correo Electrónico',
            'form.emailPlaceholder': 'juan@ejemplo.com',
            'form.phone': 'Número de Teléfono',
            'form.phonePlaceholder': '+52 624 123 4567',
            'form.date': 'Fecha',
            'form.time': 'Hora',
            'form.guests': 'Número de Comensales',
            'form.notes': 'Solicitudes Especiales o Notas',
            'form.notesPlaceholder': 'Alergias, ocasiones especiales, preferencias de asientos...',
            'form.reserveBtn': 'Reservar Mesa',
            
            // Menus
            'menus.title': 'Nuestros Menús',
            'menus.description': 'Descubra nuestros platillos cuidadosamente elaborados, hechos con los mejores ingredientes',
            
            // Contact
            'contact.title': 'Visítenos en Cabo San Lucas',
            'contact.description': 'Venga a experimentar la mejor comida frente al mar en Cabo',
            'contact.address': 'Dirección',
            'contact.contactInfo': 'Contacto',
            'contact.hours': 'Horarios',
            'contact.openDays': 'Abierto los 7 días de la semana'
        }
    };

    // ============================================
    // STATE
    // ============================================
    let currentLanguage = localStorage.getItem('language') || 'en';

    // ============================================
    // LANGUAGE FUNCTIONS
    // ============================================
    function translatePage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang][key];
            
            if (translation) {
                // Check if element has a placeholder
                if (element.placeholder !== undefined) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    function initLanguage() {
        // Set initial language
        translatePage(currentLanguage);
        
        // Add event listeners to language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.dataset.lang;
                translatePage(lang);
            });
        });
    }

    // ============================================
    // NAVBAR FUNCTIONS
    // ============================================
    function initNavbar() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.navbar-nav');
        const overlay = document.querySelector('.mobile-nav-overlay');
        const header = document.querySelector('.site-header');
        const navLinks = document.querySelectorAll('.navbar-nav a');
        
        // Mobile menu toggle
        if (toggle && nav && overlay) {
            toggle.addEventListener('click', function() {
                const isActive = nav.classList.toggle('active');
                overlay.classList.toggle('active', isActive);
                toggle.classList.toggle('active', isActive);
                toggle.setAttribute('aria-expanded', isActive);
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = isActive ? 'hidden' : '';
            });
            
            // Close menu when clicking overlay
            overlay.addEventListener('click', function() {
                nav.classList.remove('active');
                overlay.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
            
            // Close menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        nav.classList.remove('active');
                        overlay.classList.remove('active');
                        toggle.classList.remove('active');
                        toggle.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
        
        // Active page indicator
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
        
        // Scrolled header effect
        if (header) {
            let lastScroll = 0;
            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
            });
        }
    }

    // ============================================
    // KEYBOARD ACCESSIBILITY
    // ============================================
    function initAccessibility() {
        // Trap focus in mobile menu when open
        const nav = document.querySelector('.navbar-nav');
        const toggle = document.querySelector('.navbar-toggle');
        
        if (nav && toggle) {
            document.addEventListener('keydown', function(e) {
                // Close menu with Escape key
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    document.querySelector('.navbar-overlay').classList.remove('active');
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    toggle.focus();
                }
            });
        }
    }

    // ============================================
    // CHATBOT TOGGLE & CLOSE
    // ============================================
    function initChatbot() {
        const toggle = document.querySelector('.chatbot-toggle');
        const chatWindow = document.querySelector('.chatbot-window');
        const closeBtn = document.querySelector('.chatbot-close');
        const overlay = document.querySelector('.chatbot-overlay');
        
        if (!toggle || !chatWindow) return;
        
        function closeChat() {
            chatWindow.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }
        
        function openChat() {
            chatWindow.classList.add('active');
            if (overlay) overlay.classList.add('active');
        }
        
        toggle.addEventListener('click', function() {
            if (chatWindow.classList.contains('active')) {
                closeChat();
            } else {
                openChat();
            }
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeChat);
        }
        
        if (overlay) {
            overlay.addEventListener('click', closeChat);
        }
        
        // Close on ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && chatWindow.classList.contains('active')) {
                closeChat();
            }
        });
    }

    // ============================================
    // INIT ON DOM READY
    // ============================================
    function init() {
        initLanguage();
        initNavbar();
        initChatbot();
        initAccessibility();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // EXPOSE TO WINDOW (for compatibility)
    // ============================================
    window.solomons = {
        translatePage: translatePage,
        currentLanguage: function() { return currentLanguage; }
    };

})();
