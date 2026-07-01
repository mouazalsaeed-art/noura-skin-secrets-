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
