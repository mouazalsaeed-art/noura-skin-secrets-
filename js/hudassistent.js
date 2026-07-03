/* Noura Skin Secrets — Hudassistent
   Guided skin-advisor chat: skin analysis via questions, treatment
   recommendations from the live catalog, routines and pre/post advice. */

(function () {
  "use strict";

  /* ---------- Helpers to look up real treatments from the catalog ---------- */

  function findTreatment(namePart) {
    for (const cat of TREATMENT_CATEGORIES) {
      const t = cat.treatments.find((t) => t.name.includes(namePart));
      if (t) return { ...t, category: cat.name, catId: cat.id };
    }
    return null;
  }

  function treatmentCard(namePart, why) {
    const t = findTreatment(namePart);
    if (!t) return "";
    const bookHref = `boka.html?treatment=${encodeURIComponent(t.name)}`;
    return `
      <div class="ha-treatment">
        <div class="ha-treatment-name">${t.name}</div>
        <div class="ha-treatment-meta">${t.duration} · <strong>${t.price}</strong></div>
        ${why ? `<div class="ha-treatment-why">${why}</div>` : ""}
        <a class="ha-book-btn" href="${bookHref}">Boka denna behandling →</a>
      </div>`;
  }

  const CONSULT_NOTE = `
    <div class="ha-note">💡 Osäker? Boka en <strong>Hudvårdskonsultation (20 min, 450 kr)</strong> så gör Nour en personlig hudanalys.
    <a class="ha-book-btn" href="boka.html?treatment=${encodeURIComponent("Hudvårdskonsultation")}">Boka konsultation →</a></div>`;

  const DISCLAIMER = `<div class="ha-disclaimer">Detta är en vägledning och ersätter inte en professionell hudanalys på plats.</div>`;

  /* ---------- Pre/post care advice per treatment family ---------- */

  const CARE = {
    microneedling: {
      label: "Microneedling / Mesoterapi",
      before: [
        "Undvik retinol/A-vitamin, AHA/BHA-syror och peeling 3–5 dagar före",
        "Undvik solning och solarium minst 1 vecka före",
        "Kom utan smink om möjligt",
        "Undvik blodförtunnande (t.ex. Ipren) 24 h före om möjligt",
      ],
      after: [
        "Rör inte huden med otvättade händer första dygnet",
        "Ingen smink på 24 timmar",
        "Undvik träning, bastu och bad 48 timmar",
        "Använd SPF 50 dagligen i minst 2 veckor",
        "Lätt rodnad 1–3 dagar är normalt",
      ],
    },
    hifu: {
      label: "HIFU",
      before: [
        "Kom med ren hud utan smink om möjligt",
        "Undvik solbränna på området före behandling",
        "Meddela oss om du har fillers/botox i området",
      ],
      after: [
        "Lätt rodnad eller ömhet några dagar är normalt",
        "Undvik stark värme (bastu, het dusch) 48 timmar",
        "Använd SPF 50 dagligen",
        "Fullt resultat utvecklas gradvis under 2–3 månader",
      ],
    },
    peeling: {
      label: "Kemisk peeling",
      before: [
        "Undvik retinol och syror 5–7 dagar före",
        "Undvik solning 1–2 veckor före",
        "Undvik vaxning/rakning av området 48 h före",
      ],
      after: [
        "Huden kan fjälla lätt några dagar — det är normalt",
        "Peta eller riv aldrig i fjällande hud",
        "SPF 50 varje dag i minst 2 veckor — mycket viktigt",
        "Undvik träning och bastu 24–48 timmar",
        "Återfukta rikligt morgon och kväll",
      ],
    },
    laser: {
      label: "Laser",
      before: [
        "Undvik solning och brun-utan-sol 2 veckor före",
        "Undvik retinol/syror 5 dagar före",
        "Raka området vid behov — vaxa inte",
      ],
      after: [
        "SPF 50 dagligen i minst 4 veckor",
        "Undvik het dusch, bastu och träning 24–48 timmar",
        "Lätt rodnad/svullnad är normalt första dagarna",
        "Kläm eller peta inte på behandlat område",
      ],
    },
    hydrafacial: {
      label: "HydraFacial / Ansiktsbehandling",
      before: [
        "Inga särskilda förberedelser krävs",
        "Undvik peeling hemma 2–3 dagar före",
        "Kom gärna utan smink",
      ],
      after: [
        "Direkt lyster — ingen återhämtningstid",
        "Undvik smink resten av dagen om möjligt",
        "Använd SPF dagligen",
        "Drick extra vatten för bästa resultat",
      ],
    },
    plasma: {
      label: "Plasma",
      before: [
        "Undvik solning 2 veckor före",
        "Undvik retinol/syror 5 dagar före",
        "Konsultation krävs för vissa plasmabehandlingar",
      ],
      after: [
        "Små punkter/skorpor kan synas några dagar — peta inte",
        "Håll området torrt första dygnet",
        "SPF 50 dagligen i 4 veckor",
        "Undvik smink på området tills det läkt",
      ],
    },
  };

  function careHTML(key) {
    const c = CARE[key];
    return `
      <div class="ha-care">
        <div class="ha-care-col"><h5>📋 Före behandlingen</h5><ul>${c.before.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="ha-care-col"><h5>🌸 Efter behandlingen</h5><ul>${c.after.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>`;
  }

  /* ---------- Routines per skin type ---------- */

  const ROUTINES = {
    torr: {
      label: "Torr hud",
      morning: ["Mild kräm-rengöring", "Hyaluronsyra-serum på fuktig hud", "Rik återfuktande kräm", "SPF 50"],
      evening: ["Olje- eller kräm-rengöring", "Återfuktande serum", "Näringsrik nattkräm"],
      tips: "Undvik skummande rengöringar och hett vatten. Din hud älskar hyaluronsyra och ceramider.",
      treatments: [
        ["HydraFacial", "Djup återfuktning med aktiva serum — direkt lyster."],
        ["Mesojun + Hyaluronsyra 3%", "150 mg hyaluronsyra för djup, långvarig återfuktning."],
      ],
    },
    fet: {
      label: "Fet / blandhud",
      morning: ["Mild gel-rengöring", "Lätt oljefri återfuktning", "SPF 50 (oljefri)"],
      evening: ["Dubbelrengöring vid smink", "BHA/salicylsyra 2–3 ggr/vecka", "Lätt nattkräm"],
      tips: "Skippa inte återfuktning — uttorkad hud producerar mer talg. Rengör aldrig mer än 2 ggr/dag.",
      treatments: [
        ["Laser Carbon + HydraFacial", "Djuprengör porer och minskar talgproduktion — perfekt för fet hy."],
        ["Cold Plasma", "Lugnar inflammation och renar på djupet — toppval vid akne och stora porer."],
      ],
    },
    kanslig: {
      label: "Känslig hud",
      morning: ["Mycket mild rengöring (eller bara ljummet vatten)", "Lugnande serum (centella/niacinamid)", "Parfymfri kräm", "Mineralbaserad SPF"],
      evening: ["Mild rengöring", "Barriärstärkande kräm med ceramider"],
      tips: "Introducera alltid en ny produkt i taget. Undvik parfym, alkohol och starka syror.",
      treatments: [
        ["Klassisk ansiktsrengöring", "Skonsam djuprengöring anpassad för känslig hud."],
        ["Hudvårdskonsultation", "Vi analyserar din hud och lägger en trygg, skräddarsydd plan."],
      ],
    },
    normal: {
      label: "Normal hud",
      morning: ["Mild rengöring", "C-vitaminserum", "Lätt återfuktning", "SPF 50"],
      evening: ["Rengöring", "Retinol 2–3 kvällar/vecka (börja långsamt)", "Nattkräm"],
      tips: "Underhåll är nyckeln — regelbunden ansiktsbehandling var 4–6 vecka håller huden i toppform.",
      treatments: [
        ["Ansiktsbehandling (HydraFacial)", "Underhållsbehandling som bevarar lyster och ren hud."],
        ["Vitamin C Glow Facial", "Boostar lyster och jämnar ut hudtonen."],
      ],
    },
  };

  function routineHTML(key) {
    const r = ROUTINES[key];
    return `
      <div class="ha-care">
        <div class="ha-care-col"><h5>🌅 Morgon</h5><ul>${r.morning.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="ha-care-col"><h5>🌙 Kväll</h5><ul>${r.evening.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>
      <div class="ha-note">💡 ${r.tips}</div>
      <p class="ha-p"><strong>Behandlingar hos oss som passar dig:</strong></p>
      ${r.treatments.map(([n, why]) => treatmentCard(n, why)).join("")}`;
  }

  /* ---------- Recommendation map: concern → treatments ---------- */

  const FACE_CONCERNS = {
    akne: {
      label: "Akne & orena porer",
      intro: "För akne och orena porer rekommenderar vi behandlingar som rengör på djupet och lugnar inflammation:",
      recs: [
        ["Cold Plasma", "Desinficerar på djupet och lugnar inflammation — perfekt vid aktiv akne."],
        ["Laser Carbon + HydraFacial", "Djuprengör porerna och minskar pigmentering efter akne."],
        ["Oxygen Ansiktsbehandling", "Komplett djuprengöring med portömning och LED."],
      ],
      care: "hydrafacial",
    },
    pigment: {
      label: "Pigmentfläckar & ojämn hudton",
      intro: "För pigmentfläckar och ojämn hudton är dessa våra mest effektiva behandlingar:",
      recs: [
        ["Microneedling + TRANEX PRO", "Tranexamsyra + C-vitamin — riktad mot pigmentfläckar."],
        ["Pico Laser", "Bryter ner pigment och stimulerar kollagen."],
        ["Vitamin C Glow Facial", "Jämnar ut hudtonen och ger lyster."],
      ],
      care: "laser",
    },
    rynkor: {
      label: "Rynkor & fina linjer",
      intro: "För rynkor och fina linjer rekommenderar vi kollagenstimulerande behandlingar:",
      recs: [
        ["VMAX HIFU & RF – Hela ansiktet", "Lyfter och stramar upp — resultat som håller 1–2 år."],
        ["B-LEUA RELAX", "Naturligt alternativ till botox — mjukar upp mimiska linjer."],
        ["COLLAGEN-HA PRO + Mesojun", "Marint kollagen + hyaluronsyra mot ålderstecken."],
      ],
      care: "hifu",
    },
    slapp: {
      label: "Slapp hud & förlorad fasthet",
      intro: "För att återfå fasthet och definierad ansiktskontur:",
      recs: [
        ["VMAX HIFU & RF – Hela ansiktet", "Kollagenboost på djupet — lyft utan kirurgi."],
        ["FIRMPRO + Mesojun", "Definierar ansiktsovalen och motverkar slapphet."],
        ["PlasmaJet – Hela ansiktet", "Synligt lyft genom naturlig kollagenproduktion."],
      ],
      care: "hifu",
    },
    arr: {
      label: "Ärr & bristningar",
      intro: "För akneärr och ärrbildning har vi specialiserade behandlingar:",
      recs: [
        ["SCARPRO + Mesojun + Microneedling", "Vår mest kompletta ärrbehandling."],
        ["Algpeeling", "Naturlig peeling som förbättrar akneärr och porer."],
        ["Pico Laser", "Effektiv mot ytliga ärr och ojämn hudstruktur."],
      ],
      care: "microneedling",
    },
    glamig: {
      label: "Trött & glåmig hy",
      intro: "För direkt lyster och fräschör:",
      recs: [
        ["Ansiktsbehandling (HydraFacial)", "Direkt lyster — inga stilleståndsdagar."],
        ["BOOSTER PRO EXOSOMER", "Exosomer för maximal glöd och föryngring."],
        ["Vitamin C Glow Facial", "C-vitaminboost för trött hud."],
      ],
      care: "hydrafacial",
    },
    ogon: {
      label: "Mörka ringar & trötta ögon",
      intro: "För ögonpartiet rekommenderar vi:",
      recs: [
        ["Mesoterapi Eye Lift", "Minskar fina linjer, påsar och mörka ringar."],
        ["Pigmentbehandling för ögonpartiet", "Riktad mot mörka ringar och melasma."],
        ["HIFU Ögonbehandling", "Lyfter och stramar upp utan nålar."],
      ],
      care: "microneedling",
    },
  };

  const BODY_CONCERNS = {
    forma: {
      label: "Kroppsformning & fasthet",
      intro: "För kroppsformning och fastare hud:",
      recs: [
        ["Mesoterapi för magen", "Fastare hud och mindre fettansamlingar."],
        ["Mesoterapi för midja & höfter", "Formar midjan och reducerar love handles."],
        ["HIFU – Mage", "Stramar upp, särskilt efter viktminskning eller graviditet."],
      ],
      care: "microneedling",
    },
    bristningar: {
      label: "Bristningar",
      intro: "För bristningar (efter graviditet eller viktförändring):",
      recs: [
        ["Mesoterapi mot bristningar – Mage", "Minskar synligheten av bristningar på magen."],
        ["Laser – Stretch Marks (Mage)", "Laser för både nya (röda) och äldre (vita) bristningar."],
        ["Mesoterapi mot bristningar – Höfter & Lår", "Förbättrar ton och struktur på höfter/lår."],
      ],
      care: "laser",
    },
    ryggakne: {
      label: "Akne på ryggen",
      intro: "För akne och orenheter på ryggen:",
      recs: [["Ryggbehandling mot akne", "Antibakteriell djuprengöring som lugnar inflammation."]],
      care: "peeling",
    },
    morka: {
      label: "Mörka områden (knän, armhålor m.m.)",
      intro: "För mörka eller ojämna hudpartier på kroppen:",
      recs: [
        ["Behandling för armhålor", "Ljusar upp och lugnar mörka armhålor."],
        ["Behandling för knän", "För mörka eller ojämna knän."],
        ["Behandling för ben", "Lyster och jämnare hudton för benen."],
      ],
      care: "peeling",
    },
    avslappning: {
      label: "Avslappning & massage",
      intro: "För välbehövlig avslappning:",
      recs: [
        ["Helkroppsmassage", "Komplett massage för hela kroppen."],
        ["Ryggmassage med radiofrekvens", "Löser upp spända vävnader och myoser."],
        ["Lätt lymfmassage", "Minskar svullnad och stimulerar cirkulationen."],
      ],
      care: null,
    },
  };

  /* ---------- Chat engine ---------- */

  let msgsEl, optionsEl;

  function addMsg(html, who) {
    const div = document.createElement("div");
    div.className = `ha-msg ha-msg--${who || "bot"}`;
    div.innerHTML = html;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function setOptions(opts) {
    optionsEl.innerHTML = "";
    opts.forEach(([label, fn]) => {
      const b = document.createElement("button");
      b.className = "ha-opt";
      b.textContent = label;
      b.addEventListener("click", () => {
        addMsg(label, "user");
        fn();
      });
      optionsEl.appendChild(b);
    });
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function homeOption() {
    return ["🏠 Till huvudmenyn", start];
  }

  function start() {
    addMsg("Vad kan jag hjälpa dig med? 🌸");
    setOptions([
      ["🔍 Hitta rätt behandling för mig", flowFind],
      ["💧 Hudvårdsrutin för min hudtyp", flowRoutine],
      ["📋 Råd före & efter behandling", flowCare],
    ]);
  }

  function flowFind() {
    addMsg("Vilket område vill du förbättra?");
    setOptions([
      ["✨ Ansikte", askSkinType],
      ["👁 Ögon & läppar", () => showRecs(FACE_CONCERNS.ogon)],
      ["🧴 Kropp", askBodyConcern],
      ["💇‍♀️ Hår & hårbotten", showHair],
      homeOption(),
    ]);
  }

  function askSkinType() {
    addMsg("Hur skulle du beskriva din hud?");
    setOptions([
      ["💧 Torr", () => askFaceConcern("torr")],
      ["✨ Fet / blandhud", () => askFaceConcern("fet")],
      ["🌸 Känslig", () => askFaceConcern("kanslig")],
      ["😊 Normal", () => askFaceConcern("normal")],
      ["🤷‍♀️ Vet inte", () => askFaceConcern(null)],
    ]);
  }

  let currentSkinType = null;

  function askFaceConcern(skinType) {
    currentSkinType = skinType;
    if (skinType === null) {
      addMsg(`Ingen fara! ${CONSULT_NOTE} Men låt oss ändå kika på vad som besvärar dig mest:`);
    }
    addMsg("Vad är ditt största hudbekymmer just nu?");
    setOptions([
      ["🔴 Akne & orena porer", () => showRecs(FACE_CONCERNS.akne)],
      ["🟤 Pigmentfläckar & ojämn ton", () => showRecs(FACE_CONCERNS.pigment)],
      ["📉 Rynkor & fina linjer", () => showRecs(FACE_CONCERNS.rynkor)],
      ["⬇️ Slapp hud & fasthet", () => showRecs(FACE_CONCERNS.slapp)],
      ["🌿 Ärr", () => showRecs(FACE_CONCERNS.arr)],
      ["😴 Trött & glåmig hy", () => showRecs(FACE_CONCERNS.glamig)],
      homeOption(),
    ]);
  }

  function askBodyConcern() {
    addMsg("Vad vill du fokusera på?");
    setOptions([
      ["🔥 Kroppsformning & fasthet", () => showRecs(BODY_CONCERNS.forma)],
      ["🌿 Bristningar", () => showRecs(BODY_CONCERNS.bristningar)],
      ["🔴 Akne på ryggen", () => showRecs(BODY_CONCERNS.ryggakne)],
      ["🟤 Mörka områden", () => showRecs(BODY_CONCERNS.morka)],
      ["💆‍♀️ Massage & avslappning", () => showRecs(BODY_CONCERNS.avslappning)],
      homeOption(),
    ]);
  }

  function showHair() {
    addMsg(`För hår och hårbotten rekommenderar vi:
      ${treatmentCard("Hår Microneedling", "Stärker hårsäckarna och stimulerar ny hårväxt.")}
      ${treatmentCard("Mesojun + HAIRPRO Exosomes", "Exosomer som motverkar håravfall.")}
      ${DISCLAIMER}`);
    setOptions([
      ["📋 Råd före & efter microneedling", () => showCare("microneedling")],
      homeOption(),
    ]);
  }

  function showRecs(concern) {
    let html = `<p class="ha-p">${concern.intro}</p>` + concern.recs.map(([n, why]) => treatmentCard(n, why)).join("");
    if (currentSkinType && ROUTINES[currentSkinType]) {
      html += `<div class="ha-note">💡 Tips: du med ${ROUTINES[currentSkinType].label.toLowerCase()} kan också be om min dagliga hudvårdsrutin i menyn.</div>`;
    }
    html += CONSULT_NOTE + DISCLAIMER;
    addMsg(html);
    const opts = [];
    if (concern.care) opts.push(["📋 Råd före & efter behandlingen", () => showCare(concern.care)]);
    opts.push(["🔁 Annat bekymmer", flowFind], homeOption());
    setOptions(opts);
  }

  function flowRoutine() {
    addMsg("Vilken hudtyp har du?");
    setOptions([
      ["💧 Torr", () => showRoutine("torr")],
      ["✨ Fet / blandhud", () => showRoutine("fet")],
      ["🌸 Känslig", () => showRoutine("kanslig")],
      ["😊 Normal", () => showRoutine("normal")],
      ["🤷‍♀️ Vet inte", () => {
        addMsg(`Då rekommenderar jag att börja med en hudanalys: ${CONSULT_NOTE}`);
        setOptions([homeOption()]);
      }],
    ]);
  }

  function showRoutine(key) {
    addMsg(`<p class="ha-p"><strong>Daglig rutin för ${ROUTINES[key].label.toLowerCase()}:</strong></p>` + routineHTML(key) + DISCLAIMER);
    setOptions([["🔁 Annan hudtyp", flowRoutine], homeOption()]);
  }

  function flowCare() {
    addMsg("Vilken behandling gäller det?");
    setOptions([
      ["💉 Microneedling / Mesoterapi", () => showCare("microneedling")],
      ["🌟 HIFU", () => showCare("hifu")],
      ["🧪 Kemisk peeling", () => showCare("peeling")],
      ["⚡ Laser", () => showCare("laser")],
      ["💧 HydraFacial", () => showCare("hydrafacial")],
      ["🩵 Plasma", () => showCare("plasma")],
      homeOption(),
    ]);
  }

  function showCare(key) {
    addMsg(`<p class="ha-p"><strong>${CARE[key].label} — så förbereder du dig och tar hand om huden efteråt:</strong></p>` + careHTML(key) +
      `<div class="ha-note">Har du frågor inför din behandling? Ring oss på <a href="tel:+46793333476">079-333 34 76</a>.</div>`);
    setOptions([["🔁 Annan behandling", flowCare], homeOption()]);
  }

  /* ---------- Widget UI ---------- */

  function buildWidget() {
    const fab = document.createElement("button");
    fab.className = "ha-fab";
    fab.innerHTML = "💬";
    fab.setAttribute("aria-label", "Öppna hudassistenten");

    const fabLabel = document.createElement("span");
    fabLabel.className = "ha-fab-label";
    fabLabel.textContent = "Hudassistent";
    fab.appendChild(fabLabel);

    const panel = document.createElement("div");
    panel.className = "ha-panel";
    panel.innerHTML = `
      <div class="ha-header">
        <img src="images/logo.jpg" alt="" class="ha-avatar" />
        <div>
          <div class="ha-title">Nouras Hudassistent</div>
          <div class="ha-sub">Hitta rätt behandling för din hud</div>
        </div>
        <button class="ha-close" aria-label="Stäng">✕</button>
      </div>
      <div class="ha-msgs"></div>
      <div class="ha-options"></div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    msgsEl = panel.querySelector(".ha-msgs");
    optionsEl = panel.querySelector(".ha-options");

    let started = false;
    function toggle(open) {
      panel.classList.toggle("open", open);
      fab.classList.toggle("hidden", open);
      if (open && !started) {
        started = true;
        addMsg("Hej! 👋 Jag är Nouras hudassistent. Jag hjälper dig att förstå din hud och hitta rätt behandling bland våra " +
          TREATMENT_CATEGORIES.reduce((n, c) => n + c.treatments.length, 0) + " behandlingar.");
        start();
      }
    }

    fab.addEventListener("click", () => toggle(true));
    panel.querySelector(".ha-close").addEventListener("click", () => toggle(false));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
