// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

function highlightNavItem() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - document.querySelector('header').offsetHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Hero section animations
document.addEventListener('DOMContentLoaded', function() {
    // Create dynamic particles for buttons (optional enhancement)
    function createButtonParticles(button) {
        const particles = button.querySelector('.btn-particles');
        if (!particles) return;
        
        particles.innerHTML = '';
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${2 + Math.random() * 3}s infinite linear;
                animation-delay: ${Math.random() * 2}s;
            `;
            particles.appendChild(particle);
        }
    }
    
    // Mouse follow effect for name (desktop only)
    if (window.innerWidth > 768) {
        const nameElements = document.querySelectorAll('.name-part');
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            nameElements.forEach((element, index) => {
                const speed = 0.05 + (index * 0.02);
                const x = (mouseX - 0.5) * 15 * speed;
                const y = (mouseY - 0.5) * 15 * speed;
                
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }
    
    // Typing effect for greeting
    function typeWriter(element, text, speed = 100) {
        if (!element) return;
        let i = 0;
        element.innerHTML = '';
        element.style.opacity = '1';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    setTimeout(() => {
        const greetingText = document.querySelector('.greeting-text');
        if (greetingText) {
            typeWriter(greetingText, 'Hi, I am', 80);
        }
    }, 500);
    
    // Interactive word highlighting (desktop only)
    if (window.innerWidth > 768) {
        const taglineWords = document.querySelectorAll('.tagline-word');
        taglineWords.forEach(word => {
            word.addEventListener('mouseenter', function() {
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(56, 189, 248, 0.3);
                    transform: translate(-50%, -50%);
                    animation: rippleEffect 0.6s ease-out;
                    pointer-events: none;
                    z-index: -1;
                `;
                
                if (!document.getElementById('ripple-animation')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-animation';
                    style.textContent = `
                        @keyframes rippleEffect {
                            to {
                                width: 100px;
                                height: 100px;
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });
    }
    
    // Button click effects with improved wave animation
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const wave = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            wave.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                top: ${e.clientY - rect.top - size/2}px;
                left: ${e.clientX - rect.left - size/2}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: waveEffect 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            if (!document.getElementById('wave-animation')) {
                const style = document.createElement('style');
                style.id = 'wave-animation';
                style.textContent = `
                    @keyframes waveEffect {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.appendChild(wave);
            
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, 600);
        });
    });
    
    // Parallax effect for floating icons (desktop only)
    if (window.innerWidth > 768) {
        function updateFloatingIcons() {
            const icons = document.querySelectorAll('.floating-icon');
            const scrollY = window.pageYOffset;
            
            icons.forEach((icon, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrollY * speed;
                icon.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        let heroTicking = false;
        function updateHeroOnScroll() {
            updateFloatingIcons();
            heroTicking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!heroTicking) {
                requestAnimationFrame(updateHeroOnScroll);
                heroTicking = true;
            }
        });
    }
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Sending...';
            submitBtn.disabled = true;
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            alert('There was an error sending your message. Please try again later.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('section:not(#hero), .experience-card, .project-card, .education-card, .skills-category');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            if (element.classList.contains('skills-category')) {
                const skillBars = element.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        }
    });
};

// Set initial state for animations
document.querySelectorAll('section:not(#hero), .experience-card, .project-card, .education-card, .skills-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Scroll event handlers
window.addEventListener('scroll', () => {
    highlightNavItem();
    animateOnScroll();
});

// Initial calls
highlightNavItem();
animateOnScroll();