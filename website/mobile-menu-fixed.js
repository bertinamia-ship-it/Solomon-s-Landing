/**
 * MENÚ HAMBURGUESA - VERSIÓN ARREGLADA Y FUNCIONAL
 * Optimizado para iPhone y móviles
 */

(function() {
    'use strict';

    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        
        console.log('🍔 Inicializando menú móvil...');

        // Crear overlay si no existe
        let overlay = document.querySelector('.mobile-nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-nav-overlay';
            document.body.appendChild(overlay);
            console.log('✅ Overlay creado');
        }

        // Obtener elementos
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('header nav');
        const navLinks = document.querySelectorAll('header nav a');

        // Validar que existan los elementos
        if (!menuToggle) {
            console.error('❌ No se encontró el botón .mobile-menu-toggle');
            return;
        }

        if (!nav) {
            console.error('❌ No se encontró el elemento header nav');
            return;
        }

        console.log('✅ Elementos encontrados:', {
            menuToggle: !!menuToggle,
            nav: !!nav,
            overlay: !!overlay,
            links: navLinks.length
        });

        // Función para abrir el menú
        function openMenu() {
            console.log('📱 Abriendo menú...');
            menuToggle.classList.add('active');
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }

        // Función para cerrar el menú
        function closeMenu() {
            console.log('❌ Cerrando menú...');
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        // Toggle del menú
        function toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (nav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Event listener para el botón hamburguesa
        menuToggle.addEventListener('click', toggleMenu);
        console.log('✅ Click listener agregado al botón');

        // Event listener para el overlay (cerrar al hacer click fuera)
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
        console.log('✅ Click listener agregado al overlay');

        // Cerrar menú al hacer click en cualquier enlace
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Delay para permitir la navegación
                setTimeout(closeMenu, 100);
            });
        });
        console.log('✅ Click listeners agregados a los enlaces:', navLinks.length);

        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMenu();
            }
        });
        console.log('✅ Keyboard listener agregado');

        // Prevenir scroll en el body cuando el menú está abierto
        nav.addEventListener('touchmove', function(e) {
            if (nav.classList.contains('active')) {
                e.stopPropagation();
            }
        }, { passive: true });

        // Cerrar menú al cambiar orientación
        window.addEventListener('orientationchange', function() {
            if (nav.classList.contains('active')) {
                closeMenu();
            }
        });

        // Cerrar menú al hacer resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                if (window.innerWidth > 768 && nav.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });

        console.log('🎉 Menú móvil inicializado correctamente');
    });

})();
