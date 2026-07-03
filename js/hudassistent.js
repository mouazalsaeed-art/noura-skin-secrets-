/* Noura Skin Secrets — Hudassistent v2
   Guided + free-text skin advisor in Swedish, English and Arabic.
   Understands typed questions via keyword matching and recommends
   treatments from the live catalog with routines and pre/post advice. */

(function () {
  "use strict";

  /* ---------- Language ---------- */

  function lang() {
    const l = localStorage.getItem("nss-lang") || "sv";
    return ["sv", "en", "ar"].includes(l) ? l : "sv";
  }
  function tr(obj) {
    return obj[lang()] !== undefined ? obj[lang()] : obj.sv;
  }

  const UI = {
    title: { sv: "Nouras Hudassistent", en: "Noura's Skin Assistant", ar: "مساعدة نورا للبشرة" },
    sub: { sv: "Hitta rätt behandling för din hud", en: "Find the right treatment for your skin", ar: "اعثري على العلاج المناسب لبشرتك" },
    fabLabel: { sv: "Hudassistent", en: "Skin assistant", ar: "مساعدة البشرة" },
    inputPh: { sv: "Skriv din fråga här…", en: "Type your question here…", ar: "اكتبي سؤالك هنا…" },
    send: { sv: "Skicka", en: "Send", ar: "إرسال" },
    welcome: {
      sv: "Hej! 👋 Jag är Nouras hudassistent. Ställ en fråga direkt i rutan nedan — eller välj ett alternativ.",
      en: "Hi! 👋 I'm Noura's skin assistant. Type a question below — or pick an option.",
      ar: "أهلاً! 👋 أنا مساعدة نورا للبشرة. اكتبي سؤالك مباشرة في الخانة بالأسفل — أو اختاري من الخيارات.",
    },
    menu: { sv: "Vad kan jag hjälpa dig med? 🌸", en: "What can I help you with? 🌸", ar: "كيف أقدر أساعدك؟ 🌸" },
    optFind: { sv: "🔍 Hitta rätt behandling", en: "🔍 Find the right treatment", ar: "🔍 العلاج المناسب لي" },
    optRoutine: { sv: "💧 Hudvårdsrutin", en: "💧 Skin care routine", ar: "💧 روتين العناية" },
    optCare: { sv: "📋 Före & efter behandling", en: "📋 Before & after care", ar: "📋 قبل وبعد الجلسة" },
    optHome: { sv: "🏠 Huvudmenyn", en: "🏠 Main menu", ar: "🏠 القائمة الرئيسية" },
    optOther: { sv: "🔁 Annat bekymmer", en: "🔁 Another concern", ar: "🔁 مشكلة أخرى" },
    optOtherType: { sv: "🔁 Annan hudtyp", en: "🔁 Another skin type", ar: "🔁 نوع بشرة آخر" },
    optOtherTreat: { sv: "🔁 Annan behandling", en: "🔁 Another treatment", ar: "🔁 علاج آخر" },
    optCareThis: { sv: "📋 Råd före & efter", en: "📋 Before & after advice", ar: "📋 نصائح قبل وبعد" },
    areaQ: { sv: "Vilket område vill du förbättra?", en: "Which area would you like to improve?", ar: "أي منطقة تريدين تحسينها؟" },
    areaFace: { sv: "✨ Ansikte", en: "✨ Face", ar: "✨ الوجه" },
    areaEyes: { sv: "👁 Ögon & läppar", en: "👁 Eyes & lips", ar: "👁 العيون والشفاه" },
    areaBody: { sv: "🧴 Kropp", en: "🧴 Body", ar: "🧴 الجسم" },
    areaHair: { sv: "💇‍♀️ Hår & hårbotten", en: "💇‍♀️ Hair & scalp", ar: "💇‍♀️ الشعر وفروة الرأس" },
    skinQ: { sv: "Hur skulle du beskriva din hud?", en: "How would you describe your skin?", ar: "كيف تصفين بشرتك؟" },
    skinDry: { sv: "💧 Torr", en: "💧 Dry", ar: "💧 جافة" },
    skinOily: { sv: "✨ Fet / blandhud", en: "✨ Oily / combination", ar: "✨ دهنية / مختلطة" },
    skinSens: { sv: "🌸 Känslig", en: "🌸 Sensitive", ar: "🌸 حساسة" },
    skinNorm: { sv: "😊 Normal", en: "😊 Normal", ar: "😊 عادية" },
    skinIdk: { sv: "🤷‍♀️ Vet inte", en: "🤷‍♀️ Not sure", ar: "🤷‍♀️ لا أعرف" },
    concernQ: { sv: "Vad är ditt största hudbekymmer just nu?", en: "What is your biggest skin concern right now?", ar: "ما هي أكبر مشكلة تواجه بشرتك حالياً؟" },
    bodyQ: { sv: "Vad vill du fokusera på?", en: "What would you like to focus on?", ar: "على ماذا تريدين التركيز؟" },
    careQ: { sv: "Vilken behandling gäller det?", en: "Which treatment is it about?", ar: "عن أي علاج تسألين؟" },
    routineQ: { sv: "Vilken hudtyp har du?", en: "What is your skin type?", ar: "ما هو نوع بشرتك؟" },
    routineFor: { sv: "Daglig rutin för", en: "Daily routine for", ar: "الروتين اليومي لـ" },
    morning: { sv: "🌅 Morgon", en: "🌅 Morning", ar: "🌅 الصباح" },
    evening: { sv: "🌙 Kväll", en: "🌙 Evening", ar: "🌙 المساء" },
    beforeH: { sv: "📋 Före behandlingen", en: "📋 Before your treatment", ar: "📋 قبل الجلسة" },
    afterH: { sv: "🌸 Efter behandlingen", en: "🌸 After your treatment", ar: "🌸 بعد الجلسة" },
    fitsYou: { sv: "Behandlingar hos oss som passar dig:", en: "Treatments at our salon that suit you:", ar: "علاجات لدينا تناسبك:" },
    book: { sv: "Boka denna behandling →", en: "Book this treatment →", ar: "احجزي هذا العلاج ←" },
    bookConsult: { sv: "Boka konsultation →", en: "Book a consultation →", ar: "احجزي استشارة ←" },
    consult: {
      sv: "💡 Osäker? Boka en <strong>Hudvårdskonsultation (20 min, 450 kr)</strong> så gör Nour en personlig hudanalys.",
      en: "💡 Not sure? Book a <strong>skin consultation (20 min, 450 kr)</strong> and Nour will analyse your skin in person.",
      ar: "💡 غير متأكدة؟ احجزي <strong>استشارة بشرة (20 دقيقة، 450 كرون)</strong> وستقوم نور بتحليل بشرتك شخصياً.",
    },
    disclaimer: {
      sv: "Detta är en vägledning och ersätter inte en professionell hudanalys på plats.",
      en: "This is guidance only and does not replace a professional in-person skin analysis.",
      ar: "هذه إرشادات عامة ولا تغني عن تحليل البشرة الاحترافي في الصالون.",
    },
    idkAnswer: {
      sv: "Ingen fara! Låt oss ändå kika på vad som besvärar dig mest:",
      en: "No worries! Let's still look at what bothers you most:",
      ar: "لا مشكلة! لنرَ ما الذي يزعجك أكثر:",
    },
    routineIdk: {
      sv: "Då rekommenderar jag att börja med en hudanalys:",
      en: "Then I recommend starting with a skin analysis:",
      ar: "إذاً أنصحك بالبدء بتحليل للبشرة:",
    },
    hairIntro: { sv: "För hår och hårbotten rekommenderar vi:", en: "For hair and scalp we recommend:", ar: "للشعر وفروة الرأس ننصح بـ:" },
    tipRoutine: {
      sv: "💡 Tips: skriv din hudtyp här i chatten så får du en daglig hudvårdsrutin.",
      en: "💡 Tip: type your skin type in the chat to get a daily skin care routine.",
      ar: "💡 نصيحة: اكتبي نوع بشرتك في الدردشة لتحصلي على روتين عناية يومي.",
    },
    careQuestions: {
      sv: "Har du frågor inför din behandling? Ring oss på <a href=\"tel:+46793333476\">079-333 34 76</a>.",
      en: "Questions before your treatment? Call us on <a href=\"tel:+46793333476\">079-333 34 76</a>.",
      ar: "عندك أسئلة قبل الجلسة؟ اتصلي بنا على <a href=\"tel:+46793333476\">079-333 34 76</a>.",
    },
    hoursA: {
      sv: "Vi har öppet <strong>alla dagar 10:00–20:00</strong>, endast efter bokning. 🌸",
      en: "We are open <strong>every day 10:00–20:00</strong>, by appointment only. 🌸",
      ar: "نعمل <strong>يومياً من 10:00 حتى 20:00</strong>، بالحجز المسبق فقط. 🌸",
    },
    locationA: {
      sv: "Du hittar oss på <strong>Kungsängsgatan 5B, 753 22 Uppsala</strong> — mitt i centrala Uppsala. 📍",
      en: "You'll find us at <strong>Kungsängsgatan 5B, 753 22 Uppsala</strong> — right in central Uppsala. 📍",
      ar: "تجديننا في <strong>Kungsängsgatan 5B, 753 22 Uppsala</strong> — في قلب أوبسالا. 📍",
    },
    contactA: {
      sv: "Ring oss på <a href=\"tel:+46793333476\">079-333 34 76</a>, mejla <a href=\"mailto:nouraskinsecrets@gmail.com\">nouraskinsecrets@gmail.com</a> eller skriv på Instagram <a href=\"https://instagram.com/noura_skin_secrets\" target=\"_blank\" rel=\"noopener\">@noura_skin_secrets</a>. 💌",
      en: "Call us on <a href=\"tel:+46793333476\">079-333 34 76</a>, email <a href=\"mailto:nouraskinsecrets@gmail.com\">nouraskinsecrets@gmail.com</a> or message us on Instagram <a href=\"https://instagram.com/noura_skin_secrets\" target=\"_blank\" rel=\"noopener\">@noura_skin_secrets</a>. 💌",
      ar: "اتصلي على <a href=\"tel:+46793333476\">079-333 34 76</a>، أو راسلينا على <a href=\"mailto:nouraskinsecrets@gmail.com\">nouraskinsecrets@gmail.com</a> أو على إنستغرام <a href=\"https://instagram.com/noura_skin_secrets\" target=\"_blank\" rel=\"noopener\">@noura_skin_secrets</a>. 💌",
    },
    bookA: {
      sv: "Så roligt! Boka enkelt via vårt <a href=\"boka.html\"><strong>bokningsformulär</strong></a> — vi bekräftar inom 24 timmar. 🌸",
      en: "Wonderful! Book easily via our <a href=\"boka.html\"><strong>booking form</strong></a> — we confirm within 24 hours. 🌸",
      ar: "رائع! احجزي بسهولة عبر <a href=\"boka.html\"><strong>نموذج الحجز</strong></a> — نؤكد الموعد خلال 24 ساعة. 🌸",
    },
    priceIntro: {
      sv: "Här är behandlingar som matchar din sökning:",
      en: "Here are treatments matching your search:",
      ar: "هذه العلاجات المطابقة لبحثك:",
    },
    allTreatments: {
      sv: "Du hittar alla våra <span></span>87 behandlingar med priser på <a href=\"behandlingar.html\"><strong>behandlingssidan</strong></a>. 📋",
      en: "You'll find all 87 treatments with prices on the <a href=\"behandlingar.html\"><strong>treatments page</strong></a>. 📋",
      ar: "تجدين كل علاجاتنا الـ87 مع الأسعار في <a href=\"behandlingar.html\"><strong>صفحة العلاجات</strong></a>. 📋",
    },
    photoA: {
      sv: "Just nu analyserar jag huden genom smarta frågor i chatten 💬 — fotoanalys är på väg! För en riktig bedömning av din hud rekommenderar jag en hudvårdskonsultation:",
      en: "Right now I analyse your skin through smart questions in the chat 💬 — photo analysis is coming soon! For a real assessment of your skin I recommend a consultation:",
      ar: "حالياً أحلل البشرة عبر أسئلة ذكية في الدردشة 💬 — تحليل الصور قادم قريباً! ولتقييم حقيقي لبشرتك أنصحك باستشارة البشرة:",
    },
    thanksA: {
      sv: "Varsågod! 💕 Finns det något mer jag kan hjälpa dig med?",
      en: "You're welcome! 💕 Is there anything else I can help you with?",
      ar: "على الرحب والسعة! 💕 هل أقدر أساعدك بشيء آخر؟",
    },
    greetA: {
      sv: "Hej hej! 👋 Vad kan jag hjälpa dig med idag?",
      en: "Hello! 👋 What can I help you with today?",
      ar: "أهلاً وسهلاً! 👋 كيف أقدر أساعدك اليوم؟",
    },
    fallbackA: {
      sv: "Hmm, jag är inte säker på att jag förstod. 🤔 Prova att skriva t.ex. <em>\"akne\"</em>, <em>\"pigmentfläckar\"</em>, <em>\"HydraFacial\"</em>, <em>\"öppettider\"</em> — eller välj nedan:",
      en: "Hmm, I'm not sure I understood. 🤔 Try typing e.g. <em>\"acne\"</em>, <em>\"pigmentation\"</em>, <em>\"HydraFacial\"</em>, <em>\"opening hours\"</em> — or choose below:",
      ar: "همم، لم أفهم تماماً. 🤔 جربي كتابة مثلاً <em>\"حبوب\"</em>، <em>\"تصبغات\"</em>، <em>\"هيدرافيشل\"</em>، <em>\"الدوام\"</em> — أو اختاري من الأسفل:",
    },
  };

  /* ---------- Catalog helpers ---------- */

  function findTreatment(namePart) {
    for (const cat of TREATMENT_CATEGORIES) {
      const t = cat.treatments.find((t) => t.name.includes(namePart));
      if (t) return t;
    }
    return null;
  }

  function searchTreatments(q) {
    const needle = q.toLowerCase();
    const hits = [];
    for (const cat of TREATMENT_CATEGORIES) {
      for (const t of cat.treatments) {
        if (t.name.toLowerCase().includes(needle) || (t.desc && t.desc.toLowerCase().includes(needle))) {
          hits.push(t);
          if (hits.length >= 4) return hits;
        }
      }
    }
    return hits;
  }

  function treatmentCard(namePart, why) {
    const t = typeof namePart === "object" ? namePart : findTreatment(namePart);
    if (!t) return "";
    const bookHref = `boka.html?treatment=${encodeURIComponent(t.name)}`;
    return `
      <div class="ha-treatment">
        <div class="ha-treatment-name">${t.name}</div>
        <div class="ha-treatment-meta">${t.duration} · <strong>${t.price}</strong></div>
        ${why ? `<div class="ha-treatment-why">${why}</div>` : ""}
        <a class="ha-book-btn" href="${bookHref}">${tr(UI.book)}</a>
      </div>`;
  }

  function consultNote() {
    return `<div class="ha-note">${tr(UI.consult)}
      <a class="ha-book-btn" href="boka.html?treatment=${encodeURIComponent("Hudvårdskonsultation")}">${tr(UI.bookConsult)}</a></div>`;
  }
  function disclaimer() {
    return `<div class="ha-disclaimer">${tr(UI.disclaimer)}</div>`;
  }

  /* ---------- Pre/post care per treatment family ---------- */

  const CARE = {
    microneedling: {
      label: { sv: "Microneedling / Mesoterapi", en: "Microneedling / Mesotherapy", ar: "ميكرونيدلينغ / ميزوثيرابي" },
      before: {
        sv: ["Undvik retinol/A-vitamin och starka syror 3–5 dagar före", "Undvik solning och solarium minst 1 vecka före", "Kom utan smink om möjligt", "Undvik blodförtunnande (t.ex. Ipren) 24 h före om möjligt"],
        en: ["Avoid retinol/vitamin A and strong acids 3–5 days before", "Avoid sunbathing and tanning beds at least 1 week before", "Come without makeup if possible", "Avoid blood thinners (e.g. ibuprofen) 24 h before if possible"],
        ar: ["تجنبي الريتينول/فيتامين A والأحماض القوية قبل 3–5 أيام", "تجنبي التشمس والتسمير قبل أسبوع على الأقل", "احضري بدون مكياج إن أمكن", "تجنبي مميعات الدم (مثل الإيبوبروفين) قبل 24 ساعة إن أمكن"],
      },
      after: {
        sv: ["Rör inte huden med otvättade händer första dygnet", "Ingen smink på 24 timmar", "Undvik träning, bastu och bad 48 timmar", "Använd SPF 50 dagligen i minst 2 veckor", "Lätt rodnad 1–3 dagar är normalt"],
        en: ["Don't touch your skin with unwashed hands the first day", "No makeup for 24 hours", "Avoid exercise, sauna and swimming for 48 hours", "Use SPF 50 daily for at least 2 weeks", "Mild redness for 1–3 days is normal"],
        ar: ["لا تلمسي بشرتك بيدين غير نظيفتين في اليوم الأول", "بدون مكياج لمدة 24 ساعة", "تجنبي الرياضة والساونا والسباحة 48 ساعة", "استخدمي واقي شمس SPF 50 يومياً لأسبوعين على الأقل", "الاحمرار الخفيف لمدة 1–3 أيام طبيعي"],
      },
    },
    hifu: {
      label: { sv: "HIFU", en: "HIFU", ar: "هايفو (HIFU)" },
      before: {
        sv: ["Kom med ren hud utan smink om möjligt", "Undvik solbränna på området före behandling", "Meddela oss om du har fillers/botox i området"],
        en: ["Come with clean skin, without makeup if possible", "Avoid sunburn on the area before treatment", "Tell us if you have fillers/botox in the area"],
        ar: ["احضري ببشرة نظيفة بدون مكياج إن أمكن", "تجنبي حروق الشمس في المنطقة قبل الجلسة", "أخبرينا إذا كان لديك فيلر/بوتوكس في المنطقة"],
      },
      after: {
        sv: ["Lätt rodnad eller ömhet några dagar är normalt", "Undvik stark värme (bastu, het dusch) 48 timmar", "Använd SPF 50 dagligen", "Fullt resultat utvecklas gradvis under 2–3 månader"],
        en: ["Mild redness or tenderness for a few days is normal", "Avoid strong heat (sauna, hot showers) for 48 hours", "Use SPF 50 daily", "Full results develop gradually over 2–3 months"],
        ar: ["الاحمرار أو الحساسية الخفيفة لعدة أيام أمر طبيعي", "تجنبي الحرارة العالية (ساونا، دش ساخن) 48 ساعة", "استخدمي واقي شمس SPF 50 يومياً", "النتيجة الكاملة تظهر تدريجياً خلال 2–3 أشهر"],
      },
    },
    peeling: {
      label: { sv: "Kemisk peeling", en: "Chemical peel", ar: "التقشير الكيميائي" },
      before: {
        sv: ["Undvik retinol och syror 5–7 dagar före", "Undvik solning 1–2 veckor före", "Undvik vaxning/rakning av området 48 h före"],
        en: ["Avoid retinol and acids 5–7 days before", "Avoid sunbathing 1–2 weeks before", "Avoid waxing/shaving the area 48 h before"],
        ar: ["تجنبي الريتينول والأحماض قبل 5–7 أيام", "تجنبي التشمس قبل أسبوع إلى أسبوعين", "تجنبي إزالة الشعر بالشمع/الحلاقة قبل 48 ساعة"],
      },
      after: {
        sv: ["Huden kan fjälla lätt några dagar — det är normalt", "Peta eller riv aldrig i fjällande hud", "SPF 50 varje dag i minst 2 veckor — mycket viktigt", "Undvik träning och bastu 24–48 timmar", "Återfukta rikligt morgon och kväll"],
        en: ["Light peeling for a few days is normal", "Never pick or pull flaking skin", "SPF 50 every day for at least 2 weeks — very important", "Avoid exercise and sauna 24–48 hours", "Moisturise generously morning and evening"],
        ar: ["تقشر البشرة الخفيف لعدة أيام طبيعي", "لا تنزعي القشور أبداً", "واقي شمس SPF 50 يومياً لأسبوعين على الأقل — مهم جداً", "تجنبي الرياضة والساونا 24–48 ساعة", "رطبي بكثرة صباحاً ومساءً"],
      },
    },
    laser: {
      label: { sv: "Laser", en: "Laser", ar: "الليزر" },
      before: {
        sv: ["Undvik solning och brun-utan-sol 2 veckor före", "Undvik retinol/syror 5 dagar före", "Raka området vid behov — vaxa inte"],
        en: ["Avoid sunbathing and self-tanner 2 weeks before", "Avoid retinol/acids 5 days before", "Shave the area if needed — do not wax"],
        ar: ["تجنبي التشمس وكريمات التسمير قبل أسبوعين", "تجنبي الريتينول/الأحماض قبل 5 أيام", "احلقي المنطقة عند الحاجة — لا تستخدمي الشمع"],
      },
      after: {
        sv: ["SPF 50 dagligen i minst 4 veckor", "Undvik het dusch, bastu och träning 24–48 timmar", "Lätt rodnad/svullnad är normalt första dagarna", "Kläm eller peta inte på behandlat område"],
        en: ["SPF 50 daily for at least 4 weeks", "Avoid hot showers, sauna and exercise 24–48 hours", "Mild redness/swelling is normal the first days", "Don't squeeze or pick the treated area"],
        ar: ["واقي شمس SPF 50 يومياً لأربعة أسابيع على الأقل", "تجنبي الدش الساخن والساونا والرياضة 24–48 ساعة", "الاحمرار/التورم الخفيف طبيعي في الأيام الأولى", "لا تضغطي أو تعبثي بالمنطقة المعالجة"],
      },
    },
    hydrafacial: {
      label: { sv: "HydraFacial / Ansiktsbehandling", en: "HydraFacial / Facial", ar: "هيدرافيشل / تنظيف بشرة" },
      before: {
        sv: ["Inga särskilda förberedelser krävs", "Undvik peeling hemma 2–3 dagar före", "Kom gärna utan smink"],
        en: ["No special preparation needed", "Avoid at-home peeling 2–3 days before", "Preferably come without makeup"],
        ar: ["لا تحتاجين تحضيرات خاصة", "تجنبي التقشير المنزلي قبل 2–3 أيام", "يفضل الحضور بدون مكياج"],
      },
      after: {
        sv: ["Direkt lyster — ingen återhämtningstid", "Undvik smink resten av dagen om möjligt", "Använd SPF dagligen", "Drick extra vatten för bästa resultat"],
        en: ["Instant glow — no downtime", "Avoid makeup for the rest of the day if possible", "Use SPF daily", "Drink extra water for best results"],
        ar: ["إشراقة فورية — بدون فترة تعافي", "تجنبي المكياج لبقية اليوم إن أمكن", "استخدمي واقي الشمس يومياً", "اشربي ماءً إضافياً لأفضل نتيجة"],
      },
    },
    plasma: {
      label: { sv: "Plasma", en: "Plasma", ar: "البلازما" },
      before: {
        sv: ["Undvik solning 2 veckor före", "Undvik retinol/syror 5 dagar före", "Konsultation krävs för vissa plasmabehandlingar"],
        en: ["Avoid sunbathing 2 weeks before", "Avoid retinol/acids 5 days before", "A consultation is required for some plasma treatments"],
        ar: ["تجنبي التشمس قبل أسبوعين", "تجنبي الريتينول/الأحماض قبل 5 أيام", "بعض علاجات البلازما تتطلب استشارة مسبقة"],
      },
      after: {
        sv: ["Små punkter/skorpor kan synas några dagar — peta inte", "Håll området torrt första dygnet", "SPF 50 dagligen i 4 veckor", "Undvik smink på området tills det läkt"],
        en: ["Tiny dots/crusts may show for a few days — don't pick", "Keep the area dry the first day", "SPF 50 daily for 4 weeks", "Avoid makeup on the area until healed"],
        ar: ["قد تظهر نقاط/قشور صغيرة لعدة أيام — لا تلمسيها", "حافظي على جفاف المنطقة في اليوم الأول", "واقي شمس SPF 50 يومياً لأربعة أسابيع", "تجنبي المكياج على المنطقة حتى تلتئم"],
      },
    },
  };

  function careHTML(key) {
    const c = CARE[key];
    return `
      <div class="ha-care">
        <div class="ha-care-col"><h5>${tr(UI.beforeH)}</h5><ul>${tr(c.before).map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="ha-care-col"><h5>${tr(UI.afterH)}</h5><ul>${tr(c.after).map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>`;
  }

  /* ---------- Routines per skin type ---------- */

  const ROUTINES = {
    torr: {
      label: { sv: "torr hud", en: "dry skin", ar: "البشرة الجافة" },
      morning: {
        sv: ["Mild kräm-rengöring", "Hyaluronsyra-serum på fuktig hud", "Rik återfuktande kräm", "SPF 50"],
        en: ["Gentle cream cleanser", "Hyaluronic acid serum on damp skin", "Rich moisturiser", "SPF 50"],
        ar: ["غسول كريمي لطيف", "سيروم هيالورونيك على بشرة رطبة", "كريم مرطب غني", "واقي شمس SPF 50"],
      },
      evening: {
        sv: ["Olje- eller kräm-rengöring", "Återfuktande serum", "Näringsrik nattkräm"],
        en: ["Oil or cream cleanser", "Hydrating serum", "Nourishing night cream"],
        ar: ["غسول زيتي أو كريمي", "سيروم مرطب", "كريم ليلي مغذٍ"],
      },
      tips: {
        sv: "Undvik skummande rengöringar och hett vatten. Din hud älskar hyaluronsyra och ceramider.",
        en: "Avoid foaming cleansers and hot water. Your skin loves hyaluronic acid and ceramides.",
        ar: "تجنبي الغسولات الرغوية والماء الساخن. بشرتك تحب الهيالورونيك والسيراميد.",
      },
      treatments: [
        ["Ansiktsbehandling (HydraFacial)", { sv: "Djup återfuktning med aktiva serum — direkt lyster.", en: "Deep hydration with active serums — instant glow.", ar: "ترطيب عميق بسيرومات فعالة — إشراقة فورية." }],
        ["Mesojun + Hyaluronsyra 3%", { sv: "150 mg hyaluronsyra för djup, långvarig återfuktning.", en: "150 mg hyaluronic acid for deep, lasting hydration.", ar: "150 ملغ هيالورونيك لترطيب عميق يدوم." }],
      ],
    },
    fet: {
      label: { sv: "fet/blandhud", en: "oily/combination skin", ar: "البشرة الدهنية/المختلطة" },
      morning: {
        sv: ["Mild gel-rengöring", "Lätt oljefri återfuktning", "SPF 50 (oljefri)"],
        en: ["Gentle gel cleanser", "Light oil-free moisturiser", "SPF 50 (oil-free)"],
        ar: ["غسول جل لطيف", "مرطب خفيف خالٍ من الزيوت", "واقي شمس SPF 50 خالٍ من الزيوت"],
      },
      evening: {
        sv: ["Dubbelrengöring vid smink", "BHA/salicylsyra 2–3 ggr/vecka", "Lätt nattkräm"],
        en: ["Double cleanse if wearing makeup", "BHA/salicylic acid 2–3 times a week", "Light night cream"],
        ar: ["تنظيف مزدوج عند وضع المكياج", "حمض الساليسيليك 2–3 مرات أسبوعياً", "كريم ليلي خفيف"],
      },
      tips: {
        sv: "Skippa inte återfuktning — uttorkad hud producerar mer talg. Rengör aldrig mer än 2 ggr/dag.",
        en: "Don't skip moisturiser — dehydrated skin produces more oil. Never cleanse more than twice a day.",
        ar: "لا تهملي الترطيب — البشرة الجافة تنتج زيوتاً أكثر. لا تغسلي وجهك أكثر من مرتين يومياً.",
      },
      treatments: [
        ["Laser Carbon + HydraFacial", { sv: "Djuprengör porer och minskar talgproduktion.", en: "Deep-cleans pores and reduces oil production.", ar: "ينظف المسام بعمق ويقلل إفراز الدهون." }],
        ["Cold Plasma", { sv: "Lugnar inflammation och renar på djupet.", en: "Calms inflammation and purifies deeply.", ar: "يهدئ الالتهاب وينقي بعمق." }],
      ],
    },
    kanslig: {
      label: { sv: "känslig hud", en: "sensitive skin", ar: "البشرة الحساسة" },
      morning: {
        sv: ["Mycket mild rengöring (eller bara ljummet vatten)", "Lugnande serum (centella/niacinamid)", "Parfymfri kräm", "Mineralbaserad SPF"],
        en: ["Very gentle cleanser (or just lukewarm water)", "Calming serum (centella/niacinamide)", "Fragrance-free cream", "Mineral SPF"],
        ar: ["غسول لطيف جداً (أو ماء فاتر فقط)", "سيروم مهدئ (سنتيلا/نياسيناميد)", "كريم خالٍ من العطور", "واقي شمس معدني"],
      },
      evening: {
        sv: ["Mild rengöring", "Barriärstärkande kräm med ceramider"],
        en: ["Gentle cleanser", "Barrier-repair cream with ceramides"],
        ar: ["غسول لطيف", "كريم معزز للحاجز الجلدي بالسيراميد"],
      },
      tips: {
        sv: "Introducera alltid en ny produkt i taget. Undvik parfym, alkohol och starka syror.",
        en: "Always introduce one new product at a time. Avoid fragrance, alcohol and strong acids.",
        ar: "أدخلي منتجاً جديداً واحداً في كل مرة. تجنبي العطور والكحول والأحماض القوية.",
      },
      treatments: [
        ["Klassisk ansiktsrengöring", { sv: "Skonsam djuprengöring för känslig hud.", en: "Gentle deep cleanse for sensitive skin.", ar: "تنظيف عميق لطيف للبشرة الحساسة." }],
        ["Hudvårdskonsultation", { sv: "Vi lägger en trygg, skräddarsydd plan för din hud.", en: "We create a safe, tailored plan for your skin.", ar: "نضع خطة آمنة ومخصصة لبشرتك." }],
      ],
    },
    normal: {
      label: { sv: "normal hud", en: "normal skin", ar: "البشرة العادية" },
      morning: {
        sv: ["Mild rengöring", "C-vitaminserum", "Lätt återfuktning", "SPF 50"],
        en: ["Gentle cleanser", "Vitamin C serum", "Light moisturiser", "SPF 50"],
        ar: ["غسول لطيف", "سيروم فيتامين C", "مرطب خفيف", "واقي شمس SPF 50"],
      },
      evening: {
        sv: ["Rengöring", "Retinol 2–3 kvällar/vecka (börja långsamt)", "Nattkräm"],
        en: ["Cleanser", "Retinol 2–3 evenings a week (start slowly)", "Night cream"],
        ar: ["غسول", "ريتينول 2–3 ليالٍ أسبوعياً (ابدئي تدريجياً)", "كريم ليلي"],
      },
      tips: {
        sv: "Underhåll är nyckeln — en ansiktsbehandling var 4–6 vecka håller huden i toppform.",
        en: "Maintenance is key — a facial every 4–6 weeks keeps your skin in top shape.",
        ar: "المداومة هي السر — جلسة تنظيف كل 4–6 أسابيع تحافظ على بشرتك بأفضل حال.",
      },
      treatments: [
        ["Ansiktsbehandling (HydraFacial)", { sv: "Underhållsbehandling som bevarar lyster.", en: "Maintenance treatment that preserves your glow.", ar: "علاج دوري يحافظ على الإشراقة." }],
        ["Vitamin C Glow Facial", { sv: "Boostar lyster och jämnar ut hudtonen.", en: "Boosts radiance and evens skin tone.", ar: "يعزز الإشراقة ويوحد لون البشرة." }],
      ],
    },
  };

  function routineHTML(key) {
    const r = ROUTINES[key];
    return `
      <div class="ha-care">
        <div class="ha-care-col"><h5>${tr(UI.morning)}</h5><ul>${tr(r.morning).map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="ha-care-col"><h5>${tr(UI.evening)}</h5><ul>${tr(r.evening).map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>
      <div class="ha-note">💡 ${tr(r.tips)}</div>
      <p class="ha-p"><strong>${tr(UI.fitsYou)}</strong></p>
      ${r.treatments.map(([n, why]) => treatmentCard(n, tr(why))).join("")}`;
  }

  /* ---------- Concerns → recommendations ---------- */

  const CONCERNS = {
    akne: {
      label: { sv: "🔴 Akne & orena porer", en: "🔴 Acne & clogged pores", ar: "🔴 حبوب ومسام مسدودة" },
      intro: { sv: "För akne och orena porer rekommenderar vi:", en: "For acne and clogged pores we recommend:", ar: "للحبوب والمسام المسدودة ننصح بـ:" },
      recs: [
        ["Cold Plasma", { sv: "Desinficerar på djupet och lugnar inflammation.", en: "Deeply disinfects and calms inflammation.", ar: "يعقم بعمق ويهدئ الالتهاب." }],
        ["Laser Carbon + HydraFacial", { sv: "Djuprengör porerna och minskar pigmentering efter akne.", en: "Deep-cleans pores and reduces post-acne pigmentation.", ar: "ينظف المسام ويخفف التصبغات بعد الحبوب." }],
        ["Oxygen Ansiktsbehandling", { sv: "Komplett djuprengöring med portömning och LED.", en: "Complete deep cleanse with extractions and LED.", ar: "تنظيف عميق شامل مع إزالة الرؤوس وجلسة LED." }],
      ],
      care: "hydrafacial",
    },
    pigment: {
      label: { sv: "🟤 Pigmentfläckar & ojämn ton", en: "🟤 Pigmentation & uneven tone", ar: "🟤 تصبغات ولون غير موحد" },
      intro: { sv: "För pigmentfläckar och ojämn hudton:", en: "For pigmentation and uneven skin tone:", ar: "للتصبغات ولون البشرة غير الموحد:" },
      recs: [
        ["Microneedling + TRANEX PRO", { sv: "Tranexamsyra + C-vitamin riktat mot pigmentfläckar.", en: "Tranexamic acid + vitamin C targeting dark spots.", ar: "حمض الترانيكساميك + فيتامين C لاستهداف البقع." }],
        ["Pico Laser", { sv: "Bryter ner pigment och stimulerar kollagen.", en: "Breaks down pigment and stimulates collagen.", ar: "يفتت الصبغات ويحفز الكولاجين." }],
        ["Vitamin C Glow Facial", { sv: "Jämnar ut hudtonen och ger lyster.", en: "Evens skin tone and adds glow.", ar: "يوحد اللون ويمنح إشراقة." }],
      ],
      care: "laser",
    },
    rynkor: {
      label: { sv: "📉 Rynkor & fina linjer", en: "📉 Wrinkles & fine lines", ar: "📉 تجاعيد وخطوط رفيعة" },
      intro: { sv: "För rynkor och fina linjer:", en: "For wrinkles and fine lines:", ar: "للتجاعيد والخطوط الرفيعة:" },
      recs: [
        ["VMAX HIFU & RF – Hela ansiktet", { sv: "Lyfter och stramar upp — resultat som håller 1–2 år.", en: "Lifts and tightens — results lasting 1–2 years.", ar: "شد ورفع — نتائج تدوم سنة إلى سنتين." }],
        ["B-LEUA RELAX", { sv: "Naturligt alternativ till botox.", en: "A natural alternative to botox.", ar: "بديل طبيعي للبوتوكس." }],
        ["COLLAGEN-HA PRO + Mesojun", { sv: "Marint kollagen + hyaluronsyra mot ålderstecken.", en: "Marine collagen + hyaluronic acid against ageing signs.", ar: "كولاجين بحري + هيالورونيك ضد علامات التقدم بالعمر." }],
      ],
      care: "hifu",
    },
    slapp: {
      label: { sv: "⬇️ Slapp hud & fasthet", en: "⬇️ Sagging skin & firmness", ar: "⬇️ ترهل ونقص شد" },
      intro: { sv: "För fasthet och definierad kontur:", en: "For firmness and a defined contour:", ar: "لشد البشرة وتحديد ملامح الوجه:" },
      recs: [
        ["VMAX HIFU & RF – Hela ansiktet", { sv: "Kollagenboost på djupet — lyft utan kirurgi.", en: "Deep collagen boost — a lift without surgery.", ar: "تحفيز عميق للكولاجين — شد بدون جراحة." }],
        ["FIRMPRO + Mesojun", { sv: "Definierar ansiktsovalen och motverkar slapphet.", en: "Defines the facial oval and counteracts sagging.", ar: "يحدد شكل الوجه ويحارب الترهل." }],
        ["PlasmaJet – Hela ansiktet", { sv: "Synligt lyft genom naturlig kollagenproduktion.", en: "Visible lift through natural collagen production.", ar: "شد ملحوظ عبر إنتاج الكولاجين الطبيعي." }],
      ],
      care: "hifu",
    },
    arr: {
      label: { sv: "🌿 Ärr", en: "🌿 Scars", ar: "🌿 ندبات وآثار حبوب" },
      intro: { sv: "För akneärr och ärrbildning:", en: "For acne scars and scarring:", ar: "لآثار الحبوب والندبات:" },
      recs: [
        ["SCARPRO + Mesojun + Microneedling", { sv: "Vår mest kompletta ärrbehandling.", en: "Our most complete scar treatment.", ar: "علاجنا الأكثر شمولاً للندبات." }],
        ["Algpeeling", { sv: "Naturlig peeling som förbättrar akneärr och porer.", en: "Natural peel improving acne scars and pores.", ar: "تقشير طبيعي يحسّن آثار الحبوب والمسام." }],
        ["Pico Laser", { sv: "Effektiv mot ytliga ärr och ojämn struktur.", en: "Effective on superficial scars and uneven texture.", ar: "فعال ضد الندبات السطحية والملمس غير المتساوي." }],
      ],
      care: "microneedling",
    },
    glamig: {
      label: { sv: "😴 Trött & glåmig hy", en: "😴 Tired & dull skin", ar: "😴 بشرة باهتة ومتعبة" },
      intro: { sv: "För direkt lyster och fräschör:", en: "For instant glow and freshness:", ar: "لإشراقة ونضارة فورية:" },
      recs: [
        ["Ansiktsbehandling (HydraFacial)", { sv: "Direkt lyster — ingen återhämtningstid.", en: "Instant glow — no downtime.", ar: "إشراقة فورية — بدون فترة تعافي." }],
        ["BOOSTER PRO EXOSOMER", { sv: "Exosomer för maximal glöd och föryngring.", en: "Exosomes for maximum glow and rejuvenation.", ar: "إكسوسومات لأقصى توهج وتجديد." }],
        ["Vitamin C Glow Facial", { sv: "C-vitaminboost för trött hud.", en: "A vitamin C boost for tired skin.", ar: "جرعة فيتامين C للبشرة المتعبة." }],
      ],
      care: "hydrafacial",
    },
    ogon: {
      label: { sv: "👁 Mörka ringar & trötta ögon", en: "👁 Dark circles & tired eyes", ar: "👁 هالات سوداء وعيون متعبة" },
      intro: { sv: "För ögonpartiet rekommenderar vi:", en: "For the eye area we recommend:", ar: "لمنطقة العيون ننصح بـ:" },
      recs: [
        ["Mesoterapi Eye Lift", { sv: "Minskar fina linjer, påsar och mörka ringar.", en: "Reduces fine lines, bags and dark circles.", ar: "يقلل الخطوط والانتفاخ والهالات السوداء." }],
        ["Pigmentbehandling för ögonpartiet", { sv: "Riktad mot mörka ringar och melasma.", en: "Targets dark circles and melasma.", ar: "يستهدف الهالات والكلف." }],
        ["HIFU Ögonbehandling", { sv: "Lyfter och stramar upp utan nålar.", en: "Lifts and tightens without needles.", ar: "يشد ويرفع بدون إبر." }],
      ],
      care: "microneedling",
    },
    forma: {
      label: { sv: "🔥 Kroppsformning & fasthet", en: "🔥 Body shaping & firmness", ar: "🔥 نحت الجسم وشد الترهلات" },
      intro: { sv: "För kroppsformning och fastare hud:", en: "For body shaping and firmer skin:", ar: "لنحت الجسم وشد البشرة:" },
      recs: [
        ["Mesoterapi för magen", { sv: "Fastare hud och mindre fettansamlingar.", en: "Firmer skin and reduced fat deposits.", ar: "بشرة مشدودة وتقليل تراكم الدهون." }],
        ["Mesoterapi för midja & höfter", { sv: "Formar midjan och reducerar love handles.", en: "Shapes the waist and reduces love handles.", ar: "ينحت الخصر ويقلل دهون الجوانب." }],
        ["HIFU – Mage", { sv: "Stramar upp efter viktminskning eller graviditet.", en: "Tightens after weight loss or pregnancy.", ar: "يشد البطن بعد فقدان الوزن أو الحمل." }],
      ],
      care: "microneedling",
    },
    bristningar: {
      label: { sv: "🌿 Bristningar", en: "🌿 Stretch marks", ar: "🌿 علامات تمدد" },
      intro: { sv: "För bristningar:", en: "For stretch marks:", ar: "لعلامات التمدد:" },
      recs: [
        ["Mesoterapi mot bristningar – Mage", { sv: "Minskar synligheten av bristningar på magen.", en: "Reduces visibility of stretch marks on the stomach.", ar: "يقلل ظهور علامات التمدد على البطن." }],
        ["Laser – Stretch Marks (Mage)", { sv: "Laser för både nya (röda) och äldre (vita) bristningar.", en: "Laser for both new (red) and older (white) marks.", ar: "ليزر للعلامات الجديدة (الحمراء) والقديمة (البيضاء)." }],
        ["Mesoterapi mot bristningar – Höfter & Lår", { sv: "Förbättrar ton och struktur på höfter/lår.", en: "Improves tone and texture on hips/thighs.", ar: "يحسن اللون والملمس على الوركين والفخذين." }],
      ],
      care: "laser",
    },
    ryggakne: {
      label: { sv: "🔴 Akne på ryggen", en: "🔴 Back acne", ar: "🔴 حبوب الظهر" },
      intro: { sv: "För akne och orenheter på ryggen:", en: "For acne and impurities on the back:", ar: "لحبوب الظهر والشوائب:" },
      recs: [["Ryggbehandling mot akne", { sv: "Antibakteriell djuprengöring som lugnar inflammation.", en: "Antibacterial deep cleanse that calms inflammation.", ar: "تنظيف عميق مضاد للبكتيريا يهدئ الالتهاب." }]],
      care: "peeling",
    },
    morka: {
      label: { sv: "🟤 Mörka områden", en: "🟤 Dark areas", ar: "🟤 مناطق داكنة" },
      intro: { sv: "För mörka eller ojämna hudpartier på kroppen:", en: "For dark or uneven areas on the body:", ar: "للمناطق الداكنة أو غير المتجانسة في الجسم:" },
      recs: [
        ["Behandling för armhålor", { sv: "Ljusar upp och lugnar mörka armhålor.", en: "Brightens and soothes dark underarms.", ar: "يفتح ويهدئ اسمرار الإبطين." }],
        ["Behandling för knän", { sv: "För mörka eller ojämna knän.", en: "For dark or uneven knees.", ar: "للركب الداكنة أو غير المتجانسة." }],
        ["Behandling för ben", { sv: "Lyster och jämnare hudton för benen.", en: "Glow and a more even tone for the legs.", ar: "إشراقة ولون موحد للساقين." }],
      ],
      care: "peeling",
    },
    avslappning: {
      label: { sv: "💆‍♀️ Massage & avslappning", en: "💆‍♀️ Massage & relaxation", ar: "💆‍♀️ مساج واسترخاء" },
      intro: { sv: "För välbehövlig avslappning:", en: "For well-deserved relaxation:", ar: "للاسترخاء الذي تستحقينه:" },
      recs: [
        ["Helkroppsmassage", { sv: "Komplett massage för hela kroppen.", en: "A complete full-body massage.", ar: "مساج كامل للجسم." }],
        ["Ryggmassage med radiofrekvens", { sv: "Löser upp spända vävnader och myoser.", en: "Releases tense tissue and knots.", ar: "يفك العقد والتوتر العضلي." }],
        ["Lätt lymfmassage", { sv: "Minskar svullnad och stimulerar cirkulationen.", en: "Reduces swelling and boosts circulation.", ar: "يقلل الانتفاخ وينشط الدورة الدموية." }],
      ],
      care: null,
    },
    har: {
      label: { sv: "💇‍♀️ Håravfall & hårväxt", en: "💇‍♀️ Hair loss & growth", ar: "💇‍♀️ تساقط الشعر" },
      intro: { sv: "För hår och hårbotten rekommenderar vi:", en: "For hair and scalp we recommend:", ar: "للشعر وفروة الرأس ننصح بـ:" },
      recs: [
        ["Hår Microneedling", { sv: "Stärker hårsäckarna och stimulerar ny hårväxt.", en: "Strengthens follicles and stimulates new growth.", ar: "يقوي البصيلات ويحفز نمو شعر جديد." }],
        ["Mesojun + HAIRPRO Exosomes", { sv: "Exosomer som motverkar håravfall.", en: "Exosomes that counteract hair loss.", ar: "إكسوسومات تحارب تساقط الشعر." }],
      ],
      care: "microneedling",
    },
  };

  /* ---------- Free-text intent matching ---------- */

  const INTENTS = [
    { keys: ["akne", "acne", "finnar", "pimples", "pormask", "blackhead", "حبوب", "حب الشباب", "بثور", "رؤوس سوداء"], run: () => showRecs(CONCERNS.akne) },
    { keys: ["pigment", "melasma", "dark spot", "fläck", "تصبغ", "بقع", "كلف", "اسمرار الوجه"], run: () => showRecs(CONCERNS.pigment) },
    { keys: ["rynk", "wrinkle", "fine lines", "linjer", "تجاعيد", "خطوط رفيعة", "botox", "بوتوكس"], run: () => showRecs(CONCERNS.rynkor) },
    { keys: ["slapp", "sagging", "lyft", "lift", "firm", "ترهل", "شد الوجه", "رفع"], run: () => showRecs(CONCERNS.slapp) },
    { keys: ["ärr", "arr", "scar", "ندب", "ندبات", "اثار الحبوب", "آثار الحبوب", "أثار الحبوب"], run: () => showRecs(CONCERNS.arr) },
    { keys: ["glåmig", "trött hy", "dull", "glow", "lyster", "باهتة", "نضارة", "اشراق", "إشراق"], run: () => showRecs(CONCERNS.glamig) },
    { keys: ["mörka ringar", "dark circle", "ögonpås", "eye bag", "هالات", "انتفاخ العيون", "عيون متعبة"], run: () => showRecs(CONCERNS.ogon) },
    { keys: ["bristning", "stretch", "علامات تمدد", "تمدد الجلد", "خطوط بيضاء", "خطوط حمراء"], run: () => showRecs(CONCERNS.bristningar) },
    { keys: ["rygg", "back acne", "حبوب الظهر", "الظهر"], run: () => showRecs(CONCERNS.ryggakne) },
    { keys: ["armhål", "knän", "underarm", "knee", "الإبط", "الابط", "الركب", "اسمرار"], run: () => showRecs(CONCERNS.morka) },
    { keys: ["cellulit", "fett", "slim", "shaping", "midja", "mage", "تنحيف", "نحت", "سيلوليت", "دهون", "الكرش", "البطن"], run: () => showRecs(CONCERNS.forma) },
    { keys: ["massage", "avslappning", "relax", "مساج", "تدليك", "استرخاء"], run: () => showRecs(CONCERNS.avslappning) },
    { keys: ["hår", "hair", "håravfall", "شعر", "تساقط", "فروة"], run: () => showRecs(CONCERNS.har) },
    { keys: ["torr", "dry skin", "جافة", "جفاف"], run: () => showRoutine("torr") },
    { keys: ["fet hy", "fet hud", "blandhud", "oily", "combination", "دهنية", "مختلطة"], run: () => showRoutine("fet") },
    { keys: ["känslig", "sensitive", "حساسة", "حساسية"], run: () => showRoutine("kanslig") },
    { keys: ["normal hud", "normal skin", "عادية"], run: () => showRoutine("normal") },
    { keys: ["rutin", "routine", "روتين", "عناية يومية"], run: flowRoutine },
    { keys: ["före", "efter", "before", "after", "förbered", "prepare", "aftercare", "قبل الجلسة", "بعد الجلسة", "تحضير", "تعليمات"], run: flowCare },
    { keys: ["boka", "book", "appointment", "tid", "حجز", "احجز", "موعد"], run: () => answer(tr(UI.bookA)) },
    { keys: ["öppet", "öppettider", "hours", "when open", "دوام", "ساعات", "متى تفتح", "اوقات", "أوقات"], run: () => answer(tr(UI.hoursA)) },
    { keys: ["adress", "address", "var ligger", "where", "hitta", "location", "عنوان", "وين", "أين", "موقعكم", "مكان"], run: () => answer(tr(UI.locationA)) },
    { keys: ["telefon", "phone", "ring", "kontakt", "contact", "email", "mejl", "هاتف", "رقم", "تواصل", "اتصال", "ايميل", "إيميل"], run: () => answer(tr(UI.contactA)) },
    { keys: ["pris", "kostar", "price", "cost", "kostnad", "سعر", "بكم", "كم يكلف", "التكلفة", "اسعار", "أسعار"], run: handlePriceQuery },
    { keys: ["alla behandlingar", "all treatments", "katalog", "menu", "كل العلاجات", "قائمة"], run: () => answer(tr(UI.allTreatments)) },
    { keys: ["bild", "foto", "photo", "picture", "صورة", "صوره"], run: () => { addMsg(tr(UI.photoA) + consultNote()); setOptions([[tr(UI.optFind), flowFind], homeOption()]); } },
    { keys: ["tack", "thanks", "thank you", "شكرا", "شكراً", "يعطيك العافية"], run: () => answer(tr(UI.thanksA)) },
    { keys: ["hej", "hallå", "hello", "hi", "hey", "مرحبا", "مرحبًا", "هلا", "اهلا", "أهلا", "سلام", "السلام"], run: () => { addMsg(tr(UI.greetA)); mainOptions(); } },
  ];

  function normalize(s) {
    return s
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .trim();
  }

  function handleFreeText(text) {
    const q = normalize(text);

    // 1) intent keywords
    for (const intent of INTENTS) {
      if (intent.keys.some((k) => q.includes(normalize(k)))) {
        intent.run();
        return;
      }
    }

    // 2) treatment catalog search (e.g. "hydrafacial", "hifu", "plasma")
    const words = q.split(/\s+/).filter((w) => w.length >= 4);
    for (const w of [q, ...words]) {
      const hits = searchTreatments(w);
      if (hits.length) {
        addMsg(`<p class="ha-p">${tr(UI.priceIntro)}</p>` + hits.map((t) => treatmentCard(t)).join("") + disclaimer());
        setOptions([[tr(UI.optFind), flowFind], homeOption()]);
        return;
      }
    }

    // 3) fallback
    addMsg(tr(UI.fallbackA));
    mainOptions();
  }

  function handlePriceQuery() {
    answer(tr(UI.allTreatments));
  }

  function answer(html) {
    addMsg(html);
    mainOptions();
  }

  /* ---------- Chat engine ---------- */

  let msgsEl, optionsEl, inputEl, sendBtn, panelEl, fabEl;
  let currentSkinType = null;

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
    return [tr(UI.optHome), start];
  }

  function mainOptions() {
    setOptions([
      [tr(UI.optFind), flowFind],
      [tr(UI.optRoutine), flowRoutine],
      [tr(UI.optCare), flowCare],
    ]);
  }

  function start() {
    addMsg(tr(UI.menu));
    mainOptions();
  }

  function flowFind() {
    addMsg(tr(UI.areaQ));
    setOptions([
      [tr(UI.areaFace), askSkinType],
      [tr(UI.areaEyes), () => showRecs(CONCERNS.ogon)],
      [tr(UI.areaBody), askBodyConcern],
      [tr(UI.areaHair), () => showRecs(CONCERNS.har)],
      homeOption(),
    ]);
  }

  function askSkinType() {
    addMsg(tr(UI.skinQ));
    setOptions([
      [tr(UI.skinDry), () => askFaceConcern("torr")],
      [tr(UI.skinOily), () => askFaceConcern("fet")],
      [tr(UI.skinSens), () => askFaceConcern("kanslig")],
      [tr(UI.skinNorm), () => askFaceConcern("normal")],
      [tr(UI.skinIdk), () => askFaceConcern(null)],
    ]);
  }

  function askFaceConcern(skinType) {
    currentSkinType = skinType;
    if (skinType === null) {
      addMsg(tr(UI.idkAnswer) + consultNote());
    }
    addMsg(tr(UI.concernQ));
    setOptions([
      [tr(CONCERNS.akne.label), () => showRecs(CONCERNS.akne)],
      [tr(CONCERNS.pigment.label), () => showRecs(CONCERNS.pigment)],
      [tr(CONCERNS.rynkor.label), () => showRecs(CONCERNS.rynkor)],
      [tr(CONCERNS.slapp.label), () => showRecs(CONCERNS.slapp)],
      [tr(CONCERNS.arr.label), () => showRecs(CONCERNS.arr)],
      [tr(CONCERNS.glamig.label), () => showRecs(CONCERNS.glamig)],
      homeOption(),
    ]);
  }

  function askBodyConcern() {
    addMsg(tr(UI.bodyQ));
    setOptions([
      [tr(CONCERNS.forma.label), () => showRecs(CONCERNS.forma)],
      [tr(CONCERNS.bristningar.label), () => showRecs(CONCERNS.bristningar)],
      [tr(CONCERNS.ryggakne.label), () => showRecs(CONCERNS.ryggakne)],
      [tr(CONCERNS.morka.label), () => showRecs(CONCERNS.morka)],
      [tr(CONCERNS.avslappning.label), () => showRecs(CONCERNS.avslappning)],
      homeOption(),
    ]);
  }

  function showRecs(concern) {
    let html = `<p class="ha-p">${tr(concern.intro)}</p>` + concern.recs.map(([n, why]) => treatmentCard(n, tr(why))).join("");
    if (currentSkinType && ROUTINES[currentSkinType]) {
      html += `<div class="ha-note">${tr(UI.tipRoutine)}</div>`;
    }
    html += consultNote() + disclaimer();
    addMsg(html);
    const opts = [];
    if (concern.care) opts.push([tr(UI.optCareThis), () => showCare(concern.care)]);
    opts.push([tr(UI.optOther), flowFind], homeOption());
    setOptions(opts);
  }

  function flowRoutine() {
    addMsg(tr(UI.routineQ));
    setOptions([
      [tr(UI.skinDry), () => showRoutine("torr")],
      [tr(UI.skinOily), () => showRoutine("fet")],
      [tr(UI.skinSens), () => showRoutine("kanslig")],
      [tr(UI.skinNorm), () => showRoutine("normal")],
      [tr(UI.skinIdk), () => {
        addMsg(tr(UI.routineIdk) + consultNote());
        setOptions([homeOption()]);
      }],
    ]);
  }

  function showRoutine(key) {
    addMsg(`<p class="ha-p"><strong>${tr(UI.routineFor)} ${tr(ROUTINES[key].label)}:</strong></p>` + routineHTML(key) + disclaimer());
    setOptions([[tr(UI.optOtherType), flowRoutine], homeOption()]);
  }

  function flowCare() {
    addMsg(tr(UI.careQ));
    setOptions([
      ["💉 " + tr(CARE.microneedling.label), () => showCare("microneedling")],
      ["🌟 " + tr(CARE.hifu.label), () => showCare("hifu")],
      ["🧪 " + tr(CARE.peeling.label), () => showCare("peeling")],
      ["⚡ " + tr(CARE.laser.label), () => showCare("laser")],
      ["💧 " + tr(CARE.hydrafacial.label), () => showCare("hydrafacial")],
      ["🩵 " + tr(CARE.plasma.label), () => showCare("plasma")],
      homeOption(),
    ]);
  }

  function showCare(key) {
    addMsg(`<p class="ha-p"><strong>${tr(CARE[key].label)}</strong></p>` + careHTML(key) + `<div class="ha-note">${tr(UI.careQuestions)}</div>`);
    setOptions([[tr(UI.optOtherTreat), flowCare], homeOption()]);
  }

  /* ---------- Widget UI ---------- */

  function refreshLangUI() {
    if (!panelEl) return;
    panelEl.querySelector(".ha-title").textContent = tr(UI.title);
    panelEl.querySelector(".ha-sub").textContent = tr(UI.sub);
    inputEl.placeholder = tr(UI.inputPh);
    sendBtn.textContent = tr(UI.send);
    fabEl.querySelector(".ha-fab-label").textContent = tr(UI.fabLabel);
    panelEl.dir = lang() === "ar" ? "rtl" : "ltr";
  }

  function buildWidget() {
    fabEl = document.createElement("button");
    fabEl.className = "ha-fab";
    fabEl.innerHTML = "💬";
    fabEl.setAttribute("aria-label", "Hudassistent");
    const fabLabel = document.createElement("span");
    fabLabel.className = "ha-fab-label";
    fabLabel.textContent = tr(UI.fabLabel);
    fabEl.appendChild(fabLabel);

    panelEl = document.createElement("div");
    panelEl.className = "ha-panel";
    panelEl.innerHTML = `
      <div class="ha-header">
        <img src="images/logo.jpg" alt="" class="ha-avatar" />
        <div>
          <div class="ha-title"></div>
          <div class="ha-sub"></div>
        </div>
        <button class="ha-close" aria-label="Stäng">✕</button>
      </div>
      <div class="ha-msgs"></div>
      <div class="ha-options"></div>
      <form class="ha-inputrow">
        <input type="text" class="ha-input" autocomplete="off" />
        <button type="submit" class="ha-send"></button>
      </form>`;

    document.body.appendChild(fabEl);
    document.body.appendChild(panelEl);

    msgsEl = panelEl.querySelector(".ha-msgs");
    optionsEl = panelEl.querySelector(".ha-options");
    inputEl = panelEl.querySelector(".ha-input");
    sendBtn = panelEl.querySelector(".ha-send");

    refreshLangUI();
    window.addEventListener("nss-lang-change", refreshLangUI);

    panelEl.querySelector(".ha-inputrow").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (!text) return;
      addMsg(text.replace(/</g, "&lt;"), "user");
      inputEl.value = "";
      setTimeout(() => handleFreeText(text), 250);
    });

    let started = false;
    function toggle(open) {
      panelEl.classList.toggle("open", open);
      fabEl.classList.toggle("hidden", open);
      if (open && !started) {
        started = true;
        addMsg(tr(UI.welcome));
        start();
      }
      if (open) inputEl.focus();
    }

    fabEl.addEventListener("click", () => toggle(true));
    panelEl.querySelector(".ha-close").addEventListener("click", () => toggle(false));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
