const THEME_KEY = "tritix_theme";

/* =========================
   THEME STORAGE
========================= */

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        console.error("Error saving theme:", error);
    }
}

function loadTheme() {
    try {
        return localStorage.getItem(THEME_KEY) || "dark";
    } catch (error) {
        console.error("Error loading theme:", error);
        return "dark";
    }
}

/* =========================
   OPTIONAL HELPERS
========================= */

function clearTheme() {
    localStorage.removeItem(THEME_KEY);
}