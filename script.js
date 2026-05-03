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

    const revealElements = document.querySelectorAll('.solution-card, .pillar-item, .stat-item, h2, .who-top-branding, .who-text-content, .who-visual-content, .bento-card, .who-card, .service-card-glass, .testimonial-card-glass, .section-header, .reveal-item');
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
            // Close all other mega menus immediately
            megaItems.forEach(i => {
                if (i !== item) i.classList.remove('active');
            });
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

    // Close mega menus when hovering over non-mega nav items or logo
    const nonMegaLinks = document.querySelectorAll('.nav-links > li:not(.has-mega), .logo, .header-right');
    nonMegaLinks.forEach(el => {
        el.addEventListener('mouseenter', () => {
            megaItems.forEach(i => i.classList.remove('active'));
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

    // Testimonials Auto-scroll and Drag-to-Scroll
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (testimonialGrid) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoScrollInterval;

        const startAutoScroll = () => {
            stopAutoScroll(); 
            autoScrollInterval = setInterval(() => {
                if (!isDown) {
                    const firstCard = testimonialGrid.querySelector('.testimonial-card-glass');
                    if (!firstCard) return;
                    
                    const cardWidth = firstCard.offsetWidth + 24; 
                    const maxScroll = testimonialGrid.scrollWidth - testimonialGrid.clientWidth;
                    
                    if (testimonialGrid.scrollLeft >= maxScroll - 20) {
                        testimonialGrid.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        testimonialGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
                    }
                }
            }, 5000); 
        };

        const stopAutoScroll = () => clearInterval(autoScrollInterval);

        // Drag to scroll logic
        testimonialGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialGrid.classList.add('dragging');
            startX = e.pageX - testimonialGrid.offsetLeft;
            scrollLeft = testimonialGrid.scrollLeft;
            stopAutoScroll();
        });

        testimonialGrid.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                testimonialGrid.classList.remove('dragging');
                startAutoScroll();
            }
        });

        testimonialGrid.addEventListener('mouseup', () => {
            isDown = false;
            testimonialGrid.classList.remove('dragging');
            startAutoScroll();
        });

        testimonialGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialGrid.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialGrid.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        testimonialGrid.addEventListener('touchstart', stopAutoScroll);
        testimonialGrid.addEventListener('touchend', startAutoScroll);

        // Button controls
        const prevBtn = document.getElementById('testimonialPrev');
        const nextBtn = document.getElementById('testimonialNext');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = testimonialGrid.querySelector('.testimonial-card-glass').offsetWidth + 30;
                testimonialGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                stopAutoScroll();
                setTimeout(startAutoScroll, 3000); // Restart auto-scroll after a delay
            });

            nextBtn.addEventListener('click', () => {
                const cardWidth = testimonialGrid.querySelector('.testimonial-card-glass').offsetWidth + 30;
                testimonialGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
                stopAutoScroll();
                setTimeout(startAutoScroll, 3000);
            });
        }

        // Initialize auto-scroll
        startAutoScroll();
        
        // Pause on mouse enter
        testimonialGrid.addEventListener('mouseenter', () => {
            stopAutoScroll();
            testimonialGrid.style.cursor = 'grab';
        });
        
        testimonialGrid.addEventListener('mouseleave', () => {
            if (!isDown) startAutoScroll();
        });
    }

    // Close mega menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-mega')) {
            megaItems.forEach(i => i.classList.remove('active'));
        }
    });
});
