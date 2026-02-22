// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAEaES9D8V8Bb75XaM0Ez0YNpFl5SLcjGU",
    authDomain: "agrosense-26957.firebaseapp.com",
    projectId: "agrosense-26957",
    storageBucket: "agrosense-26957.firebasestorage.app",
    messagingSenderId: "443884554356",
    appId: "1:443884554356:web:26ca9189dbb7d41b482921"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
