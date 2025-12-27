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
            description: { en: "With yogurt and granola.", es: "Con yogurt y granola." }
        },
        {
            category: { en: "A Fresh Start", es: "Un Comienzo Fresco" },
            name: { en: "Açaí Bowl", es: "Bowl de Açaí" },
            description: { en: "Topped with mango, strawberry, blueberry, banana, pecans and coconut.", es: "Cubierto con mango, fresa, arándano, plátano, nueces y coco." }
        },
        {
            category: { en: "A Fresh Start", es: "Un Comienzo Fresco" },
            name: { en: "Avocado Toast", es: "Tostada de Aguacate" },
            description: { en: "Homemade seeded bread with a light goat cheese spread, avocado with a touch of lemon, poached eggs with toasted pepitas and sesame seeds. Comes with an organic salad with goat cheese and passion fruit vinaigrette.", es: "Pan artesanal con semillas con un ligero untado de queso de cabra, aguacate con un toque de limón, huevos pochados con pepitas tostadas y ajonjolí. Viene con una ensalada orgánica con queso de cabra y vinagreta de maracuyá." },
            icons: "🥑"
        },
        // SOMETHING SWEET
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Pancakes", es: "Hot Cakes" },
            description: { en: "Buttermilk pancakes with clarified butter served with real Canadian maple syrup, berries and homemade whipped cream.", es: "Hot cakes de suero de leche con mantequilla clarificada servidos con jarabe de maple canadiense real, frutos rojos y crema batida casera." },
            price: "$210"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Banana Pecan Pancakes", es: "Hot Cakes de Plátano y Nuez" },
            description: { en: "Buttermilk pancakes with clarified butter, pecans, banana and homemade whipped cream, served with real Canadian maple syrup.", es: "Hot cakes de suero de leche con mantequilla clarificada, nueces, plátano y crema batida casera, servidos con jarabe de maple canadiense real." },
            price: "$315"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "French Toast", es: "Pan Francés" },
            description: { en: "Buttermilk pancakes with clarified butter served with real Canadian maple syrup, berries and homemade whipped cream.", es: "Hot cakes de suero de leche con mantequilla clarificada servidos con jarabe de maple canadiense real, frutos rojos y crema batida casera." },
            price: "$210"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "French Toast Stuffed with Cream Cheese, Strawberry & Banana", es: "Pan Francés Relleno de Queso Crema, Fresa y Plátano" },
            description: { en: "Served with real Canadian maple syrup, berries and homemade whipped cream. Featured on Food Network's Triple D, an all-time favorite signature dish.", es: "Servido con jarabe de maple canadiense real, frutos rojos y crema batida casera. Presentado en Triple D de Food Network, un platillo firma favorito de todos los tiempos." },
            price: "$220",
            featured: true
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Solomon's Waffle", es: "Waffle Solomon's" },
            description: { en: "Crispy Belgian waffle with vanilla bean ice cream, mixed berries and hazelnut sauce on top. Served with real Canadian maple syrup.", es: "Waffle belga crujiente con helado de vainilla, frutos rojos mixtos y salsa de avellana encima. Servido con jarabe de maple canadiense real." },
            price: "$265"
        },
        {
            category: { en: "Something Sweet", es: "Algo Dulce" },
            name: { en: "Belgian Waffle", es: "Waffle Belga" },
            description: { en: "Crispy Belgian waffle served with real Canadian maple syrup and homemade whipped cream.", es: "Waffle belga crujiente servido con jarabe de maple canadiense real y crema batida casera." },
            price: "$210"
        },
        // CHEF'S SPECIALTIES
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Chilaquiles", es: "Chilaquiles" },
            description: { en: "Choice of red or green sauce.", es: "A elegir salsa roja o verde." },
            price: "$255"
        },
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Organic Eggs", es: "Huevos Orgánicos" },
            description: { en: "Featured on Food Network's Triple D.", es: "Presentado en Triple D de Food Network." },
            price: "$230"
        },
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Organic Chicken", es: "Pollo Orgánico" },
            description: { en: "", es: "" },
            price: "$285"
        },
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Barbacoa Burrito", es: "Burrito de Barbacoa" },
            description: { en: "Flour tortilla filled with barbacoa, pinto beans, Monterrey cheese and egg. Served with organic salad, goat cheese & passion fruit vinaigrette.", es: "Tortilla de harina rellena de barbacoa, frijoles pintos, queso Monterrey y huevo. Servido con ensalada orgánica, queso de cabra y vinagreta de maracuyá." },
            price: "$290",
            featured: true
        },
        {
            category: { en: "Chef's Specialties", es: "Especialidades del Chef" },
            name: { en: "Barbacoa Sope", es: "Sope de Barbacoa" },
            description: { en: "Barbacoa sope with eggs to your liking, pickled red onion and avocado on top, sitting in a pool of two sauces: bean sauce and red sauce.", es: "Sope de barbacoa con huevos al gusto, cebolla roja encurtida y aguacate encima, en un pool de dos salsas: salsa de frijol y salsa roja." },
            price: "$290",
            new: true
        },
        // EGG DISHES
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Eggs to Your Liking", es: "Huevos al Gusto" },
            description: { en: "Served with crispy hash browns made with avocado oil and refried beans. Choice of corn or flour tortillas, or homemade seeded toast.", es: "Servidos con papas hash browns crujientes hechas con aceite de aguacate y frijoles refritos. A elegir tortillas de maíz o harina, o pan artesanal con semillas." },
            price: "$190"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Mediterranean Omelette", es: "Omelette Mediterráneo" },
            description: { en: "Onion, kalamata olives, cherry tomato, basil & goat cheese. Served with organic salad, goat cheese & passion fruit vinaigrette. Choice of tortillas or seeded toast.", es: "Cebolla, aceitunas kalamata, tomate cherry, albahaca y queso de cabra. Servido con ensalada orgánica, queso de cabra y vinagreta de maracuyá. A elegir tortillas o pan con semillas." },
            price: "$270"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Green Fisherman", es: "Pescador Verde" },
            description: { en: "Spinach, mushroom, onion, Monterrey cheese, green sauce & avocado. Choice of tortillas or seeded toast.", es: "Espinaca, champiñones, cebolla, queso Monterrey, salsa verde y aguacate. A elegir tortillas o pan con semillas." },
            price: "$265"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Italian Omelette", es: "Omelette Italiano" },
            description: { en: "Egg crêpe stuffed with Monterrey cheese and Italian sausage in homemade marinara sauce. Choice of tortillas or seeded toast.", es: "Crepa de huevo rellena de queso Monterrey y salchicha italiana en salsa marinara casera. A elegir tortillas o pan con semillas." },
            price: "$270",
            new: true
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "The Baja Omelette", es: "Omelette Baja" },
            description: { en: "Bacon, artisanal chorizo, cheddar, mushrooms, onion, sour cream & avocado. Served with avocado-oil hash browns & refried beans.", es: "Tocino, chorizo artesanal, cheddar, champiñones, cebolla, crema ácida y aguacate. Servido con papas hash browns hechas con aceite de aguacate y frijoles refritos." },
            price: "$300"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Rancheros", es: "Rancheros" },
            description: { en: "Sunny-side-up eggs over pinto beans on a lightly fried corn tortilla, topped with ranchero sauce, farm cheese and avocado.", es: "Huevos estrellados sobre frijoles pintos en tortilla de maíz ligeramente frita, cubiertos con salsa ranchera, queso ranchero y aguacate." },
            price: "$245"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Breakfast Fajitas", es: "Fajitas de Desayuno" },
            description: { en: "Two sunny-side-up eggs with flank steak, peppers, onion, tomato & avocado. Choice of tortillas or seeded toast.", es: "Dos huevos estrellados con arrachera, pimientos, cebolla, tomate y aguacate. A elegir tortillas o pan con semillas." },
            price: "$310"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Eggs Benedict", es: "Huevos Benedictinos" },
            description: { en: "Poached eggs and Canadian bacon on a homemade English muffin topped with hollandaise sauce. Served with asparagus and avocado-oil hash browns.", es: "Huevos pochados y tocino canadiense en un muffin inglés casero cubierto con salsa holandesa. Servido con espárragos y papas hash browns hechas con aceite de aguacate." },
            price: "$300"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "The Breakfast Sandwich", es: "El Sandwich de Desayuno" },
            description: { en: "Homemade artisanal basil bread with chipotle dressing, arugula in truffle oil, sun-dried tomato, grilled cheese, Black Forest ham, avocado & egg to your liking. Served with organic salad, goat cheese & passion fruit vinaigrette.", es: "Pan artesanal de albahaca casero con aderezo de chipotle, arúgula en aceite de trufa, tomate seco, queso a la parrilla, jamón selva negra, aguacate y huevo al gusto. Servido con ensalada orgánica, queso de cabra y vinagreta de maracuyá." },
            price: "$310"
        },
        {
            category: { en: "Egg Dishes", es: "Platillos con Huevo" },
            name: { en: "Breakfast Burrito", es: "Burrito de Desayuno" },
            description: { en: "Eggs, bacon, jack cheese and potatoes. Served with pico de gallo, guacamole and ranchero sauce.", es: "Huevos, tocino, queso jack y papas. Servido con pico de gallo, guacamole y salsa ranchera." },
            price: "$245"
        },
        // SIDES
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Homemade Seeded Toast", es: "Pan Artesanal con Semillas" },
            description: { en: "", es: "" },
            price: "$55"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Hash Browns", es: "Papas Hash Browns" },
            description: { en: "", es: "" },
            price: "$55"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Applewood Bacon", es: "Tocino Applewood" },
            description: { en: "", es: "" },
            price: "$85"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Pork Sausage", es: "Salchicha de Cerdo" },
            description: { en: "", es: "" },
            price: "$90"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Honey Ham Steak", es: "Jamón con Miel" },
            description: { en: "", es: "" },
            price: "$90"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Italian Sausage", es: "Salchicha Italiana" },
            description: { en: "", es: "" },
            price: "$90"
        }
    ],
    lunch: [
        // STARTERS
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Seasonal Fruit Plate", es: "Plato de Fruta de Temporada" },
            description: { en: "Fresh seasonal fruit.", es: "Fruta fresca de temporada." }
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Seafood Guacamole", es: "Guacamole de Mariscos" },
            description: { en: "Fresh avocado, shrimp, scallops, onion, tomato, cilantro & lime juice. Served with homemade tortilla chips.", es: "Aguacate fresco, camarón, callos de hacha, cebolla, tomate, cilantro y jugo de limón. Servido con totopos caseros." }
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Classic Guacamole", es: "Guacamole Clásico" },
            description: { en: "Fresh avocado, onion, tomato, cilantro & lime juice. Served with homemade tortilla chips.", es: "Aguacate fresco, cebolla, tomate, cilantro y jugo de limón. Servido con totopos caseros." }
        },
        {
            category: { en: "Starters", es: "Entradas" },
            name: { en: "Tuna Tartare", es: "Tartar de Atún" },
            description: { en: "Fresh tuna, avocado, cucumber, sesame oil and soy sauce. Served with wonton chips.", es: "Atún fresco, aguacate, pepino, aceite de sésamo y salsa de soya. Servido con chips de wonton." }
        },
        // SALADS
        {
            category: { en: "Salads", es: "Ensaladas" },
            name: { en: "Caesar Salad", es: "Ensalada César" },
            description: { en: "Romaine lettuce, parmesan cheese, homemade croutons and Caesar dressing.", es: "Lechuga romana, queso parmesano, crutones caseros y aderezo César." }
        },
        {
            category: { en: "Salads", es: "Ensaladas" },
            name: { en: "Grilled Chicken Caesar Salad", es: "Ensalada César con Pollo a la Parrilla" },
            description: { en: "Classic Caesar salad topped with organic grilled chicken.", es: "Ensalada César clásica cubierta con pollo orgánico a la parrilla." }
        },
        {
            category: { en: "Salads", es: "Ensaladas" },
            name: { en: "Solomon's Salad", es: "Ensalada Solomon's" },
            description: { en: "Organic mixed greens, goat cheese, walnuts, dried cranberries and passion fruit vinaigrette.", es: "Verduras mixtas orgánicas, queso de cabra, nueces, arándanos secos y vinagreta de maracuyá." }
        },
        {
            category: { en: "Salads", es: "Ensaladas" },
            name: { en: "Grilled Shrimp Salad", es: "Ensalada de Camarón a la Parrilla" },
            description: { en: "Organic mixed greens, grilled shrimp, avocado, cucumber and citrus vinaigrette.", es: "Verduras mixtas orgánicas, camarón a la parrilla, aguacate, pepino y vinagreta cítrica." }
        },
        // TACOS & MEXICAN FAVORITES
        {
            category: { en: "Tacos & Mexican Favorites", es: "Tacos y Favoritos Mexicanos" },
            name: { en: "Fish Tacos", es: "Tacos de Pescado" },
            description: { en: "Beer-battered fish, cabbage slaw, chipotle mayo and pico de gallo. Served with rice and beans.", es: "Pescado empanizado con cerveza, ensalada de col, mayonesa de chipotle y pico de gallo. Servido con arroz y frijoles." }
        },
        {
            category: { en: "Tacos & Mexican Favorites", es: "Tacos y Favoritos Mexicanos" },
            name: { en: "Shrimp Tacos", es: "Tacos de Camarón" },
            description: { en: "Grilled shrimp, cabbage slaw, chipotle mayo and pico de gallo. Served with rice and beans.", es: "Camarón a la parrilla, ensalada de col, mayonesa de chipotle y pico de gallo. Servido con arroz y frijoles." }
        },
        {
            category: { en: "Tacos & Mexican Favorites", es: "Tacos y Favoritos Mexicanos" },
            name: { en: "Chicken Tacos", es: "Tacos de Pollo" },
            description: { en: "Grilled organic chicken, onion, cilantro and salsa. Served with rice and beans.", es: "Pollo orgánico a la parrilla, cebolla, cilantro y salsa. Servido con arroz y frijoles." }
        },
        {
            category: { en: "Tacos & Mexican Favorites", es: "Tacos y Favoritos Mexicanos" },
            name: { en: "Carne Asada Tacos", es: "Tacos de Carne Asada" },
            description: { en: "Grilled flank steak, onion, cilantro and salsa. Served with rice and beans.", es: "Arrachera a la parrilla, cebolla, cilantro y salsa. Servido con arroz y frijoles." }
        },
        // BURGERS & SANDWICHES
        {
            category: { en: "Burgers & Sandwiches", es: "Hamburguesas y Sándwiches" },
            name: { en: "Solomon's Burger", es: "Hamburguesa Solomon's" },
            description: { en: "Angus beef patty, cheddar cheese, lettuce, tomato, onion and house sauce. Served with French fries.", es: "Hamburguesa de res Angus, queso cheddar, lechuga, tomate, cebolla y salsa de la casa. Servida con papas fritas." }
        },
        {
            category: { en: "Burgers & Sandwiches", es: "Hamburguesas y Sándwiches" },
            name: { en: "Bacon Cheeseburger", es: "Hamburguesa con Tocino y Queso" },
            description: { en: "Angus beef patty, bacon, cheddar cheese, lettuce, tomato and onion. Served with French fries.", es: "Hamburguesa de res Angus, tocino, queso cheddar, lechuga, tomate y cebolla. Servida con papas fritas." }
        },
        {
            category: { en: "Burgers & Sandwiches", es: "Hamburguesas y Sándwiches" },
            name: { en: "Grilled Chicken Sandwich", es: "Sándwich de Pollo a la Parrilla" },
            description: { en: "Organic grilled chicken breast, avocado, lettuce, tomato and chipotle mayo. Served with French fries.", es: "Pechuga de pollo orgánico a la parrilla, aguacate, lechuga, tomate y mayonesa de chipotle. Servido con papas fritas." }
        },
        {
            category: { en: "Burgers & Sandwiches", es: "Hamburguesas y Sándwiches" },
            name: { en: "Fish Sandwich", es: "Sándwich de Pescado" },
            description: { en: "Beer-battered fish, cabbage slaw and tartar sauce. Served with French fries.", es: "Pescado empanizado con cerveza, ensalada de col y salsa tártara. Servido con papas fritas." }
        },
        // SEAFOOD
        {
            category: { en: "Seafood", es: "Mariscos" },
            name: { en: "Grilled Salmon", es: "Salmón a la Parrilla" },
            description: { en: "Served with seasonal vegetables and mashed potatoes.", es: "Servido con vegetales de temporada y puré de papas." }
        },
        {
            category: { en: "Seafood", es: "Mariscos" },
            name: { en: "Garlic Shrimp", es: "Camarones al Ajo" },
            description: { en: "Sautéed shrimp in garlic butter sauce. Served with rice and vegetables.", es: "Camarones salteados en salsa de mantequilla de ajo. Servido con arroz y vegetales." }
        },
        {
            category: { en: "Seafood", es: "Mariscos" },
            name: { en: "Catch of the Day", es: "Pesca del Día" },
            description: { en: "Ask your server for today's fresh catch.", es: "Pregunta a tu mesero por la pesca fresca del día." }
        },
        // PASTA
        {
            category: { en: "Pasta", es: "Pasta" },
            name: { en: "Pasta Alfredo", es: "Pasta Alfredo" },
            description: { en: "Fettuccine with creamy Alfredo sauce.", es: "Fettuccine con salsa cremosa Alfredo." }
        },
        {
            category: { en: "Pasta", es: "Pasta" },
            name: { en: "Chicken Alfredo", es: "Pollo Alfredo" },
            description: { en: "Fettuccine Alfredo topped with grilled organic chicken.", es: "Fettuccine Alfredo cubierto con pollo orgánico a la parrilla." }
        },
        {
            category: { en: "Pasta", es: "Pasta" },
            name: { en: "Shrimp Alfredo", es: "Camarón Alfredo" },
            description: { en: "Fettuccine Alfredo topped with grilled shrimp.", es: "Fettuccine Alfredo cubierto con camarón a la parrilla." }
        },
        // SIDES
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "French Fries", es: "Papas Fritas" },
            description: { en: "", es: "" }
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Rice", es: "Arroz" },
            description: { en: "", es: "" }
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Refried Beans", es: "Frijoles Refritos" },
            description: { en: "", es: "" }
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Seasonal Vegetables", es: "Vegetales de Temporada" },
            description: { en: "", es: "" }
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Mashed Potatoes", es: "Puré de Papas" },
            description: { en: "", es: "" }
        },
        // DESSERTS
        {
            category: { en: "Desserts", es: "Postres" },
            name: { en: "Chocolate Cake", es: "Pastel de Chocolate" },
            description: { en: "Rich chocolate cake served with ice cream.", es: "Pastel de chocolate rico servido con helado." }
        },
        {
            category: { en: "Desserts", es: "Postres" },
            name: { en: "Cheesecake", es: "Pastel de Queso" },
            description: { en: "Classic cheesecake with berry sauce.", es: "Pastel de queso clásico con salsa de frutos rojos." }
        },
        {
            category: { en: "Desserts", es: "Postres" },
            name: { en: "Ice Cream", es: "Helado" },
            description: { en: "Ask for available flavors.", es: "Pregunta por los sabores disponibles." }
        }
    ],
    dinner: [
        // APPETIZERS
        {
            category: { en: "Appetizers", es: "Aperitivos" },
            name: { en: "Guacamole", es: "Guacamole" },
            description: { en: "Made at your table, served with pico de gallo and baked corn tortilla chips.", es: "Hecho en tu mesa, servido con pico de gallo y totopos horneados." },
            price: "$255"
        },
        {
            category: { en: "Appetizers", es: "Aperitivos" },
            name: { en: "Seafood Guacamole", es: "Guacamole de Mariscos" },
            description: { en: "Made at your table guacamole with cooked shrimp, blackened tuna and Magdalena Bay scallops (seasonal), served with farm fresh cheese and baked corn tortilla chips.", es: "Guacamole hecho en tu mesa con camarón cocido, atún ennegrecido y callos de hacha de Bahía Magdalena (de temporada), servido con queso ranchero fresco y totopos horneados." },
            price: "$385"
        },
        {
            category: { en: "Appetizers", es: "Aperitivos" },
            name: { en: "Solomon's Ceviche", es: "Ceviche Solomon's" },
            description: { en: "Salmon, tuna & white fish in a Mexican-Asian fusion sauce with mango, cucumber, red onion, cilantro, avocado, mint & fried chile de árbol. Served with baked corn chips.", es: "Salmón, atún y pescado blanco en una salsa fusión mexicana-asiática con mango, pepino, cebolla morada, cilantro, aguacate, menta y chile de árbol frito. Servido con totopos horneados." },
            price: "$335"
        },
        {
            category: { en: "Appetizers", es: "Aperitivos" },
            name: { en: "Scallop Mango Ceviche", es: "Ceviche de Callos de Hacha y Mango" },
            description: { en: "Magdalena Bay scallops (seasonal), mango, mint, cilantro, lemon, cucumber, cherry tomato, red onion, avocado and olive oil.", es: "Callos de hacha de Bahía Magdalena (de temporada), mango, menta, cilantro, limón, pepino, tomate cherry, cebolla morada, aguacate y aceite de oliva." },
            price: "$325"
        },
        {
            category: { en: "Appetizers", es: "Aperitivos" },
            name: { en: "Spinach & Artichoke Dip", es: "Dip de Espinaca y Alcachofa" },
            description: { en: "Organic spinach, artichoke, mozzarella and parmesan cheese. Served with baked corn tortilla chips.", es: "Espinaca orgánica, alcachofa, mozzarella y queso parmesano. Servido con totopos horneados." },
            price: "$240"
        },
        // PASTA
        {
            category: { en: "Pasta", es: "Pasta" },
            name: { en: "Chicken Pappardelle", es: "Pappardelle de Pollo" },
            description: { en: "Homemade pappardelle pasta with organic grilled chicken and asparagus in a carbonara-style sauce with pancetta.", es: "Pasta pappardelle casera con pollo orgánico a la parrilla y espárragos en una salsa estilo carbonara con pancetta." },
            price: "$420"
        },
        {
            category: { en: "Pasta", es: "Pasta" },
            name: { en: "Seafood Alfredo", es: "Alfredo de Mariscos" },
            description: { en: "Homemade basil and egg pasta with shrimp and Magdalena Bay scallops in an alfredo sauce with parmesan and parsley.", es: "Pasta casera de albahaca y huevo con camarón y callos de hacha de Bahía Magdalena en una salsa alfredo con parmesano y perejil." },
            price: "$435"
        },
        {
            category: { en: "Pasta", es: "Pasta" },
            name: { en: "Vodka Fettuccine", es: "Fettuccine con Vodka" },
            description: { en: "Homemade fettuccine with shrimp and salmon in vodka marinara sauce.", es: "Fettuccine casera con camarón y salmón en salsa marinara con vodka." },
            price: "$535"
        },
        {
            category: { en: "Pasta", es: "Pasta" },
            name: { en: "Artichoke & Cheese Ravioli", es: "Ravioli de Alcachofa y Queso" },
            description: { en: "Ravioli stuffed with artichoke and cheese in marinara sauce.", es: "Ravioli relleno de alcachofa y queso en salsa marinara." },
            price: "$365"
        },
        // SEAFOOD
        {
            category: { en: "Seafood", es: "Mariscos" },
            name: { en: "Grilled Salmon", es: "Salmón a la Parrilla" },
            description: { en: "Served with mashed potatoes and seasonal vegetables.", es: "Servido con puré de papas y vegetales de temporada." },
            price: "$465"
        },
        {
            category: { en: "Seafood", es: "Mariscos" },
            name: { en: "Pan Seared Tuna", es: "Atún Sellado en Sartén" },
            description: { en: "Fresh tuna steak served with mashed potatoes and seasonal vegetables.", es: "Filete de atún fresco servido con puré de papas y vegetales de temporada." },
            price: "$495"
        },
        {
            category: { en: "Seafood", es: "Mariscos" },
            name: { en: "Catch of the Day", es: "Pesca del Día" },
            description: { en: "Ask your server for today's fresh catch.", es: "Pregunta a tu mesero por la pesca fresca del día." },
            price: "Market Price"
        },
        // MEAT
        {
            category: { en: "Meat", es: "Carnes" },
            name: { en: "Filet Mignon", es: "Filete Mignon" },
            description: { en: "Served with mashed potatoes and seasonal vegetables.", es: "Servido con puré de papas y vegetales de temporada." },
            price: "$635"
        },
        {
            category: { en: "Meat", es: "Carnes" },
            name: { en: "New York Steak", es: "Corte New York" },
            description: { en: "Served with mashed potatoes and seasonal vegetables.", es: "Servido con puré de papas y vegetales de temporada." },
            price: "$565"
        },
        {
            category: { en: "Meat", es: "Carnes" },
            name: { en: "Braised Short Ribs", es: "Costillas Estofadas" },
            description: { en: "Slow cooked short ribs served with mashed potatoes and seasonal vegetables.", es: "Costillas cocidas lentamente servidas con puré de papas y vegetales de temporada." },
            price: "$485"
        },
        // SIDES
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Mashed Potatoes", es: "Puré de Papas" },
            description: { en: "", es: "" },
            price: "$85"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Seasonal Vegetables", es: "Vegetales de Temporada" },
            description: { en: "", es: "" },
            price: "$85"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Rice", es: "Arroz" },
            description: { en: "", es: "" },
            price: "$55"
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Refried Beans", es: "Frijoles Refritos" },
            description: { en: "", es: "" },
            price: "$55"
        }
    ],
    bar: [
        // DRINK SPECIALS
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Pacifico / Corona", es: "Pacifico / Corona" },
            description: { en: "", es: "" },
            price: "$48"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Pacifico Light", es: "Pacifico Light" },
            description: { en: "", es: "" },
            price: "$48"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Margarita", es: "Margarita" },
            description: { en: "207 ml", es: "207 ml" },
            price: "$74"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Fruit Margarita", es: "Margarita de Fruta" },
            description: { en: "207 ml", es: "207 ml" },
            price: "$88"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Red Wine", es: "Vino Tinto" },
            description: { en: "177 ml", es: "177 ml" },
            price: "$65"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "White Wine", es: "Vino Blanco" },
            description: { en: "177 ml", es: "177 ml" },
            price: "$65"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Vodka", es: "Vodka" },
            description: { en: "295 ml", es: "295 ml" },
            price: "$53"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Rum", es: "Ron" },
            description: { en: "295 ml", es: "295 ml" },
            price: "$53"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Tequila", es: "Tequila" },
            description: { en: "295 ml", es: "295 ml" },
            price: "$53"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Gin", es: "Ginebra" },
            description: { en: "295 ml", es: "295 ml" },
            price: "$53"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Whisky", es: "Whisky" },
            description: { en: "295 ml", es: "295 ml" },
            price: "$78"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Piña Colada", es: "Piña Colada" },
            description: { en: "", es: "" },
            price: "$78"
        },
        {
            category: { en: "Drink Specials", es: "Especiales de Bebidas" },
            name: { en: "Daiquiri", es: "Daiquiri" },
            description: { en: "", es: "" },
            price: "$78"
        },
        // FOOD SPECIALS
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Fish Taco", es: "Taco de Pescado" },
            description: { en: "Lightly crispy breaded fish on a flour tortilla served with coleslaw, red onion and cilantro with a chipotle dressing, served with guacamole, pico de gallo and homemade salsas.", es: "Pescado empanizado ligeramente crujiente en una tortilla de harina servido con ensalada de col, cebolla morada y cilantro con un aderezo de chipotle, servido con guacamole, pico de gallo y salsas caseras." },
            price: "$65"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Carnitas Taco", es: "Taco de Carnitas" },
            description: { en: "Pork confit on a handmade corn tortilla, served with guacamole and pico de gallo.", es: "Cerdo confitado en una tortilla de maíz hecha a mano, servido con guacamole y pico de gallo." },
            price: "$65"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Shrimp Taco", es: "Taco de Camarón" },
            description: { en: "Lightly crispy breaded shrimp on a flour tortilla served with coleslaw, red onion and cilantro with a chipotle dressing, served with guacamole, pico de gallo and homemade salsas.", es: "Camarón empanizado ligeramente crujiente en una tortilla de harina servido con ensalada de col, cebolla morada y cilantro con un aderezo de chipotle, servido con guacamole, pico de gallo y salsas caseras." },
            price: "$65"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Tropical Tuna Tostada", es: "Tostada de Atún Tropical" },
            description: { en: "Homemade tostada with fresh tuna marinated in a Mexican Asian fusion sauce with mango, cucumber, red onion, cilantro and olive oil.", es: "Tostada casera con atún fresco marinado en una salsa fusión mexicana asiática con mango, pepino, cebolla morada, cilantro y aceite de oliva." },
            price: "$90"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Shrimp Special Tostada", es: "Tostada Especial de Camarón" },
            description: { en: "Homemade tostada with cooked shrimp, celery, cilantro, red onion, carrot, tomato and mayonnaise.", es: "Tostada casera con camarón cocido, apio, cilantro, cebolla morada, zanahoria, tomate y mayonesa." },
            price: "$90"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "House Cheesy Fries", es: "Papas con Queso de la Casa" },
            description: { en: "French fries drenched in melted creamy cheddar topped with crispy bacon and chipotle sauce.", es: "Papas fritas bañadas en cheddar cremoso derretido cubiertas con tocino crujiente y salsa de chipotle." },
            price: "$115"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "BBQ Ribs", es: "Costillas BBQ" },
            description: { en: "Brian's recipe from New Orleans, 2 pc.", es: "Receta de Brian de Nueva Orleans, 2 pzas." },
            price: "$120"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Loaded Potato", es: "Papa Cargada" },
            description: { en: "Baked crispy potato skins filled with potato, bacon, chives, jack cheese, cheddar cheese, parmesan cheese and sour cream.", es: "Cáscaras de papa horneadas crujientes rellenas con papa, tocino, cebollín, queso jack, queso cheddar, queso parmesano y crema ácida." },
            price: "$95"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Organic Chicken Caesar", es: "César de Pollo Orgánico" },
            description: { en: "Traditional homemade caesar dressing, romaine lettuce, organic chicken and homemade focaccia with herbs and parmesan.", es: "Aderezo césar tradicional casero, lechuga romana, pollo orgánico y focaccia casera con hierbas y parmesano." },
            price: "$110"
        },
        {
            category: { en: "Food Specials", es: "Especiales de Comida" },
            name: { en: "Calamari", es: "Calamares" },
            description: { en: "Calamari steak strips sautéed crispy in panko, served with cocktail and marinara sauce.", es: "Tiras de filete de calamar salteadas crujientes en panko, servidas con salsa coctel y marinara." },
            price: "$100"
        }
    ],
    sushi: [
        // SASHIMI
        {
            category: { en: "Sashimi", es: "Sashimi" },
            name: { en: "Mexican Sashimi", es: "Sashimi Mexicano" },
            description: { en: "Fresh fish, onion, serrano, cucumber and avocado in a citrus soy sauce.", es: "Pescado fresco, cebolla, serrano, pepino y aguacate en una salsa de soya cítrica." },
            price: "$330"
        },
        // ROLLS
        {
            category: { en: "Rolls", es: "Rollos" },
            name: { en: "California Roll", es: "Rollo California" },
            description: { en: "Crab, avocado and cucumber.", es: "Cangrejo, aguacate y pepino." },
            price: "$295"
        },
        {
            category: { en: "Rolls", es: "Rollos" },
            name: { en: "Spicy Tuna Roll", es: "Rollo de Atún Picante" },
            description: { en: "California roll with spicy tuna on top.", es: "Rollo California con atún picante encima." },
            price: "$325"
        },
        {
            category: { en: "Rolls", es: "Rollos" },
            name: { en: "Cosmo Roll", es: "Rollo Cosmo" },
            description: { en: "Shrimp, cream cheese, avocado, cucumber inside, lightly breaded in panko, spicy kanikama salad on top and eel sauce.", es: "Camarón, queso crema, aguacate, pepino adentro, ligeramente empanizado en panko, ensalada de kanikama picante encima y salsa de anguila." },
            price: "$330"
        },
        {
            category: { en: "Rolls", es: "Rollos" },
            name: { en: "Cilantro Roll", es: "Rollo de Cilantro" },
            description: { en: "Shrimp, avocado, cucumber on the inside, seared fish with cilantro sauce on the outside.", es: "Camarón, aguacate, pepino por dentro, pescado sellado con salsa de cilantro por fuera." },
            price: "$330"
        },
        {
            category: { en: "Rolls", es: "Rollos" },
            name: { en: "Currican Roll", es: "Rollo Currican" },
            description: { en: "Catch of the day stuffed with shrimp and kanikama salad with avocado and an orange sauce with sesame.", es: "Pesca del día rellena con camarón y ensalada de kanikama con aguacate y una salsa naranja con sésamo." },
            price: "$330"
        },
        // SPECIALTY ROLLS
        {
            category: { en: "Specialty Rolls", es: "Rollos Especiales" },
            name: { en: "Solomon's Roll", es: "Rollo Solomon's" },
            description: { en: "Shrimp tempura, avocado, cucumber inside, fresh tuna on top with eel sauce.", es: "Camarón tempura, aguacate, pepino por dentro, atún fresco encima con salsa de anguila." },
            price: "$365"
        },
        {
            category: { en: "Specialty Rolls", es: "Rollos Especiales" },
            name: { en: "Dragon Roll", es: "Rollo Dragón" },
            description: { en: "Shrimp tempura, avocado inside, eel on top with eel sauce.", es: "Camarón tempura, aguacate por dentro, anguila encima con salsa de anguila." },
            price: "$365"
        },
        {
            category: { en: "Specialty Rolls", es: "Rollos Especiales" },
            name: { en: "Rainbow Roll", es: "Rollo Arcoíris" },
            description: { en: "California roll topped with assorted fresh fish.", es: "Rollo California cubierto con pescado fresco variado." },
            price: "$365"
        },
        // SIDES
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Extra Soy Sauce", es: "Salsa de Soya Extra" },
            description: { en: "", es: "" }
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Extra Eel Sauce", es: "Salsa de Anguila Extra" },
            description: { en: "", es: "" }
        },
        {
            category: { en: "Sides", es: "Acompañamientos" },
            name: { en: "Extra Wasabi", es: "Wasabi Extra" },
            description: { en: "", es: "" }
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
        menuItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No items available in this category.</p>';
        return;
    }

    // Agrupar por categoría si existe, separando SIDES
    const itemsByCategory = {};
    const sidesItems = [];
    
    items.forEach(item => {
        if (item.category) {
            const catName = item.category[currentLanguage] || item.category.en;
            // Separar SIDES en su propio array
            if (catName === 'Sides' || catName === 'Acompañamientos') {
                sidesItems.push(item);
            } else {
            if (!itemsByCategory[catName]) {
                itemsByCategory[catName] = [];
            }
            itemsByCategory[catName].push(item);
            }
        } else {
            if (!itemsByCategory['main']) {
                itemsByCategory['main'] = [];
            }
            itemsByCategory['main'].push(item);
        }
    });

    let menuHTML = '';
    let itemIndex = 0;
    
    // Renderizar categorías principales (excepto SIDES)
    Object.keys(itemsByCategory).forEach(catName => {
        if (catName !== 'main') {
            menuHTML += `
                <div class="menu-category-header" style="grid-column: 1 / -1; margin: 2.5rem 0 1.25rem 0; padding: 1.25rem 1.75rem; background: linear-gradient(135deg, rgba(0, 74, 159, 0.1), rgba(0, 74, 159, 0.05)); border-radius: 14px; border-left: 4px solid #004A9F; box-shadow: 0 3px 12px rgba(0, 74, 159, 0.1); animation: fadeInDown 0.5s ease-out;">
                    <h3 style="font-size: clamp(1.25rem, 2.5vw, 1.6rem); color: #004A9F; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0;">${catName}</h3>
                </div>
            `;
        }
        
        // Agregar items de esta categoría
        menuHTML += itemsByCategory[catName].map(item => {
            const itemName = item.name[currentLanguage] || item.name.en;
            const itemDescription = item.description[currentLanguage] || item.description.en;
            const delay = itemIndex * 0.05;
            itemIndex++;
            
            // Badges (NEW, FEATURED) - Blue theme
            let badges = '';
            if (item.new) {
                badges += '<span style="background: linear-gradient(135deg, #004A9F, #0066CC); color: white; padding: 0.3rem 0.7rem; border-radius: 14px; font-size: 0.7rem; font-weight: 700; margin-left: 0.5rem; text-transform: uppercase; display: inline-block; box-shadow: 0 2px 6px rgba(0, 74, 159, 0.3);">New</span>';
            }
            if (item.featured) {
                badges += '<span style="background: linear-gradient(135deg, #004A9F, #0066CC); color: white; padding: 0.3rem 0.7rem; border-radius: 14px; font-size: 0.7rem; font-weight: 700; margin-left: 0.5rem; text-transform: uppercase; display: inline-block; box-shadow: 0 2px 6px rgba(0, 74, 159, 0.3);">⭐ Featured</span>';
            }
            
            // Iconos
            const icons = item.icons || '';
            
            // Opciones (para items con variaciones) - NO PRICES
            let optionsHTML = '';
            if (item.options && item.options.length > 0) {
                optionsHTML = '<div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(0, 74, 159, 0.1);">';
                item.options.forEach(option => {
                    const optionName = option.name ? (option.name[currentLanguage] || option.name.en) : (option[currentLanguage] || option.en);
                    optionsHTML += `
                        <div style="display: flex; justify-content: flex-start; align-items: center; padding: 0.5rem 0; font-size: 0.95rem; color: #64748b;">
                            <span style="color: #004A9F; margin-right: 0.5rem;">•</span>
                            <span>${optionName}</span>
                        </div>
                    `;
                });
                optionsHTML += '</div>';
            }
            
            return `
                <div class="menu-item" style="background: #ffffff; padding: clamp(1.5rem, 3vw, 2rem); border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0, 74, 159, 0.08); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(0, 74, 159, 0.1); position: relative; overflow: hidden; box-sizing: border-box; animation: fadeInUp 0.5s ease-out ${delay}s both; opacity: 0;">
                    <div class="menu-item-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.875rem; gap: 1rem; position: relative; z-index: 1;">
                        <h3 class="menu-item-name" style="font-size: clamp(1.15rem, 2.5vw, 1.4rem); color: #1a1a1a; font-weight: 700; flex: 1; line-height: 1.4; letter-spacing: -0.2px; word-wrap: break-word; overflow-wrap: break-word;">
                            ${icons ? `<span style="font-size: 1.4rem; margin-right: 0.6rem; vertical-align: middle; filter: drop-shadow(0 2px 4px rgba(0, 74, 159, 0.2));">${icons}</span>` : ''}
                            <span style="display: inline-block; vertical-align: middle;">${itemName}${badges}</span>
                        </h3>
                    </div>
                    ${itemDescription ? `<p class="menu-item-description" style="font-size: clamp(0.95rem, 2vw, 1.05rem); color: #64748b; line-height: 1.75; margin: 0; position: relative; z-index: 1; word-wrap: break-word; overflow-wrap: break-word;">${itemDescription}</p>` : ''}
                    ${optionsHTML}
                </div>
            `;
        }).join('');
    });

    // Renderizar SIDES como sección separada al final
    if (sidesItems.length > 0) {
        menuHTML += `
            <div class="menu-sides-section" style="grid-column: 1 / -1; margin-top: 3.5rem; padding-top: 2.5rem; border-top: 3px solid rgba(0, 74, 159, 0.2); animation: fadeInUp 0.6s ease-out ${itemIndex * 0.05}s both; opacity: 0;">
                <div class="menu-category-header" style="margin-bottom: 1.5rem; padding: 1.25rem 1.75rem; background: linear-gradient(135deg, rgba(0, 74, 159, 0.12), rgba(0, 74, 159, 0.06)); border-radius: 14px; border-left: 4px solid #004A9F; box-shadow: 0 3px 12px rgba(0, 74, 159, 0.1);">
                    <h3 style="font-size: clamp(1.25rem, 2.5vw, 1.6rem); color: #004A9F; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0;">${sidesItems[0].category[currentLanguage] || sidesItems[0].category.en}</h3>
                </div>
                <div class="menu-sides-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
        `;
        
        sidesItems.forEach((item, idx) => {
            const itemName = item.name[currentLanguage] || item.name.en;
            const delay = (itemIndex + idx) * 0.05;
            menuHTML += `
                <div class="menu-item menu-side-item" style="background: #f8f9fa; padding: 1.125rem 1.375rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid rgba(0, 74, 159, 0.12); text-align: center; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); animation: fadeInUp 0.4s ease-out ${delay}s both; opacity: 0;">
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <span style="font-size: clamp(0.95rem, 2vw, 1.05rem); color: #1a1a1a; font-weight: 600; text-align: center;">${itemName}</span>
                    </div>
                </div>
            `;
        });
        
        menuHTML += `
                </div>
            </div>
        `;
    }

    menuItemsContainer.innerHTML = menuHTML;
    
    // Trigger animations after a brief delay
    setTimeout(() => {
        const animatedItems = menuItemsContainer.querySelectorAll('.menu-item, .menu-category-header, .menu-sides-section');
        animatedItems.forEach(item => {
            item.style.opacity = '1';
        });
    }, 50);
    
    // Agregar efecto hover mejorado con blue accents
    const menuItems = menuItemsContainer.querySelectorAll('.menu-item:not(.menu-side-item)');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 24px rgba(0, 74, 159, 0.15), 0 0 0 1px rgba(0, 74, 159, 0.15)';
            this.style.borderColor = 'rgba(0, 74, 159, 0.25)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0, 74, 159, 0.08)';
            this.style.borderColor = 'rgba(0, 74, 159, 0.1)';
        });
    });
    
    // Hover para side items con blue accents
    const sideItems = menuItemsContainer.querySelectorAll('.menu-side-item');
    sideItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 16px rgba(0, 74, 159, 0.12)';
            this.style.background = '#ffffff';
            this.style.borderColor = 'rgba(0, 74, 159, 0.2)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            this.style.background = '#f8f9fa';
            this.style.borderColor = 'rgba(0, 74, 159, 0.12)';
        });
    });
}

/**
 * Maneja el cambio de pestañas del menú
 */
function initMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItemsContainer = document.getElementById('menuItems');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Smooth fade out
            if (menuItemsContainer) {
                menuItemsContainer.style.opacity = '0';
                menuItemsContainer.style.transition = 'opacity 0.2s ease-out';
            }
            
            menuTabs.forEach(t => {
                t.classList.remove('active');
                // Update inactive tab styles - ensure stable styling
                if (!t.hasAttribute('data-styled')) {
                    t.setAttribute('data-styled', 'true');
                }
                t.style.background = 'white';
                t.style.color = '#1a1a1a';
                t.style.borderColor = '#004A9F';
                t.style.transform = 'none';
            });
            
            this.classList.add('active');
            // Update active tab styles - ensure stable styling
            if (!this.hasAttribute('data-styled')) {
                this.setAttribute('data-styled', 'true');
            }
            this.style.background = 'linear-gradient(135deg, #004A9F, #0066CC)';
            this.style.color = 'white';
            this.style.borderColor = '#004A9F';
            this.style.transform = 'none';

            const category = this.getAttribute('data-category');
            
            // Render menu after brief fade
            setTimeout(() => {
            renderMenu(category);
                if (menuItemsContainer) {
                    menuItemsContainer.style.opacity = '1';
                    menuItemsContainer.style.transition = 'opacity 0.3s ease-in';
                }
            }, 150);
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

/**
 * Send reservation email via Netlify Function (with EmailJS fallback)
 */
async function sendReservationEmail(reservationData) {
    // Determine Netlify function URL
    const netlifyUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8888/.netlify/functions/send-reservation'
        : `/.netlify/functions/send-reservation`;
    
    try {
        // Try Netlify Function first
        const response = await fetch(netlifyUrl, {
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
                notes: reservationData.notes || '',
                confirmationCode: reservationData.confirmationCode || '',
                confirmUrl: reservationData.confirmUrl || '',
                customerLanguage: reservationData.customerLanguage || 'English'
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Reservation email sent via Netlify Function');
            return { success: true, method: 'netlify' };
        } else {
            throw new Error(result.error || 'Netlify function failed');
        }
    } catch (netlifyError) {
        console.warn('⚠️ Netlify Function failed, falling back to EmailJS:', netlifyError);
        
        // Fallback to EmailJS
        if (typeof emailjs !== 'undefined') {
            try {
                // Initialize EmailJS if needed
                if (!emailjs.init) {
                    emailjs.init('gCsJYvChpOqVACgUr');
                }
                
                const dateObj = new Date(reservationData.date + 'T00:00:00');
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                await emailjs.send('service_u021fxi', 'template_ij3p83j', {
                    to_email: 'contact@solomonslanding.com.mx',
                    customer_name: reservationData.name,
                    customer_email: reservationData.email,
                    customer_phone: reservationData.phone,
                    reservation_date: formattedDate,
                    reservation_time: reservationData.time,
                    party_size: reservationData.guests,
                    special_requests: reservationData.notes || 'None',
                    confirmation_code: reservationData.confirmationCode || '',
                    confirm_url: reservationData.confirmUrl || '',
                    customer_language: reservationData.customerLanguage || 'English'
                });
                
                console.log('✅ Reservation email sent via EmailJS (fallback)');
                return { success: true, method: 'emailjs' };
            } catch (emailjsError) {
                console.error('❌ EmailJS fallback also failed:', emailjsError);
                return { 
                    success: false, 
                    error: 'Failed to send email. Please try again or call +52 624 219 3228.',
                    method: 'none'
                };
            }
        } else {
            console.error('❌ EmailJS not available as fallback');
            return { 
                success: false, 
                error: 'Email service unavailable. Please call +52 624 219 3228.',
                method: 'none'
            };
        }
    }
}

/**
 * Send catering email via Netlify Function (with EmailJS fallback)
 */
async function sendCateringEmail(cateringData) {
    // Determine Netlify function URL
    const netlifyUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8888/.netlify/functions/send-catering'
        : `/.netlify/functions/send-catering`;
    
    try {
        // Try Netlify Function first
        const response = await fetch(netlifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: cateringData.name,
                email: cateringData.email,
                phone: cateringData.phone,
                eventDate: cateringData.eventDate,
                guestCount: cateringData.guestCount,
                eventType: cateringData.eventType,
                message: cateringData.message || ''
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Catering email sent via Netlify Function');
            return { success: true, method: 'netlify' };
        } else {
            throw new Error(result.error || 'Netlify function failed');
        }
    } catch (netlifyError) {
        console.warn('⚠️ Netlify Function failed, falling back to EmailJS:', netlifyError);
        
        // Fallback to EmailJS
        if (typeof emailService !== 'undefined') {
            try {
                const result = await emailService.sendCateringQuote(cateringData);
                if (result.success) {
                    console.log('✅ Catering email sent via EmailJS (fallback)');
                    return { success: true, method: 'emailjs' };
                } else {
                    throw new Error('EmailJS failed');
                }
            } catch (emailjsError) {
                console.error('❌ EmailJS fallback also failed:', emailjsError);
                return { 
                    success: false, 
                    error: 'Failed to send email. Please try again or call +52 624 219 3228.',
                    method: 'none'
                };
            }
        } else if (typeof emailjs !== 'undefined') {
            // Direct EmailJS fallback
            try {
                if (!emailjs.init) {
                    emailjs.init('gCsJYvChpOqVACgUr');
                }
                
                await emailjs.send(
                    'service_u021fxi',
                    'template_catering_quote',
                    {
                        to_email: 'samantha@solomonslanding.com.mx',
                        from_name: cateringData.name,
                        from_email: cateringData.email,
                        phone: cateringData.phone,
                        event_date: cateringData.eventDate,
                        guest_count: cateringData.guestCount,
                        event_type: cateringData.eventType,
                        message: cateringData.message || ''
                    },
                    'gCsJYvChpOqVACgUr'
                );
                
                console.log('✅ Catering email sent via EmailJS (direct fallback)');
                return { success: true, method: 'emailjs' };
            } catch (emailjsError) {
                console.error('❌ Direct EmailJS fallback also failed:', emailjsError);
                return { 
                    success: false, 
                    error: 'Failed to send email. Please try again or call +52 624 219 3228.',
                    method: 'none'
                };
            }
        } else {
            console.error('❌ EmailJS not available as fallback');
            return { 
                success: false, 
                error: 'Email service unavailable. Please call +52 624 219 3228.',
                method: 'none'
            };
        }
    }
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

    cateringForm.addEventListener('submit', async function(e) {
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

        // Send catering quote via Netlify Function (with EmailJS fallback)
        try {
            const emailResult = await sendCateringEmail(formData);
            
            if (emailResult.success) {
                    showCateringMessage('✅ Thank you! Your catering request has been sent to our team. We will contact you within 24 hours.', 'success');
                    cateringForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Request Quote';
                } else {
                    showCateringMessage('❌ Error sending request. Please try again or call +52 624 219 3228.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Request Quote';
                }
        } catch (error) {
            console.error('Catering email error:', error);
            showCateringMessage('❌ Error sending request. Please try again or call +52 624 219 3228.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request Quote';
        }
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
    
    // Check if we're on GitHub Pages (functions won't exist there)
    const isGitHubPages = window.location.hostname.includes('github.io') || 
                         window.location.hostname.includes('github.com');
    
    // Try Netlify Function first (unless on GitHub Pages)
    if (!isGitHubPages) {
        try {
            const netlifyUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:8888/.netlify/functions/createReservation'
                : `/.netlify/functions/createReservation`;
            
            const response = await fetch(netlifyUrl, {
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
                    notes: reservationData.notes || '',
                    language: reservationData.language || (currentLanguage || 'en')
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Reservation created via Netlify Function:', result.reservationId);
                return {
                    success: true,
                    reservationId: result.reservationId,
                    message: 'Reservation request sent successfully',
                    method: 'netlify'
                };
            } else {
                throw new Error(result.error || 'Netlify function failed');
            }
        } catch (netlifyError) {
            console.warn('⚠️ Netlify Function failed, falling back to EmailJS:', netlifyError);
            // Fall through to EmailJS fallback
        }
    }
    
    // Fallback to EmailJS (for GitHub Pages or if Netlify Function fails)
    if (typeof emailjs !== 'undefined') {
        try {
            // Generate confirmation code if not provided
            const confirmationCode = reservationData.confirmationCode || 'RES-' + Date.now().toString().slice(-6);
            
            // Build confirmation URL if needed
            const confirmUrl = reservationData.confirmUrl || `${window.location.origin}/website/confirm-reservation.html?code=${confirmationCode}`;
            
            // Send email via EmailJS
            const emailResult = await sendReservationEmail({
                ...reservationData,
                confirmationCode,
                confirmUrl,
                customerLanguage: reservationData.customerLanguage || (currentLanguage === 'es' ? 'Español' : 'English')
            });
            
            if (!emailResult.success) {
                return {
                    success: false,
                    message: emailResult.error || 'Failed to send reservation email'
                };
            }
            
            return {
                success: true,
                reservationId: confirmationCode,
                message: 'Reservation request sent successfully',
                method: 'emailjs'
            };
        } catch (emailjsError) {
            console.error('❌ EmailJS fallback also failed:', emailjsError);
            return {
                success: false,
                message: 'Failed to send reservation. Please try again or call +52 624 219 3228.'
            };
        }
    } else {
        console.error('❌ No email service available');
        return {
            success: false,
            message: 'Email service unavailable. Please call +52 624 219 3228.'
        };
    }
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
    const slideInterval = 4000; // 4 segundos por slide

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
        const slideInterval = 4000; // 4 segundos por slide

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
    const nav = document.querySelector('.navbar-menu');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    if (!menuToggle || !nav || !overlay) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Update aria-expanded
        const isActive = nav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Close menu when overlay is clicked
    overlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
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



