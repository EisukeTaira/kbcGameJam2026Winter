document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    /* --- Carousel Logic --- */
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');

        let currentIndex = 0;
        let slidesPerView = window.innerWidth <= 768 ? 1 : 3;
        const totalSlides = slides.length;

        function updateCarousel() {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const gap = 20; // Needs to match CSS gap
            const moveAmount = (slideWidth + gap) * currentIndex;

            track.style.transform = `translateX(-${moveAmount}px)`;

            // Update center focus class
            slides.forEach(s => s.classList.remove('center-focus'));

            let centerIndex = currentIndex;
            if (slidesPerView > 1) {
                // In 3-item view, center is middle visible slide
                centerIndex = currentIndex + 1;
            }

            if (slides[centerIndex]) {
                slides[centerIndex].classList.add('center-focus');
            }

            // Navigation status
            if (prevButton && nextButton) {
                prevButton.style.opacity = currentIndex === 0 ? '0.3' : '1';
                prevButton.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

                const maxIndex = totalSlides - slidesPerView;
                nextButton.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
                nextButton.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
            }
        }

        // Initialize
        updateCarousel();

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const maxIndex = totalSlides - slidesPerView;
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        window.addEventListener('resize', () => {
            slidesPerView = window.innerWidth <= 768 ? 1 : 3;
            const maxIndex = totalSlides - slidesPerView;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel();
        });

        /* --- Lightbox Logic --- */
        const lightbox = document.getElementById('lightbox');
        const lightboxImgContainer = document.querySelector('.lightbox-img-container');
        const closeBtn = document.querySelector('.lightbox-close');

        if (lightbox && lightboxImgContainer) {
            slides.forEach(slide => {
                slide.addEventListener('click', () => {
                    // Ignore spacer clicks
                    if (slide.classList.contains('spacer')) return;

                    const content = slide.innerHTML;
                    lightboxImgContainer.innerHTML = content;
                    lightbox.classList.add('active');
                });
            });

            closeBtn?.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    lightbox.classList.remove('active');
                }
            });
        }
    }
});
