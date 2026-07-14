/* Noura Skin Secrets — site.js (nav, reveal, video, räknare, kompabilitet) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var LANG = (document.documentElement.lang || "sv").slice(0, 2);

  /* Chatbot & payment läser språket från localStorage — synka per språkmapp */
  try { localStorage.setItem("nss-lang", LANG === "ar" ? "ar" : LANG === "en" ? "en" : "sv"); } catch (e) {}

  /* ---------- räknare ---------- */
  if (typeof TREATMENT_CATEGORIES !== "undefined") {
    var total = TREATMENT_CATEGORIES.reduce(function (s, c) { return s + c.treatments.length; }, 0);
    document.querySelectorAll("[data-total-treatments]").forEach(function (el) { el.textContent = total; });
    document.querySelectorAll("[data-total-categories]").forEach(function (el) { el.textContent = TREATMENT_CATEGORIES.length; });
  }

  /* ---------- mobilmeny ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-locked", open);
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    var closer = menu.querySelector(".mm-close");
    if (closer) closer.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- reveal (säker: failsafe i CSS gör att inget kan förbli dolt) ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
    /* element redan i viewport vid load */
    requestAnimationFrame(function () {
      targets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    });
  }

  /* ---------- flytande CTA (endast mobil, visas efter hero, döljs vid footer) ---------- */
  var fcta = document.querySelector(".float-cta");
  if (fcta && "IntersectionObserver" in window) {
    var hero = document.querySelector(".hero, .page-hero");
    var footer = document.querySelector(".site-footer");
    var pastHero = false, atFooter = false;
    function updateFcta() { fcta.classList.toggle("show", pastHero && !atFooter); }
    if (hero) {
      new IntersectionObserver(function (en) {
        pastHero = !en[0].isIntersecting; updateFcta();
      }, { threshold: 0.05 }).observe(hero);
    }
    if (footer) {
      new IntersectionObserver(function (en) {
        atFooter = en[0].isIntersecting; updateFcta();
      }, { threshold: 0.05 }).observe(footer);
    }
  }

  /* ---------- hero-video: laddas sent, poster om filen saknas/är trasig ---------- */
  window.addEventListener("load", function () {
    var video = document.querySelector(".hero-media video");
    if (!video) return;
    var conn = navigator.connection || {};
    if (reduce || conn.saveData || /2g/.test(conn.effectiveType || "")) return;
    var src = video.getAttribute("data-src");
    if (!src) return;
    video.src = src;
    video.muted = true;
    video.load();
    video.addEventListener("loadeddata", function () {
      if (video.videoWidth > 0) {
        video.classList.add("is-on");
        video.play().catch(function () {});
      }
    }, { once: true });
    video.addEventListener("error", function () { video.remove(); }, { once: true });
    /* om filen aldrig blir spelbar inom 8 s: ge upp tyst, postern står kvar */
    setTimeout(function () {
      if (video.readyState < 2) { video.removeAttribute("src"); video.load(); }
    }, 8000);
  });

  /* ---------- media med data-optional: göm blocket om filen saknas/är trasig ---------- */
  document.querySelectorAll("[data-optional]").forEach(function (el) {
    var media = el.querySelector("img,video");
    if (!media) return;
    function hide() {
      /* video med poster: visa postern som bild istället för att gömma blocket */
      if (media.tagName === "VIDEO" && media.poster) {
        var img = document.createElement("img");
        img.src = media.poster;
        img.alt = "";
        img.loading = "lazy";
        media.replaceWith(img);
        return;
      }
      el.style.display = "none";
    }
    media.addEventListener("error", hide, true);
    if (media.tagName === "IMG") {
      if (media.complete && !media.naturalWidth) hide();
    } else {
      media.addEventListener("loadeddata", function () {
        if (!media.videoWidth) hide();
      }, { once: true });
      /* trasig/ospelbar fil som aldrig ger error eller data */
      setTimeout(function () {
        if (media.readyState < 2 || !media.videoWidth) hide();
      }, 7000);
    }
  });
})();
