/* =====================================================================
NOURA SKIN SECRETS — noura-luxe.js (companion to noura-luxe.css)
Adds the "Före / Efter" (before/after) results section on the home page
using REAL salon assets:
  • videos/before-after.mp4   (short before→after transition)
  • videos/skin-resultat.mp4  (skin before/after comparison clip)
  • images/resultat-1..3.jpg  (real result photos)
Load on index.html only, after the other scripts:
  <script src="js/noura-luxe.js" defer></script>
Touches no existing JavaScript (chatbot, catalog, i18n, booking stay intact).
===================================================================== */
(function () {
"use strict";
var VIDEO = "videos/before-after.mp4";
var POSTER = "images/before-after-poster.jpg";
var SKINCLIP = "videos/skin-resultat.mp4";
var SKINPOSTER = "images/skin-resultat-poster.jpg";
var RESULTS = ["images/resultat-1.jpg", "images/resultat-2.jpg"];

function styles() {
  if (document.getElementById("nl-ba-style")) return;
  var st = document.createElement("style");
  st.id = "nl-ba-style";
  st.textContent =
    ".nl-ba-video{max-width:760px;margin:40px auto 0;border:1px solid var(--nl-line);border-radius:3px;overflow:hidden;box-shadow:var(--nl-shadow);background:var(--nl-cream-2)}" +
    ".nl-ba-video video{display:block;width:100%;height:auto}" +
    ".nl-ba--grid{grid-template-columns:repeat(auto-fit,minmax(160px,1fr));max-width:760px;margin-top:16px}" +
    ".nl-ba-item video{width:100%;height:100%;object-fit:cover;display:block}";
  document.head.appendChild(st);
}

function inject() {
  var faq = document.getElementById("faq");
  if (!faq || document.getElementById("nl-ba-section")) return;
  styles();
  var media =
    '<figure class="nl-ba-item"><span class="nl-ba-tag nl-ba-tag--after" data-i18n="nlba.tag">Före &amp; efter</span>' +
      '<video src="' + SKINCLIP + '" poster="' + SKINPOSTER + '" autoplay muted loop playsinline webkit-playsinline preload="metadata" disablepictureinpicture></video>' +
    '</figure>' +
    RESULTS.map(function (src, i) {
      return '<figure class="nl-ba-item"><img loading="lazy" src="' + src +
        '" alt="Verkligt resultat ' + (i + 1) + ' från behandling hos Noura Skin Secrets"></figure>';
    }).join("");
  var sec = document.createElement("section");
  sec.id = "nl-ba-section";
  sec.className = "section section--tight";
  sec.innerHTML =
    '<div class="container">' +
      '<div class="section-head reveal">' +
        '<span class="eyebrow" data-i18n="nlba.eyebrow">Resultat</span>' +
        '<h2 data-i18n="nlba.title">Före &amp; efter</h2>' +
        '<p data-i18n="nlba.lede">En glimt av vad avancerad hudvård kan göra för hudens lyster och struktur.</p>' +
      '</div>' +
      '<div class="nl-ba-video reveal">' +
        '<video src="' + VIDEO + '" poster="' + POSTER + '" autoplay muted loop playsinline webkit-playsinline preload="metadata" disablepictureinpicture></video>' +
      '</div>' +
      '<div class="nl-ba nl-ba--grid reveal">' + media + '</div>' +
      '<p class="nl-ba-note" data-i18n="nlba.note">Verkliga resultat från salongen.</p>' +
    '</div>';
  faq.parentNode.insertBefore(sec, faq);
nlApplyLang(sec);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible", "visible", "in", "active"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    sec.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    sec.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }
}
/* ---- i18n for the injected results section (SV default in markup) ---- */
var NL_I18N = {
en: { "nlba.eyebrow": "Results", "nlba.title": "Before &amp; after", "nlba.lede": "A glimpse of what advanced skin care can do for your skin's glow and texture.", "nlba.note": "Real results from the salon.", "nlba.tag": "Before &amp; after" },
ar: { "nlba.eyebrow": "النتائج", "nlba.title": "قبل وبعد", "nlba.lede": "لمحة عما يمكن أن تفعله العناية المتقدمة بالبشرة لنضارة بشرتك وملمسها.", "nlba.note": "نتائج حقيقية من الصالون.", "nlba.tag": "قبل وبعد" }
};
function nlApplyLang(root) {
var lang = localStorage.getItem("nss-lang") || "sv";
var dict = NL_I18N[lang];
var els = (root || document).querySelectorAll('[data-i18n^="nlba."]');
for (var k = 0; k < els.length; k++) {
var el = els[k], key = el.getAttribute("data-i18n");
if (lang === "sv") {
if (el.dataset.svHtml !== undefined) el.innerHTML = el.dataset.svHtml;
} else if (dict && dict[key]) {
if (el.dataset.svHtml === undefined) el.dataset.svHtml = el.innerHTML;
el.innerHTML = dict[key];
}
}
}
window.addEventListener("nss-lang-change", function () { nlApplyLang(document.getElementById("nl-ba-section")); });

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
else inject();
})();
