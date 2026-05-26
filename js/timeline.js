/* ============================================================
   TIMELINE.JS — Vertical experience timeline scroll reveal
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const timelineLine  = document.getElementById('timelineLine');
    const timelineWrap  = document.getElementById('experienceTimeline');

    if (!timelineWrap || !timelineLine) return;

    // Progressive line draw: fires when the timeline container enters view
    const lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timelineLine.classList.add('drawn');
                lineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    lineObserver.observe(timelineWrap);

    // Keyboard navigation between cards (Arrow Up/Down)
    const cards = timelineWrap.querySelectorAll('.timeline-card');
    cards.forEach((card, i) => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' && cards[i + 1]) {
                e.preventDefault();
                cards[i + 1].focus();
                cards[i + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (e.key === 'ArrowUp' && cards[i - 1]) {
                e.preventDefault();
                cards[i - 1].focus();
                cards[i - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});
