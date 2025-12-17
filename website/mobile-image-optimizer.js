/**
 * OPTIMIZACIÓN DE IMÁGENES PARA MÓVIL - CLOUDINARY
 * Detección automática de dispositivo y carga de imágenes optimizadas
 */

(function() {
    'use strict';

    // Detectar si es dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isRetina = window.devicePixelRatio > 1;

    /**
     * Optimizar URLs de Cloudinary para móvil
     * @param {string} url - URL original de Cloudinary
     * @returns {string} - URL optimizada
     */
    function optimizeCloudinaryURL(url) {
        if (!url || !url.includes('cloudinary.com')) {
            return url;
        }

        // Obtener el ancho de la pantalla
        const screenWidth = Math.min(window.innerWidth, 768);
        const imageWidth = isRetina ? screenWidth * 2 : screenWidth;

        // Transformaciones para móvil
        const mobileTransformations = [
            `w_${imageWidth}`, // Ancho responsive
            'c_fill', // Crop para llenar
            'f_auto', // Formato automático (WebP en soportado)
            'q_auto:good', // Calidad automática buena
            'dpr_auto' // Pixel ratio automático
        ].join(',');

        // Insertar transformaciones en la URL
        if (url.includes('/upload/')) {
            return url.replace('/upload/', `/upload/${mobileTransformations}/`);
        }

        return url;
    }

    /**
     * Optimizar imágenes de fondo (background-image)
     */
    function optimizeBackgroundImages() {
        if (!isMobile) return;

        // Hero slides
        const heroSlides = document.querySelectorAll('.hero-slide');
        heroSlides.forEach(slide => {
            const bgImage = slide.style.backgroundImage;
            if (bgImage && bgImage.includes('cloudinary.com')) {
                const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                if (urlMatch && urlMatch[1]) {
                    const originalURL = urlMatch[1];
                    const optimizedURL = optimizeCloudinaryURL(originalURL);
                    slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${optimizedURL}')`;
                }
            }
        });

        // Otros elementos con background-image
        const bgElements = document.querySelectorAll('[style*="background-image"]');
        bgElements.forEach(element => {
            const bgImage = element.style.backgroundImage;
            if (bgImage && bgImage.includes('cloudinary.com')) {
                const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                if (urlMatch && urlMatch[1]) {
                    const originalURL = urlMatch[1];
                    const optimizedURL = optimizeCloudinaryURL(originalURL);
                    element.style.backgroundImage = `url('${optimizedURL}')`;
                }
            }
        });
    }

    /**
     * Lazy loading de imágenes
     */
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Si tiene data-src, cargar la imagen
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }

                        // Si tiene srcset, activarlo
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }

                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px' // Cargar 50px antes de que sea visible
            });

            // Observar todas las imágenes con loading="lazy"
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Optimizar hero para móvil
     */
    function optimizeHeroForMobile() {
        if (!isMobile) return;

        const hero = document.getElementById('hero') || document.getElementById('catering-hero');
        if (hero) {
            // Ajustar altura del hero
            hero.style.minHeight = '75vh';
            hero.style.height = '75vh';
            hero.style.maxHeight = '75vh';

            // Desactivar parallax en móvil
            hero.style.backgroundAttachment = 'scroll';
        }
    }

    /**
     * Precargar imágenes críticas
     */
    function preloadCriticalImages() {
        const criticalImages = [
            document.querySelector('.hero-slide.active')
        ];

        criticalImages.forEach(element => {
            if (!element) return;

            const bgImage = element.style.backgroundImage;
            if (bgImage) {
                const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                if (urlMatch && urlMatch[1]) {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = urlMatch[1];
                    document.head.appendChild(link);
                }
            }
        });
    }

    /**
     * Reducir calidad de animaciones en móvil
     */
    function optimizeAnimations() {
        if (!isMobile) return;

        // Reducir duración de animaciones
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                * {
                    animation-duration: 0.4s !important;
                    transition-duration: 0.3s !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Optimizar menu tabs scroll
     */
    function optimizeMenuTabs() {
        const menuTabs = document.querySelector('.menu-tabs');
        if (menuTabs && isMobile) {
            // Habilitar scroll suave
            menuTabs.style.scrollBehavior = 'smooth';
            menuTabs.style.webkitOverflowScrolling = 'touch';
        }
    }

    /**
     * Inicializar todas las optimizaciones
     */
    function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('🚀 Iniciando optimizaciones móviles...');
        console.log('📱 Dispositivo móvil:', isMobile);
        console.log('🖥️ Retina:', isRetina);
        console.log('📏 Ancho de pantalla:', window.innerWidth);

        // Ejecutar optimizaciones
        optimizeBackgroundImages();
        setupLazyLoading();
        optimizeHeroForMobile();
        preloadCriticalImages();
        optimizeAnimations();
        optimizeMenuTabs();

        console.log('✅ Optimizaciones móviles completadas');

        // Re-optimizar en resize (con throttle)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                optimizeBackgroundImages();
                optimizeHeroForMobile();
            }, 250);
        });
    }

    // Iniciar inmediatamente si el DOM ya está listo
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
