/**
 * SOLOMON'S LANDING - MOBILE MENU
 * Professional hamburger menu handler for mobile devices
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    function initMobileMenu() {
        // Only run on mobile devices
        if (window.innerWidth > 768) return;

        // Create hamburger button if it doesn't exist
        createHamburgerButton();
        
        // Create menu backdrop
        createMenuBackdrop();
        
        // Setup event listeners
        setupEventListeners();
        
        // Close menu on page load
        closeMenu();
    }

    function createHamburgerButton() {
        const header = document.querySelector('header');
        if (!header) return;

        // Check if hamburger already exists
        if (document.querySelector('.hamburger-menu')) return;

        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        header.insertBefore(hamburger, header.firstChild);
    }

    function createMenuBackdrop() {
        // Check if backdrop already exists
        if (document.querySelector('.menu-backdrop')) return;

        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.appendChild(backdrop);
    }

    function setupEventListeners() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('nav');
        const backdrop = document.querySelector('.menu-backdrop');
        const navLinks = document.querySelectorAll('nav a');

        if (!hamburger || !nav || !backdrop) return;

        // Toggle menu on hamburger click
        hamburger.addEventListener('click', toggleMenu);

        // Close menu on backdrop click
        backdrop.addEventListener('click', closeMenu);

        // Close menu on navigation link click
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            }, 250);
        });
    }

    function toggleMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('nav');
        const backdrop = document.querySelector('.menu-backdrop');

        if (!hamburger || !nav || !backdrop) return;

        const isActive = nav.classList.contains('active');

        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('nav');
        const backdrop = document.querySelector('.menu-backdrop');

        if (!hamburger || !nav || !backdrop) return;

        hamburger.classList.add('active');
        nav.classList.add('active');
        backdrop.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('nav');
        const backdrop = document.querySelector('.menu-backdrop');

        if (!hamburger || !nav || !backdrop) return;

        hamburger.classList.remove('active');
        nav.classList.remove('active');
        backdrop.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Expose functions globally if needed
    window.SolomonsMobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu
    };
})();
