(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => preloader.classList.add("is-hidden"), 300);
    }
  });

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("portfolio-theme");
  if (storedTheme) root.setAttribute("data-theme", storedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("header");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header?.classList.toggle("is-scrolled", scrolled);
    backToTop?.classList.toggle("is-visible", window.scrollY > 500);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Mobile nav ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navOverlay = document.getElementById("navOverlay");

  const closeNav = () => {
    nav?.classList.remove("is-open");
    navToggle?.classList.remove("is-active");
    navOverlay?.classList.remove("is-active");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", !!isOpen);
    navOverlay?.classList.toggle("is-active", !!isOpen);
    navToggle.setAttribute("aria-expanded", String(!!isOpen));
  });

  navOverlay?.addEventListener("click", closeNav);
  document.querySelectorAll("[data-nav]").forEach((link) => link.addEventListener("click", closeNav));

  /* ---------- Active nav link (site multi-pages) ---------- */
  const navLinks = document.querySelectorAll(".nav__link");
  const pageName = (path) => {
    const file = path.split("/").pop().replace(/\.html$/i, "");
    return file === "" ? "index" : file;
  };
  const currentPage = pageName(window.location.pathname);

  navLinks.forEach((link) => {
    const linkPage = pageName(link.getAttribute("href") || "");
    const isActive = linkPage === currentPage;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Typed role text ---------- */
  const typedEl = document.getElementById("typed");
  const roles = [
    "Développeur Web",
    "Intégrateur Front-End",
    "Développeur PHP / MySQL",
    "Créateur de sites WordPress",
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1600);
            return;
          }
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 40 : 80);
      };
      tick();
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10) || 0;
        if (prefersReducedMotion) {
          el.textContent = String(target);
        } else {
          const duration = 900;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  const setFieldError = (field, message) => {
    const row = field.closest(".form-row");
    const errorEl = row?.querySelector(".form-error");
    if (message) {
      row?.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
    } else {
      row?.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    let valid = true;

    if (!nameField.value.trim()) {
      setFieldError(nameField, "Merci d'indiquer votre nom.");
      valid = false;
    } else {
      setFieldError(nameField, "");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value.trim())) {
      setFieldError(emailField, "Adresse email invalide.");
      valid = false;
    } else {
      setFieldError(emailField, "");
    }

    if (!messageField.value.trim()) {
      setFieldError(messageField, "Merci d'écrire un message.");
      valid = false;
    } else {
      setFieldError(messageField, "");
    }

    if (!valid) {
      if (formStatus) {
        formStatus.textContent = "Merci de corriger les champs indiqués.";
        formStatus.className = "form-status is-error";
      }
      return;
    }

    const subject = encodeURIComponent(`Contact portfolio — ${nameField.value.trim()}`);
    const body = encodeURIComponent(
      `${messageField.value.trim()}\n\n— ${nameField.value.trim()} (${emailField.value.trim()})`
    );
    window.location.href = `mailto:houetognongerardo1@gmail.com?subject=${subject}&body=${body}`;

    if (formStatus) {
      formStatus.textContent = "Votre client email va s'ouvrir pour finaliser l'envoi. Merci !";
      formStatus.className = "form-status is-success";
    }
    form.reset();
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Particle network (hero background) ---------- */
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const hero = canvas.closest(".hero");
    let particles = [];
    let width, height;
    let mouse = { x: null, y: null };

    const accentColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#38bdf8";

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const count = Math.min(70, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const color = accentColor();

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x += dx / dist * 0.6;
            p.y += dy / dist * 0.6;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 130) * 0.25;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    resize();
    requestAnimationFrame(draw);
  }
})();
