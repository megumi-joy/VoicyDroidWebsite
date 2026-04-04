// --- Firebase Configuration (Phase 16 Reality) ---
// These values will be populated from your .env after real deployment
const firebaseConfig = {
    apiKey: "REPLACE_WITH_REAL_API_KEY",
    authDomain: "REPLACE_WITH_REAL_DOMAIN",
    projectId: "REPLACE_WITH_REAL_PROJECT_ID",
    storageBucket: "REPLACE_WITH_REAL_BUCKET",
    messagingSenderId: "REPLACE_WITH_REAL_SENDER",
    appId: "REPLACE_WITH_REAL_APP_ID"
};

// Initialize Firebase
let app, auth, db;
try {
    if (firebaseConfig.apiKey !== "REPLACE_WITH_REAL_API_KEY") {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase Reality Link Active.");
    }
} catch (e) {
    console.warn("Firebase initialization skipped - missing config.");
}

// --- Theme Management ---
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    let theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// --- Auth Handling ---
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        if (!auth) {
            alert("No real Firebase keys detected. Please fill out .env and re-deploy.");
            return;
        }
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            alert("Auth failed: " + error.message);
        }
    });

    if (auth) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                loginBtn.innerText = "Premium: " + user.displayName;
                loginBtn.classList.add('premium');

                // Fetch real credits from Firestore
                const billingAmount = document.querySelector('.billing-container .amount');
                if (billingAmount) {
                    const doc = await db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        billingAmount.innerText = "$" + doc.data().credits.toFixed(2);
                    }
                }
            } else {
                loginBtn.innerText = "Sign In / Google";
                loginBtn.classList.remove('premium');
            }
        });
    }
}

// --- Demo Interaction ---
const demoBtn = document.querySelector('.quick-actions button:nth-child(2)');
if (demoBtn) {
    demoBtn.addEventListener('click', () => {
        window.location.href = 'demo/';
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
