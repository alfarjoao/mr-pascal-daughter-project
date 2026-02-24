/**
 * Mobile Navigation Menu
 * Handles hamburger menu toggle and smooth scrolling
 */

(function() {
    'use strict';

    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    // State
    let isMenuOpen = false;

    /**
     * Open mobile menu
     */
    function openMenu() {
        isMenuOpen = true;
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuBtn.classList.add('active');
        body.classList.add('mobile-menu-open');
        
        // Animate links with stagger
        mobileNavLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }

    /**
     * Close mobile menu
     */
    function closeMenu() {
        isMenuOpen = false;
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        body.classList.remove('mobile-menu-open');
    }

    /**
     * Toggle mobile menu
     */
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Smooth scroll to section
     */
    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Handle navigation link clicks
     */
    function handleNavLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Only handle internal links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            // Close menu first
            closeMenu();
            
            // Scroll after menu closes
            setTimeout(() => {
                smoothScrollTo(href);
            }, 400);
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Menu button click
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMenu);
        }

        // Close button click
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMenu);
        }

        // Overlay click
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMenu);
        }

        // Navigation links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

        // Close menu on window resize to desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && isMenuOpen) {
                    closeMenu();
                }
            }, 250);
        });
    }

    /**
     * Initialize
     */
    function init() {
        setupEventListeners();
        console.log('📱 Mobile navigation initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
