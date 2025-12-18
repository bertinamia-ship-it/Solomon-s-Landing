/**
 * Optimizador de Rendimiento Móvil
 * Carga rápida y smooth scroll
 */

// Detectar móvil
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    console.log('📱 Mobile Performance Optimizer loaded');
    
    // 1. Lazy load images
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        console.log(`✅ ${images.length} images set to lazy load`);
    });
    
    // 2. Optimizar animaciones (desactivar)
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
        }
    `;
    document.head.appendChild(style);
    
    // 3. Preconnect a recursos externos
    const preconnect = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    preconnect.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        document.head.appendChild(link);
    });
    
    // 4. Mejorar scroll performance
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        document.body.classList.add('scrolling');
        scrollTimer = setTimeout(function() {
            document.body.classList.remove('scrolling');
        }, 150);
    }, { passive: true });
    
    console.log('✅ Mobile performance optimizations applied');
}
