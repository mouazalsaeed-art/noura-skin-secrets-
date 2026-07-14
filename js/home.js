/* Noura Skin Secrets — startsidans dynamiska sektioner (kategorier, erbjudanden,
   klippkort, omdömen, galleri). Renderar på sidans språk (html[lang]). */
(function () {
  "use strict";
  var L = (document.documentElement.lang || "sv").slice(0, 2);
  var BOKA = document.body.getAttribute("data-boka") || "boka.html";

  var UI = {
    treatments: { sv: "behandlingar", en: "treatments", ar: "علاجاً" },
    see: { sv: "Se behandlingar", en: "View treatments", ar: "شاهدي العلاجات" },
    book: { sv: "Boka", en: "Book", ar: "احجزي" },
    save: { sv: "Spara", en: "Save", ar: "وفّري" },
    buy: { sv: "Köp klippkort", en: "Buy package", ar: "اشتري الباقة" },
    valid: { sv: "Giltigt i 12 månader", en: "Valid for 12 months", ar: "صالحة لمدة 12 شهراً" },
    via: { sv: "via", en: "via", ar: "عبر" },
  };
  function t(k) { return (UI[k] && (UI[k][L] || UI[k].sv)) || ""; }
  function pick(o, base) { return (L === "en" && o[base + "En"]) || (L === "ar" && o[base + "Ar"]) || o[base] || ""; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function num(s) { return parseInt(String(s).replace(/[^\d]/g, ""), 10) || 0; }
  var arrow = typeof NSS_ICON === "function" ? NSS_ICON("arrow", 12) : "→";

  /* ---------- kategorier: asymmetrisk bento ---------- */
  var bento = document.getElementById("cat-bento");
  if (bento && typeof TREATMENT_CATEGORIES !== "undefined") {
    var featured = "ansikte"; /* största kategorin får stora kortet */
    TREATMENT_CATEGORIES.forEach(function (cat) {
      var a = document.createElement("a");
      var big = cat.id === featured;
      a.className = "cat-card" + (big ? " cat-card--lg" : "") + " reveal";
      a.href = (document.body.getAttribute("data-catalog") || "behandlingar.html") + "#" + cat.id;
      a.innerHTML =
        '<span class="cat-ic">' + catIcon(cat.id) + "</span>" +
        "<h3>" + esc(pick(cat, "name")) + "</h3>" +
        '<span class="cat-count"><span class="num">' + cat.treatments.length + "</span> " + t("treatments") + "</span>" +
        '<span class="cat-link">' + t("see") + " " + arrow + "</span>";
      bento.appendChild(a);
    });
  }

  /* ---------- erbjudanden: zig-zag rader ---------- */
  var offersEl = document.getElementById("offer-list");
  if (offersEl && typeof OFFERS !== "undefined") {
    OFFERS.filter(function (o) { return o.active; }).forEach(function (o, i) {
      var row = document.createElement("div");
      row.className = "offer-row reveal";
      if (i) row.setAttribute("data-d", String(Math.min(i, 3)));
      row.innerHTML =
        '<span class="offer-badge">' + esc(pick(o, "badge")) + "</span>" +
        "<div><h3>" + esc(pick(o, "title")) + "</h3><p>" + esc(pick(o, "desc")) + "</p></div>" +
        '<div class="offer-price"><strong>' + esc(o.price) + "</strong>" +
        (o.oldPrice ? "<s>" + esc(o.oldPrice) + "</s>" : "") + "</div>" +
        '<a class="btn btn-outline" href="' + BOKA + "?treatment=" + encodeURIComponent(o.treatment) + '">' + t("book") + "</a>";
      offersEl.appendChild(row);
    });
  }

  /* ---------- klippkort ---------- */
  var klipp = document.getElementById("klipp-grid");
  if (klipp && typeof KLIPPKORT !== "undefined") {
    KLIPPKORT.filter(function (k) { return k.active; }).forEach(function (k, i) {
      var save = num(k.oldPrice) - num(k.price);
      var card = document.createElement("div");
      card.className = "klipp-card reveal";
      if (i) card.setAttribute("data-d", String(Math.min(i, 3)));
      var paket = k.title + " – " + k.sessions + " (klippkort)";
      card.innerHTML =
        (save > 0 ? '<span class="klipp-save">' + t("save") + ' <span class="num">' + save.toLocaleString("sv-SE") + "</span> kr</span>" : "") +
        "<h3>" + esc(pick(k, "title")) + "</h3>" +
        '<ul class="klipp-facts">' +
        '<li><span class="num">' + esc(k.duration) + "</span></li>" +
        "<li><strong>" + esc(pick(k, "sessions")) + "</strong></li>" +
        "<li>" + t("valid") + "</li></ul>" +
        '<div class="klipp-price">' + (k.oldPrice ? "<s>" + esc(k.oldPrice) + "</s>" : "") +
        "<strong>" + esc(k.price) + "</strong></div>" +
        '<a class="btn btn-primary btn-block" href="' + BOKA + "?paket=" + encodeURIComponent(paket) + '">' + t("buy") + "</a>";
      klipp.appendChild(card);
    });
  }

  /* ---------- omdömen (endast riktiga; sektionen döljs om tom) ---------- */
  var wall = document.getElementById("review-wall");
  var reviewSection = document.getElementById("omdomen");
  if (wall && typeof REVIEWS !== "undefined" && REVIEWS.length) {
    REVIEWS.forEach(function (r, i) {
      var c = document.createElement("div");
      c.className = "review-card reveal";
      if (i) c.setAttribute("data-d", String(Math.min(i % 3, 3)));
      c.innerHTML =
        '<div class="rv-stars">' + "★★★★★".slice(0, r.stars || 5) + "</div>" +
        "<blockquote>“" + esc(r.text) + "”</blockquote>" +
        '<div class="rv-name">' + esc(r.name || "") + (r.source ? " · " + t("via") + " " + esc(r.source) : "") + "</div>";
      wall.appendChild(c);
    });
  } else if (reviewSection) {
    reviewSection.style.display = "none";
  }

  /* ---------- galleri ----------
     Lägg riktiga foton i images/gallery/ och lista dem här: */
  var GALLERY = [
    { img: "images/IMG_2166.jpg", alt: "Nöjd kund efter behandling hos Noura Skin Secrets" },
    { img: "images/publer-1757699814482.JPG", alt: "Lyster och glow efter ansiktsbehandling" },
    { img: "images/publer-1768170262397.JPG", alt: "Hårbottenbehandling — före och efter" },
    { img: "images/publer-1771717340180.JPG", alt: "Jämnare hudton efter behandling" },
    { img: "images/resultat-3.jpg", alt: "Strålande resultat efter hudvårdsbehandling" },
    // Lägg till fler: { img: "images/filnamn.jpg", alt: "beskrivning" },
  ];
  var PLACEHOLDERS = {
    sv: ["Ansiktsvård", "HIFU-lyft", "Glow & lyster", "Massage", "Laser"],
    en: ["Facials", "HIFU lift", "Glow", "Massage", "Laser"],
    ar: ["عناية بالوجه", "شدّ الهايفو", "إشراقة", "مساج", "ليزر"],
  };
  var strip = document.getElementById("ig-strip");
  if (strip) {
    var IG = "https://instagram.com/noura_skin_secrets";
    var glyph = typeof NSS_ICON === "function" ? NSS_ICON("ig", 18) : "";
    var prefix = document.body.getAttribute("data-root") || "";
    if (GALLERY.length) {
      GALLERY.forEach(function (it) {
        var a = document.createElement("a");
        a.className = "ig-tile has-media";
        a.href = IG; a.target = "_blank"; a.rel = "noopener";
        a.innerHTML = (it.video
          ? '<video src="' + prefix + it.video + '" muted loop playsinline autoplay preload="metadata"></video>'
          : '<img src="' + prefix + it.img + '" alt="' + esc(it.alt || "Noura Skin Secrets") + '" loading="lazy" />') +
          '<span class="ig-glyph">' + glyph + "</span>";
        strip.appendChild(a);
      });
    } else {
      (PLACEHOLDERS[L] || PLACEHOLDERS.sv).forEach(function (label) {
        var a = document.createElement("a");
        a.className = "ig-tile";
        a.href = IG; a.target = "_blank"; a.rel = "noopener";
        a.innerHTML = '<span class="ig-glyph">' + glyph + '</span><span class="ig-label">' + esc(label) + "</span>";
        strip.appendChild(a);
      });
    }
  }
})();
