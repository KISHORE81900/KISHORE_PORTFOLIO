document.addEventListener("DOMContentLoaded", () => {
  // Gold particle background
  const canvas = document.createElement("canvas");
  canvas.id = "gold-particles";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.5,
    speedY: Math.random() * 0.55 + 0.15,
    speedX: Math.random() * 0.25 - 0.125,
    opacity: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (!reducedMotion) {
        p.y += p.speedY;
        p.x += p.speedX;
      }
      if (p.y > height + 5) { p.y = -5; p.x = Math.random() * width; }
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
      ctx.fill();
    }
    if (!reducedMotion) animationFrame = requestAnimationFrame(animate);
  }
  animate();

  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  // Current year in footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Contact form: Formspree handles delivery. Do not claim success before server confirms.
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", (event) => {
      const endpoint = form.getAttribute("action") || "";
      if (endpoint.includes("YOUR_FORM_ID")) {
        event.preventDefault();
        status.textContent = "Contact form setup pending: replace YOUR_FORM_ID with your Formspree form ID.";
      }
    });
  }

  // Avoid an unused animation loop if the page is being hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animationFrame) cancelAnimationFrame(animationFrame);
    else if (!document.hidden && !reducedMotion) animate();
  });
});
