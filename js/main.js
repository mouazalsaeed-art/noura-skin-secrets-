// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => header.classList.toggle("open"));
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => header.classList.remove("open"));
    });
  }

  // Populate treatment count in hero stat / footer if placeholder exists
  if (typeof TREATMENT_CATEGORIES !== "undefined") {
    const total = TREATMENT_CATEGORIES.reduce((sum, c) => sum + c.treatments.length, 0);
    document.querySelectorAll("[data-total-treatments]").forEach((el) => {
      el.textContent = total;
    });
    document.querySelectorAll("[data-total-categories]").forEach((el) => {
      el.textContent = TREATMENT_CATEGORIES.length;
    });
  }
});

// Hero background video: deferred, connection-aware, pauses off-screen
window.addEventListener("load", () => {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const saveData = !!(conn && (conn.saveData || /2g/.test(conn.effectiveType || "")));

  if (reduceMotion || saveData) return; // keep poster/gradient only

  // Sources use data-src so the browser never fetches the video until we
  // explicitly opt in here, well after the page's critical resources have loaded.
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
  });
  video.load();

  video.addEventListener(
    "loadeddata",
    () => video.classList.add("is-loaded"),
    { once: true }
  );

  video.play().catch(() => {
    // Autoplay blocked by the browser — poster/gradient stays visible, no error surfaced.
  });

  // Pause when the hero scrolls out of view or the tab is hidden, to save battery/CPU/bandwidth.
  const heroSection = video.closest(".hero");
  if (heroSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(heroSection);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      video.pause();
    } else if (heroSection && heroSection.getBoundingClientRect().top < window.innerHeight) {
      video.play().catch(() => {});
    }
  });
});
