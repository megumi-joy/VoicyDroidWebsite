// --- Theme Management ---
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark for Solarpunk feel

if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
} else {
    document.body.removeAttribute('data-theme');
}

themeToggle.addEventListener('click', () => {
    let theme = document.body.getAttribute('data-theme');
    if (theme === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// --- Supabase / Auth Mock ---
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        alert("Google Login triggered. Redirecting to Supabase...");
    });
}

// --- Demo Interaction (Minimalist Style) ---
const demoBtn = document.querySelector('.quick-actions button:nth-child(2)'); // Try WebGL Terminal
if (demoBtn) {
    demoBtn.addEventListener('click', () => {
        console.log("Navigating to WebGL Demo...");
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Mock Chat Input Logic
const chatInput = document.querySelector('.chat-box-mock input');
if (chatInput) {
    // Just a placeholder since it's disabled in the landing page
    chatInput.placeholder = "Neural Link Active. Use Launcher to Message.";
}
