/* ===========================
   Canvas Hero Background
   =========================== */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

const PARTICLE_COUNT = 55;
const CONNECT_DIST    = 140;
const SPEED           = 0.25;

let particles = [];
let W = 0, H = 0;

function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}

class Particle {
    constructor() { this.init(); }

    init() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * SPEED;
        this.vy = (Math.random() - 0.5) * SPEED;
        this.r  = Math.random() * 1.2 + 0.5;
        this.o  = Math.random() * 0.35 + 0.08;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${this.o})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT_DIST) {
                const alpha = (1 - dist / CONNECT_DIST) * 0.14;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, W, H);

    // Subtle ambient glow on the left
    const grad = ctx.createRadialGradient(W * 0.15, H * 0.5, 0, W * 0.15, H * 0.5, W * 0.55);
    grad.addColorStop(0, 'rgba(10, 28, 52, 0.75)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize();
initParticles();
animate();


/* ===========================
   Typewriter
   =========================== */
const phrases = [
    'offensive consulting',
    'AI-augmented assessments',
    'vulnerability research',
    'red team operations',
];

let pIdx = 0, cIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
    const word = phrases[pIdx];

    if (!deleting) {
        typeEl.textContent = word.slice(0, ++cIdx);
        if (cIdx === word.length) {
            deleting = true;
            setTimeout(type, 2200);
            return;
        }
    } else {
        typeEl.textContent = word.slice(0, --cIdx);
        if (cIdx === 0) {
            deleting = false;
            pIdx = (pIdx + 1) % phrases.length;
        }
    }

    setTimeout(type, deleting ? 38 : 72);
}

setTimeout(type, 1600);


/* ===========================
   Navbar: scroll + active link
   =========================== */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 110) current = s.id;
    });

    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
}, { passive: true });


/* ===========================
   Mobile Menu
   =========================== */
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const hSpans     = hamburger.querySelectorAll('span');
let open = false;

function toggleMenu(state) {
    open = state;
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
        hSpans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        hSpans[1].style.opacity   = '0';
        hSpans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
        hSpans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
}

hamburger.addEventListener('click', () => toggleMenu(!open));

mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
});


/* ===========================
   Scroll Reveal
   =========================== */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
