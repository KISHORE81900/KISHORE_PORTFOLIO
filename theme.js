// Loaded in <head> so the saved theme is applied before the page paints (no flash)
const THEMES = ["ocean", "light", "sunset", "forest"];
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
const startTheme = THEMES.includes(saved)
    ? saved
    : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "ocean");
document.documentElement.dataset.theme = startTheme;

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const dots = document.querySelectorAll(".dot");
    const mark = t => dots.forEach(d => d.setAttribute("aria-pressed", String(d.dataset.t === t)));
    mark(startTheme);

    dots.forEach(dot => dot.addEventListener("click", () => {
        root.classList.add("theme-anim");
        root.dataset.theme = dot.dataset.t;
        mark(dot.dataset.t);
        try { localStorage.setItem("theme", dot.dataset.t); } catch (e) {}
        setTimeout(() => root.classList.remove("theme-anim"), 600);
    }));
});
