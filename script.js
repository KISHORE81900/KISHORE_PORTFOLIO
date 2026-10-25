
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // PROFESSIONAL GOLDEN FIRE EMBERS BACKGROUND
    // ==========================================

    const canvas = document.createElement("canvas");
    canvas.id = "gold-particles";
    canvas.setAttribute("aria-hidden", "true");

    Object.assign(canvas.style, {
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "0",
        display: "block"
    });

    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    if (ctx) {
        let width = 0;
        let height = 0;
        let animationFrame = null;
        let particles = [];

        const reducedMotion = false;

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(
                100,
                Math.max(35, Math.floor((width * height) / 14000))
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.5,
                speedY: Math.random() * 0.9 + 0.3,
                speedX: (Math.random() - 0.5) * 0.6,
                opacity: Math.random() * 0.55 + 0.2,
                phase: Math.random() * Math.PI * 2,
                bright: Math.random() > 0.82
            }));
        }

        function animateParticles() {
            if (document.hidden) {
                animationFrame = null;
                return;
            }

            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.phase += 0.045;

                const glow = p.opacity *
                    (0.65 + Math.sin(p.phase) * 0.35);

                // Glowing fire ember
                ctx.beginPath();
                ctx.fillStyle = p.bright
                    ? `rgba(255, 195, 85, ${glow})`
                    : `rgba(255, ${Math.floor(
                        110 + Math.sin(p.phase) * 45
                    )}, 30, ${glow})`;

                ctx.shadowBlur = p.bright ? 16 : 9;
                ctx.shadowColor = p.bright ? "#ffd166" : "#ff6500";

                ctx.arc(
                    p.x,
                    p.y,
                    p.bright ? p.radius * 1.5 : p.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                // Ember trail
                if (p.bright) {
                    ctx.beginPath();
                    ctx.strokeStyle =
                        `rgba(255, 170, 60, ${glow * 0.6})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(
                        p.x - p.speedX * 3,
                        p.y + p.speedY * 5
                    );
                    ctx.stroke();
                }

                ctx.shadowBlur = 0;

                // Move embers upward
                if (!reducedMotion) {
                    p.y -= p.speedY;
                    p.x += p.speedX;

                    if (p.y < -12) {
                        p.y = height + 12;
                        p.x = Math.random() * width;
                    }

                    if (p.x < -12) p.x = width + 12;
                    if (p.x > width + 12) p.x = -12;
                }
            });

           animationFrame = requestAnimationFrame(animateParticles);
        }

        function startAnimation() {
            if (document.hidden) return;

            if (animationFrame === null) {
                if (reducedMotion) {
                    animateParticles();
                } else {
                    animationFrame =
                        requestAnimationFrame(animateParticles);
                }
            }
        }

        function stopAnimation() {
            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }

        resizeCanvas();
        startAnimation();

        window.addEventListener("resize", () => {
            resizeCanvas();

            if (reducedMotion && !document.hidden) {
                animateParticles();
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    }

    // ==========================================
    // MOBILE NAVIGATION
    // Expected IDs: menu-toggle and nav-links
    // ==========================================

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================
    // AUTOMATIC FOOTER YEAR
    // Expected ID: year
    // ==========================================

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==========================================
    // CONTACT FORM BASIC VALIDATION
    // Expected ID: contact-form
    // ==========================================

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            const emailInput = contactForm.querySelector(
                'input[type="email"]'
            );

            const messageInput = contactForm.querySelector(
                'textarea[name="message"], textarea'
            );

            if (!contactForm.checkValidity()) {
                event.preventDefault();
                contactForm.reportValidity();
                return;
            }

            if (
                messageInput &&
                messageInput.value.trim().length < 5
            ) {
                event.preventDefault();
                messageInput.setCustomValidity(
                    "Please enter a longer message."
                );
                messageInput.reportValidity();
                messageInput.setCustomValidity("");
                return;
            }

            if (emailInput && !emailInput.value.includes("@")) {
                event.preventDefault();
                emailInput.reportValidity();
            }

            // Form submission is handled by its configured action,
            // such as your Formspree endpoint.
        });
    }
    // FIRE SPARKS FOLLOW THE MOUSE CURSOR 🔥
(() => {
  const canvas = document.getElementById("gold-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const sparks = [];
  let lastSparkTime = 0;

  window.addEventListener("pointermove", (event) => {
    const now = performance.now();

    // Avoid creating too many sparks
    if (now - lastSparkTime < 18) return;
    lastSparkTime = now;

    // Create golden fire particles around cursor
    for (let i = 0; i < 3; i++) {
      sparks.push({
        x: event.clientX + (Math.random() - 0.5) * 12,
        y: event.clientY + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 3 - 0.5,
        size: Math.random() * 3 + 1,
        life: 1,
        decay: Math.random() * 0.025 + 0.015
      });
    }
  });

  function animateCursorFire() {
    // Draw sparks on the existing canvas without clearing
    // the background animation's particles.
    sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.025;
      spark.life -= spark.decay;

      if (spark.life <= 0) return;

      ctx.save();
      ctx.globalAlpha = spark.life;
      ctx.fillStyle = "#ffb52e";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ff6a00";
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    for (let i = sparks.length - 1; i >= 0; i--) {
      if (sparks[i].life <= 0) sparks.splice(i, 1);
    }

    requestAnimationFrame(animateCursorFire);
  }

  animateCursorFire();
})();

});
