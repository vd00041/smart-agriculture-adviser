
import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { doc, setDoc }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


function validatePassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);
}

function togglePassword() {
    const input = document.getElementById("password");
    if (input) {
        input.type = input.type === "password" ? "text" : "password";
    }
}

async function signupUser(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    if (!validatePassword(password)) {
        alert(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        );
        return;
    }

    try {
        // 🔥 Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🔥 Save extra info in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email
        });

        alert("Signup successful! Please login.");
        window.location.href = "index.html";

    } catch (error) {
        alert(error.message);
    }
}


async function loginUser(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Keep your old localStorage logic
        localStorage.setItem("loggedInUser", JSON.stringify({
            uid: user.uid,
            email: user.email
        }));

        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "index.html";

    } catch (error) {
        alert(error.message);
    }
}

async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error logging out:", error);
    }

    localStorage.removeItem("loggedInUser");
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "home.html";
}

/**
 * Check if user is logged in
 * Returns the user session if logged in, null otherwise
 */
async function checkAuth() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify({
                    uid: user.uid,
                    email: user.email
                }));
                localStorage.setItem("isLoggedIn", "true");
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}

/**
 * Redirect to login if not authenticated
 */
async function requireAuth() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// Auto-check auth on page load (for protected pages)
document.addEventListener('DOMContentLoaded', async () => {
    // Only check if we're on a protected page
    const path = window.location.pathname;
    const protectedPages = ['dashboard.html', 'crops.html', 'map.html', 'index.html'];

    if (protectedPages.some(page => path.includes(page))) {
        await checkAuth();
    }
});
// Make functions available globally for HTML
window.signupUser = signupUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.togglePassword = togglePassword;


if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
