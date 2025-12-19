// ============================================
// MOBILE FORCE - FORZAR CAMBIOS CON JAVASCRIPT
// Se ejecuta INMEDIATAMENTE al cargar
// ============================================

(function() {
    'use strict';
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    console.log('🔧 MOBILE FORCE: Aplicando cambios...');
    
    // FUNCIÓN 1: FORZAR LOGO SIN SANTA
    function forzarLogo() {
        // Cambiar TODAS las imágenes de logo
        const logos = document.querySelectorAll('header img, .logo img, .logo-container img, footer img[src*="logo"]');
        logos.forEach(img => {
            if (img.src.includes('logo') || img.src.includes('solomons')) {
                img.src = 'cropped-solomons-logo.png';
                img.style.height = '32px';
                img.style.width = 'auto';
                console.log('✅ Logo cambiado:', img);
            }
        });
        
        // Cambiar favicon
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = 'cropped-solomons-logo.png';
            console.log('✅ Favicon cambiado');
        }
    }
    
    // FUNCIÓN 2: OCULTAR H1 "RESTAURANT"
    function ocultarTituloRestaurant() {
        const h1s = document.querySelectorAll('.hero-overlay h1, .hero h1, h1[data-i18n="hero.title"]');
        h1s.forEach(h1 => {
            if (h1.textContent.includes('Restaurant') || h1.textContent.includes('Cuisine')) {
                h1.style.display = 'none';
                h1.style.visibility = 'hidden';
                h1.style.opacity = '0';
                h1.style.height = '0';
                h1.style.overflow = 'hidden';
                h1.style.position = 'absolute';
                h1.style.clip = 'rect(0,0,0,0)';
                console.log('✅ H1 Restaurant ocultado');
            }
        });
    }
    
    // FUNCIÓN 3: REDUCIR CARRUSEL/STICKERS
    function reducirCarrusel() {
        // Container
        const container = document.querySelector('.features-scroll-container');
        if (container) {
            container.style.padding = '8px 0';
            container.style.margin = '0';
        }
        
        // Track
        const track = document.querySelector('.features-scroll-track');
        if (track) {
            track.style.gap = '4px';
        }
        
        // Cards
        const cards = document.querySelectorAll('.feature-mini-card');
        cards.forEach(card => {
            card.style.minWidth = '70px';
            card.style.maxWidth = '70px';
            card.style.padding = '5px 4px';
            card.style.borderRadius = '8px';
            card.style.borderWidth = '1px';
            
            // Icono
            const icon = card.querySelector('div:first-child');
            if (icon) {
                icon.style.fontSize = '1.4rem';
                icon.style.marginBottom = '2px';
            }
            
            // Texto
            const h4 = card.querySelector('h4');
            if (h4) {
                h4.style.fontSize = '0.5rem';
                h4.style.lineHeight = '1.1';
                h4.style.margin = '0';
                h4.style.padding = '0';
                h4.style.letterSpacing = '-0.2px';
            }
        });
        console.log(`✅ ${cards.length} cards reducidas`);
    }
    
    // FUNCIÓN 4: COMPACTAR FOOTER
    function compactarFooter() {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.padding = '20px 15px';
            
            // Ocultar Quick Links (segunda columna)
            const gridDiv = footer.querySelector('div > div');
            if (gridDiv) {
                const columns = gridDiv.children;
                if (columns[1]) {
                    columns[1].style.display = 'none';
                    console.log('✅ Quick Links ocultado');
                }
            }
            
            // Redes sociales pequeñas
            const socialLinks = footer.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="tripadvisor"]');
            socialLinks.forEach(link => {
                link.style.width = '28px';
                link.style.height = '28px';
                link.style.fontSize = '14px';
                link.style.padding = '6px';
                link.style.margin = '0 4px';
            });
        }
    }
    
    // FUNCIÓN 5: COMPACTAR HERO
    function compactarHero() {
        const hero = document.querySelector('.hero, #hero');
        if (hero) {
            hero.style.height = '45vh';
            hero.style.minHeight = '380px';
            hero.style.maxHeight = '450px';
        }
        
        // Botones más pequeños
        const btns = document.querySelectorAll('.hero-buttons a, .cta-buttons a, .btn');
        btns.forEach(btn => {
            btn.style.maxWidth = '120px';
            btn.style.padding = '8px 14px';
            btn.style.fontSize = '0.65rem';
            btn.style.borderRadius = '18px';
        });
        
        // Subtitle más pequeño
        const subtitle = document.querySelector('.hero-overlay p, .hero p[data-i18n="hero.subtitle"]');
        if (subtitle) {
            subtitle.style.fontSize = '0.75rem';
            subtitle.style.marginBottom = '12px';
            subtitle.style.letterSpacing = '1px';
        }
    }
    
    // EJECUTAR TODO
    function aplicarTodo() {
        forzarLogo();
        ocultarTituloRestaurant();
        reducirCarrusel();
        compactarFooter();
        compactarHero();
        console.log('✅ MOBILE FORCE: Todos los cambios aplicados');
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarTodo);
    } else {
        aplicarTodo();
    }
    
    // Re-aplicar después de 100ms por si acaso
    setTimeout(aplicarTodo, 100);
    
    // Re-aplicar después de 500ms para asegurar
    setTimeout(aplicarTodo, 500);
    
    // Observer para cambios dinámicos
    const observer = new MutationObserver(() => {
        aplicarTodo();
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
})();
