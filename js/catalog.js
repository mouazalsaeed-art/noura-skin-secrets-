/* Noura Skin Secrets — behandlingskatalog: sök, grupper, chips, rendering.
   Fullt flerspråkig (SV/EN/AR) via fälten i treatments.js. */
(function () {
  "use strict";
  var L = (document.documentElement.lang || "sv").slice(0, 2);
  var BOKA = document.body.getAttribute("data-boka") || "boka.html";

  var UI = {
    all: { sv: "Alla", en: "All", ar: "الكل" },
    allT: { sv: "Alla behandlingar", en: "All treatments", ar: "جميع العلاجات" },
    face: { sv: "Ansikte & hud", en: "Face & skin", ar: "الوجه والبشرة" },
    body: { sv: "Kropp & figur", en: "Body & contour", ar: "الجسم والقوام" },
    massage: { sv: "Massage", en: "Massage", ar: "المساج" },
    hair: { sv: "Hår", en: "Hair", ar: "الشعر" },
    book: { sv: "Boka", en: "Book", ar: "احجزي" },
    one: { sv: "1 behandling", en: "1 treatment", ar: "علاج واحد" },
    many: { sv: "behandlingar", en: "treatments", ar: "علاجاً" },
  };
  function t(k) { return UI[k][L] || UI[k].sv; }
  function pick(o, base) { return (L === "en" && o[base + "En"]) || (L === "ar" && o[base + "Ar"]) || o[base] || ""; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var catalogEl = document.getElementById("catalog");
  if (!catalogEl || typeof TREATMENT_CATEGORIES === "undefined") return;
  var chipRow = document.getElementById("chip-row");
  var groupTabs = document.getElementById("group-tabs");
  var searchInput = document.getElementById("search");
  var emptyState = document.getElementById("empty-state");
  var countEl = document.getElementById("catalog-count");

  var GROUPS = [
    { id: "all", label: t("allT"), cats: null },
    { id: "ansikte", label: t("face"), cats: ["ansikte", "hifu-ansikte", "ogon-lappar", "plasma", "laser", "arrbehandling", "ovrigt"] },
    { id: "kropp", label: t("body"), cats: ["kroppsbehandlingar", "slim-firm", "bristningar", "hifu-kropp"] },
    { id: "massage", label: t("massage"), cats: ["massage-ansikte", "massage-kropp"] },
    { id: "har", label: t("hair"), cats: ["harvard"] },
  ];
  var activeGroup = "all", activeCategory = "all";

  function catsInGroup() {
    var g = GROUPS.find(function (x) { return x.id === activeGroup; });
    if (!g || !g.cats) return TREATMENT_CATEGORIES;
    return TREATMENT_CATEGORIES.filter(function (c) { return g.cats.indexOf(c.id) !== -1; });
  }

  function buildTabs() {
    groupTabs.innerHTML = "";
    GROUPS.forEach(function (g) {
      var b = document.createElement("button");
      b.className = "group-tab" + (g.id === activeGroup ? " active" : "");
      b.textContent = g.label;
      b.addEventListener("click", function () {
        activeGroup = g.id; activeCategory = "all";
        buildTabs(); buildChips(); render();
      });
      groupTabs.appendChild(b);
    });
  }

  function buildChips() {
    chipRow.innerHTML = "";
    var all = document.createElement("button");
    all.className = "chip" + (activeCategory === "all" ? " active" : "");
    all.textContent = t("all");
    all.addEventListener("click", function () { activeCategory = "all"; buildChips(); render(); });
    chipRow.appendChild(all);
    catsInGroup().forEach(function (cat) {
      var chip = document.createElement("button");
      chip.className = "chip" + (activeCategory === cat.id ? " active" : "");
      chip.innerHTML = catIcon(cat.id, 14) + "<span>" + esc(pick(cat, "name")) + "</span>";
      chip.addEventListener("click", function () {
        activeCategory = cat.id; buildChips(); render();
        var el = document.getElementById(cat.id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      chipRow.appendChild(chip);
    });
  }

  function matches(tr, q) {
    if (!q) return true;
    return [tr.name, tr.nameEn, tr.nameAr, tr.desc, tr.descEn, tr.descAr]
      .some(function (s) { return s && s.toLowerCase().indexOf(q) !== -1; });
  }

  function render() {
    var q = (searchInput.value || "").trim().toLowerCase();
    catalogEl.innerHTML = "";
    var shown = 0;
    catsInGroup().forEach(function (cat) {
      if (activeCategory !== "all" && activeCategory !== cat.id) return;
      var filtered = cat.treatments.filter(function (tr) { return matches(tr, q); });
      if (!filtered.length) return;
      shown += filtered.length;

      var block = document.createElement("div");
      block.className = "category-block";
      block.id = cat.id;
      var h = document.createElement("h2");
      h.innerHTML = esc(pick(cat, "name")) + ' <span class="cat-count num">' + filtered.length + "</span>";
      block.appendChild(h);
      var catNote = pick(cat, "note");
      if (catNote) {
        var note = document.createElement("div");
        note.className = "cat-note";
        note.textContent = catNote;
        block.appendChild(note);
      }
      var grid = document.createElement("div");
      grid.className = "treatment-grid";
      filtered.forEach(function (tr) {
        var card = document.createElement("div");
        card.className = "treatment-card";
        var trNote = pick(tr, "note");
        card.innerHTML =
          '<div class="row"><h4>' + esc(pick(tr, "name")) + '</h4><span class="duration">' + esc(tr.duration) + "</span></div>" +
          '<p class="desc">' + esc(pick(tr, "desc")) + "</p>" +
          (trNote ? '<div class="note-line">' + esc(trNote) + "</div>" : "") +
          '<div class="footer-row"><span class="t-price">' + esc(typeof tPrice === "function" ? tPrice(tr) : tr.price) + "</span>" +
          '<a class="book-link" href="' + BOKA + "?treatment=" + encodeURIComponent(tr.name) + '">' + t("book") + "</a></div>";
        grid.appendChild(card);
      });
      block.appendChild(grid);
      catalogEl.appendChild(block);
    });
    countEl.textContent = shown === 1 ? t("one") : '⁨' + shown + '⁩ ' + t("many");
    emptyState.style.display = shown === 0 ? "block" : "none";
  }

  buildTabs(); buildChips();
  searchInput.addEventListener("input", render);
  render();

  if (location.hash) {
    var hid = location.hash.slice(1);
    var g = GROUPS.find(function (x) { return x.cats && x.cats.indexOf(hid) !== -1; });
    if (g) { activeGroup = g.id; buildTabs(); buildChips(); render(); }
    setTimeout(function () {
      var target = document.getElementById(hid);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }
})();
