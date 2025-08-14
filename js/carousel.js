// Enhanced Experience Carousel with Better Arrow Visibility
function initExperienceCarousel() {
    const carousel = document.querySelector('.experience-carousel');
    if (!carousel) return;
    
    const container = carousel.querySelector('.carousel-container');
    const cards = carousel.querySelectorAll('.experience-card');
    const prevBtn = carousel.querySelector('.carousel-nav.prev');
    const nextBtn = carousel.querySelector('.carousel-nav.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    // Create navigation dots
    function createDots() {
        dotsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
    }
    
    createDots();
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // width + gap
    
    function goToSlide(index) {
        currentIndex = index;
        container.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        updateDots();
        updateArrows();
    }
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function updateArrows() {
        // Show/hide arrows based on position
        if (prevBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
            prevBtn.disabled = currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.style.opacity = currentIndex === cards.length - 1 ? '0.5' : '1';
            nextBtn.style.cursor = currentIndex === cards.length - 1 ? 'not-allowed' : 'pointer';
            nextBtn.disabled = currentIndex === cards.length - 1;
        }
    }
    
    function nextSlide() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            goToSlide(currentIndex);
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            goToSlide(currentIndex);
        }
    }
    
    // Button events
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        prevBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                prevSlide();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        nextBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                nextSlide();
            }
        });
    }
    
    // Keyboard navigation
    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Auto-scroll on mobile if not interacted with
    let autoScrollInterval;
    let userInteracted = false;
    
    function startAutoScroll() {
        if (window.innerWidth <= 768 && !userInteracted) {
            autoScrollInterval = setInterval(() => {
                if (currentIndex < cards.length - 1) {
                    nextSlide();
                } else {
                    goToSlide(0);
                }
            }, 5000);
        }
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Mark interaction when user interacts with carousel
    const interactionEvents = ['mousedown', 'touchstart', 'keydown'];
    interactionEvents.forEach(event => {
        container.addEventListener(event, () => {
            userInteracted = true;
            stopAutoScroll();
        });
    });
    
    // Initialize
    updateArrows();
    startAutoScroll();
    
    // Pause auto-scroll when hovering (desktop only)
    if (window.innerWidth > 768) {
        container.addEventListener('mouseenter', stopAutoScroll);
        container.addEventListener('mouseleave', () => {
            if (!userInteracted) startAutoScroll();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initExperienceCarousel);