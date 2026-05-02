document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, .solution-card, .stat-item, .faq-item, .who-card, .service-card-glass, .testimonial-card-glass');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.querySelector('header').appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Enhanced Reveal on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.solution-card, .pillar-item, .stat-item, h2, .who-text, .who-visual, .bento-card, .who-card, .service-card-glass, .testimonial-card-glass, .section-header');
    revealElements.forEach((el, index) => {
        el.classList.add('reveal-item');
        el.style.transitionDelay = (index % 3) * 0.1 + 's';
        observer.observe(el);
    });

    // FAQ Accordion - Toggle on Click
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-toggle').className = 'fas fa-plus faq-toggle';
            });

            if (!isOpen) {
                item.classList.add('active');
                toggle.className = 'fas fa-minus faq-toggle';
            }
        });
    });

    // Header Glow on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.borderBottom = '1px solid var(--accent-color)';
            header.style.boxShadow = '0 10px 40px rgba(0, 45, 91, 0.08)';
        } else {
            header.style.borderBottom = '1px solid rgba(0, 45, 91, 0.05)';
            header.style.boxShadow = 'none';
        }
    });

    // Mega Menu Enhanced Logic
    const megaItems = document.querySelectorAll('.has-mega');
    
    megaItems.forEach(item => {
        const link = item.querySelector('a');
        let closeTimeout;

        // Desktop Hover with Delay
        item.addEventListener('mouseenter', () => {
            clearTimeout(closeTimeout);
            item.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            closeTimeout = setTimeout(() => {
                item.classList.remove('active');
            }, 200); // 200ms delay to prevent flickering
        });

        // Mobile Click Handling
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                const isOpen = item.classList.contains('active');
                
                // Close others
                megaItems.forEach(i => i.classList.remove('active'));
                
                if (!isOpen) {
                    item.classList.add('active');
                }
            }
        });

        // Accessibility - Keyboard Navigation
        link.addEventListener('focus', () => {
            megaItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                megaItems.forEach(i => i.classList.remove('active'));
            }
        });
    });

    // Vertical Hero Slider Logic
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active", "prev");
            if (i === index) {
                slide.classList.add("active");
            } else if (i < index) {
                slide.classList.add("prev");
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
        
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    if (slides.length > 0) {
        let autoSlide = setInterval(nextSlide, slideInterval);

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                clearInterval(autoSlide);
                showSlide(index);
                autoSlide = setInterval(nextSlide, slideInterval);
            });
        });
    }

    // Close mega menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-mega')) {
            megaItems.forEach(i => i.classList.remove('active'));
        }
    });
});
