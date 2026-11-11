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
  var activeOffers = typeof OFFERS !== "undefined" ? OFFERS.filter(function (o) {
    return o.active && (!o.until || Date.now() <= Date.parse(o.until));
  }) : [];
  if (offersEl && !activeOffers.length) {
    var offersSec = document.getElementById("erbjudanden"); if (offersSec) offersSec.style.display = "none";
  }
  if (offersEl && activeOffers.length) {
    activeOffers.forEach(function (o, i) {
      var row = document.createElement("div");
      row.className = "offer-row reveal";
      if (i) row.setAttribute("data-d", String(Math.min(i, 3)));
      row.innerHTML =
        '<span class="offer-badge">' + esc(pick(o, "badge")) + "</span>" +
        "<div><h3>" + esc(pick(o, "title")) + "</h3><p>" + esc(pick(o, "desc")) + "</p></div>" +
        '<div class="offer-price"><strong>' + esc(o.price) + "</strong>" +
        (o.oldPrice ? "<s>" + esc(o.oldPrice) + "</s>" : "") + "</div>" +
        '<a class="btn btn-gold" href="' + BOKA + "?erbjudande=" + encodeURIComponent(o.title) + '">' + t("book") + "</a>";
      offersEl.appendChild(row);
    });
  }

  /* ---------- klippkort ---------- */
  var klipp = document.getElementById("klipp-grid");
  var activeKlipp = typeof KLIPPKORT !== "undefined" ? KLIPPKORT.filter(function (k) { return k.active; }) : [];
  if (klipp && !activeKlipp.length) {
    var klippSec = document.getElementById("klippkort"); if (klippSec) klippSec.style.display = "none";
  }
  if (klipp && activeKlipp.length) {
    activeKlipp.forEach(function (k, i) {
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
        '<blockquote dir="auto">“' + esc(r.text) + "”</blockquote>" +
        '<div class="rv-name"><bdi>' + esc(r.name || "") + "</bdi>" + (r.source ? " · " + t("via") + " <bdi>" + esc(r.source) + "</bdi>" : "") + "</div>";
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
    { img: "images/publer-1771717258362.JPG", alt: "Glow och lyster efter behandling" },
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

  /* ---------- långsamt rullande band (Före & efter + Instagram) ----------
     Rullar av sig själv, och går att dra/svepa med fingret eller musen. */
  function marquee(el, pxPerSec) {
    if (!el || el.classList.contains("mq")) return;
    var items = Array.prototype.slice.call(el.children);
    if (items.length < 2) return;
    items.forEach(function (it) { it.classList.remove("reveal"); it.removeAttribute("data-d"); });
    el.classList.add("mq");
    var track = document.createElement("div");
    track.className = "mq-track";
    items.forEach(function (it) { track.appendChild(it); });
    el.appendChild(track);
    track.querySelectorAll("img, a").forEach(function (i) { i.draggable = false; });
    if (el.tagName === "A") el.draggable = false;
    items.forEach(function (it) { if (it.tagName === "A") it.draggable = false; });
    el.addEventListener("dragstart", function (e) { e.preventDefault(); });
    function cloneSet() {
      items.forEach(function (it) {
        var c = it.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        if (c.tagName === "A") c.tabIndex = -1;
        c.querySelectorAll("a").forEach(function (x) { x.tabIndex = -1; });
        c.querySelectorAll("img, a").forEach(function (i) { i.draggable = false; });
        if (c.tagName === "A") c.draggable = false;
        c.querySelectorAll("video").forEach(function (v) { v.muted = true; if (v.play) v.play().catch(function () {}); });
        track.appendChild(c);
      });
    }

    var rtl = document.documentElement.dir === "rtl";
    var sign = rtl ? 1 : -1;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var shift = 0, pos = 0, last = 0, vel = 0;
    var dragging = false, hover = false, resumeAt = 0, moved = 0, startX = 0, lastX = 0, lastT = 0;

    function wrap() { if (shift) { pos = pos % shift; if (pos < 0) pos += shift; } }
    function paint() { track.style.transform = "translate3d(" + (sign * pos) + "px,0,0)"; }
    function frame(t) {
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (!dragging) {
        if (Math.abs(vel) > 5) { pos += vel * dt; vel *= Math.pow(0.04, dt); }   // utrullning efter svep
        else if (!reduce && !hover && t > resumeAt) pos += pxPerSec * dt;
        wrap(); paint();
      }
      requestAnimationFrame(frame);
    }
    function setup() {
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      var guard = 0;
      while (track.scrollWidth < el.clientWidth && guard++ < 6) cloneSet();
      var n = track.children.length;
      for (var r = 0; r * items.length < n; r++) cloneSet();
      shift = 0;
      for (var i = 0; i < n; i++) shift += track.children[i].getBoundingClientRect().width + gap;
      el.classList.add("mq-on");
      requestAnimationFrame(frame);
    }

    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true; moved = 0; vel = 0;
      startX = lastX = e.clientX; lastT = performance.now();
      el.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX, now = performance.now();
      moved += Math.abs(dx);
      pos -= dx * -sign;
      if (now > lastT) vel = (-dx * -sign) / ((now - lastT) / 1000) * 0.6 + vel * 0.4;
      lastX = e.clientX; lastT = now;
      wrap(); paint();
    }, { passive: true });
    function end() {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("dragging");
      if (performance.now() - lastT > 80) vel = 0;
      vel = Math.max(-2500, Math.min(2500, vel));
      resumeAt = performance.now() + 2500;
    }
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    // ett svep ska inte öppna länken (Instagram-rutorna)
    el.addEventListener("click", function (e) { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
    el.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hover = true; });
    el.addEventListener("pointerleave", function () { hover = false; });

    if (document.readyState === "complete") setup(); else window.addEventListener("load", setup);
  }
  marquee(document.querySelector("#resultat .ba-grid"), 28);
  marquee(document.getElementById("ig-strip"), 32);
})();
