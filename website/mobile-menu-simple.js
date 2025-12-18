/**
 * Menu Hamburguesa SIMPLE - Solomon's Landing
 * SIN animaciones, SOLO funcionalidad
 */

console.log('=== MOBILE MENU LOADING ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM LOADED ===');
    
    // Crear overlay si no existe
    let overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) {
        console.log('Creating overlay');
        overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
    }

    // Elementos
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');
    const navLinks = document.querySelectorAll('header nav a');

    console.log('Elements found:', {
        menuToggle: !!menuToggle,
        nav: !!nav,
        overlay: !!overlay,
        navLinksCount: navLinks.length
    });

    if (!menuToggle || !nav) {
        console.error('MENU ELEMENTS NOT FOUND!');
        return;
    }

    // Toggle menú - ULTRA SIMPLE
    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('=== TOGGLE MENU ===');
        
        const isOpen = nav.classList.contains('active');
        console.log('Current state:', isOpen ? 'OPEN' : 'CLOSED');
        
        if (isOpen) {
            // CERRAR
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu CLOSED');
        } else {
            // ABRIR
            menuToggle.classList.add('active');
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menu OPENED');
        }
    }

    // Cerrar menú
    function closeMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('=== CLOSE MENU ===');
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners - usar capture phase
    console.log('Adding event listeners...');
    
    menuToggle.addEventListener('click', toggleMenu, true);
    menuToggle.addEventListener('touchstart', toggleMenu, { passive: false, capture: true });
    
    overlay.addEventListener('click', closeMenu, true);
    overlay.addEventListener('touchstart', closeMenu, { passive: false, capture: true });
    
    // Cerrar al hacer click en links - SOLO click, NO touchstart
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            console.log('Nav link clicked:', link.textContent);
            closeMenu();
            // Permitir navegación normal
        }, false);
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            console.log('ESC pressed');
            closeMenu();
        }
    });
    
    // Cerrar al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            console.log('Window resized > 768px');
            closeMenu();
        }
    });
    
    console.log('=== MOBILE MENU INITIALIZED ===');
});
