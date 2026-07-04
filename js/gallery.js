/* Noura Skin Secrets — Instagram gallery slider.
   ═══════════ HOW TO ADD YOUR PHOTOS ═══════════
   1. Put your image files in the folder  images/gallery/
   2. List them in the GALLERY array below, e.g.
        { img: "images/gallery/1.jpg", alt: "HydraFacial hos oss" },
   The slider updates automatically. Until photos are added, a branded
   teaser is shown so the section still looks intentional. */
(function () {
  const IG = "https://instagram.com/noura_skin_secrets";

  const GALLERY = [
    { video: "videos/gallery-1.mp4", alt: "Behandling hos Noura Skin Secrets" },
    // Lägg till dina bilder så här (dra in filerna i images/gallery/):
    // { img: "images/gallery/1.jpg", alt: "HydraFacial hos oss" },
  ];

  // Branded placeholder tiles shown until real photos are added.
  const PLACEHOLDERS = [
    { t: "Ansiktsvård", g: "linear-gradient(150deg,#c2447e,#7b2e52)" },
    { t: "HIFU-lyft", g: "linear-gradient(150deg,#8b5cf6,#c2447e)" },
    { t: "Glow & lyster", g: "linear-gradient(150deg,#de7eac,#8b5cf6)" },
    { t: "Massage", g: "linear-gradient(150deg,#7b2e52,#c2447e)" },
    { t: "Laser", g: "linear-gradient(150deg,#c2447e,#8b5cf6)" },
    { t: "Hårvård", g: "linear-gradient(150deg,#8b5cf6,#7b2e52)" },
  ];

  const root = document.getElementById("ig-gallery");
  if (!root) return;

  const igGlyph =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>';

  const track = document.createElement("div");
  track.className = "ig-track";

  GALLERY.forEach((it) => {
    const a = document.createElement("a");
    a.className = "ig-slide";
    a.href = IG;
    a.target = "_blank";
    a.rel = "noopener";
    const media = it.video
      ? `<video src="${it.video}" muted loop playsinline autoplay preload="metadata" aria-label="${it.alt || "Noura Skin Secrets"}"></video>`
      : `<img src="${it.img}" alt="${it.alt || "Noura Skin Secrets"}" loading="lazy" />`;
    a.innerHTML = media + `<span class="ig-badge">${igGlyph}</span>`;
    track.appendChild(a);
  });

  // Fill the strip with branded teaser tiles so it always looks full.
  const fill = GALLERY.length ? Math.max(0, 5 - GALLERY.length) : PLACEHOLDERS.length;
  for (let i = 0; i < fill; i++) {
    const p = PLACEHOLDERS[i % PLACEHOLDERS.length];
    const a = document.createElement("a");
    a.className = "ig-slide ig-slide--ph";
    a.href = IG;
    a.target = "_blank";
    a.rel = "noopener";
    a.style.background = p.g;
    a.innerHTML = `<span class="ig-ph-ic">${igGlyph}</span><span class="ig-ph-t">${p.t}</span>`;
    track.appendChild(a);
  }

  const prev = document.createElement("button");
  prev.className = "ig-nav ig-prev";
  prev.setAttribute("aria-label", "Föregående");
  prev.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
  const next = document.createElement("button");
  next.className = "ig-nav ig-next";
  next.setAttribute("aria-label", "Nästa");
  next.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

  function scrollByCard(dir) {
    const card = track.querySelector(".ig-slide");
    const step = card ? card.offsetWidth + 16 : 300;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }
  prev.addEventListener("click", () => scrollByCard(-1));
  next.addEventListener("click", () => scrollByCard(1));

  const viewport = document.createElement("div");
  viewport.className = "ig-viewport";
  viewport.appendChild(track);

  root.appendChild(prev);
  root.appendChild(viewport);
  root.appendChild(next);
})();
