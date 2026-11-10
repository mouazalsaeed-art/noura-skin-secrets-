/* Noura Skin Secrets — kampanjband överst (svart, rullande text).
   ▸ active:false stänger av bandet. ▸ until: bandet försvinner automatiskt efter detta datum.
   ▸ Döljs när besökaren scrollar ned, visas igen högst upp. */
const PROMO = {
  active: true,
  until: "2026-11-30T23:59:59+01:00",
  link: "boka.html",
  code: "BLACKFRIDAY", /* samma kod som i scripts/stripe-promo.json */
  /* tips på betalningen (kort/Klarna) i bokningsformuläret */
  payHint: {
    sv: "Black Friday: skriv koden BLACKFRIDAY på betalsidan så dras 20% av.",
    en: "Black Friday: enter the code BLACKFRIDAY on the payment page for 20% off.",
    ar: "بلاك فرايدي: اكتبي الكود BLACKFRIDAY في صفحة الدفع ليُخصم 20%.",
  },
  text: {
    sv: "BLACK FRIDAY · 20% PÅ ALLA BEHANDLINGAR · KOD: BLACKFRIDAY",
    en: "BLACK FRIDAY · 20% OFF ALL TREATMENTS · CODE: BLACKFRIDAY",
    ar: "بلاك فرايدي · خصم 20% على كل العلاجات · الكود: BLACKFRIDAY",
  },
};

(function () {
  if (!PROMO.active || Date.now() > Date.parse(PROMO.until)) return;
  var root = document.documentElement;
  var lang = (root.lang || "sv").slice(0, 2);
  var text = PROMO.text[lang] || PROMO.text.sv;
  var base = (document.body && document.body.getAttribute("data-root")) || "";

  var bar = document.createElement("a");
  bar.className = "promo-bar";
  bar.href = base + (lang === "sv" ? "" : lang + "/") + PROMO.link;
  bar.setAttribute("aria-label", text);
  var run = "";
  for (var i = 0; i < 6; i++) run += '<span class="promo-item">' + text + "</span>";
  bar.innerHTML = '<span class="promo-track" aria-hidden="true">' + run + run + "</span>";
  document.body.insertBefore(bar, document.body.firstChild);
  root.classList.add("has-promo");

  var ticking = false;
  function update() {
    ticking = false;
    root.classList.toggle("promo-hidden", window.pageYOffset > 30);
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
