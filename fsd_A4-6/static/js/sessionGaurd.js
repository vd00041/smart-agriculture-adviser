/**
 * AgroSense Session Guard
 * Protects routes and handles authentication state
 */

(async function () {
    const path = window.location.pathname;

    try {
        // Check if database is available and get session
        let isLoggedIn = false;
        if (typeof AGROSENSE_DB !== 'undefined') {
            const session = await AGROSENSE_DB.getCurrentSession();
            isLoggedIn = session !== undefined;

            // Sync with localStorage for backward compatibility
            if (isLoggedIn) {
                localStorage.setItem("isLoggedIn", "true");
            }
        } else {
            // Fallback to localStorage if database not loaded yet
            isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        }

        // 🚫 Logged-in user should NOT access guest home
        if (isLoggedIn && path.includes("home.html") && !path.includes("index")) {
            window.location.replace("index.html");
        }

        // 🚫 Guest should NOT access logged-in pages
        if (!isLoggedIn && (
            path.includes("index.html") ||
            path.includes("dashboard") ||
            path.includes("map") ||
            path.includes("crops")
        )) {
            window.location.replace("home.html");
        }
    } catch (error) {
        console.error("Session guard error:", error);
        // Fallback to localStorage check
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (isLoggedIn && path.includes("home.html") && !path.includes("index")) {
            window.location.replace("index.html");
        }

        if (!isLoggedIn && (
            path.includes("index.html") ||
            path.includes("dashboard") ||
            path.includes("map") ||
            path.includes("crops")
        )) {
            window.location.replace("home.html");
        }
    }
})();
