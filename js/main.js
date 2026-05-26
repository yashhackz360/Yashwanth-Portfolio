/* ============================================================
   MAIN.JS — Navigation, progress bar, scroll reveals, hero FX
   ============================================================ */

'use strict';

// ── Page Progress Bar ────────────────────────────────────────
const progressBar = document.getElementById('pageProgress');

function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.body.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
        progressBar.style.width = pct.toFixed(1) + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(pct));
    }
}

// ── Header scroll state ──────────────────────────────────────
const header        = document.getElementById('mainHeader');
const scrollIndicator = document.getElementById('scrollIndicator');

function updateHeader() {
    const scrolled = window.scrollY > 60;
    header?.classList.toggle('scrolled', scrolled);
    scrollIndicator?.classList.toggle('hidden', window.scrollY > 120);
}

// ── Active nav link ──────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function highlightNav() {
    const offset = (header?.offsetHeight ?? 72) + 24;
    let current  = '';

    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - offset) {
            current = sec.id;
        }
    });

    navLinks.forEach(link => {
        const active = link.dataset.section === current;
        link.classList.toggle('active', active);
    });
}

// ── Throttled scroll handler ─────────────────────────────────
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateProgress();
            updateHeader();
            highlightNav();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Initial call
updateProgress();
updateHeader();
highlightNav();

// ── Mobile menu ──────────────────────────────────────────────
const menuBtn  = document.getElementById('mobileMenuBtn');
const navPanel = document.getElementById('navLinks');

menuBtn?.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
navPanel?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navPanel.classList.remove('open');
        menuBtn?.classList.remove('open');
        menuBtn?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Close on outside tap
document.addEventListener('click', e => {
    if (navPanel?.classList.contains('open') &&
        !navPanel.contains(e.target) &&
        !menuBtn?.contains(e.target)) {
        navPanel.classList.remove('open');
        menuBtn?.classList.remove('open');
        menuBtn?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Scroll indicator keyboard/click
scrollIndicator?.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
scrollIndicator?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Scroll Reveal (IntersectionObserver) ─────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Hero: mouse parallax on name (desktop) ───────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 900) {
        const nameParts = document.querySelectorAll('.name-part');
        document.addEventListener('mousemove', e => {
            const mx = (e.clientX / window.innerWidth  - 0.5);
            const my = (e.clientY / window.innerHeight - 0.5);
            nameParts.forEach((el, i) => {
                const speed = 0.04 + i * 0.015;
                el.style.textShadow =
                    `${mx * 8 * speed}px ${my * 8 * speed}px 20px rgba(56,189,248,0.15)`;
            });
        });
    }

    // Typewriter on greeting
    const greetingEl = document.querySelector('.greeting-text');
    if (greetingEl) {
        greetingEl.textContent = '';
        const text   = 'Hi, I am';
        let   i      = 0;
        const type   = () => {
            if (i < text.length) {
                greetingEl.textContent += text[i++];
                setTimeout(type, 75);
            }
        };
        setTimeout(type, 400);
    }

    // Button ripple effect
    document.querySelectorAll('.btn, .contact-submit-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const wave = document.createElement('span');
            wave.style.cssText = `
                position:absolute; pointer-events:none; z-index:1;
                width:${size}px; height:${size}px; border-radius:50%;
                background:rgba(255,255,255,0.25);
                top:${e.clientY - rect.top - size/2}px;
                left:${e.clientX - rect.left - size/2}px;
                transform:scale(0); animation:waveEffect 0.55s ease-out forwards;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(wave);
            setTimeout(() => wave.remove(), 600);
        });
    });

    // Education arc animations
    const arcObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const circle  = entry.target.querySelector('.score-arc-fill');
            const pct     = Number(circle?.dataset.score ?? 0);
            const r       = 30;
            const circum  = 2 * Math.PI * r;          // ≈ 188.5
            const offset  = circum * (1 - pct / 100);
            if (circle) {
                circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s';
                circle.style.strokeDashoffset = offset;
            }
            arcObserver.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.score-arc-wrap').forEach(el => arcObserver.observe(el));

    // Semester progress fill trigger (on scroll into view)
    const progressFill = document.querySelector('.semester-progress-fill');
    if (progressFill) {
        const progObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                progressFill.style.width = progressFill.style.getPropertyValue('--progress-width') || '87.5%';
                progObserver.disconnect();
            }
        }, { threshold: 0.5 });
        progObserver.observe(progressFill);
        // Set initial width to 0 so it animates in
        progressFill.style.width = '0%';
        setTimeout(() => {
            progObserver.observe(progressFill.closest('.edu-featured') || progressFill);
        }, 100);
    }
});