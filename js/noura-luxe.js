/* =====================================================================
   NOURA SKIN SECRETS — noura-luxe.js  (companion to noura-luxe.css)
   Adds the "Fore / Efter" (before/after) section on the home page,
   with a mandatory "AI-generated illustration" label. Load on index.html
   only, after the other scripts:  <script src="js/noura-luxe.js" defer></script>
   Touches no existing JavaScript (chatbot, catalog, i18n, booking stay intact).
   ===================================================================== */
(function () {
  "use strict";
  var BEFORE = "https://d8j0ntlcm91z4.cloudfront.net/user_3G3VDWffa9TaSKYmVTmpCBYbEyo/hf_20260706_123253_6c503c8c-0f2f-4987-a4e5-0917efb569bb.png";
  var AFTER  = "https://d8j0ntlcm91z4.cloudfront.net/user_3G3VDWffa9TaSKYmVTmpCBYbEyo/hf_20260706_123257_f7bcb786-608e-4a12-9bd4-38fe48f90271.png";

  function inject() {
    var faq = document.getElementById("faq");
    if (!faq || document.getElementById("nl-ba-section")) return;
    var sec = document.createElement("section");
    sec.id = "nl-ba-section";
    sec.className = "section section--tight";
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">Resultat</span>' +
          '<h2>Fore &amp; efter</h2>' +
          '<p>En glimt av vad avancerad hudvard kan gora for hudens lyster och struktur.</p>' +
        '</div>' +
        '<div class="nl-ba reveal">' +
          '<figure class="nl-ba-item"><span class="nl-ba-tag">FORE</span>' +
            '<img loading="lazy" src="' + BEFORE + '" alt="Hud fore behandling"></figure>' +
          '<figure class="nl-ba-item"><span class="nl-ba-tag nl-ba-tag--after">EFTER</span>' +
            '<img loading="lazy" src="' + AFTER + '" alt="Hud efter behandling"></figure>' +
        '</div>' +
        '<p class="nl-ba-note">AI-genererad illustration – ej en verklig klient.</p>' +
      '</div>';
    faq.parentNode.insertBefore(sec, faq);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible","visible","in","active"); io.unobserve(e.target); }
        });
      }, { threshold: 0.15 });
      sec.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
      sec.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
