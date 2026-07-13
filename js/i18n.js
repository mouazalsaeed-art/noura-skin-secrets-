/* Noura Skin Secrets — språkväxlare (SV / EN / AR)
   Översätter statiska texter via [data-i18n]-attribut.
   Behandlingskatalogens namn och priser visas alltid på svenska. */

(function () {
  "use strict";

  const DICT = {
    sv: {}, // svenska är standard — texterna ligger i HTML:en

    en: {
      "nav.home": "Home",
      "nav.treatments": "Treatments",
      "nav.about": "About us",
      "nav.contact": "Contact",
      "nav.book": "Book now",

      "hero.eyebrow": "Uppsala · Women only",
      "hero.title": "Where expertise and <em>comfort</em> meet",
      "hero.lede": "Advanced skin and body care in a warm, personal setting. From HydraFacial and HIFU to microneedling and massage — tailored to your skin.",
      "hero.cta1": "Book now",
      "hero.cta2": "See all treatments",
      "hero.stat1": "reviews on Bokadirekt",
      "hero.stat2": "treatments to choose from",
      "hero.stat3": "Open daily, by appointment",
      "hero.badge": "Certified skin therapist & founder",

      "usp1.title": "Women only",
      "usp1.text": "A safe, relaxed environment created just for you.",
      "usp2.title": "Advanced equipment",
      "usp2.text": "Top-class HIFU, laser, plasma and microneedling.",
      "usp3.title": "Rated 4.9",
      "usp3.text": "Based on 71 reviews from happy clients.",
      "usp4.title": "Central Uppsala",
      "usp4.text": "Kungsängsgatan 5B — easy to reach, open every day.",

      "cats.eyebrow": "Our services",
      "cats.title": "Treatments for face, body & hair",
      "cats.lede": "Browse our <span data-total-categories>14</span> categories and <span data-total-treatments>86</span> treatments — or view the full catalogue at once.",

      "offers.eyebrow": "Right now",
      "offers.title": "Offers & packages",
      "offers.lede": "Selected treatments and packages at a great price.",
      "offers.more": "You'll always find current offers on <a href=\"https://instagram.com/noura_skin_secrets\" target=\"_blank\" rel=\"noopener\">@noura_skin_secrets</a>.",
      "klipp.eyebrow": "Save more",
      "klipp.title": "Packages (Klippkort)",
      "klipp.lede": "Buy several sessions of your favourite treatment at a lower price. All packages are valid for 12 months.",

      "about.eyebrow": "About Noura Skin Secrets",
      "about.title": "Personal skin care, built on expertise",
      "about.text": "Noura Skin Secrets is run by Nour, a certified skin therapist in Uppsala. The salon is a safe space for women only, where every treatment is tailored to your skin and goals — from classic facials to advanced HIFU and laser treatments.",
      "about.li1": "Tailored treatment plans based on skin analysis",
      "about.li2": "Modern equipment: HIFU, laser, plasma, microneedling",
      "about.li3": "Calm, exclusive environment — women only",
      "about.li4": "Open every day 10:00–20:00, by appointment",
      "about.cta": "Book an appointment",

      "rating.meta": "71 reviews via Bokadirekt",
      "rating.cta": "Read the reviews",

      "results.eyebrow": "Results",
      "results.title": "See our results",
      "results.lede": "We regularly share photos and results from the salon on Instagram — follow us for before/after, offers and skin care tips.",
      "results.cta": "📸 Follow @noura_skin_secrets",

      "faq.eyebrow": "Good to know",
      "faq.title": "Frequently asked questions",
      "faq.q1": "How do I book an appointment?",
      "faq.a1": "The easiest way is our <a href=\"boka.html\">booking form</a> — we confirm your appointment by email or phone within 24 hours. You can also call <a href=\"tel:+46793333476\">079-333 34 76</a> or email <a href=\"mailto:nouraskinsecrets@gmail.com\">nouraskinsecrets@gmail.com</a>.",
      "faq.q2": "Where is the salon located?",
      "faq.a2": "In central Uppsala at Kungsängsgatan 5B, 753 22 Uppsala — close to buses, trains and parking.",
      "faq.q3": "What are your opening hours?",
      "faq.a3": "We are open every day 10:00–20:00, by appointment only.",
      "faq.q4": "Is the salon really women only?",
      "faq.a4": "Yes. The salon is a safe, relaxed environment created exclusively for women.",
      "faq.q5": "How do I know which treatment suits me?",
      "faq.a5": "Try our skin assistant (chat button bottom left) which guides you based on your skin type and needs. For a personal assessment we recommend a skin consultation (20 min, 450 kr).",
      "faq.q6": "How do I prepare for a treatment?",
      "faq.a6": "Come without makeup if possible, and avoid sun as well as strong acids/retinol a few days before most treatments. Our skin assistant has detailed advice for each treatment type — and you always get personal instructions when booking.",
      "faq.q7": "Can I cancel or reschedule?",
      "faq.a7": "Yes, contact us as soon as possible by phone or email and we will help you find a new time.",
      "faq.q8": "Do the treatments hurt?",
      "faq.a8": "Most of our treatments are gentle and painless. For more intensive treatments such as microneedling, numbing cream is used for your comfort. Let us know if you are sensitive and we will adapt the treatment.",

      "contact.eyebrow": "Find us",
      "contact.title": "Visit us in Uppsala",
      "contact.lede": "Book easily online or contact us directly by phone, email or Instagram.",
      "contact.address": "Address",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.hours": "Opening hours",
      "contact.hoursText": "Every day 10:00–20:00<br />By appointment only",
      "contact.cta": "Book your appointment now",

      "footer.desc": "Advanced skin and body care in Uppsala, in a safe environment created exclusively for women.",
      "footer.shortcuts": "Shortcuts",
      "footer.allTreatments": "All treatments",
      "footer.book": "Book now",
      "footer.about": "About us",
      "footer.contact": "Contact",
      "footer.rights": "© 2026 Noura Skin Secrets. All rights reserved.",

      "float.book": "Book now",

      "boka.eyebrow": "Booking request",
      "boka.title": "Book your appointment",
      "boka.lede": "Fill in the form below and we will get back to you via email within 24 hours to confirm your appointment.",
      "boka.name": "Name *",
      "boka.namePh": "First and last name",
      "boka.email": "Email *",
      "boka.phone": "Phone *",
      "boka.treatment": "Treatment *",
      "boka.date": "Preferred date *",
      "boka.time": "Preferred time",
      "boka.message": "Message",
      "boka.messagePh": "Anything we should know? Allergies, skin condition, questions...",
      "boka.submit": "Send booking request",
      "boka.infoTitle": "Contact & directions",
    },

    ar: {
      "nav.home": "الرئيسية",
      "nav.treatments": "العلاجات",
      "nav.about": "من نحن",
      "nav.contact": "اتصلي بنا",
      "nav.book": "احجزي موعد",

      "hero.eyebrow": "أوبسالا · للنساء فقط",
      "hero.title": "حيث تلتقي الخبرة <em>بالأمان</em>",
      "hero.lede": "عناية متقدمة بالبشرة والجسم في أجواء دافئة وشخصية. من الهيدرافيشل والهايفو إلى الميكرونيدلينغ والمساج — كل شيء مصمم خصيصاً لبشرتك.",
      "hero.cta1": "احجزي موعد",
      "hero.cta2": "جميع العلاجات",
      "hero.stat1": "تقييم على Bokadirekt",
      "hero.stat2": "علاجاً للاختيار من بينها",
      "hero.stat3": "مفتوح يومياً، بالحجز المسبق",
      "hero.badge": "أخصائية بشرة معتمدة والمؤسِّسة",

      "usp1.title": "للنساء فقط",
      "usp1.text": "بيئة آمنة ومريحة صُممت خصيصاً لكِ.",
      "usp2.title": "أجهزة متطورة",
      "usp2.text": "هايفو، ليزر، بلازما وميكرونيدلينغ من الطراز الأول.",
      "usp3.title": "تقييم 4.9",
      "usp3.text": "بناءً على 71 تقييماً من عميلات سعيدات.",
      "usp4.title": "وسط أوبسالا",
      "usp4.text": "Kungsängsgatan 5B — موقع سهل الوصول، مفتوح يومياً.",

      "cats.eyebrow": "خدماتنا",
      "cats.title": "علاجات للوجه والجسم والشعر",
      "cats.lede": "تصفحي <span data-total-categories>14</span> فئة و<span data-total-treatments>86</span> علاجاً — أو شاهدي الكتالوج كاملاً.",

      "offers.eyebrow": "حالياً",
      "offers.title": "العروض والباقات",
      "offers.lede": "علاجات وباقات مختارة بأسعار مميزة.",
      "offers.more": "تجدين أحدث العروض دائماً على <a href=\"https://instagram.com/noura_skin_secrets\" target=\"_blank\" rel=\"noopener\">@noura_skin_secrets</a>.",
      "klipp.eyebrow": "وفّري أكثر",
      "klipp.title": "باقات الجلسات (Klippkort)",
      "klipp.lede": "اشترِي عدة جلسات من علاجك المفضّل بسعر أقل. كل الباقات صالحة لمدة 12 شهراً.",

      "about.eyebrow": "عن نورا سكين سيكرتس",
      "about.title": "عناية شخصية بالبشرة مبنية على الخبرة",
      "about.text": "تدير نورا سكين سيكرتس الأخصائية نور، أخصائية بشرة معتمدة في أوبسالا. الصالون مساحة آمنة للنساء فقط، حيث يُصمم كل علاج حسب بشرتك وأهدافك — من تنظيف البشرة الكلاسيكي إلى علاجات الهايفو والليزر المتقدمة.",
      "about.li1": "خطط علاج مخصصة بعد تحليل البشرة",
      "about.li2": "أجهزة حديثة: هايفو، ليزر، بلازما، ميكرونيدلينغ",
      "about.li3": "أجواء هادئة وراقية — للنساء فقط",
      "about.li4": "مفتوح يومياً 10:00–20:00، بالحجز المسبق",
      "about.cta": "احجزي موعداً",

      "rating.meta": "71 تقييماً عبر Bokadirekt",
      "rating.cta": "اقرئي التقييمات",

      "results.eyebrow": "النتائج",
      "results.title": "شاهدي نتائجنا",
      "results.lede": "نشارك باستمرار صوراً ونتائج من الصالون على إنستغرام — تابعينا لمشاهدة قبل/بعد والعروض ونصائح العناية بالبشرة.",
      "results.cta": "📸 تابعي @noura_skin_secrets",

      "faq.eyebrow": "معلومات مفيدة",
      "faq.title": "الأسئلة الشائعة",
      "faq.q1": "كيف أحجز موعداً؟",
      "faq.a1": "أسهل طريقة عبر <a href=\"boka.html\">نموذج الحجز</a> — نؤكد موعدك عبر الإيميل أو الهاتف خلال 24 ساعة. يمكنك أيضاً الاتصال على <a href=\"tel:+46793333476\">079-333 34 76</a> أو مراسلتنا على <a href=\"mailto:nouraskinsecrets@gmail.com\">nouraskinsecrets@gmail.com</a>.",
      "faq.q2": "أين يقع الصالون؟",
      "faq.a2": "في وسط أوبسالا: Kungsängsgatan 5B, 753 22 Uppsala — قريب من الباصات والقطار والمواقف.",
      "faq.q3": "ما هي أوقات العمل؟",
      "faq.a3": "مفتوح يومياً من 10:00 حتى 20:00، بالحجز المسبق فقط.",
      "faq.q4": "هل الصالون فعلاً للنساء فقط؟",
      "faq.a4": "نعم. الصالون بيئة آمنة ومريحة مخصصة للنساء فقط.",
      "faq.q5": "كيف أعرف العلاج المناسب لي؟",
      "faq.a5": "جربي مساعدة البشرة (زر الدردشة أسفل اليسار) التي ترشدك حسب نوع بشرتك واحتياجاتك. وللتقييم الشخصي ننصح بجلسة استشارة بشرة (20 دقيقة، 450 كرون).",
      "faq.q6": "كيف أستعد قبل الجلسة؟",
      "faq.a6": "يفضل الحضور بدون مكياج، وتجنب التعرض للشمس والأحماض القوية/الريتينول قبل أيام من معظم العلاجات. مساعدة البشرة لديها نصائح مفصلة قبل وبعد كل نوع علاج — وستحصلين دائماً على تعليمات شخصية عند الحجز.",
      "faq.q7": "هل يمكنني إلغاء أو تغيير موعدي؟",
      "faq.a7": "نعم، تواصلي معنا بأسرع وقت عبر الهاتف أو الإيميل وسنساعدك في إيجاد موعد جديد.",
      "faq.q8": "هل العلاجات مؤلمة؟",
      "faq.a8": "معظم علاجاتنا لطيفة وغير مؤلمة. وفي العلاجات الأقوى مثل الميكرونيدلينغ نستخدم كريم تخدير لراحتك. أخبرينا إذا كانت بشرتك حساسة وسنكيّف العلاج.",

      "contact.eyebrow": "موقعنا",
      "contact.title": "زورينا في أوبسالا",
      "contact.lede": "احجزي بسهولة أونلاين أو تواصلي معنا مباشرة عبر الهاتف أو الإيميل أو إنستغرام.",
      "contact.address": "العنوان",
      "contact.phone": "الهاتف",
      "contact.email": "الإيميل",
      "contact.hours": "أوقات العمل",
      "contact.hoursText": "يومياً 10:00–20:00<br />بالحجز المسبق فقط",
      "contact.cta": "احجزي موعدك الآن",

      "footer.desc": "عناية متقدمة بالبشرة والجسم في أوبسالا، في بيئة آمنة مخصصة للنساء فقط.",
      "footer.shortcuts": "روابط سريعة",
      "footer.allTreatments": "جميع العلاجات",
      "footer.book": "احجزي موعد",
      "footer.about": "من نحن",
      "footer.contact": "اتصلي بنا",
      "footer.rights": "© 2026 نورا سكين سيكرتس. جميع الحقوق محفوظة.",

      "float.book": "احجزي موعد",

      "boka.eyebrow": "طلب حجز",
      "boka.title": "احجزي موعدك",
      "boka.lede": "املئي النموذج أدناه وسنرد عليك عبر الإيميل خلال 24 ساعة لتأكيد موعدك.",
      "boka.name": "الاسم *",
      "boka.namePh": "الاسم الكامل",
      "boka.email": "الإيميل *",
      "boka.phone": "الهاتف *",
      "boka.treatment": "العلاج *",
      "boka.date": "التاريخ المفضل *",
      "boka.time": "الوقت المفضل",
      "boka.message": "رسالة",
      "boka.messagePh": "هل هناك ما يجب أن نعرفه؟ حساسية، حالة البشرة، أسئلة...",
      "boka.submit": "أرسلي طلب الحجز",
      "boka.infoTitle": "التواصل والوصول",
    },
  };

  const STORAGE_KEY = "nss-lang";

  function applyLang(lang) {
    const dict = DICT[lang] || {};
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (lang === "sv") {
        if (el.dataset.svHtml !== undefined) el.innerHTML = el.dataset.svHtml;
      } else if (dict[key]) {
        if (el.dataset.svHtml === undefined) el.dataset.svHtml = el.innerHTML;
        el.innerHTML = dict[key];
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (lang === "sv") {
        if (el.dataset.svPh !== undefined) el.placeholder = el.dataset.svPh;
      } else if (dict[key]) {
        if (el.dataset.svPh === undefined) el.dataset.svPh = el.placeholder;
        el.placeholder = dict[key];
      }
    });

    document.documentElement.lang = lang === "ar" ? "ar" : lang === "en" ? "en" : "sv";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, lang);
    document.querySelectorAll(".lang-switch button").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    window.dispatchEvent(new CustomEvent("nss-lang-change", { detail: lang }));
  }

  function buildSwitcher() {
    const host = document.querySelector(".nav-cta");
    if (!host) return;
    const box = document.createElement("div");
    box.className = "lang-switch";
    [["sv", "SV"], ["en", "EN"], ["ar", "ع"]].forEach(([code, label]) => {
      const b = document.createElement("button");
      b.dataset.lang = code;
      b.textContent = label;
      b.addEventListener("click", () => applyLang(code));
      box.appendChild(b);
    });
    host.insertBefore(box, host.firstChild);
  }

  function init() {
    buildSwitcher();
    const saved = localStorage.getItem(STORAGE_KEY) || "sv";
    applyLang(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
