/* ============================================================
   CONTACT.JS — Float-label validation, form submission, badge
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ── EmailJS Initialisation ──────────────────────────────
    // TODO: Replace with your EmailJS credentials
    // Sign up free at https://emailjs.com (200 emails/month)
    // Then fill in the three values below:
    const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // TODO
    const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // TODO
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // TODO

    if (typeof emailjs !== 'undefined' &&
        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // ── Form elements ───────────────────────────────────────
    const form        = document.getElementById('contactForm');
    const statusEl    = document.getElementById('formStatus');
    const submitBtn   = document.getElementById('submitBtn');
    const btnLabel    = submitBtn?.querySelector('.btn-label');
    const btnLoading  = submitBtn?.querySelector('.btn-loading');

    // ── Real-time field validation ───────────────────────────
    const fields = {
        'contact-name': {
            validate : v => v.trim().length >= 2,
            message  : '✕  Please enter your name (at least 2 characters)',
        },
        'contact-email': {
            validate : v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            message  : '✕  Please enter a valid email address',
        },
        'contact-message': {
            validate : v => v.trim().length >= 10,
            message  : '✕  Message should be at least 10 characters',
        },
    };

    Object.entries(fields).forEach(([id, rule]) => {
        const input = document.getElementById(id);
        if (!input) return;

        const iconEl = input.closest('.float-field')?.querySelector('.field-icon');

        function validate() {
            const ok = rule.validate(input.value);
            input.classList.toggle('valid',   ok);
            input.classList.toggle('invalid', !ok && input.value.length > 0);
            if (iconEl) {
                if (ok) {
                    iconEl.textContent = '✓';
                    iconEl.style.color = 'var(--success)';
                } else if (input.value.length > 0) {
                    iconEl.textContent = '✕';
                    iconEl.style.color = 'var(--error)';
                } else {
                    iconEl.textContent = '';
                }
            }
        }

        input.addEventListener('input',  validate);
        input.addEventListener('blur',   validate);
    });

    // ── Status helpers ───────────────────────────────────────
    function showStatus(type, msg) {
        if (!statusEl) return;
        statusEl.className = 'form-status ' + type;
        statusEl.innerHTML = msg;
    }

    function clearStatus() {
        if (!statusEl) return;
        statusEl.className = 'form-status';
        statusEl.innerHTML = '';
    }

    function setLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        if (btnLabel)   btnLabel.style.display   = loading ? 'none'  : '';
        if (btnLoading) btnLoading.style.display  = loading ? ''      : 'none';
    }

    // ── Form submission ──────────────────────────────────────
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearStatus();

        // Run validation
        let valid = true;
        Object.entries(fields).forEach(([id, rule]) => {
            const input = document.getElementById(id);
            if (input && !rule.validate(input.value)) {
                valid = false;
                input.classList.add('invalid');
                input.focus();
            }
        });

        if (!valid) {
            showStatus('error', '<i class="fas fa-exclamation-circle"></i> Please fix the highlighted fields above.');
            return;
        }

        setLoading(true);

        try {
            // If EmailJS is configured, send via SDK
            if (typeof emailjs !== 'undefined' &&
                EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {

                await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
                showStatus('success',
                    '<i class="fas fa-check-circle"></i> Message sent! I\'ll get back to you soon.');
                form.reset();
                // Clear validation icons
                document.querySelectorAll('.field-icon').forEach(el => { el.textContent = ''; });
                document.querySelectorAll('.float-field input, .float-field textarea')
                    .forEach(el => el.classList.remove('valid', 'invalid'));

            } else {
                // EmailJS not yet configured — show friendly notice
                await new Promise(r => setTimeout(r, 800));
                showStatus('error',
                    '<i class="fas fa-info-circle"></i> ' +
                    'Contact form is not yet connected. Please email me directly at ' +
                    '<a href="mailto:yashwanthsaikasarabada@gmail.com" ' +
                    'style="color:var(--accent);text-decoration:underline">' +
                    'yashwanthsaikasarabada@gmail.com</a>');
            }
        } catch (err) {
            console.error('EmailJS error:', err);
            showStatus('error',
                '<i class="fas fa-times-circle"></i> Failed to send — please try again or email me directly.');
        } finally {
            setLoading(false);
        }
    });

    // ── Read-more toggle (About section) ─────────────────────
    const readMoreBtn  = document.getElementById('readMoreBtn');
    const bioExtra     = document.getElementById('bioExtra');
    const readMoreLbl  = readMoreBtn?.querySelector('.read-more-label');

    readMoreBtn?.addEventListener('click', () => {
        const expanded = bioExtra?.classList.toggle('expanded');
        readMoreBtn.setAttribute('aria-expanded', expanded);
        if (readMoreLbl) readMoreLbl.textContent = expanded ? 'Show less' : 'Read more';
    });

});
