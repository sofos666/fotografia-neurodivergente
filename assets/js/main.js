/**
 * White Premium Gallery v7
 * Session Cards (not modules) + Bidirectional Scroll + Modal
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. BIDIRECTIONAL SCROLL ANIMATIONS
    ========================================== */
    const fadeElements = document.querySelectorAll('.fade-scroll');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden-up');
            } else {
                const boundingRect = entry.boundingClientRect;

                if (boundingRect.top < 0) {
                    entry.target.classList.add('hidden-up');
                    entry.target.classList.remove('visible');
                } else {
                    entry.target.classList.remove('visible');
                    entry.target.classList.remove('hidden-up');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.15
    });

    fadeElements.forEach(el => scrollObserver.observe(el));


    /* ==========================================
       2. SESSION CARD TOGGLE (Mobile Only)
       Changed from .module-card to .session-card
    ========================================== */
    const sessionCards = document.querySelectorAll('.session-card');
    const isMobile = window.innerWidth < 768;

    sessionCards.forEach(card => {
        const titleBar = card.querySelector('.session-title-bar');

        if (titleBar) {
            titleBar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSession(card);
            });
        }
    });

    function toggleSession(card) {
        const isActive = card.classList.contains('active');

        // Close all others (accordion)
        sessionCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove('active');
            }
        });

        // Toggle current
        if (isActive) {
            card.classList.remove('active');
            // Hide scroll indicator
            const indicator = card.querySelector('.scroll-indicator');
            if (indicator) indicator.classList.add('hidden');
        } else {
            card.classList.add('active');

            // Reset content scroll to top so user starts reading from beginning
            const contentOverlay = card.querySelector('.session-content-overlay');
            const scrollIndicator = card.querySelector('.scroll-indicator');

            if (contentOverlay) {
                contentOverlay.scrollTop = 0;

                // Show indicator
                if (scrollIndicator) {
                    scrollIndicator.classList.remove('hidden');
                }

                // Listen for scroll to hide indicator at bottom
                contentOverlay.addEventListener('scroll', function checkScroll() {
                    const isAtBottom = contentOverlay.scrollHeight - contentOverlay.scrollTop <= contentOverlay.clientHeight + 20;
                    if (scrollIndicator) {
                        if (isAtBottom) {
                            scrollIndicator.classList.add('hidden');
                        } else {
                            scrollIndicator.classList.remove('hidden');
                        }
                    }
                });
            }

            // Scroll to the card so the content is visible at the top
            setTimeout(() => {
                const cardRect = card.getBoundingClientRect();
                const scrollTop = window.pageYOffset + cardRect.top - 20;

                window.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }, 150);
        }
    }

    // Close session when clicking outside (mobile)
    if (isMobile) {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.session-card')) {
                sessionCards.forEach(card => card.classList.remove('active'));
            }
        });
    }


    /* ==========================================
       3. QUIZ MODAL
    ========================================== */
    const openBtn = document.getElementById('openQuizModal');
    const modal = document.getElementById('quizModal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const quizForm = document.getElementById('quizForm');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Quiz → WhatsApp
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(quizForm);
            const answers = [];

            for (let [key, value] of formData.entries()) {
                answers.push(`${key}: ${value}`);
            }

            const message = encodeURIComponent(
                `Hola, completé la encuesta de nivel:\n\n${answers.join('\n')}\n\nMe gustaría agendar una consulta.`
            );

            const waUrl = `https://wa.me/573014975393?text=${message}`;

            closeModal();
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }


    /* ==========================================
       4. NAVBAR SCROLL EFFECT
    ========================================== */
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                navbar.style.background = 'rgba(0,0,0,0.5)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.backdropFilter = 'none';
            }
        }, { passive: true });
    }

});
