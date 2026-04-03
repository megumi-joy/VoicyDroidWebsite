// --- Theme Management ---
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// --- Supabase Configuration ---
// These should be replaced with the actual values from the user's Supabase dashboard
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

let supabase = null;
try {
    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Initialized.");
} catch (e) {
    console.warn("Supabase initialization skipped - missing config.");
}

// --- Scroll Reveal Animation ---
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-reveal').forEach(el => {
    observer.observe(el);
});

// --- Auth Logic ---
const loginBtn = document.getElementById('login-btn');

if (loginBtn && supabase) {
    loginBtn.addEventListener('click', async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            console.error("Auth Error:", error.message);
            alert("Login failed: " + error.message);
        }
    });

    // Handle session
    supabase.auth.onAuthStateChanged((event, session) => {
        if (session) {
            console.log("User signed in:", session.user);
            loginBtn.innerText = "Premium Account: " + session.user.email.split('@')[0];
            loginBtn.classList.add('premium');
        } else {
            loginBtn.innerText = "Sign In / Google";
        }
    });
}

// --- Demo Interaction Placeholder ---
document.querySelector('.demo-placeholder button').addEventListener('click', function () {
    const statusText = document.querySelector('.demo-placeholder p');
    const loader = document.querySelector('.loader');

    this.style.display = 'none';
    statusText.innerText = "Syncing with Local Node...";
    loader.style.borderBottomColor = "#00b0ff";

    setTimeout(() => {
        statusText.innerHTML = "Neural Link Established. <br><span style='color: var(--accent)'>VOICY ONLINE.</span>";
        loader.style.display = 'none';

        // Show a "Speak" prompt
        const prompt = document.createElement('div');
        prompt.className = 'glass-panel';
        prompt.innerHTML = "<p style='font-family: JetBrains Mono'>[AI]: Hello. I am Voicy. How can I assist you today?</p>";
        document.querySelector('.demo-placeholder').appendChild(prompt);
    }, 2000);
});

// Smooth Scroll Offset for Nav
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
