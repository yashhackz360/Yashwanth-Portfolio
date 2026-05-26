/* ============================================================
   SKILLS.JS — Filter bar (All / Core Only) + pill stagger-in
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pills      = document.querySelectorAll('.skill-pill');

    // Filter logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            pills.forEach((pill, i) => {
                const tier = pill.dataset.tier;
                const show = filter === 'all' || tier === 'core';

                if (show) {
                    pill.classList.remove('hidden');
                    // Stagger re-entry
                    pill.style.animationDelay = (i * 0.03) + 's';
                    pill.style.animation = 'pillIn 0.3s ease both';
                } else {
                    pill.classList.add('hidden');
                    pill.style.animation = '';
                }
            });
        });
    });

    // Stagger-in when skills section enters view
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const staggerObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;

        pills.forEach((pill, i) => {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(10px) scale(0.92)';
            setTimeout(() => {
                pill.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                pill.style.opacity    = '';
                pill.style.transform  = '';
            }, 60 + i * 28);
        });

        staggerObserver.unobserve(skillsSection);
    }, { threshold: 0.15 });

    staggerObserver.observe(skillsSection);
});
