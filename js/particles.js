// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 60, "density": { "enable": true, "value_area": 1000 } },
            "color": { "value": "#38bdf8" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.3, "random": true },
            "size": { "value": 2, "random": true },
            "line_linked": { "enable": true, "distance": 120, "color": "#38bdf8", "opacity": 0.2, "width": 1 },
            "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "repulse" },
                "onclick": { "enable": true, "mode": "push" }
            }
        }
    });
    
    // Adjust particle count for mobile
    if (window.innerWidth <= 768 && window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.particles.number.value = 30;
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
});