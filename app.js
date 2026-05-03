// --- Voicy Web Client ---
const API = 'https://api.voicydroid.com';

// --- Theme ---
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// --- Hero Chat Box (redirects to /chat/ with pre-filled message) ---
const heroInput = document.getElementById('hero-input');
const heroSend  = document.getElementById('hero-send');

function sendFromHero() {
    const text = heroInput ? heroInput.value.trim() : '';
    if (text) {
        localStorage.setItem('voicy_pending_msg', text);
    }
    window.location.href = 'chat/';
}

if (heroSend)  heroSend.addEventListener('click', sendFromHero);
if (heroInput) heroInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendFromHero();
});

// --- System Status Polling ---
async function checkSystemHealth() {
    // Cloud API
    try {
        const resp = await fetch(API + '/health', { signal: AbortSignal.timeout(5000) });
        if (resp.ok) {
            document.getElementById('status-cloud').className = 'status-dot online';
        } else {
            document.getElementById('status-cloud').className = 'status-dot offline';
        }
    } catch {
        document.getElementById('status-cloud').className = 'status-dot offline';
    }

    // PC Bridge (only works on localhost)
    try {
        const resp = await fetch('http://localhost:8001/health', { signal: AbortSignal.timeout(3000) });
        if (resp.ok) {
            document.getElementById('status-pc').className = 'status-dot online';
            document.getElementById('status-bot').className = 'status-dot online';
        } else {
            document.getElementById('status-pc').className = 'status-dot offline';
            document.getElementById('status-bot').className = 'status-dot offline';
        }
    } catch {
        document.getElementById('status-pc').className = 'status-dot offline';
        document.getElementById('status-bot').className = 'status-dot offline';
    }
}

setInterval(checkSystemHealth, 30000);
checkSystemHealth();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});
