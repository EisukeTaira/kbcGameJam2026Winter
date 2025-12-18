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
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
});

/* Carousel Logic */
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');

let currentIndex = 0;
let slidesPerView = window.innerWidth <= 768 ? 1 : 3;
const totalSlides = slides.length;

function updateCarousel() {
    // Recalculate move amount based on item width including gap
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 20; // Matches CSS gap
    const moveAmount = (slideWidth + gap) * currentIndex;

    track.style.transform = 'translateX(-' + moveAmount + 'px)';

    // Update center focus class
    slides.forEach(s => s.classList.remove('center-focus'));

    let centerIndex = currentIndex;
    if (slidesPerView > 1) {
        // In 3-item view, the center one is the second one visible (index + 1)
        centerIndex = currentIndex + 1;
    }
    // Only apply if valid index
    if (slides[centerIndex]) {
        slides[centerIndex].classList.add('center-focus');
    }

    // Button visibility
    prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevButton.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
    prevButton.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

    const maxIndex = totalSlides - slidesPerView;
    nextButton.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    nextButton.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    nextButton.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
}

// Initial call to set classes
// Wait for layout to ensure width is correct? requestAnimationFrame usually helps but simple timeout or just call is fine for static template
// Better: call it after a short delay or if images load. For now, immediate call.
updateCarousel();

nextButton.addEventListener('click', () => {
    const maxIndex = totalSlides - slidesPerView;
    if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
    }
});

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

// Update on resize
window.addEventListener('resize', () => {
    slidesPerView = window.innerWidth <= 768 ? 1 : 3;
    // Cap index if resizing makes it out of bounds
    const maxIndex = totalSlides - slidesPerView;
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    updateCarousel();
});


/* Lightbox Logic */
const lightbox = document.getElementById('lightbox');
const lightboxImgContainer = document.querySelector('.lightbox-img-container');
const closeBtn = document.querySelector('.lightbox-close');

// Open lightbox on slide click
slides.forEach(slide => {
    slide.addEventListener('click', () => {
        const content = slide.innerHTML;
        lightboxImgContainer.innerHTML = content;
        lightbox.classList.add('active');
    });
});

// Close functionality
closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
    }
});

