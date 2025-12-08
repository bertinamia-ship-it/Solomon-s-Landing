// ============================================
// SOLOMON'S LANDING - MAIN JAVASCRIPT
// ============================================

// ============================================
// INTERNACIONALIZACIÓN (i18n) - SISTEMA BILINGÜE EN/ES
// ============================================

// Variable global para el idioma actual
let currentLanguage = 'en';

// Objeto completo de traducciones EN/ES
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.menus': 'Menus',
        'nav.testimonials': 'Testimonials',
        'nav.catering': 'Catering',
        'nav.contact': 'Contact',
        'nav.reserve': 'Reserve',

        // Hero Section
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

        // Reservations Section
        'reservations.title': 'Make a Reservation',
        'reservations.description': 'Reserve your table and enjoy an unforgettable dining experience',

        // Form Labels
        'form.name': 'Full Name',
        'form.namePlaceholder': 'John Doe',
        'form.email': 'Email',
        'form.emailPlaceholder': 'john@example.com',
        'form.phone': 'Phone Number',
        'form.phonePlaceholder': '+52 624 123 4567',
        'form.date': 'Date',
        'form.time': 'Time',
        'form.guests': 'Number of Guests',
        'form.selectGuests': 'Select number of guests',
        'form.guest1': '1 Guest',
        'form.guests2': '2 Guests',
        'form.guests3': '3 Guests',
        'form.guests4': '4 Guests',
        'form.guests5': '5 Guests',
        'form.guests6': '6 Guests',
        'form.guests7': '7 Guests',
        'form.guests8': '8 Guests',
        'form.guests9': '9 Guests',
        'form.guests10': '10+ Guests',
        'form.notes': 'Special Requests or Notes',
        'form.notesPlaceholder': 'Allergies, special occasions, seating preferences...',
        'form.reserveBtn': 'Reserve Table',

        // Holiday Banner
        'holiday.banner': 'Celebrate the Holidays with Us! Special Festive Menu Available',

        // Menus Section
        'menus.title': 'Our Menus',
        'menus.description': 'Discover our carefully crafted dishes, made with the finest ingredients',
        'menus.breakfast': 'Breakfast',
        'menus.lunch': 'Lunch',
        'menus.dinner': 'Dinner',
        'menus.bar': 'Bar',
        'menus.sushi': 'Sushi',
        'menus.seasonal': 'Seasonal',

        // Testimonials Section
        'testimonials.title': 'What Our Guests Say',
        'testimonials.description': 'Read authentic reviews from our satisfied customers',

        // Catering Section
        'catering.title': 'Catering Service',
        'catering.intro1': 'Make your special event truly memorable with Solomon\'s Landing catering services. We bring our award-winning cuisine and exceptional service to your celebrations, whether it\'s an intimate gathering or a grand celebration.',
        'catering.intro2': 'We specialize in: Weddings, Corporate Events, Private Parties, Birthday Celebrations, Anniversary Dinners, and Group Celebrations.',
        'catering.whyChoose': 'Why Choose Our Catering?',

        // Contact Section
        'contact.title': 'Visit Us in Cabo San Lucas',
        'contact.description': 'Come experience the best waterfront dining in Cabo',
        'contact.address': 'Address',
        'contact.contactInfo': 'Contact',
        'contact.hours': 'Hours',
        'contact.petFriendly': 'We Are Pet Friendly!',
        'contact.petMessage': 'We love seeing you with your best friend. Our place is suitable for you both.',
        'contact.openDays': 'Open 7 days a week',

        // Reviews Page
        'reviews.heroTitle': 'Guest Reviews',
        'reviews.heroSubtitle': 'Read what our valued customers have to say about their experience',
        'reviews.rating': 'Based on 500+ verified reviews',
        'reviews.foodQuality': 'Food Quality',
        'reviews.service': 'Service',
        'reviews.ambiance': 'Ambiance',
        'reviews.value': 'Value',
        'reviews.sectionTitle': 'What Our Guests Say',
        'reviews.sectionSubtitle': '✨ Real experiences from our valued customers ✨',
        'reviews.visited': 'Visited',

        // Location Page
        'location.heroTitle': 'Location & Hours',
        'location.heroSubtitle': 'Find us at the beautiful Cabo San Lucas Marina',
        'location.addressTitle': 'Address',
        'location.contactTitle': 'Contact',
        'location.hoursTitle': 'Hours',
        'location.phone': 'Phone',
        'location.email': 'Email',
        'location.openDays': 'Open 7 days a week',
        'location.breakfast': 'Breakfast',
        'location.lunch': 'Lunch',
        'location.dinner': 'Dinner',

        // Reservations Page
        'reservations.heroTitle': 'Make a Reservation',
        'reservations.heroSubtitle': 'Reserve your table and enjoy an unforgettable dining experience',
        'reservations.subtitle': 'Reserve your table and enjoy an unforgettable dining experience at the beautiful Cabo San Lucas Marina',
        'reservations.formTitle': 'Reserve Your Table',
        'reservations.formDescription': 'Fill out the form and we will confirm your reservation by email in less than 2 hours'
    },
    es: {
        // Navegación
        'nav.home': 'Inicio',
        'nav.menus': 'Menús',
        'nav.testimonials': 'Testimonios',
        'nav.catering': 'Catering',
        'nav.contact': 'Contacto',
        'nav.reserve': 'Reservar',

        // Sección Hero
        'hero.title': 'Restaurante de Cocina Internacional',
        'hero.subtitle': 'Disfruta la experiencia',
        'hero.bookBtn': 'Reservar Mesa',
        'hero.menusBtn': 'Ver Menús',

        // Sección de Bienvenida
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

        // Sección de Reservaciones
        'reservations.title': 'Hacer una Reservación',
        'reservations.description': 'Reserve su mesa y disfrute de una experiencia gastronómica inolvidable',

        // Etiquetas del Formulario
        'form.name': 'Nombre Completo',
        'form.namePlaceholder': 'Juan Pérez',
        'form.email': 'Correo Electrónico',
        'form.emailPlaceholder': 'juan@ejemplo.com',
        'form.phone': 'Número de Teléfono',
        'form.phonePlaceholder': '+52 624 123 4567',
        'form.date': 'Fecha',
        'form.time': 'Hora',
        'form.guests': 'Número de Comensales',
        'form.selectGuests': 'Seleccione número de comensales',
        'form.guest1': '1 Persona',
        'form.guests2': '2 Personas',
        'form.guests3': '3 Personas',
        'form.guests4': '4 Personas',
        'form.guests5': '5 Personas',
        'form.guests6': '6 Personas',
        'form.guests7': '7 Personas',
        'form.guests8': '8 Personas',
        'form.guests9': '9 Personas',
        'form.guests10': '10+ Personas',
        'form.notes': 'Solicitudes Especiales o Notas',
        'form.notesPlaceholder': 'Alergias, ocasiones especiales, preferencias de asientos...',
        'form.reserveBtn': 'Reservar Mesa',

        // Banner Navideño
        'holiday.banner': '¡Celebra las Fiestas con Nosotros! Menú Festivo Especial Disponible',

        // Sección de Menús
        'menus.title': 'Nuestros Menús',
        'menus.description': 'Descubra nuestros platillos cuidadosamente elaborados, hechos con los mejores ingredientes',
        'menus.breakfast': 'Desayuno',
        'menus.lunch': 'Comida',
        'menus.dinner': 'Cena',
        'menus.bar': 'Bar',
        'menus.sushi': 'Sushi',
        'menus.seasonal': 'Temporada',

        // Sección de Testimonios
        'testimonials.title': 'Lo Que Dicen Nuestros Huéspedes',
        'testimonials.description': 'Lea reseñas auténticas de nuestros clientes satisfechos',

        // Sección de Catering
        'catering.title': 'Servicio de Catering',
        'catering.intro1': 'Haga que su evento especial sea verdaderamente memorable con los servicios de catering de Solomon\'s Landing. Llevamos nuestra cocina galardonada y servicio excepcional a sus celebraciones, ya sea una reunión íntima o una gran celebración.',
        'catering.intro2': 'Nos especializamos en: Bodas, Eventos Corporativos, Fiestas Privadas, Celebraciones de Cumpleaños, Cenas de Aniversario y Celebraciones Grupales.',
        'catering.whyChoose': '¿Por Qué Elegir Nuestro Catering?',

        // Sección de Contacto
        'contact.title': 'Visítenos en Cabo San Lucas',
        'contact.description': 'Venga a experimentar la mejor comida frente al mar en Cabo',
        'contact.address': 'Dirección',
        'contact.contactInfo': 'Contacto',
        'contact.hours': 'Horarios',
        'contact.petFriendly': '¡Aceptamos Mascotas!',
        'contact.petMessage': 'Nos encanta verte con tu mejor amigo. Nuestro lugar es adecuado para ambos.',
        'contact.openDays': 'Abierto los 7 días de la semana',

        // Página de Reviews
        'reviews.heroTitle': 'Reseñas de Huéspedes',
        'reviews.heroSubtitle': 'Lee lo que dicen nuestros valiosos clientes sobre su experiencia',
        'reviews.rating': 'Basado en 500+ reseñas verificadas',
        'reviews.foodQuality': 'Calidad de Comida',
        'reviews.service': 'Servicio',
        'reviews.ambiance': 'Ambiente',
        'reviews.value': 'Valor',
        'reviews.sectionTitle': 'Lo Que Dicen Nuestros Huéspedes',
        'reviews.sectionSubtitle': '✨ Experiencias reales de nuestros valiosos clientes ✨',
        'reviews.visited': 'Visitó',

        // Página de Location
        'location.heroTitle': 'Ubicación y Horarios',
        'location.heroSubtitle': 'Encuéntranos en la hermosa Marina de Cabo San Lucas',
        'location.addressTitle': 'Dirección',
        'location.contactTitle': 'Contacto',
        'location.hoursTitle': 'Horarios',
        'location.phone': 'Teléfono',
        'location.email': 'Correo',
        'location.openDays': 'Abierto los 7 días de la semana',
        'location.breakfast': 'Desayuno',
        'location.lunch': 'Comida',
        'location.dinner': 'Cena',

        // Página de Reservations
        'reservations.heroTitle': 'Hacer una Reservación',
        'reservations.heroSubtitle': 'Reserve su mesa y disfrute de una experiencia gastronómica inolvidable',
        'reservations.subtitle': 'Reserve su mesa y disfrute de una experiencia gastronómica inolvidable en la hermosa Marina de Cabo San Lucas',
        'reservations.formTitle': 'Reserve Su Mesa',
        'reservations.formDescription': 'Complete el formulario y confirmaremos su reservación por correo electrónico en menos de 2 horas'
    }
};

/**
 * Cambia el idioma de toda la página
 * @param {string} lang - Código del idioma ('en' o 'es')
 */
function setLanguage(lang) {
    if (!translations[lang]) {
        console.error('Language not supported:', lang);
        return;
    }

    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);

    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Actualizar todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang][key];
        
        if (translation) {
            element.textContent = translation;
        }
    });

    // Actualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = translations[lang][key];
        
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });

    // RE-RENDERIZAR MENÚ SI ESTAMOS EN LA PÁGINA DE MENÚS
    const menuItemsContainer = document.getElementById('menuItems');
    if (menuItemsContainer) {
        // Obtener categoría activa
        const activeTab = document.querySelector('.menu-tab.active');
        if (activeTab) {
            const activeCategory = activeTab.getAttribute('data-category');
            renderMenu(activeCategory);
        }
    }

    // Re-renderizar el menú actual
    const activeTab = document.querySelector('.menu-tab.active');
    if (activeTab) {
        const category = activeTab.getAttribute('data-category');
        renderMenu(category);
    }

    console.log('Language changed to:', lang);
}

// Inicializar idioma al cargar la página
function initLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const initialLanguage = (savedLanguage && translations[savedLanguage]) ? savedLanguage : 'en';
    setLanguage(initialLanguage);
}

// ============================================
// HERO SLIDER AUTOMÁTICO
// ============================================
let currentSlide = 0;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Cambiar de slide cada 4 segundos
    setInterval(nextSlide, 4000);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SISTEMA DE MENÚS
// ============================================

// MENÚS COMPLETOS DE SOLOMON'S LANDING - EXTRAÍDOS DE PDFs OFICIALES 2026
const sampleMenus = {
    breakfast: [
        // A FRESH START
        {
            category: { en: "A Fresh Start", es: "Un Comienzo Fresco" },
            name: { en: "Seasonal Fruit", es: "Fruta de Temporada" },
            description: { en: "With yogurt and granola", es: "Con yogurt y granola" },
            price: "$210"
        },
        {
            category: { en: "A Fresh Start", es: "Un Comienzo Fresco" },
            name: { en: "Açaí Bowl", es: "Bowl de Açaí" },
            description: { en: "Topped with mango, strawberry, blueberry, banana, pecans and coconut", es: "Cubierto con mango, fresa, arándano, plátano, nueces y coco" },
            price: "$315"
        },
        {
            category: { en: "A Fresh Start", es: "Un Comienzo Fresco" },
            name: { en: "Avocado Toast", es: "Tostada de Aguacate" },
            description: { en: "Homemade seeded bread with light goat cheese spread, avocado with lemon, poached eggs with toasted pepitas and sesame seeds. Comes with organic salad with goat cheese and passion fruit vinaigrette", es: "Pan artesanal con semillas con queso de cabra ligero, aguacate con limón, huevos pochados con pepitas tostadas y ajonjolí. Viene con ensalada orgánica con queso de cabra y vinagreta de maracuyá" },
            price: "$265",
            icons: "🥑"
        },
        // SOMETHING SWEET
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Pancakes", es: "Hot Cakes" },
            description: { en: "Buttermilk pancakes with clarified butter served with real Canadian maple syrup, berries and homemade whipped cream", es: "Hot cakes de suero de leche con mantequilla clarificada servidos con jarabe de maple canadiense real, frutos rojos y crema batida casera" },
            price: "$210"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Banana Pecan Pancakes", es: "Hot Cakes de Plátano y Nuez" },
            description: { en: "Buttermilk pancakes with clarified butter, pecans, banana and homemade whipped cream, served with real Canadian maple syrup", es: "Hot cakes de suero de leche con mantequilla clarificada, nueces, plátano y crema batida casera, servidos con jarabe de maple canadiense real" },
            price: "$220"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "French Toast", es: "Pan Francés" },
            description: { en: "Served with real Canadian maple syrup, berries and homemade whipped cream", es: "Servido con jarabe de maple canadiense real, frutos rojos y crema batida casera" },
            price: "$210"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "French Toast Stuffed with Cream Cheese, Strawberry, and Banana", es: "Pan Francés Relleno de Queso Crema, Fresa y Plátano" },
            description: { en: "Featured on Food Network's Triple D, an all time favorite signature dish. Served with real Canadian maple syrup, berries and homemade whipped cream", es: "Presentado en Triple D de Food Network, un platillo firma favorito de todos los tiempos. Servido con jarabe de maple canadiense real, frutos rojos y crema batida casera" },
            price: "$265",
            featured: true
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Belgian Waffle", es: "Waffle Belga" },
            description: { en: "Crispy Belgian waffle served with real Canadian maple syrup and homemade whipped cream", es: "Waffle belga crujiente servido con jarabe de maple canadiense real y crema batida casera" },
            price: "$210"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Solomon's Waffle", es: "Waffle Solomon's" },
            description: { en: "Crispy Belgian waffle with vanilla bean ice cream, mixed berries and hazelnut sauce on top. Served with real Canadian maple syrup", es: "Waffle belga crujiente con helado de vainilla, frutos rojos mixtos y salsa de avellana encima. Servido con jarabe de maple canadiense real" },
            price: "$265"
        },
        // CHEF'S SPECIALTIES
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Chilaquiles", es: "Chilaquiles" },
            description: { en: "Choice of red or green sauce", es: "A elegir salsa roja o verde" },
            price: "$230",
            options: [
                { en: "With Organic Eggs", es: "Con Huevos Orgánicos", price: "$255" },
                { en: "With Organic Chicken", es: "Con Pollo Orgánico", price: "$285" }
            ]
        },
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Barbacoa Burrito", es: "Burrito de Barbacoa" },
            description: { en: "Flour tortilla filled with barbacoa, pinto beans, Monterrey cheese, and egg. Served with organic salad, goat cheese & passion fruit vinaigrette", es: "Tortilla de harina rellena de barbacoa, frijoles pintos, queso Monterrey y huevo. Servido con ensalada orgánica, queso de cabra y vinagreta de maracuyá" },
            price: "$290",
            featured: true
        },
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Barbacoa Sope", es: "Sope de Barbacoa" },
            description: { en: "Barbacoa sope with eggs to your liking, pickled red onion and avocado on top, sitting in a pool of two sauces, a bean sauce and red sauce", es: "Sope de barbacoa con huevos al gusto, cebolla roja encurtida y aguacate encima, en un pool de dos salsas, salsa de frijol y salsa roja" },
            price: "$290",
            new: true
        },
        // EGG DISHES
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Eggs to Your Liking", es: "Huevos al Gusto" },
            description: { en: "Served with crispy hash browns made with avocado oil and refried beans. Choice of corn or flour tortillas, or homemade seeded toast", es: "Servidos con papas hash browns crujientes hechas con aceite de aguacate y frijoles refritos. A elegir tortillas de maíz o harina, o pan artesanal con semillas" },
            price: "$190"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Mediterranean Omelette", es: "Omelette Mediterráneo" },
            description: { en: "With onion, kalamata olives, cherry tomato, basil & goat cheese. Served with organic salad, goat cheese & passion fruit vinaigrette. Choice of corn or flour tortillas, or homemade seeded toast", es: "Con cebolla, aceitunas kalamata, tomate cherry, albahaca y queso de cabra. Servido con ensalada orgánica, queso de cabra y vinagreta de maracuyá. A elegir tortillas de maíz o harina, o pan artesanal con semillas" },
            price: "$270"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Green Fisherman", es: "Pescador Verde" },
            description: { en: "With spinach, mushroom, onion, Monterrey cheese, green sauce & avocado. Choice of corn or flour tortillas, or homemade seeded toast", es: "Con espinaca, champiñones, cebolla, queso Monterrey, salsa verde y aguacate. A elegir tortillas de maíz o harina, o pan artesanal con semillas" },
            price: "$265"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Italian Omelette", es: "Omelette Italiano" },
            description: { en: "An egg crepe stuffed with Monterrey cheese and Italian sausage in a pool of homemade marinara sauce. Choice of corn or flour tortillas, or seeded toast", es: "Una crepa de huevo rellena de queso Monterrey y salchicha italiana en un pool de salsa marinara casera. A elegir tortillas de maíz o harina, o pan con semillas" },
            price: "$270",
            new: true
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "The Baja Omelette", es: "Omelette Baja" },
            description: { en: "With bacon, artisanal chorizo, cheddar, mushrooms, onion, sour cream & avocado. Served with crispy avocado-oil hash browns & refried beans. Choice of corn or flour tortillas, or homemade seeded toast", es: "Con tocino, chorizo artesanal, cheddar, champiñones, cebolla, crema ácida y aguacate. Servido con papas hash browns crujientes hechas con aceite de aguacate y frijoles refritos. A elegir tortillas de maíz o harina, o pan artesanal con semillas" },
            price: "$300"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Rancheros", es: "Rancheros" },
            description: { en: "Sunny side up eggs over pinto beans on a lightly fried corn tortilla topped with ranchero sauce, farm cheese and avocado", es: "Huevos estrellados sobre frijoles pintos en tortilla de maíz ligeramente frita cubiertos con salsa ranchera, queso ranchero y aguacate" },
            price: "$245"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Breakfast Fajitas", es: "Fajitas de Desayuno" },
            description: { en: "Two sunny-side-up eggs with flank steak, peppers, onion, tomato & avocado. Choice of corn or flour tortillas, or homemade seeded toast", es: "Dos huevos estrellados con arrachera, pimientos, cebolla, tomate y aguacate. A elegir tortillas de maíz o harina, o pan artesanal con semillas" },
            price: "$310"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Eggs Benedict", es: "Huevos Benedictinos" },
            description: { en: "Poached eggs and Canadian bacon on a homemade English muffin topped with hollandaise sauce, served with asparagus and crispy hash browns made with avocado oil", es: "Huevos pochados y tocino canadiense en un muffin inglés casero cubierto con salsa holandesa, servido con espárragos y papas hash browns crujientes hechas con aceite de aguacate" },
            price: "$300"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "The Breakfast Sandwich", es: "El Sandwich de Desayuno" },
            description: { en: "Homemade artisanal basil bread with chipotle dressing, arugula in truffle oil, sun-dried tomato, grilled cheese, black forest ham, avocado & egg to your liking. Served with organic salad, goat cheese & passion fruit vinaigrette", es: "Pan artesanal de albahaca casero con aderezo de chipotle, arúgula en aceite de trufa, tomate seco, queso a la parrilla, jamón selva negra, aguacate y huevo al gusto. Servido con ensalada orgánica, queso de cabra y vinagreta de maracuyá" },
            price: "$310"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Breakfast Burrito", es: "Burrito de Desayuno" },
            description: { en: "Eggs, bacon, jack cheese and potatoes. Served with pico de gallo, guacamole and ranchero sauce", es: "Huevos, tocino, queso jack y papas. Servido con pico de gallo, guacamole y salsa ranchera" },
            price: "$245"
        }
    ],
    lunch: [
        // STARTERS
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Guacamole", es: "Guacamole" },
            description: { en: "Served with pico de gallo and baked corn tortilla chips", es: "Servido con pico de gallo y totopos horneados" },
            price: "$255",
            icons: "🥑"
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Seafood Guacamole", es: "Guacamole de Mariscos" },
            description: { en: "Guacamole, cooked shrimp, seared blackened tuna and Magdalena Bay scallops (seasonal) with farm fresh cheese and baked corn tortilla chips", es: "Guacamole, camarón cocido, atún sellado ennegrecido y callos de hacha de Bahía Magdalena (de temporada) con queso ranchero fresco y totopos horneados" },
            price: "$385",
            icons: "🦐"
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Calamari", es: "Calamares" },
            description: { en: "Calamari steak strips sautéed crispy in panko, served with cocktail and marinara sauce", es: "Tiras de filete de calamar salteadas crujientes en panko, servidas con salsa coctel y marinara" },
            price: "$255",
            icons: "🦑"
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Solomon's Ceviche", es: "Ceviche Solomon's" },
            description: { en: "Salmon, tuna & white fish in Mexican-Asian fusion sauce with mango, cucumber, red onion, cilantro, avocado, mint & fried chile de árbol. Served with baked corn chips", es: "Salmón, atún y pescado blanco en salsa fusión mexicana-asiática con mango, pepino, cebolla morada, cilantro, aguacate, menta y chile de árbol frito" },
            price: "$335",
            icons: "🐟",
            featured: true
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Shrimp Cocktail", es: "Cóctel de Camarón" },
            description: { en: "Cooked shrimp with cocktail and clamato sauce, tomato, onion, cucumber, chili, cilantro, green olives, lemon and avocado", es: "Camarón cocido con salsa coctel y clamato, tomate, cebolla, pepino, chile, cilantro, aceitunas verdes, limón y aguacate" },
            price: "$325",
            icons: "🦐"
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Tortilla Soup", es: "Sopa de Tortilla" },
            description: { en: "Traditional homemade tomato base, local cheese, avocado, sour cream, chile guajillo and corn tortilla strips", es: "Base tradicional de tomate casera, queso local, aguacate, crema ácida, chile guajillo y tiras de tortilla" },
            price: "$190",
            icons: "🍲"
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Crab Cakes", es: "Pastelitos de Cangrejo" },
            description: { en: "Crab cakes in mango chipotle sauce with organic mixed salad, goat cheese, passion fruit dressing and homemade focaccia", es: "Pastelitos de cangrejo en salsa de mango chipotle con ensalada mixta orgánica, queso de cabra, vinagreta de maracuyá y focaccia casera" },
            price: "$365",
            icons: "🦀",
            new: true
        },
        // SALADS
        {
            category: { en: "Salads", es: "Ensaladas" },
            name: { en: "Caesar Salad", es: "Ensalada César" },
            description: { en: "Traditional homemade Caesar dressing, romaine lettuce and homemade garlic bread with parmesan", es: "Aderezo César tradicional casero, lechuga romana y pan de ajo casero con parmesano" },
            price: "$220",
            options: [
                { name: { en: "Organic Chicken", es: "Pollo Orgánico" }, price: "$290" },
                { name: { en: "Shrimp", es: "Camarón" }, price: "$330" }
            ]
        },
        {
            category: { en: "Salads", es: "Ensaladas" },
            name: { en: "House Salad", es: "Ensalada de la Casa" },
            description: { en: "Mixed organic lettuce, avocado, grapes, orange slices, pistachios, gorgonzola and cherry tomatoes with raspberry balsamic vinaigrette", es: "Lechuga orgánica mixta, aguacate, uvas, rebanadas de naranja, pistaches, gorgonzola y tomates cherry con vinagreta balsámica de frambuesa" },
            price: "$250"
        },
        // BURGERS & PANINIS
        {
            category: { en: "Burgers & Paninis", es: "Hamburguesas y Paninis" },
            name: { en: "Classic Burger", es: "Hamburguesa Clásica" },
            description: { en: "8 oz. beef patty, cheddar, tomato, onion, lettuce, pickles. Choice of sweet potato fries, french fries, or organic salad", es: "Hamburguesa de 8 oz., cheddar, tomate, cebolla, lechuga, pepinillos. A elegir papas de camote, papas fritas o ensalada orgánica" },
            price: "$290",
            icons: "🍔"
        },
        {
            category: { en: "Burgers & Paninis", es: "Hamburguesas y Paninis" },
            name: { en: "Western Burger", es: "Hamburguesa Western" },
            description: { en: "8 oz. beef patty, cheddar, bacon, smoked BBQ sauce, breaded shallot rings. Choice of sweet potato fries, french fries, or organic salad", es: "Hamburguesa de 8 oz., cheddar, tocino, salsa BBQ ahumada, aros de chalota empanizados. A elegir papas de camote, papas fritas o ensalada orgánica" },
            price: "$315",
            icons: "🍔"
        },
        {
            category: { en: "Burgers & Paninis", es: "Hamburguesas y Paninis" },
            name: { en: "Tuna Burger", es: "Hamburguesa de Atún" },
            description: { en: "Fresh grilled tuna Cajun style with arugula, avocado, tomato, swiss cheese and chipotle dressing", es: "Atún fresco a la parrilla estilo cajún con arúgula, aguacate, tomate, queso suizo y aderezo de chipotle" },
            price: "$400",
            icons: "🐟"
        },
        // MEXICAN SPECIALTIES
        {
            category: { en: "Mexican Specialties", es: "Especialidades Mexicanas" },
            name: { en: "Fish Tacos (3)", es: "Tacos de Pescado (3)" },
            description: { en: "Lightly crispy breaded fish on flour tortilla with coleslaw, red onion, cilantro, chipotle dressing, guacamole, pico de gallo and homemade salsas", es: "Pescado empanizado ligeramente crujiente en tortilla de harina con col, cebolla morada, cilantro, aderezo de chipotle, guacamole, pico de gallo y salsas caseras" },
            price: "$255",
            icons: "🌮🐟"
        },
        {
            category: { en: "Mexican Specialties", es: "Especialidades Mexicanas" },
            name: { en: "Shrimp Tacos (3)", es: "Tacos de Camarón (3)" },
            description: { en: "Lightly crispy breaded shrimp on flour tortilla with coleslaw, red onion, cilantro, chipotle dressing, guacamole, pico de gallo and homemade salsas", es: "Camarón empanizado ligeramente crujiente en tortilla de harina con col, cebolla morada, cilantro, aderezo de chipotle, guacamole, pico de gallo y salsas caseras" },
            price: "$265",
            icons: "🌮🦐"
        },
        {
            category: { en: "Mexican Specialties", es: "Especialidades Mexicanas" },
            name: { en: "Signature Grilled Tacos (3)", es: "Tacos a la Parrilla Firma (3)" },
            description: { en: "Arrachera steak, Monterrey jack cheese and caramelized onion on handmade nixtamal corn tortilla with guacamole, pico de gallo and homemade salsas", es: "Arrachera, queso Monterrey jack y cebolla caramelizada en tortilla de maíz nixtamalizada hecha a mano con guacamole, pico de gallo y salsas caseras" },
            price: "$365",
            icons: "🌮🥩",
            featured: true
        },
        {
            category: { en: "Mexican Specialties", es: "Especialidades Mexicanas" },
            name: { en: "Fajitas", es: "Fajitas" },
            description: { en: "Served in hot rock molcajete with cactus, panela farm cheese, sauce with peppers and onions, pinto beans, guacamole and pico de gallo. Choice of flour or corn tortillas", es: "Servidas en molcajete de piedra caliente con nopal, queso panela, salsa con pimientos y cebolla, frijoles pintos, guacamole y pico de gallo. A elegir tortillas de harina o maíz" },
            price: "$335",
            options: [
                { name: { en: "Organic Chicken", es: "Pollo Orgánico" }, price: "$335" },
                { name: { en: "Shrimp", es: "Camarón" }, price: "$390" },
                { name: { en: "Steak", es: "Arrachera" }, price: "$405" }
            ],
            icons: "🌶️"
        }
    ],
    dinner: [
        // APPETIZERS
        { category: {en: "Appetizers", es: "Aperitivos"}, name: {en: "Guacamole", es: "Guacamole"}, description: {en: "Made at your table, served with pico de gallo and baked corn tortilla chips", es: "Hecho en tu mesa, servido con pico de gallo y totopos horneados"}, price: "$255", icons: "🥑" },
        { category: {en: "Appetizers", es: "Aperitivos"}, name: {en: "Seafood Guacamole", es: "Guacamole de Mariscos"}, description: {en: "Made at your table: guacamole, cooked shrimp, blackened tuna and Magdalena Bay scallops with farm fresh cheese", es: "Hecho en tu mesa: guacamole, camarón cocido, atún ennegrecido y callos de hacha con queso ranchero fresco"}, price: "$385", icons: "🦐" },
        { category: {en: "Appetizers", es: "Aperitivos"}, name: {en: "Solomon's Ceviche", es: "Ceviche Solomon's"}, description: {en: "Salmon, tuna & white fish in Mexican-Asian fusion sauce with mango, cucumber, red onion, cilantro, avocado, mint & fried chile de árbol", es: "Salmón, atún y pescado blanco en salsa fusión mexicana-asiática con mango, pepino, cebolla morada, cilantro, aguacate, menta y chile de árbol frito"}, price: "$335", icons: "🐟", featured: true },
        { category: {en: "Appetizers", es: "Aperitivos"}, name: {en: "Spinach & Artichoke Dip", es: "Dip de Espinaca y Alcachofa"}, description: {en: "Organic spinach, artichoke, mozzarella, Monterey jack, cream cheese, parmesan, served with baked crispy pita bread", es: "Espinaca orgánica, alcachofa, mozzarella, queso Monterey jack, queso crema, parmesano, servido con pan pita horneado crujiente"}, price: "$240" },
        { category: {en: "Appetizers", es: "Aperitivos"}, name: {en: "Crab Cakes", es: "Pastelitos de Cangrejo"}, description: {en: "Crab cakes in mango chipotle sauce with organic mixed salad, goat cheese, passion fruit dressing and homemade focaccia", es: "Pastelitos de cangrejo en salsa de mango chipotle con ensalada mixta orgánica, queso de cabra, vinagreta de maracuyá y focaccia casera"}, price: "$365", icons: "🦀", new: true },
        // STEAKS & RIBS
        { category: {en: "Steaks & Ribs", es: "Cortes y Costillas"}, name: {en: "Ribeye 16oz", es: "Ribeye 16oz"}, description: {en: "Prime ribeye with local seasonal vegetables, toasted almonds, balsamic reduction sauce over cauliflower puree. Choice of baked potato or mashed potatoes", es: "Ribeye premium con vegetales locales de temporada, almendras tostadas, salsa de reducción balsámica sobre puré de coliflor. A elegir papa al horno o puré de papas"}, price: "$890", icons: "🥩" },
        { category: {en: "Steaks & Ribs", es: "Cortes y Costillas"}, name: {en: "New York 12oz", es: "New York 12oz"}, description: {en: "Prime New York strip with local seasonal vegetables, toasted almonds, balsamic reduction sauce over cauliflower puree. Choice of baked potato or mashed potatoes", es: "Corte New York premium con vegetales locales de temporada, almendras tostadas, salsa de reducción balsámica sobre puré de coliflor. A elegir papa al horno o puré de papas"}, price: "$795", icons: "🥩" },
        { category: {en: "Steaks & Ribs", es: "Cortes y Costillas"}, name: {en: "Filet Mignon 8oz", es: "Filete Mignon 8oz"}, description: {en: "Prime tenderloin with local seasonal vegetables, toasted almonds, balsamic reduction sauce over cauliflower puree. Choice of baked potato or mashed potatoes", es: "Lomo premium con vegetales locales de temporada, almendras tostadas, salsa de reducción balsámica sobre puré de coliflor. A elegir papa al horno o puré de papas"}, price: "$750", icons: "🥩" },
        { category: {en: "Steaks & Ribs", es: "Cortes y Costillas"}, name: {en: "BBQ Pork Ribs", es: "Costillas de Cerdo BBQ"}, description: {en: "Slow-cooked pork ribs with homemade BBQ sauce, served with sweet potato fries and coleslaw", es: "Costillas de cerdo cocidas lentamente con salsa BBQ casera, servidas con papas fritas de camote y ensalada de col"}, price: "$575", icons: "🍖" },
        { category: {en: "Steaks & Ribs", es: "Cortes y Costillas"}, name: {en: "Surf & Turf", es: "Mar y Tierra"}, description: {en: "8oz filet mignon and lobster tail with local seasonal vegetables, toasted almonds, balsamic reduction sauce over cauliflower puree", es: "Filete mignon de 8oz y cola de langosta con vegetales locales de temporada, almendras tostadas, salsa de reducción balsámica sobre puré de coliflor"}, price: "$990", icons: "🥩🦞", featured: true },
        // SEAFOOD
        { category: {en: "Seafood", es: "Mariscos"}, name: {en: "Solomon's Catch of the Day", es: "Pesca del Día Solomon's"}, description: {en: "Fresh catch with local seasonal vegetables, toasted almonds and balsamic reduction sauce over cauliflower puree. Choice of preparation: garlic, creamy cilantro, lemon pepper, signature grilled, Cajun blackened, crispy coconut, capers & wine, or Rockefeller", es: "Pesca fresca con vegetales locales de temporada, almendras tostadas y salsa de reducción balsámica sobre puré de coliflor. A elegir preparación: ajo, cilantro cremoso, pimienta limón, parrilla firma, cajún ennegrecido, coco crujiente, alcaparras y vino, o Rockefeller"}, price: "$570", icons: "🐟" },
        { category: {en: "Seafood", es: "Mariscos"}, name: {en: "Grilled Lobster Tail", es: "Cola de Langosta a la Parrilla"}, description: {en: "Fresh lobster tail with herb butter, local seasonal vegetables, toasted almonds and balsamic reduction sauce over cauliflower puree", es: "Cola de langosta fresca con mantequilla de hierbas, vegetales locales de temporada, almendras tostadas y salsa de reducción balsámica sobre puré de coliflor"}, price: "$695", icons: "🦞" },
        { category: {en: "Seafood", es: "Mariscos"}, name: {en: "Coconut Shrimp", es: "Camarones al Coco"}, description: {en: "Over apple compote with mango sauce, served with local seasonal vegetables, toasted almonds and balsamic reduction sauce over cauliflower puree", es: "Sobre compota de manzana con salsa de mango, servido con vegetales locales de temporada, almendras tostadas y salsa de reducción balsámica sobre puré de coliflor"}, price: "$575", icons: "🦐🥥" },
        { category: {en: "Seafood", es: "Mariscos"}, name: {en: "Seared Scallops", es: "Callos de Hacha Sellados"}, description: {en: "Magdalena Bay scallops (seasonal) over risotto with local seasonal vegetables, toasted almonds and balsamic reduction", es: "Callos de hacha de Bahía Magdalena (de temporada) sobre risotto con vegetales locales de temporada, almendras tostadas y reducción balsámica"}, price: "$625", icons: "🦪" }
    ],
    bar: [
        // MARGARITAS
        { category: {en: "Margaritas", es: "Margaritas"}, name: {en: "House Margarita", es: "Margarita de la Casa"}, description: {en: "Tequila, triple sec, fresh lime juice, agave", es: "Tequila, triple sec, jugo de limón fresco, agave"}, price: "$140", icons: "🍹" },
        { category: {en: "Margaritas", es: "Margaritas"}, name: {en: "Cadillac Margarita", es: "Margarita Cadillac"}, description: {en: "Premium tequila, Cointreau, fresh lime juice, agave, Grand Marnier float", es: "Tequila premium, Cointreau, jugo de limón fresco, agave, flotador de Grand Marnier"}, price: "$240" },
        { category: {en: "Margaritas", es: "Margaritas"}, name: {en: "Mango Margarita", es: "Margarita de Mango"}, description: {en: "Tequila, fresh mango, triple sec, lime juice, agave", es: "Tequila, mango fresco, triple sec, jugo de limón, agave"}, price: "$165", icons: "🥭" },
        { category: {en: "Margaritas", es: "Margaritas"}, name: {en: "Jalapeño Margarita", es: "Margarita de Jalapeño"}, description: {en: "Tequila, fresh jalapeño, cucumber, lime juice, agave", es: "Tequila, jalapeño fresco, pepino, jugo de limón, agave"}, price: "$165", icons: "🌶️" },
        // COCKTAILS
        { category: {en: "Cocktails", es: "Cocteles"}, name: {en: "Mojito", es: "Mojito"}, description: {en: "White rum, fresh mint, lime, sugar, soda water", es: "Ron blanco, menta fresca, limón, azúcar, agua mineral"}, price: "$145", icons: "🍃" },
        { category: {en: "Cocktails", es: "Cocteles"}, name: {en: "Piña Colada", es: "Piña Colada"}, description: {en: "Rum, coconut cream, fresh pineapple juice", es: "Ron, crema de coco, jugo de piña fresco"}, price: "$155", icons: "🍍" },
        { category: {en: "Cocktails", es: "Cocteles"}, name: {en: "Paloma", es: "Paloma"}, description: {en: "Tequila, fresh grapefruit juice, lime, grapefruit soda", es: "Tequila, jugo de toronja fresco, limón, refresco de toronja"}, price: "$145", icons: "🍋" },
        { category: {en: "Cocktails", es: "Cocteles"}, name: {en: "Moscow Mule", es: "Moscow Mule"}, description: {en: "Vodka, ginger beer, lime juice", es: "Vodka, cerveza de jengibre, jugo de limón"}, price: "$150" },
        // BEER
        { category: {en: "Beer", es: "Cerveza"}, name: {en: "Draft Beer", es: "Cerveza de Barril"}, description: {en: "Ask server for current selection", es: "Pregunta al mesero por la selección actual"}, price: "$75-$95", icons: "🍺" },
        { category: {en: "Beer", es: "Cerveza"}, name: {en: "Craft Beer Bottle", es: "Cerveza Artesanal Botella"}, description: {en: "Local and international craft beers", es: "Cervezas artesanales locales e internacionales"}, price: "$85-$125" },
        { category: {en: "Beer", es: "Cerveza"}, name: {en: "Domestic Beer", es: "Cerveza Nacional"}, description: {en: "Corona, Pacífico, Modelo, Tecate", es: "Corona, Pacífico, Modelo, Tecate"}, price: "$65" },
        // WINE
        { category: {en: "Wine", es: "Vino"}, name: {en: "House Wine", es: "Vino de la Casa"}, description: {en: "Red, White, or Rosé by the glass", es: "Tinto, Blanco o Rosado por copa"}, price: "$125", icons: "🍷" },
        { category: {en: "Wine", es: "Vino"}, name: {en: "Premium Wine", es: "Vino Premium"}, description: {en: "Ask server for wine list", es: "Pregunta al mesero por la lista de vinos"}, price: "$150-$350" }
    ],
    sushi: [
        // CLASSIC ROLLS
        { category: {en: "Classic Rolls", es: "Rollos Clásicos"}, name: {en: "California Roll", es: "Rollo California"}, description: {en: "Crab, avocado, cucumber, sesame seeds", es: "Cangrejo, aguacate, pepino, ajonjolí"}, price: "$185", icons: "🍣" },
        { category: {en: "Classic Rolls", es: "Rollos Clásicos"}, name: {en: "Spicy Tuna Roll", es: "Rollo de Atún Picante"}, description: {en: "Fresh tuna, spicy mayo, cucumber, scallions", es: "Atún fresco, mayonesa picante, pepino, cebollín"}, price: "$245", icons: "🌶️" },
        { category: {en: "Classic Rolls", es: "Rollos Clásicos"}, name: {en: "Philadelphia Roll", es: "Rollo Filadelfia"}, description: {en: "Smoked salmon, cream cheese, avocado, cucumber", es: "Salmón ahumado, queso crema, aguacate, pepino"}, price: "$225" },
        { category: {en: "Classic Rolls", es: "Rollos Clásicos"}, name: {en: "Salmon Avocado Roll", es: "Rollo de Salmón y Aguacate"}, description: {en: "Fresh salmon, avocado, cucumber", es: "Salmón fresco, aguacate, pepino"}, price: "$235", icons: "🥑" },
        // SPECIALTY ROLLS
        { category: {en: "Specialty Rolls", es: "Rollos Especiales"}, name: {en: "Rainbow Roll", es: "Rollo Arcoíris"}, description: {en: "California roll topped with tuna, salmon, yellowtail, shrimp, avocado", es: "Rollo California cubierto con atún, salmón, jurel, camarón, aguacate"}, price: "$325", icons: "🌈", featured: true },
        { category: {en: "Specialty Rolls", es: "Rollos Especiales"}, name: {en: "Dragon Roll", es: "Rollo Dragón"}, description: {en: "Shrimp tempura, eel, avocado, unagi sauce, crispy flakes", es: "Camarón tempura, anguila, aguacate, salsa unagi, hojuelas crujientes"}, price: "$365", icons: "🐉" },
        { category: {en: "Specialty Rolls", es: "Rollos Especiales"}, name: {en: "Volcano Roll", es: "Rollo Volcán"}, description: {en: "Spicy tuna, cream cheese, deep fried, topped with spicy mayo and eel sauce", es: "Atún picante, queso crema, frito, cubierto con mayonesa picante y salsa de anguila"}, price: "$295", icons: "🌋" },
        { category: {en: "Specialty Rolls", es: "Rollos Especiales"}, name: {en: "Solomon's Special Roll", es: "Rollo Especial Solomon's"}, description: {en: "Shrimp tempura, crab, avocado, topped with seared tuna, spicy mayo, eel sauce", es: "Camarón tempura, cangrejo, aguacate, cubierto con atún sellado, mayonesa picante, salsa de anguila"}, price: "$385", featured: true },
        // SASHIMI & NIGIRI
        { category: {en: "Sashimi & Nigiri", es: "Sashimi y Nigiri"}, name: {en: "Tuna Sashimi (5 pcs)", es: "Sashimi de Atún (5 pzas)"}, description: {en: "Fresh sliced tuna", es: "Atún fresco rebanado"}, price: "$265" },
        { category: {en: "Sashimi & Nigiri", es: "Sashimi y Nigiri"}, name: {en: "Salmon Sashimi (5 pcs)", es: "Sashimi de Salmón (5 pzas)"}, description: {en: "Fresh sliced salmon", es: "Salmón fresco rebanado"}, price: "$255" },
        { category: {en: "Sashimi & Nigiri", es: "Sashimi y Nigiri"}, name: {en: "Mixed Sashimi Platter", es: "Plato Mixto de Sashimi"}, description: {en: "Chef's selection of fresh fish: tuna, salmon, yellowtail, served with wasabi, pickled ginger, soy sauce", es: "Selección del chef de pescado fresco: atún, salmón, jurel, servido con wasabi, jengibre encurtido, salsa de soya"}, price: "$425", icons: "🐟" },
        { category: {en: "Sashimi & Nigiri", es: "Sashimi y Nigiri"}, name: {en: "Nigiri Combo (8 pcs)", es: "Combo Nigiri (8 pzas)"}, description: {en: "Chef's selection of nigiri sushi", es: "Selección del chef de sushi nigiri"}, price: "$345" }
    ],
    seasonal: [
        {
            name: {
                en: "Butternut Squash Risotto",
                es: "Risotto de Calabaza"
            },
            description: {
                en: "Arborio rice, roasted butternut squash, sage, parmesan, truffle oil",
                es: "Arroz arborio, calabaza asada, salvia, parmesano, aceite de trufa"
            },
            price: "$425"
        },
        {
            name: {
                en: "Wild Mushroom Ravioli",
                es: "Ravioli de Hongos Silvestres"
            },
            description: {
                en: "House-made pasta, porcini mushrooms, cream sauce, herbs",
                es: "Pasta hecha en casa, hongos porcini, salsa de crema, hierbas"
            },
            price: "$895"
        },
        {
            name: {
                en: "Seasonal Salad",
                es: "Ensalada de Temporada"
            },
            description: {
                en: "Mixed greens, seasonal fruits, nuts, goat cheese, balsamic vinaigrette",
                es: "Lechugas mixtas, frutas de temporada, nueces, queso de cabra, vinagreta balsámica"
            },
            price: "$325"
        },
        {
            name: {
                en: "Pumpkin Pie",
                es: "Pay de Calabaza"
            },
            description: {
                en: "Spiced pumpkin filling, buttery crust, whipped cream, cinnamon",
                es: "Relleno de calabaza especiado, masa mantequillosa, crema batida, canela"
            },
            price: "$165"
        }
    ]
};

/**
 * Renderiza los platillos de una categoría específica
 * @param {string} category - Categoría del menú a mostrar
 */
function renderMenu(category) {
    const menuItemsContainer = document.getElementById('menuItems');
    if (!menuItemsContainer) return;

    const items = sampleMenus[category] || [];

    if (items.length === 0) {
        menuItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">No items available in this category.</p>';
        return;
    }

    // Agrupar por categoría si existe
    const itemsByCategory = {};
    items.forEach(item => {
        if (item.category) {
            const catName = item.category[currentLanguage] || item.category.en;
            if (!itemsByCategory[catName]) {
                itemsByCategory[catName] = [];
            }
            itemsByCategory[catName].push(item);
        } else {
            if (!itemsByCategory['main']) {
                itemsByCategory['main'] = [];
            }
            itemsByCategory['main'].push(item);
        }
    });

    let menuHTML = '';
    
    Object.keys(itemsByCategory).forEach(catName => {
        // Agregar encabezado de categoría (excepto para 'main') - Holiday Edition
        if (catName !== 'main') {
            menuHTML += `
                <div class="menu-category-header" style="margin: 4rem 0 2rem 0; padding: 1.5rem 2rem; background: linear-gradient(135deg, rgba(22, 91, 51, 0.08), rgba(196, 30, 58, 0.08)); border-radius: 15px; border-left: 5px solid var(--holiday-red); box-shadow: 0 4px 15px rgba(0,0,0,0.06); position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0.5rem; right: 1rem; font-size: 1.5rem; opacity: 0.15;">✨</div>
                    <h3 style="font-size: 2.2rem; color: var(--holiday-green); font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">${catName}</h3>
                </div>
            `;
        }
        
        // Agregar items de esta categoría
        menuHTML += itemsByCategory[catName].map(item => {
            const itemName = item.name[currentLanguage] || item.name.en;
            const itemDescription = item.description[currentLanguage] || item.description.en;
            
            // Badges (NEW, FEATURED)
            let badges = '';
            if (item.new) {
                badges += '<span style="background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-left: 0.5rem; text-transform: uppercase;">New</span>';
            }
            if (item.featured) {
                badges += '<span style="background: linear-gradient(135deg, var(--yellow-sun), var(--orange-sun)); color: var(--navy-dark); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-left: 0.5rem; text-transform: uppercase;">⭐ Featured</span>';
            }
            
            // Iconos
            const icons = item.icons || '';
            
            // Opciones (para items con variaciones)
            let optionsHTML = '';
            if (item.options && item.options.length > 0) {
                optionsHTML = '<div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(0,0,0,0.1);">';
                item.options.forEach(option => {
                    const optionName = option.name ? (option.name[currentLanguage] || option.name.en) : (option[currentLanguage] || option.en);
                    optionsHTML += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; font-size: 0.95rem; color: var(--text-light);">
                            <span>${optionName}</span>
                            <span style="font-weight: 600; color: var(--blue-main);">${option.price}</span>
                        </div>
                    `;
                });
                optionsHTML += '</div>';
            }
            
            return `
                <div class="menu-item" style="background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%); padding: 2.5rem; margin-bottom: 2rem; border-radius: 16px; box-shadow: 0 6px 25px rgba(0,0,0,0.1); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-left: 5px solid transparent; position: relative; overflow: hidden;">
                    <!-- Subtle Holiday Accent -->
                    <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: radial-gradient(circle, rgba(22, 91, 51, 0.05) 0%, transparent 70%); border-radius: 50%;"></div>
                    
                    <div class="menu-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; position: relative; z-index: 1;">
                        <h3 class="menu-item-name" style="font-size: 1.5rem; color: var(--navy-dark); font-weight: 800; flex: 1; line-height: 1.5; letter-spacing: 0.3px;">
                            ${icons ? `<span style="font-size: 1.6rem; margin-right: 0.6rem;">${icons}</span>` : ''}
                            ${itemName}${badges}
                        </h3>
                        <span class="menu-item-price" style="font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, var(--holiday-red), var(--holiday-green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-left: 1.5rem; white-space: nowrap;">${item.price}</span>
                    </div>
                    <p class="menu-item-description" style="font-size: 1.08rem; color: var(--text-light); line-height: 1.8; margin: 0; position: relative; z-index: 1;">${itemDescription}</p>
                    ${optionsHTML}
                </div>
            `;
        }).join('');
    });

    menuItemsContainer.innerHTML = menuHTML;
    
    // Agregar efecto hover con colores navideños
    const menuItems = menuItemsContainer.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.01)';
            this.style.boxShadow = '0 12px 40px rgba(22, 91, 51, 0.15), 0 0 20px rgba(196, 30, 58, 0.1)';
            this.style.borderLeftColor = 'var(--holiday-red)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 6px 25px rgba(0,0,0,0.1)';
            this.style.borderLeftColor = 'transparent';
        });
    });
}

/**
 * Maneja el cambio de pestañas del menú
 */
function initMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu-tab');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            menuTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            renderMenu(category);
        });
    });
}

// ============================================
// VALIDACIÓN DE FORMULARIOS
// ============================================

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateDate(dateString) {
    const selectedDate = new Date(dateString);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return selectedDate >= todayDate;
}

// ============================================
// FORMULARIO DE RESERVACIONES
// ============================================
function initReservationForm() {
    const reservationForm = document.getElementById('reservationForm');
    if (!reservationForm) return;

    const formMessage = document.getElementById('formMessage');
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }

    function showMessage(message, type) {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 3000);
        }
    }

    reservationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            notes: document.getElementById('notes').value.trim()
        };

        // Validaciones
        if (!formData.name) {
            showMessage('Please enter your name', 'error');
            return;
        }

        if (!formData.email) {
            showMessage('Please enter your email', 'error');
            return;
        }

        if (!validateEmail(formData.email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (!formData.date) {
            showMessage('Please select a date', 'error');
            return;
        }

        if (!validateDate(formData.date)) {
            showMessage('Please select a future date', 'error');
            return;
        }

        if (!formData.time) {
            showMessage('Please select a time', 'error');
            return;
        }

        if (!formData.guests) {
            showMessage('Please select number of guests', 'error');
            return;
        }

        const submitBtn = reservationForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Checking availability...';

        try {
            const availabilityCheck = await checkOpenTableAvailability(formData.date, formData.time, formData.guests);
            
            if (!availabilityCheck.available) {
                showMessage(availabilityCheck.message || 'Lo sentimos, no hay disponibilidad para el horario seleccionado. Por favor intenta otro horario.', 'error');
                return;
            }

            const backendResponse = await sendReservationToBackend(formData);
            
            if (!backendResponse.success) {
                showMessage(backendResponse.message || 'No se pudo procesar la reservación. Por favor intenta de nuevo o llámanos.', 'error');
                return;
            }

            await syncReservationWithOpenTable(formData);

            showMessage('¡Reservación enviada con éxito! Recibirás un correo de confirmación en las próximas 2 horas. ID: ' + backendResponse.reservationId, 'success');
            reservationForm.reset();

        } catch (error) {
            console.error('Reservation error:', error);
            showMessage('Ocurrió un error inesperado. Por favor intenta de nuevo o contáctanos al +52 624 219 3228', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Reservar Mesa';
        }
    });
}

// ============================================
// FORMULARIO DE CATERING
// ============================================
function initCateringForm() {
    const cateringForm = document.getElementById('cateringForm');
    if (!cateringForm) return;

    const cateringFormMessage = document.getElementById('cateringFormMessage');
    const eventDateInput = document.getElementById('eventDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (eventDateInput) {
        eventDateInput.setAttribute('min', today);
    }

    function showCateringMessage(message, type) {
        if (!cateringFormMessage) return;
        cateringFormMessage.textContent = message;
        cateringFormMessage.className = 'form-message ' + type;
        cateringFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        if (type === 'success') {
            setTimeout(() => {
                cateringFormMessage.style.display = 'none';
            }, 3000);
        }
    }

    cateringForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('cateringName').value.trim(),
            email: document.getElementById('cateringEmail').value.trim(),
            phone: document.getElementById('cateringPhone').value.trim(),
            eventDate: document.getElementById('eventDate').value,
            guestCount: parseInt(document.getElementById('guestCount').value),
            eventType: document.getElementById('eventType').value,
            message: document.getElementById('cateringMessage').value.trim()
        };

        if (!formData.name) {
            showCateringMessage('Please enter your name', 'error');
            return;
        }

        if (!formData.email) {
            showCateringMessage('Please enter your email', 'error');
            return;
        }

        if (!validateEmail(formData.email)) {
            showCateringMessage('Please enter a valid email address', 'error');
            return;
        }

        if (!formData.phone) {
            showCateringMessage('Please enter your phone number', 'error');
            return;
        }

        if (!formData.guestCount || formData.guestCount < 20) {
            showCateringMessage('Catering service requires a minimum of 20 guests', 'error');
            return;
        }

        const submitBtn = cateringForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        console.log('Catering request data:', formData);

        setTimeout(() => {
            showCateringMessage('Thank you! We will contact you within 24 hours to discuss your event.', 'success');
            cateringForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Quote';
        }, 1000);
    });
}

// ============================================
// RESERVE BUTTON
// ============================================
function initReserveButton() {
    // No OpenTable button needed - users go directly to reservations.html
    console.log('Direct reservation system active');
}

// ============================================
// BACKEND INTEGRATION FUNCTIONS
// ============================================

async function checkOpenTableAvailability(date, time, guests) {
    // No longer checking OpenTable - internal system only
    console.log('Checking internal availability for:', { date, time, guests });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Always return available for now - can add real availability checking later
    return { available: true, message: 'Table available' };
}

async function sendReservationToBackend(reservationData) {
    console.log('Sending reservation email with data:', reservationData);
    
    // TODO: Implement real email sending via backend
    // For now, simulating the process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This should be replaced with actual backend call:
    // POST to /api/reservations/create
    // Backend should send email to: reservations@solomonslanding.com.mx
    // Email should include all reservation details
    
    /*
    BACKEND IMPLEMENTATION NEEDED:
    
    const response = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: reservationData.name,
            email: reservationData.email,
            phone: reservationData.phone,
            date: reservationData.date,
            time: reservationData.time,
            guests: reservationData.guests,
            notes: reservationData.notes,
            source: 'website'
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to create reservation');
    }
    
    const data = await response.json();
    return {
        success: true,
        reservationId: data.reservationId,
        message: 'Reservation request sent successfully'
    };
    */
    
    // Simulation - replace with real backend call
    return {
        success: true,
        reservationId: 'SOL-' + Date.now(),
        message: 'Reservation request sent successfully'
    };
}

async function syncReservationWithOpenTable(reservationData) {
    // No longer syncing with OpenTable - internal system only
    console.log('Reservation saved to internal system:', reservationData);
    await new Promise(resolve => setTimeout(resolve, 200));
    return { saved: true, internalId: 'INT-' + Date.now() };
}

// ============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar idioma
    initLanguage();

    // Agregar listeners a botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Inicializar hero slider (solo en página principal)
    initHeroSlider();

    // Inicializar menu hero slider (solo en página de menús)
    initMenuHeroSlider();

    // Inicializar hero sliders para todas las páginas
    initAllHeroSliders();

    // Inicializar smooth scroll
    initSmoothScroll();

    // Inicializar navbar animado en scroll
    initScrollNavbar();

    // Inicializar sistema de menús
    initMenuTabs();
    if (document.getElementById('menuItems')) {
        renderMenu('breakfast');
    }

    // Inicializar formularios
    initReservationForm();
    initCateringForm();

    // Inicializar botón de reserva
    initReserveButton();

    // Inicializar carrusel de perks
    initPerksCarousel();

    console.log('Solomon\'s Landing website loaded successfully!');
});

// ============================================
// NAVBAR ANIMADO EN SCROLL
// ============================================
function initScrollNavbar() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Agregar clase 'scrolled' cuando se hace scroll hacia abajo
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// MENU HERO SLIDER - AUTOMATIC PHOTO ROTATION
// ============================================

function initMenuHeroSlider() {
    const heroSlides = document.querySelectorAll('#menu-hero .hero-slide');
    if (heroSlides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 3000; // 3 segundos por slide

    function showSlide(index) {
        // Remover active de todos
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });

        // Mostrar slide actual
        heroSlides[index].classList.add('active');
        heroSlides[index].style.opacity = '1';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }

    // Auto-advance slides
    setInterval(nextSlide, slideInterval);

    // Inicializar primer slide
    showSlide(0);
}

// Inicializar hero sliders para todas las páginas
function initAllHeroSliders() {
    // Seleccionar todos los hero sections
    const heroSections = ['#reviews-hero', '#catering-hero', '#location-hero', '#reservations-hero'];
    
    heroSections.forEach(sectionId => {
        const heroSlides = document.querySelectorAll(`${sectionId} .hero-slide`);
        if (heroSlides.length === 0) return;

        let currentSlide = 0;
        const slideInterval = 3000; // 3 segundos por slide

        function showSlide(index) {
            // Remover active de todos
            heroSlides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            });

            // Mostrar slide actual
            heroSlides[index].classList.add('active');
            heroSlides[index].style.opacity = '1';
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % heroSlides.length;
            showSlide(currentSlide);
        }

        // Auto-advance slides
        setInterval(nextSlide, slideInterval);

        // Inicializar primer slide
        showSlide(0);
    });
}

// ============================================
// PERKS CAROUSEL - AUTO-SCROLLING ANIMATION (OPTIMIZADO)
// ============================================
function initPerksCarousel() {
    const track = document.querySelector('.features-scroll-track');
    if (!track) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.6; // Velocidad aumentada para más fluidez
    const cards = track.querySelectorAll('.feature-mini-card');
    
    if (cards.length === 0) return;

    // Calculate total width of one set of cards (first 10)
    const cardWidth = cards[0].offsetWidth;
    const gap = 12; // 0.75rem = 12px
    const totalWidth = (cardWidth + gap) * (cards.length / 2); // Divide by 2 because we duplicated

    let animationId = null;
    let isPaused = false;

    function animate() {
        if (!isPaused) {
            scrollPosition += scrollSpeed;
            
            // Reset position when we've scrolled through one complete set
            if (scrollPosition >= totalWidth) {
                scrollPosition = 0;
            }
            
            track.style.transform = `translateX(-${scrollPosition}px)`;
        }
        animationId = requestAnimationFrame(animate);
    }

    // Start animation
    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const container = track.parentElement;
    container.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    container.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });


    track.parentElement.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('nav a');
    
    if (!menuToggle || !nav || !overlay) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = menuToggle.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when overlay is clicked
    overlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize mobile menu
initMobileMenu();

// ============================================
// SCROLL INDICATOR - Smooth scroll to content
// ============================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const heroSection = scrollIndicator.closest('section');
            if (heroSection) {
                const nextSection = heroSection.nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
}

// Initialize scroll indicator
initScrollIndicator();



