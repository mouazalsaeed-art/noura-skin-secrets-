# -*- coding: utf-8 -*-
"""Noura Skin Secrets — genererar sv/ (rot), en/ och ar/ ur samma mallar.
Kör:  python3 build.py   (skriver index.html m.fl. + en/ + ar/)"""
import json, os

SITE = "https://nouraskinsecrets.se"
BOKADIREKT = "https://www.bokadirekt.se/places/noura-skin-secrets-kvinnlig-behandling-129600"
GOOGLE_REVIEW = "https://share.google/mvDQKfjYthddWukLt"
IG = "https://instagram.com/noura_skin_secrets"
PHONE_DISP = "079-333 34 76"
PHONE_TEL = "+46793333476"
EMAIL = "info@nouraskinsecrets.se"
ADDRESS = "Kungsängsgatan 5B, 753 22 Uppsala"
ORGNR = "559588-8925"

LOGO = """<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22.1" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="24" cy="24" r="19.2" fill="none" stroke="#B98A44" stroke-width=".7"/><path d="M16.8 31.5V16.5M16.8 16.5L31.2 31.5M31.2 31.5V16.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M36.4 12.2l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" fill="#B98A44"/></svg>"""
IC = {
  "arrow": '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  "star": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.52 2.3a.53.53 0 0 1 .96 0l2.3 4.68a2.12 2.12 0 0 0 1.6 1.16l5.17.75a.53.53 0 0 1 .29.9l-3.73 3.64a2.12 2.12 0 0 0-.62 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.98a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 10.77a.53.53 0 0 1 .29-.9l5.17-.76a2.12 2.12 0 0 0 1.6-1.16z"/></svg>',
  "shield": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  "pin": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  "phone": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h3L11 7.5 9 9a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.1 2A16 16 0 0 1 4.5 5.6a2 2 0 0 1 2-2.1z"/></svg>',
  "mail": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.6"/><path d="M4 6.6l8 5.6 8-5.6"/></svg>',
  "clock": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.2v5l3.4 2"/></svg>',
  "ig": '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="17" height="17" x="3.5" y="3.5" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r=".7" fill="currentColor" stroke="none"/></svg>',
  "cal": '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
}

GOOGLE_G = """<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="#4285F4" d="M23.04 12.26c0-.82-.07-1.6-.21-2.36H12v4.47h6.19c-.27 1.44-1.08 2.66-2.3 3.48v2.9h3.72c2.18-2.01 3.43-4.97 3.43-8.49z"/><path fill="#34A853" d="M12 24c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.9c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.99A11.99 11.99 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.55 14.66c-.23-.69-.36-1.42-.36-2.16s.13-1.48.36-2.16V7.35H1.7A11.99 11.99 0 0 0 .43 12.5c0 1.94.47 3.77 1.27 5.15l3.85-2.99z"/><path fill="#EA4335" d="M12 4.77c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.71 1.19 15.1 0 12 0A11.99 11.99 0 0 0 1.7 6.35l3.85 2.99C6.46 6.8 9 4.77 12 4.77z"/></svg>"""

# ---------------------------------------------------------------- texter
T = {
"sv": {
  "dir": "ltr", "lang": "sv", "locale": "sv_SE",
  "brand_tag": "Hudvård & skönhetsbehandlingar i Uppsala",
  "nav": ["Hem", "Behandlingar", "Om oss", "Kontakt"], "nav_book": "Boka tid",
  "menu_close": "Stäng",
  "home_title": "Noura Skin Secrets — Hudvård & Skönhetsbehandlingar i Uppsala",
  "home_desc": "Noura Skin Secrets i Uppsala erbjuder avancerad hudvård: HydraFacial, HIFU, microneedling, laser och massage. Endast för kvinnor. Boka din tid idag.",
  "hero_eyebrow": "Uppsala · Endast för kvinnor",
  "hero_h1": 'Där expertis och <em>trygghet</em> möts',
  "hero_lede": "Avancerad hud- och kroppsvård i en varm, personlig miljö. Från HydraFacial och HIFU till microneedling och massage — skräddarsytt för din hud.",
  "hero_cta1": "Boka tid", "hero_cta2": "Se alla behandlingar",
  "hero_stat1": ("4.9 ★", "på Bokadirekt · 71 recensioner"),
  "hero_stat2": ("86", "behandlingar i 14 kategorier"),
  "hero_stat3": ("10–20", "öppet alla dagar, efter bokning"),
  "hero_tag": ("Nour", "Certifierad hudterapeut & grundare"),
  "trust": ["Endast för kvinnor", "HIFU · Laser · Plasma · Microneedling", "Centrala Uppsala — Kungsängsgatan 5B"],
  "cats_eyebrow": "Vårt utbud", "cats_h2": "Behandlingar för <em>ansikte, kropp & hår</em>",
  "cats_lede": "Bläddra bland våra 14 kategorier och 86 behandlingar — eller se hela katalogen på en gång.",
  "cats_all": "Hela behandlingskatalogen",
  "offers_eyebrow": "Just nu", "offers_h2": "Erbjudanden & <em>paket</em>",
  "offers_lede": "Utvalda behandlingar och kurpaket till extra bra pris.",
  "offers_more": f'Fler aktuella erbjudanden hittar du alltid på <a href="{IG}" target="_blank" rel="noopener">@noura_skin_secrets</a>.',
  "klipp_eyebrow": "Spara mer", "klipp_h2": "Klippkort",
  "klipp_lede": "Köp flera tillfällen av din favoritbehandling till ett lägre pris. Alla klippkort gäller i 12 månader.",
  "about_eyebrow": "Om Noura Skin Secrets", "about_h2": "Personlig hudvård, grundad på <em>expertis</em>",
  "about_p": "Noura Skin Secrets drivs av Nour, certifierad hudterapeut i Uppsala. Salongen är skapad som en trygg plats enbart för kvinnor, där varje behandling anpassas efter din hud och dina mål — från klassisk ansiktsrengöring till avancerad HIFU- och laserbehandling.",
  "about_list": ["Skräddarsydda behandlingsplaner efter hudanalys", "Modern utrustning: HIFU, laser, plasma, microneedling", "Lugn, exklusiv miljö — endast för kvinnor", "Öppet alla dagar 10:00–20:00, efter bokning"],
  "about_cta": "Boka en tid", "about_alt": "Nour, certifierad hudterapeut — Noura Skin Secrets",
  "rating_bokadirekt": ("4,9", "71 recensioner på Bokadirekt", "Läs omdömen"),
  "rating_google": ("5,0", "Vårt betyg på Google", "Läs & lämna omdöme"),
  "reviews_eyebrow": "Röster från kunder", "reviews_h2": "Vad våra kunder säger",
  "results_eyebrow": "Resultat", "results_h2": "Före & efter",
  "results_lede": "En glimt av vad avancerad hudvård kan göra för hudens lyster och struktur.",
  "results_note": "Verkliga resultat från salongen.", "results_tag": "Före & efter",
  "ig_eyebrow": "Galleri", "ig_h2": "Från vårt Instagram",
  "ig_lede": "Vi delar löpande bilder och resultat från salongen — följ oss för före/efter, erbjudanden och hudvårdstips.",
  "ig_cta": "Följ @noura_skin_secrets",
  "faq_eyebrow": "Bra att veta", "faq_h2": "Vanliga frågor",
  "faq": [
    ("Hur bokar jag en tid?", f'Boka direkt med realtidskalender på <a href="{BOKADIREKT}" target="_blank" rel="noopener">Bokadirekt</a>, via vårt bokningsformulär, på telefon <a href="tel:{PHONE_TEL}">{PHONE_DISP}</a> eller mejl <a href="mailto:{EMAIL}">{EMAIL}</a>.'),
    ("Var ligger salongen?", "Mitt i centrala Uppsala på Kungsängsgatan 5B, 753 22 Uppsala — nära bussar, tåg och parkering."),
    ("Vilka öppettider har ni?", "Vi har öppet alla dagar 10:00–20:00, endast efter bokning."),
    ("Är salongen verkligen endast för kvinnor?", "Ja. Salongen är skapad som en trygg och avslappnad miljö enbart för kvinnor."),
    ("Hur vet jag vilken behandling som passar mig?", "Prova vår hudassistent (chattknappen) som guidar dig utifrån din hudtyp. Vill du ha en personlig bedömning rekommenderar vi en hudvårdskonsultation (20 min, 450 kr)."),
    ("Hur förbereder jag mig inför en behandling?", "Kom gärna utan smink och undvik solning samt starka syror/retinol några dagar före de flesta behandlingar. Du får alltid personliga instruktioner vid bokning."),
    ("Kan jag avboka eller omboka min tid?", "Ja, kontakta oss så snart som möjligt via telefon eller e-post så hjälper vi dig att hitta en ny tid."),
    ("Gör behandlingarna ont?", "De flesta behandlingar är skonsamma och smärtfria. Vid intensivare behandlingar som microneedling används bedövningskräm. Berätta gärna om du är känslig så anpassar vi behandlingen."),
  ],
  "contact_eyebrow": "Hitta hit", "contact_h2": "Besök oss i <em>Uppsala</em>",
  "contact_lede": "Boka enkelt online eller kontakta oss direkt via telefon, e-post eller Instagram.",
  "contact_hours": "Alla dagar 10:00–20:00 · endast efter bokning",
  "contact_cta": "Boka din tid nu",
  "footer_desc": "Avancerad hud- och kroppsvård i Uppsala, i en trygg miljö skapad enbart för kvinnor.",
  "footer_shortcuts": "Genvägar", "footer_contact": "Kontakt",
  "footer_links": ["Alla behandlingar", "Boka tid", "Om oss", "Integritetspolicy"],
  "footer_rights": "Alla rättigheter förbehållna.",
  "footer_org": f"Org.nr {ORGNR}", "footer_place": "Uppsala, Sverige",
  "float_book": "Boka tid",
  "skip": "Hoppa till innehållet",
  # behandlingar
  "cat_title": "Behandlingar & priser — Noura Skin Secrets Uppsala",
  "cat_desc": "Utforska alla 86 behandlingar hos Noura Skin Secrets i Uppsala: ansikte, HIFU, ögon & läppar, hårvård, massage, kroppsformning, laser och plasma — med priser.",
  "cat_eyebrow": "Behandlingskatalog", "cat_h1": "Alla våra <em>behandlingar</em>",
  "cat_lede": "86 behandlingar fördelade på 14 kategorier — med tydliga priser. Sök eller filtrera för att hitta rätt behandling för dig.",
  "cat_search": "Sök behandling, t.ex. HydraFacial, HIFU, massage…",
  "cat_empty_h": "Inga behandlingar hittades", "cat_empty_p": "Prova ett annat sökord eller välj en annan kategori.",
  "cat_consult_h2": "Osäker på vilken behandling som passar dig?",
  "cat_consult_p": "Boka en hudvårdskonsultation (450 kr, 20 min) så hittar vi rätt behandling tillsammans.",
  "cat_consult_cta": "Boka konsultation",
  # boka
  "boka_title": "Boka tid — Noura Skin Secrets Uppsala",
  "boka_desc": "Boka din behandling hos Noura Skin Secrets i Uppsala — direkt via Bokadirekt eller med vårt formulär.",
  "boka_eyebrow": "Bokning", "boka_h1": "Boka din <em>tid</em>",
  "boka_lede": "Boka direkt med realtidskalender via Bokadirekt — eller skicka en förfrågan så bekräftar vi inom 24 timmar.",
  "bd_h3": "Boka direkt — se lediga tider",
  "bd_p": "Välj behandling och tid i realtid via Bokadirekt. Snabbast och enklast.",
  "bd_cta": "Öppna Bokadirekt",
  "bd_or": "eller skicka en förfrågan",
  "boka_name": "Namn", "boka_name_ph": "För- och efternamn",
  "boka_email": "E-post", "boka_phone": "Telefon",
  "boka_treatment": "Behandling", "boka_date": "Önskat datum", "boka_time": "Önskad tid",
  "boka_msg": "Meddelande (valfritt)", "boka_msg_ph": "Berätta gärna om eventuella hudbesvär, önskemål eller tidigare behandlingar.",
  "boka_note": f"* Obligatoriska fält. Din förfrågan skickas till {EMAIL} — vi bekräftar din tid så snart vi kan.",
  "boka_submit": "Skicka bokningsförfrågan",
  "boka_info_h3": "Kontakt & besöksadress",
  "boka_rating": "4,9 av 5 — 71 recensioner på Bokadirekt",
  # integritet
  "priv_title": "Integritetspolicy — Noura Skin Secrets",
  "priv_desc": "Integritetspolicy för Noura Skin Secrets — hur vi hanterar personuppgifter, bokningar och foton vid AI-hudanalys.",
  "priv_h1": "Integritetspolicy",
},
"en": {
  "dir": "ltr", "lang": "en", "locale": "en_GB",
  "brand_tag": "Skin care & beauty treatments in Uppsala",
  "nav": ["Home", "Treatments", "About", "Contact"], "nav_book": "Book now",
  "menu_close": "Close",
  "home_title": "Noura Skin Secrets — Skin Care & Beauty Treatments in Uppsala",
  "home_desc": "Noura Skin Secrets in Uppsala offers advanced skin care: HydraFacial, HIFU, microneedling, laser and massage. Women only. Book your appointment today.",
  "hero_eyebrow": "Uppsala · Women only",
  "hero_h1": 'Where expertise and <em>comfort</em> meet',
  "hero_lede": "Advanced skin and body care in a warm, personal setting. From HydraFacial and HIFU to microneedling and massage — tailored to your skin.",
  "hero_cta1": "Book now", "hero_cta2": "See all treatments",
  "hero_stat1": ("4.9 ★", "on Bokadirekt · 71 reviews"),
  "hero_stat2": ("86", "treatments across 14 categories"),
  "hero_stat3": ("10–20", "open daily, by appointment"),
  "hero_tag": ("Nour", "Certified skin therapist & founder"),
  "trust": ["Women only", "HIFU · Laser · Plasma · Microneedling", "Central Uppsala — Kungsängsgatan 5B"],
  "cats_eyebrow": "Our services", "cats_h2": "Treatments for <em>face, body & hair</em>",
  "cats_lede": "Browse our 14 categories and 86 treatments — or view the full catalogue at once.",
  "cats_all": "Full treatment catalogue",
  "offers_eyebrow": "Right now", "offers_h2": "Offers & <em>packages</em>",
  "offers_lede": "Selected treatments and course packages at a great price.",
  "offers_more": f'You will always find current offers on <a href="{IG}" target="_blank" rel="noopener">@noura_skin_secrets</a>.',
  "klipp_eyebrow": "Save more", "klipp_h2": "Packages",
  "klipp_lede": "Buy several sessions of your favourite treatment at a lower price. All packages are valid for 12 months.",
  "about_eyebrow": "About Noura Skin Secrets", "about_h2": "Personal skin care, built on <em>expertise</em>",
  "about_p": "Noura Skin Secrets is run by Nour, a certified skin therapist in Uppsala. The salon is a safe space for women only, where every treatment is tailored to your skin and goals — from classic facials to advanced HIFU and laser treatments.",
  "about_list": ["Tailored treatment plans based on skin analysis", "Modern equipment: HIFU, laser, plasma, microneedling", "Calm, exclusive environment — women only", "Open every day 10:00–20:00, by appointment"],
  "about_cta": "Book an appointment", "about_alt": "Nour, certified skin therapist — Noura Skin Secrets",
  "rating_bokadirekt": ("4.9", "71 reviews on Bokadirekt", "Read reviews"),
  "rating_google": ("5.0", "Our rating on Google", "Read & leave a review"),
  "reviews_eyebrow": "Client voices", "reviews_h2": "What our clients say",
  "results_eyebrow": "Results", "results_h2": "Before & after",
  "results_lede": "A glimpse of what advanced skin care can do for your skin's glow and texture.",
  "results_note": "Real results from the salon.", "results_tag": "Before & after",
  "ig_eyebrow": "Gallery", "ig_h2": "From our Instagram",
  "ig_lede": "We regularly share photos and results from the salon — follow us for before/after, offers and skin care tips.",
  "ig_cta": "Follow @noura_skin_secrets",
  "faq_eyebrow": "Good to know", "faq_h2": "Frequently asked questions",
  "faq": [
    ("How do I book an appointment?", f'Book instantly with a live calendar on <a href="{BOKADIREKT}" target="_blank" rel="noopener">Bokadirekt</a>, via our booking form, by phone <a href="tel:{PHONE_TEL}">{PHONE_DISP}</a> or email <a href="mailto:{EMAIL}">{EMAIL}</a>.'),
    ("Where is the salon located?", "In central Uppsala at Kungsängsgatan 5B, 753 22 Uppsala — close to buses, trains and parking."),
    ("What are your opening hours?", "We are open every day 10:00–20:00, by appointment only."),
    ("Is the salon really women only?", "Yes. The salon is a safe, relaxed environment created exclusively for women."),
    ("How do I know which treatment suits me?", "Try our skin assistant (chat button) which guides you based on your skin type. For a personal assessment we recommend a skin consultation (20 min, 450 kr)."),
    ("How do I prepare for a treatment?", "Come without makeup if possible, and avoid sun as well as strong acids/retinol a few days before most treatments. You always get personal instructions when booking."),
    ("Can I cancel or reschedule?", "Yes, contact us as soon as possible by phone or email and we will help you find a new time."),
    ("Do the treatments hurt?", "Most treatments are gentle and painless. For more intensive treatments such as microneedling, numbing cream is used. Let us know if you are sensitive and we will adapt the treatment."),
  ],
  "contact_eyebrow": "Find us", "contact_h2": "Visit us in <em>Uppsala</em>",
  "contact_lede": "Book easily online or contact us directly by phone, email or Instagram.",
  "contact_hours": "Every day 10:00–20:00 · by appointment only",
  "contact_cta": "Book your appointment now",
  "footer_desc": "Advanced skin and body care in Uppsala, in a safe environment created exclusively for women.",
  "footer_shortcuts": "Shortcuts", "footer_contact": "Contact",
  "footer_links": ["All treatments", "Book now", "About us", "Privacy policy"],
  "footer_rights": "All rights reserved.",
  "footer_org": f"Reg. no. {ORGNR}", "footer_place": "Uppsala, Sweden",
  "float_book": "Book now",
  "skip": "Skip to content",
  "cat_title": "Treatments & prices — Noura Skin Secrets Uppsala",
  "cat_desc": "Explore all 86 treatments at Noura Skin Secrets in Uppsala: facials, HIFU, eyes & lips, hair care, massage, body contouring, laser and plasma — with prices.",
  "cat_eyebrow": "Treatment catalogue", "cat_h1": "All our <em>treatments</em>",
  "cat_lede": "86 treatments across 14 categories — with clear prices. Search or filter to find the right treatment for you.",
  "cat_search": "Search treatments, e.g. HydraFacial, HIFU, massage…",
  "cat_empty_h": "No treatments found", "cat_empty_p": "Try another search term or category.",
  "cat_consult_h2": "Not sure which treatment suits you?",
  "cat_consult_p": "Book a skin consultation (450 kr, 20 min) and we will find the right treatment together.",
  "cat_consult_cta": "Book a consultation",
  "boka_title": "Book an appointment — Noura Skin Secrets Uppsala",
  "boka_desc": "Book your treatment at Noura Skin Secrets in Uppsala — instantly via Bokadirekt or with our request form.",
  "boka_eyebrow": "Booking", "boka_h1": "Book your <em>appointment</em>",
  "boka_lede": "Book instantly with a live calendar via Bokadirekt — or send a request and we confirm within 24 hours.",
  "bd_h3": "Book instantly — see available times",
  "bd_p": "Choose treatment and time in real time via Bokadirekt. The fastest way.",
  "bd_cta": "Open Bokadirekt",
  "bd_or": "or send a request",
  "boka_name": "Name", "boka_name_ph": "First and last name",
  "boka_email": "Email", "boka_phone": "Phone",
  "boka_treatment": "Treatment", "boka_date": "Preferred date", "boka_time": "Preferred time",
  "boka_msg": "Message (optional)", "boka_msg_ph": "Anything we should know? Allergies, skin condition, questions…",
  "boka_note": f"* Required fields. Your request is sent to {EMAIL} — we confirm your appointment as soon as we can.",
  "boka_submit": "Send booking request",
  "boka_info_h3": "Contact & directions",
  "boka_rating": "4.9 out of 5 — 71 reviews on Bokadirekt",
  "priv_title": "Privacy policy — Noura Skin Secrets",
  "priv_desc": "Privacy policy for Noura Skin Secrets — how we handle personal data, bookings and photos in AI skin analysis.",
  "priv_h1": "Privacy policy",
},
"ar": {
  "dir": "rtl", "lang": "ar", "locale": "ar_SE",
  "brand_tag": "العناية بالبشرة وعلاجات التجميل في أوبسالا",
  "nav": ["الرئيسية", "العلاجات", "من نحن", "اتصلي بنا"], "nav_book": "احجزي موعد",
  "menu_close": "إغلاق",
  "home_title": "نورا سكين سيكرتس — العناية بالبشرة وعلاجات التجميل في أوبسالا",
  "home_desc": "نورا سكين سيكرتس في أوبسالا: عناية متقدمة بالبشرة — هيدرافيشل، هايفو، ميكرونيدلينغ، ليزر ومساج. للنساء فقط. احجزي موعدك اليوم.",
  "hero_eyebrow": "أوبسالا · للنساء فقط",
  "hero_h1": 'حيث تلتقي الخبرة <em>بالأمان</em>',
  "hero_lede": "عناية متقدمة بالبشرة والجسم في أجواء دافئة وشخصية. من الهيدرافيشل والهايفو إلى الميكرونيدلينغ والمساج — كل شيء مصمم خصيصاً لبشرتك.",
  "hero_cta1": "احجزي موعد", "hero_cta2": "جميع العلاجات",
  "hero_stat1": ("★ 4.9", "على Bokadirekt · 71 تقييماً"),
  "hero_stat2": ("86", "علاجاً في 14 فئة"),
  "hero_stat3": ("10–20", "مفتوح يومياً، بالحجز المسبق"),
  "hero_tag": ("نور", "أخصائية بشرة معتمدة والمؤسِّسة"),
  "trust": ["للنساء فقط", "هايفو · ليزر · بلازما · ميكرونيدلينغ", "وسط أوبسالا — Kungsängsgatan 5B"],
  "cats_eyebrow": "خدماتنا", "cats_h2": "علاجات <em>للوجه والجسم والشعر</em>",
  "cats_lede": "تصفحي 14 فئة و86 علاجاً — أو شاهدي الكتالوج كاملاً.",
  "cats_all": "كتالوج العلاجات الكامل",
  "offers_eyebrow": "حالياً", "offers_h2": "العروض <em>والباقات</em>",
  "offers_lede": "علاجات وباقات مختارة بأسعار مميزة.",
  "offers_more": f'تجدين أحدث العروض دائماً على <a href="{IG}" target="_blank" rel="noopener">@noura_skin_secrets</a>.',
  "klipp_eyebrow": "وفّري أكثر", "klipp_h2": "باقات الجلسات",
  "klipp_lede": "اشتري عدة جلسات من علاجك المفضل بسعر أقل. كل الباقات صالحة لمدة 12 شهراً.",
  "about_eyebrow": "عن نورا سكين سيكرتس", "about_h2": "عناية شخصية بالبشرة، مبنية على <em>الخبرة</em>",
  "about_p": "تدير نورا سكين سيكرتس الأخصائية نور، أخصائية بشرة معتمدة في أوبسالا. الصالون مساحة آمنة للنساء فقط، حيث يُصمم كل علاج حسب بشرتك وأهدافك — من تنظيف البشرة الكلاسيكي إلى علاجات الهايفو والليزر المتقدمة.",
  "about_list": ["خطط علاج مخصصة بعد تحليل البشرة", "أجهزة حديثة: هايفو، ليزر، بلازما، ميكرونيدلينغ", "أجواء هادئة وراقية — للنساء فقط", "مفتوح يومياً 10:00–20:00، بالحجز المسبق"],
  "about_cta": "احجزي موعداً", "about_alt": "نور، أخصائية بشرة معتمدة — نورا سكين سيكرتس",
  "rating_bokadirekt": ("4.9", "71 تقييماً على Bokadirekt", "اقرئي التقييمات"),
  "rating_google": ("5.0", "تقييمنا على غوغل", "اقرئي أو اتركي تقييماً"),
  "reviews_eyebrow": "آراء العميلات", "reviews_h2": "ماذا تقول عميلاتنا",
  "results_eyebrow": "النتائج", "results_h2": "قبل وبعد",
  "results_lede": "لمحة عما يمكن أن تفعله العناية المتقدمة بالبشرة لنضارة بشرتك وملمسها.",
  "results_note": "نتائج حقيقية من الصالون.", "results_tag": "قبل وبعد",
  "ig_eyebrow": "المعرض", "ig_h2": "من إنستغرامنا",
  "ig_lede": "نشارك باستمرار صوراً ونتائج من الصالون — تابعينا لمشاهدة قبل/بعد والعروض ونصائح العناية بالبشرة.",
  "ig_cta": "تابعي @noura_skin_secrets",
  "faq_eyebrow": "معلومات مفيدة", "faq_h2": "الأسئلة الشائعة",
  "faq": [
    ("كيف أحجز موعداً؟", f'احجزي فوراً عبر تقويم مباشر على <a href="{BOKADIREKT}" target="_blank" rel="noopener">Bokadirekt</a>، أو عبر نموذج الحجز، أو هاتفياً <a href="tel:{PHONE_TEL}"><span dir="ltr">{PHONE_DISP}</span></a> أو بالبريد <a href="mailto:{EMAIL}">{EMAIL}</a>.'),
    ("أين يقع الصالون؟", "في وسط أوبسالا: Kungsängsgatan 5B, 753 22 Uppsala — قريب من الباصات والقطار والمواقف."),
    ("ما هي أوقات العمل؟", "مفتوح يومياً من 10:00 حتى 20:00، بالحجز المسبق فقط."),
    ("هل الصالون فعلاً للنساء فقط؟", "نعم. الصالون بيئة آمنة ومريحة مخصصة للنساء فقط."),
    ("كيف أعرف العلاج المناسب لي؟", "جربي مساعدة البشرة (زر الدردشة) التي ترشدك حسب نوع بشرتك. وللتقييم الشخصي ننصح بجلسة استشارة بشرة (20 دقيقة، 450 كرون)."),
    ("كيف أستعد قبل الجلسة؟", "يفضل الحضور بدون مكياج، وتجنب التعرض للشمس والأحماض القوية/الريتينول قبل أيام من معظم العلاجات. ستحصلين دائماً على تعليمات شخصية عند الحجز."),
    ("هل يمكنني إلغاء أو تغيير موعدي؟", "نعم، تواصلي معنا بأسرع وقت عبر الهاتف أو الإيميل وسنساعدك في إيجاد موعد جديد."),
    ("هل العلاجات مؤلمة؟", "معظم علاجاتنا لطيفة وغير مؤلمة. وفي العلاجات الأقوى مثل الميكرونيدلينغ نستخدم كريم تخدير لراحتك. أخبرينا إذا كانت بشرتك حساسة وسنكيّف العلاج."),
  ],
  "contact_eyebrow": "موقعنا", "contact_h2": "زورينا في <em>أوبسالا</em>",
  "contact_lede": "احجزي بسهولة أونلاين أو تواصلي معنا مباشرة عبر الهاتف أو الإيميل أو إنستغرام.",
  "contact_hours": "يومياً 10:00–20:00 · بالحجز المسبق فقط",
  "contact_cta": "احجزي موعدك الآن",
  "footer_desc": "عناية متقدمة بالبشرة والجسم في أوبسالا، في بيئة آمنة مخصصة للنساء فقط.",
  "footer_shortcuts": "روابط سريعة", "footer_contact": "التواصل",
  "footer_links": ["جميع العلاجات", "احجزي موعد", "من نحن", "سياسة الخصوصية"],
  "footer_rights": "جميع الحقوق محفوظة.",
  "footer_org": f"رقم المنظمة {ORGNR}", "footer_place": "أوبسالا، السويد",
  "float_book": "احجزي موعد",
  "skip": "انتقلي إلى المحتوى",
  "cat_title": "العلاجات والأسعار — نورا سكين سيكرتس أوبسالا",
  "cat_desc": "استكشفي 86 علاجاً لدى نورا سكين سيكرتس في أوبسالا: الوجه، هايفو، العيون والشفاه، الشعر، المساج، نحت الجسم، الليزر والبلازما — مع الأسعار.",
  "cat_eyebrow": "كتالوج العلاجات", "cat_h1": "جميع <em>علاجاتنا</em>",
  "cat_lede": "86 علاجاً في 14 فئة — بأسعار واضحة. ابحثي أو صفّي للعثور على العلاج المناسب لك.",
  "cat_search": "ابحثي عن علاج، مثل: هيدرافيشل، هايفو، مساج…",
  "cat_empty_h": "لم يتم العثور على علاجات", "cat_empty_p": "جربي كلمة بحث أخرى أو فئة مختلفة.",
  "cat_consult_h2": "غير متأكدة أي علاج يناسبك؟",
  "cat_consult_p": "احجزي استشارة بشرة (450 كرون، 20 دقيقة) وسنجد العلاج المناسب معاً.",
  "cat_consult_cta": "احجزي استشارة",
  "boka_title": "حجز موعد — نورا سكين سيكرتس أوبسالا",
  "boka_desc": "احجزي علاجك لدى نورا سكين سيكرتس في أوبسالا — فوراً عبر Bokadirekt أو عبر نموذج الطلب.",
  "boka_eyebrow": "الحجز", "boka_h1": "احجزي <em>موعدك</em>",
  "boka_lede": "احجزي فوراً عبر تقويم مباشر على Bokadirekt — أو أرسلي طلباً وسنؤكده خلال 24 ساعة.",
  "bd_h3": "احجزي فوراً — شاهدي الأوقات المتاحة",
  "bd_p": "اختاري العلاج والوقت مباشرة عبر Bokadirekt. الطريقة الأسرع والأسهل.",
  "bd_cta": "افتحي Bokadirekt",
  "bd_or": "أو أرسلي طلب حجز",
  "boka_name": "الاسم", "boka_name_ph": "الاسم الكامل",
  "boka_email": "الإيميل", "boka_phone": "الهاتف",
  "boka_treatment": "العلاج", "boka_date": "التاريخ المفضل", "boka_time": "الوقت المفضل",
  "boka_msg": "رسالة (اختياري)", "boka_msg_ph": "هل هناك ما يجب أن نعرفه؟ حساسية، حالة البشرة، أسئلة…",
  "boka_note": f"* حقول إلزامية. يُرسل طلبك إلى {EMAIL} — وسنؤكد موعدك بأسرع وقت.",
  "boka_submit": "أرسلي طلب الحجز",
  "boka_info_h3": "التواصل والوصول",
  "boka_rating": "4.9 من 5 — 71 تقييماً على Bokadirekt",
  "priv_title": "سياسة الخصوصية — نورا سكين سيكرتس",
  "priv_desc": "سياسة الخصوصية لنورا سكين سيكرتس — كيف نتعامل مع البيانات الشخصية والحجوزات والصور في تحليل البشرة بالذكاء الاصطناعي.",
  "priv_h1": "سياسة الخصوصية",
},
}

PAGES = ["index.html", "behandlingar.html", "boka.html", "integritet.html"]
LANG_DIR = {"sv": "", "en": "en/", "ar": "ar/"}

def urlfor(lang, page):
    base = SITE + "/" + LANG_DIR[lang]
    return base + ("" if page == "index.html" and lang != "sv" else page) if page != "index.html" else base

def head(lang, page, title, desc, root, extra_schema=None):
    t = T[lang]
    fonts = "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:ital,wght@0,300;0,400;0,500;1,400"
    if lang == "ar":
        fonts += "&family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@300;400;500;700"
    alts = "\n".join(
        f'<link rel="alternate" hreflang="{l}" href="{urlfor(l, page)}" />' for l in ["sv", "en", "ar"]
    ) + f'\n<link rel="alternate" hreflang="x-default" href="{urlfor("sv", page)}" />'
    schema = ""
    if extra_schema:
        for s in extra_schema:
            schema += f'<script type="application/ld+json">{json.dumps(s, ensure_ascii=False)}</script>\n'
    return f"""<!DOCTYPE html>
<html lang="{t['lang']}" dir="{t['dir']}">
<head>
<meta charset="UTF-8" />
<meta name="google-site-verification" content="wgeO30Nwprq1GqiJqN-1tGFF_bGT_r66AaDnktiWAkQ" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<link rel="canonical" href="{urlfor(lang, page)}" />
{alts}
<meta property="og:type" content="website" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{desc}" />
<meta property="og:url" content="{urlfor(lang, page)}" />
<meta property="og:image" content="{SITE}/images/logo.jpg" />
<meta property="og:locale" content="{t['locale']}" />
<meta name="twitter:card" content="summary" />
<link rel="icon" href="{root}images/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{root}app/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap" />
<link rel="stylesheet" href="{root}css/site.css" />
<link rel="stylesheet" href="{root}css/hudassistent.css" />
{schema}</head>"""

def header(lang, page, root):
    t = T[lang]
    p = lambda f: root + LANG_DIR[lang].replace(LANG_DIR[lang], "") + f  # same-lang pages sit beside each other
    nav_items = [
        ("index.html", t["nav"][0]),
        ("behandlingar.html", t["nav"][1]),
        ("index.html#om-oss", t["nav"][2]),
        ("index.html#kontakt", t["nav"][3]),
    ]
    active_attr = ' class="active"'
    links = "".join(
        f'<li><a href="{h}"{active_attr if h == page else ""}>{lbl}</a></li>'
        for h, lbl in nav_items
    )
    # språkväxel: länka till motsvarande sida
    def langhref(l):
        depth = "../" if lang != "sv" else ""
        target = LANG_DIR[l]
        return (depth + target + page) if l != "sv" else (depth + page) if lang != "sv" else (target + page)
    switch = ""
    for l, lbl, cls in [("sv", "SV", ""), ("en", "EN", ""), ("ar", "عربي", " ar")]:
        active = " active" if l == lang else ""
        switch += f'<a class="{cls.strip()}{active}" href="{langhref(l)}" lang="{l}">{lbl}</a>'
    mobile_links = "".join(
        f'<a class="mm-link" href="{h}">{lbl}</a>' for h, lbl in nav_items
    ) + f'<a class="mm-link" href="boka.html">{t["nav_book"]}</a>'
    return f"""<body data-boka="boka.html" data-catalog="behandlingar.html" data-root="{root}">
<a class="skip-link" href="#main">{t['skip']}</a>
<header class="site-header">
  <div class="bar">
    <a href="index.html" class="logo" aria-label="Noura Skin Secrets">{LOGO}<span class="logo-word">Noura <em>Skin Secrets</em></span></a>
    <nav aria-label="Huvudmeny"><ul class="nav-links">{links}</ul></nav>
    <div class="nav-cta">
      <div class="lang-switch">{switch}</div>
      <a href="boka.html" class="btn btn-primary">{t['nav_book']}<span class="btn-ic">{IC['arrow']}</span></a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Meny"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu">
  <button class="mm-close nav-toggle" aria-expanded="true" aria-label="{t['menu_close']}" style="display:block"><span style="transform:translateY(4.5px) rotate(45deg)"></span><span style="transform:translateY(-4.5px) rotate(-45deg)"></span></button>
  {mobile_links}
  <div class="mm-meta">{ADDRESS} · <span dir="ltr">{PHONE_DISP}</span></div>
</div>"""

def footer(lang, root):
    t = T[lang]
    fl = t["footer_links"]
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="f-brand">{LOGO} Noura Skin Secrets</div>
        <p>{t['footer_desc']}</p>
      </div>
      <div>
        <h4>{t['footer_shortcuts']}</h4>
        <ul>
          <li><a href="behandlingar.html">{fl[0]}</a></li>
          <li><a href="boka.html">{fl[1]}</a></li>
          <li><a href="index.html#om-oss">{fl[2]}</a></li>
          <li><a href="integritet.html">{fl[3]}</a></li>
        </ul>
      </div>
      <div>
        <h4>{t['footer_contact']}</h4>
        <ul>
          <li>{ADDRESS}</li>
          <li><a href="tel:{PHONE_TEL}"><span dir="ltr">{PHONE_DISP}</span></a></li>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li><a href="{IG}" target="_blank" rel="noopener">@noura_skin_secrets</a></li>
          <li><a href="{BOKADIREKT}" target="_blank" rel="noopener">Bokadirekt</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Noura Skin Secrets AB · <span class="num">{t['footer_org']}</span> · {t['footer_rights']}</span>
      <span>{t['footer_place']}</span>
    </div>
  </div>
</footer>
<a href="boka.html" class="btn btn-gold float-cta">{t['float_book']}</a>"""

def scripts(root, extra=""):
    base = (
        f'<script src="{root}js/treatments.js"></script>\n'
        f'<script src="{root}js/icons.js"></script>\n'
        f'<script src="{root}js/site.js"></script>\n'
    )
    return base + extra + (
        f'<script src="{root}js/livechat.js" defer></script>\n'
        f'<script src="{root}js/hudassistent.js" defer></script>\n</body>\n</html>'
    )

def salon_schema(lang):
    return {
        "@context": "https://schema.org", "@type": "BeautySalon",
        "name": "Noura Skin Secrets",
        "image": f"{SITE}/images/logo.jpg", "url": urlfor(lang, "index.html"),
        "telephone": PHONE_TEL, "email": EMAIL, "priceRange": "450–3500 SEK",
        "address": {"@type": "PostalAddress", "streetAddress": "Kungsängsgatan 5B",
                    "postalCode": "753 22", "addressLocality": "Uppsala", "addressCountry": "SE"},
        "geo": {"@type": "GeoCoordinates", "latitude": 59.8556, "longitude": 17.6431},
        "openingHoursSpecification": {"@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "10:00", "closes": "20:00"},
        "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "71"},
        "identifier": {"@type": "PropertyValue", "propertyID": "org.nr", "value": ORGNR},
        "sameAs": [IG, BOKADIREKT],
    }

def faq_schema(lang):
    import re
    return {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a)}}
            for q, a in T[lang]["faq"]
        ],
    }

# ---------------------------------------------------------------- index
def page_index(lang, root):
    t = T[lang]
    stats = "".join(
        f'<div class="stat"><span class="stat-num">{a}</span><span>{b}</span></div>'
        for a, b in [t["hero_stat1"], t["hero_stat2"], t["hero_stat3"]]
    )
    trust = f'<span class="t-sep"></span>'.join(
        f'<span class="t-item">{ic}<span>{txt}</span></span>'
        for ic, txt in zip([IC["shield"], IC["star"], IC["pin"]], t["trust"])
    )
    about_list = "".join(f"<li>{x}</li>" for x in t["about_list"])
    faq_blocks = "".join(
        f'<div class="faq-block reveal"><h3>{q}</h3><p>{a}</p></div>' for q, a in t["faq"]
    )
    half = (len(t["faq"]) + 1) // 2
    faq_col1 = "".join(f'<div class="faq-block reveal"><h3>{q}</h3><p>{a}</p></div>' for q, a in t["faq"][:half])
    faq_col2 = "".join(f'<div class="faq-block reveal"><h3>{q}</h3><p>{a}</p></div>' for q, a in t["faq"][half:])
    rb = t["rating_bokadirekt"]; rg = t["rating_google"]
    # tredje före/efter-bilden: arabiska sidor får bilden med قبل/بعد-etiketter
    ba3 = "publer-1772786254018.JPG" if lang == "ar" else "publer-1772392918562.JPG"
    html = head(lang, "index.html", t["home_title"], t["home_desc"], root,
                [salon_schema(lang), faq_schema(lang)])
    html += header(lang, "index.html", root)
    html += f"""
<main id="main">
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">{t['hero_eyebrow']}</span>
      <h1>{t['hero_h1']}</h1>
      <p class="lede">{t['hero_lede']}</p>
      <div class="hero-actions">
        <a href="boka.html" class="btn btn-gold">{t['hero_cta1']}<span class="btn-ic">{IC['arrow']}</span></a>
        <a href="behandlingar.html" class="btn btn-outline">{t['hero_cta2']}</a>
      </div>
      <div class="hero-proof">{stats}</div>
    </div>
    <div class="hero-media reveal" data-d="1">
      <div class="frame"><div class="frame-core">
        <img src="{root}images/hero-poster.jpg" alt="" onerror="this.remove()" />
        <video data-src="{root}videos/hero.mp4" muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true"></video>
        <div class="hero-tag"><strong>{t['hero_tag'][0]}</strong><span>{t['hero_tag'][1]}</span></div>
      </div></div>
    </div>
  </div>
</section>

<div class="container"><div class="trust-line reveal">{trust}</div></div>

<section class="section" id="behandlingskategorier">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">{t['cats_eyebrow']}</span>
      <h2>{t['cats_h2']}</h2>
      <p>{t['cats_lede']}</p>
    </div>
    <div class="cat-bento" id="cat-bento"></div>
    <p class="center mt-lg reveal"><a class="text-link" href="behandlingar.html">{t['cats_all']} {IC['arrow']}</a></p>
  </div>
</section>

<section class="section section--tone" id="erbjudanden">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">{t['offers_eyebrow']}</span>
      <h2>{t['offers_h2']}</h2>
      <p>{t['offers_lede']}</p>
    </div>
    <div class="offer-list" id="offer-list"></div>
    <p class="center mt-lg reveal" style="color:var(--taupe);font-size:.9rem">{t['offers_more']}</p>
  </div>
</section>

<section class="section" id="klippkort">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">{t['klipp_eyebrow']}</span>
      <h2>{t['klipp_h2']}</h2>
      <p>{t['klipp_lede']}</p>
    </div>
    <div class="klipp-grid" id="klipp-grid"></div>
  </div>
</section>

<section class="section section--tone" id="om-oss">
  <div class="container about-grid">
    <div class="about-media reveal">
      <div class="frame"><div class="frame-core">
        <img src="{root}images/om-oss.jpg" alt="{t['about_alt']}" loading="lazy" onerror="this.remove()" />
      </div></div>
    </div>
    <div class="about-copy reveal" data-d="1">
      <span class="eyebrow">{t['about_eyebrow']}</span>
      <h2>{t['about_h2']}</h2>
      <p>{t['about_p']}</p>
      <ul class="about-list">{about_list}</ul>
      <div class="hero-actions"><a href="boka.html" class="btn btn-primary">{t['about_cta']}<span class="btn-ic">{IC['arrow']}</span></a></div>
    </div>
  </div>
</section>

<section class="section--tight section">
  <div class="container rating-duo">
    <a class="rating-card reveal" href="{BOKADIREKT}" target="_blank" rel="noopener">
      <span class="r-logo">{IC['cal']}</span>
      <div><span class="r-score num">{rb[0]}</span></div>
      <div><div class="r-stars">★★★★★</div><div class="r-meta">{rb[1]} · {rb[2]} →</div></div>
    </a>
    <a class="rating-card reveal" data-d="1" href="{GOOGLE_REVIEW}" target="_blank" rel="noopener">
      <span class="r-logo">{GOOGLE_G}</span>
      <div><span class="r-score num">{rg[0]}</span></div>
      <div><div class="r-stars">★★★★★</div><div class="r-meta">{rg[1]} · {rg[2]} →</div></div>
    </a>
  </div>
</section>

<section class="section" id="omdomen">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">{t['reviews_eyebrow']}</span>
      <h2>{t['reviews_h2']}</h2>
    </div>
    <div class="review-wall" id="review-wall"></div>
  </div>
</section>

<section class="section section--tone" id="resultat">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">{t['results_eyebrow']}</span>
      <h2>{t['results_h2']}</h2>
      <p>{t['results_lede']}</p>
    </div>
    <div class="ba-grid">
      <figure class="ba-item reveal" data-optional>
        <video src="{root}videos/before-after.mp4" poster="{root}images/before-after-poster.jpg" muted loop playsinline autoplay preload="metadata"></video>
        <span class="ba-tag">{t['results_tag']}</span>
      </figure>
      <figure class="ba-item reveal" data-d="1" data-optional>
        <img src="{root}images/publer-1770172237629.JPG" alt="{t['results_note']}" loading="lazy" />
        <span class="ba-tag">{t['results_tag']}</span>
      </figure>
      <figure class="ba-item reveal" data-d="2" data-optional>
        <img src="{root}images/{ba3}" alt="{t['results_note']}" loading="lazy" />
      </figure>
    </div>
    <p class="ba-note">{t['results_note']}</p>
  </div>
</section>

<section class="section" id="galleri">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">{t['ig_eyebrow']}</span>
      <h2>{t['ig_h2']}</h2>
      <p>{t['ig_lede']}</p>
    </div>
    <div class="ig-strip" id="ig-strip"></div>
    <p class="center mt-lg reveal"><a href="{IG}" target="_blank" rel="noopener" class="btn btn-outline">{t['ig_cta']}</a></p>
  </div>
</section>

<section class="section section--tone" id="faq">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">{t['faq_eyebrow']}</span>
      <h2>{t['faq_h2']}</h2>
    </div>
    <div class="faq-cols"><div>{faq_col1}</div><div>{faq_col2}</div></div>
  </div>
</section>

<section class="section" id="kontakt">
  <div class="container contact-band">
    <div class="reveal">
      <span class="eyebrow">{t['contact_eyebrow']}</span>
      <h2>{t['contact_h2']}</h2>
      <p style="color:var(--taupe)">{t['contact_lede']}</p>
      <ul class="c-list">
        <li>{IC['pin']}<span>{ADDRESS}</span></li>
        <li>{IC['phone']}<a href="tel:{PHONE_TEL}"><span dir="ltr">{PHONE_DISP}</span></a></li>
        <li>{IC['mail']}<a href="mailto:{EMAIL}">{EMAIL}</a></li>
        <li>{IC['clock']}<span>{t['contact_hours']}</span></li>
        <li>{IC['ig']}<a href="{IG}" target="_blank" rel="noopener">@noura_skin_secrets</a></li>
      </ul>
      <div class="hero-actions"><a href="boka.html" class="btn btn-gold">{t['contact_cta']}<span class="btn-ic">{IC['arrow']}</span></a></div>
    </div>
    <div class="map-frame reveal" data-d="1">
      <div class="frame"><div class="frame-core">
        <iframe title="Karta — Noura Skin Secrets" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=Kungs%C3%A4ngsgatan%205B%2C%20753%2022%20Uppsala&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
      </div></div>
    </div>
  </div>
</section>
</main>
"""
    html += footer(lang, root)
    extra = (
        f'<script src="{root}js/offers.js"></script>\n'
        f'<script src="{root}js/klippkort.js"></script>\n'
        f'<script src="{root}js/reviews.js"></script>\n'
        f'<script src="{root}js/home.js"></script>\n'
    )
    html += scripts(root, extra)
    return html

# ---------------------------------------------------------------- behandlingar
def page_catalog(lang, root):
    t = T[lang]
    html = head(lang, "behandlingar.html", t["cat_title"], t["cat_desc"], root, [salon_schema(lang)])
    html += header(lang, "behandlingar.html", root)
    html += f"""
<main id="main">
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">{t['cat_eyebrow']}</span>
    <h1>{t['cat_h1']}</h1>
    <p class="lede">{t['cat_lede']}</p>
  </div>
</section>
<section class="section--tight section">
  <div class="container">
    <div class="catalog-controls" id="catalog-controls">
      <div class="cc-row1">
        <input type="search" id="search" class="search-input" placeholder="{t['cat_search']}" />
        <div class="group-tabs" id="group-tabs"></div>
      </div>
      <div class="chip-row" id="chip-row"></div>
    </div>
    <div class="catalog-count" id="catalog-count"></div>
    <div id="catalog"></div>
    <div class="empty-state" id="empty-state" style="display:none">
      <h3>{t['cat_empty_h']}</h3><p>{t['cat_empty_p']}</p>
    </div>
  </div>
</section>
<section class="section section--tone">
  <div class="container center">
    <h2>{t['cat_consult_h2']}</h2>
    <p style="max-width:520px;margin:0 auto 26px;color:var(--taupe)">{t['cat_consult_p']}</p>
    <a href="boka.html" class="btn btn-primary">{t['cat_consult_cta']}<span class="btn-ic">{IC['arrow']}</span></a>
  </div>
</section>
</main>
"""
    html += footer(lang, root)
    html += scripts(root, f'<script src="{root}js/catalog.js"></script>\n')
    return html

# ---------------------------------------------------------------- boka
def page_booking(lang, root):
    t = T[lang]
    req = "*"
    html = head(lang, "boka.html", t["boka_title"], t["boka_desc"], root, [salon_schema(lang)])
    html += header(lang, "boka.html", root)
    html += f"""
<main id="main">
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">{t['boka_eyebrow']}</span>
    <h1>{t['boka_h1']}</h1>
    <p class="lede">{t['boka_lede']}</p>
  </div>
</section>
<section class="section--tight section">
  <div class="container">
    <div class="bd-card reveal">
      <h3>{t['bd_h3']}</h3>
      <p>{t['bd_p']}</p>
      <a class="btn btn-gold" href="{BOKADIREKT}" target="_blank" rel="noopener">{t['bd_cta']}<span class="btn-ic">{IC['arrow']}</span></a>
    </div>
    <div class="bd-or">{t['bd_or']}</div>
    <div class="booking-layout">
      <form class="booking-form reveal" id="booking-form" novalidate>
        <input type="hidden" name="_subject" value="Ny bokningsförfrågan — Noura Skin Secrets" />
        <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
        <div class="form-row">
          <label for="name">{t['boka_name']} {req}</label>
          <input type="text" id="name" name="name" required placeholder="{t['boka_name_ph']}" autocomplete="name" />
          <span class="field-error"></span>
        </div>
        <div class="form-row two-col">
          <div class="form-row">
            <label for="email">{t['boka_email']} {req}</label>
            <input type="email" id="email" name="email" required placeholder="din@epost.se" autocomplete="email" />
            <span class="field-error"></span>
          </div>
          <div class="form-row">
            <label for="phone">{t['boka_phone']} {req}</label>
            <input type="tel" id="phone" name="phone" required placeholder="07X-XXX XX XX" autocomplete="tel" />
            <span class="field-error"></span>
          </div>
        </div>
        <div class="form-row">
          <label for="treatment">{t['boka_treatment']} {req}</label>
          <select id="treatment" name="treatment" required></select>
          <span class="field-error"></span>
        </div>
        <div class="form-row two-col">
          <div class="form-row">
            <label for="date">{t['boka_date']} {req}</label>
            <input type="date" id="date" name="date" required />
            <span class="field-error"></span>
          </div>
          <div class="form-row">
            <label for="time">{t['boka_time']}</label>
            <input type="time" id="time" name="time" min="10:00" max="20:00" />
          </div>
        </div>
        <div class="form-row">
          <label for="message">{t['boka_msg']}</label>
          <textarea id="message" name="message" placeholder="{t['boka_msg_ph']}"></textarea>
        </div>
        <p class="form-note">{t['boka_note']}</p>
        <button type="submit" class="btn btn-primary btn-block">{t['boka_submit']}</button>
        <div class="confirm-box" id="confirm-box" role="status" aria-live="polite"></div>
      </form>
      <div class="reveal" data-d="1">
        <div class="info-card">
          <h3>{t['boka_info_h3']}</h3>
          <div class="info-row">{IC['pin']}<span>{ADDRESS}</span></div>
          <div class="info-row">{IC['mail']}<a href="mailto:{EMAIL}">{EMAIL}</a></div>
          <div class="info-row">{IC['phone']}<a href="tel:{PHONE_TEL}"><span dir="ltr">{PHONE_DISP}</span></a></div>
          <div class="info-row">{IC['clock']}<span>{t['contact_hours']}</span></div>
          <div class="info-row">{IC['ig']}<a href="{IG}" target="_blank" rel="noopener">@noura_skin_secrets</a></div>
          <div class="info-row">{IC['star']}<span>{t['boka_rating']}</span></div>
          <iframe class="map-embed" title="Karta" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Kungs%C3%A4ngsgatan%205B%2C%20753%2022%20Uppsala&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>
</main>
"""
    html += footer(lang, root)
    extra = (
        f'<script src="{root}js/vendor-qrcode.js"></script>\n'
        f'<script src="{root}js/booking.js"></script>\n'
        f'<script src="{root}js/availability.js" defer></script>\n'
        f'<script src="{root}js/payment.js" defer></script>\n'
    )
    html += scripts(root, extra)
    return html

# ---------------------------------------------------------------- integritet
PRIV = {
"sv": """
<div class="lang-block">
<h2>Personuppgiftsansvarig</h2>
<p><strong>Noura Skin Secrets AB</strong>, org.nr 559588-8925, Kungsängsgatan 5B, 753 22 Uppsala, är personuppgiftsansvarig för behandlingen av dina personuppgifter. Kontakt: <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>, 079-333 34 76.</p>
<h2>Bokningsförfrågningar</h2>
<p>Uppgifterna du anger i bokningsformuläret (namn, e-post, telefon, önskad behandling, datum och eventuellt meddelande) skickas till oss via formulärtjänsten Formspree och används enbart för att hantera din bokning. Rättslig grund: fullgörande av avtal. Uppgifterna sparas så länge det behövs för bokningen och vår bokföringsskyldighet.</p>
<h2>AI-hudanalys (foto)</h2>
<ul>
<li>Bilden förminskas i din webbläsare innan den skickas — metadata som platsinformation (GPS/EXIF) tas bort automatiskt.</li>
<li>Bilden skickas krypterat (HTTPS) via vår server till AI-leverantören Anthropic för analys.</li>
<li><strong>Vi sparar aldrig din bild</strong> — den behandlas endast i minnet och lagras inte på våra system.</li>
<li>Anthropic använder inte bilden för att träna AI-modeller och raderar API-data enligt sin policy (för närvarande max 30 dagar).</li>
<li>Analysen är kosmetisk vägledning och ersätter inte medicinsk rådgivning.</li>
<li>Tjänsten kräver ditt uttryckliga samtycke varje gång och är avsedd för personer över 18 år.</li>
</ul>
<h2>AI-chatt</h2>
<p>Fritextfrågor du skriver i hudassistenten skickas krypterat via vår server till AI-leverantören Anthropic för att generera ett svar. Meddelandena sparas aldrig av oss, används inte för att träna AI och raderas hos leverantören enligt deras policy. Skriv inte in känsliga personuppgifter i chatten.</p>
<h2>Livechatt & WhatsApp</h2>
<p>Vill du prata med en riktig person kan du använda vår livechatt eller WhatsApp. Livechatten drivs av tjänsten Tawk.to och laddas <strong>först när du själv klickar</strong> på chattknappen — innan dess sätts inga cookies från tjänsten. När chatten är öppen behandlar Tawk.to det du skriver samt tekniska uppgifter (t.ex. IP-adress) och sätter funktionscookies som krävs för chatten, enligt <a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener">Tawk.tos integritetspolicy</a>. Väljer du WhatsApp öppnas WhatsApp (Meta) och deras villkor gäller.</p>
<h2>Kontroll av lediga tider</h2>
<p>När du väljer ett datum i bokningsformuläret kan en förfrågan skickas till Google Kalender för att visa lediga och upptagna tider. Förfrågan innehåller endast det valda datumet — inga personuppgifter — men din IP-adress överförs till Google när anropet görs.</p>
<h2>Cookies och lokal lagring</h2>
<p>Webbplatsen använder inga spårnings- eller marknadsföringscookies. Vi sparar endast ditt språkval lokalt i din webbläsare (localStorage) — det är nödvändigt för funktionen och delas inte med någon. Typsnitt laddas från Google Fonts, varvid din IP-adress överförs till Google när filerna hämtas.</p>
<h2>Dina rättigheter (GDPR)</h2>
<p>Du har rätt att begära tillgång till, rättelse av eller radering av dina personuppgifter, samt att invända mot eller begränsa behandlingen. Kontakta oss på <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>. Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY), <a href="https://www.imy.se" target="_blank" rel="noopener">www.imy.se</a>.</p>
""",
"en": """
<div class="lang-block">
<h2>Data controller</h2>
<p><strong>Noura Skin Secrets AB</strong>, reg. no. 559588-8925, Kungsängsgatan 5B, 753 22 Uppsala, Sweden, is the controller for the processing of your personal data. Contact: <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>, +46 79-333 34 76.</p>
<h2>Booking requests</h2>
<p>The details you enter in the booking form (name, email, phone, requested treatment, date and any message) are sent to us via the form service Formspree and are used only to handle your booking. Legal basis: performance of a contract. Data is kept as long as needed for the booking and our bookkeeping obligations.</p>
<h2>AI skin analysis (photo)</h2>
<ul>
<li>The photo is downscaled in your browser before sending — metadata such as location (GPS/EXIF) is removed automatically.</li>
<li>The photo is sent encrypted (HTTPS) via our server to the AI provider Anthropic for analysis.</li>
<li><strong>We never store your photo</strong> — it is processed in memory only.</li>
<li>Anthropic does not use the photo to train AI models and deletes API data according to its policy (currently max 30 days).</li>
<li>The analysis is cosmetic guidance and does not replace medical advice.</li>
<li>The service requires your explicit consent each time and is intended for adults (18+).</li>
</ul>
<h2>AI chat</h2>
<p>Free-text questions you type in the skin assistant are sent encrypted via our server to the AI provider Anthropic to generate an answer. The messages are never stored by us, are not used to train AI, and are deleted by the provider according to their policy. Please don't enter sensitive personal data in the chat.</p>
<h2>Live chat & WhatsApp</h2>
<p>If you want to talk to a real person you can use our live chat or WhatsApp. The live chat is provided by Tawk.to and is loaded <strong>only when you click</strong> the chat button — no cookies from the service are set before that. Once open, Tawk.to processes what you write and technical data (e.g. IP address) and sets functional cookies required for the chat, according to the <a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener">Tawk.to privacy policy</a>. If you choose WhatsApp, WhatsApp (Meta) opens and their terms apply.</p>
<h2>Availability check</h2>
<p>When you pick a date in the booking form, a request may be sent to Google Calendar to show free and busy times. The request contains only the selected date — no personal data — but your IP address is transferred to Google when the call is made.</p>
<h2>Cookies and local storage</h2>
<p>This website uses no tracking or marketing cookies. We only store your language choice locally in your browser (localStorage) — this is necessary for the site to function and is not shared with anyone. Fonts are loaded from Google Fonts, which means your IP address is transferred to Google when the files are fetched.</p>
<h2>Your rights (GDPR)</h2>
<p>You may request access to, correction of, or deletion of your personal data, and object to or restrict processing, at <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>. You also have the right to lodge a complaint with the Swedish Authority for Privacy Protection (IMY), <a href="https://www.imy.se" target="_blank" rel="noopener">www.imy.se</a>.</p>
""",
"ar": """
<div class="lang-block">
<h2>المسؤول عن البيانات</h2>
<p><strong>Noura Skin Secrets AB</strong>، رقم المنظمة <span dir="ltr">559588-8925</span>، Kungsängsgatan 5B, 753 22 Uppsala، السويد، هي الجهة المسؤولة عن معالجة بياناتك الشخصية. للتواصل: <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>، <span dir="ltr">079-333 34 76</span>.</p>
<h2>طلبات الحجز</h2>
<p>البيانات التي تدخلينها في نموذج الحجز (الاسم، الإيميل، الهاتف، العلاج المطلوب، التاريخ وأي رسالة) تُرسل إلينا عبر خدمة النماذج Formspree وتُستخدم فقط لإدارة حجزك. الأساس القانوني: تنفيذ العقد. تُحفظ البيانات ما دامت لازمة للحجز ولالتزاماتنا المحاسبية.</p>
<h2>تحليل البشرة بالذكاء الاصطناعي (الصورة)</h2>
<ul>
<li>تُصغَّر الصورة في متصفحك قبل الإرسال — وتُحذف البيانات الوصفية مثل الموقع الجغرافي (GPS/EXIF) تلقائياً.</li>
<li>تُرسل الصورة مشفرة (HTTPS) عبر سيرفرنا إلى مزود الذكاء الاصطناعي Anthropic للتحليل.</li>
<li><strong>لا نخزن صورتك أبداً</strong> — تُعالج في الذاكرة فقط.</li>
<li>لا تستخدم Anthropic الصورة لتدريب نماذج الذكاء الاصطناعي وتحذف البيانات حسب سياستها (حالياً 30 يوماً كحد أقصى).</li>
<li>التحليل إرشاد تجميلي ولا يغني عن الاستشارة الطبية.</li>
<li>الخدمة تتطلب موافقتك الصريحة في كل مرة ومخصصة للبالغات (+18).</li>
</ul>
<h2>الدردشة بالذكاء الاصطناعي</h2>
<p>الأسئلة النصية التي تكتبينها في مساعدة البشرة تُرسل مشفرة عبر سيرفرنا إلى مزود الذكاء الاصطناعي Anthropic لتوليد الرد. لا نخزن الرسائل أبداً، ولا تُستخدم لتدريب الذكاء الاصطناعي، وتُحذف لدى المزود حسب سياستهم. الرجاء عدم كتابة بيانات شخصية حساسة في الدردشة.</p>
<h2>الدردشة المباشرة وواتساب</h2>
<p>إذا رغبت بالتحدث مع شخص حقيقي يمكنك استخدام الدردشة المباشرة أو واتساب. الدردشة المباشرة تقدمها خدمة Tawk.to وتُحمَّل <strong>فقط عندما تنقرين</strong> على زر الدردشة — وقبل ذلك لا تُوضع أي كوكيز من الخدمة. عند فتح الدردشة تعالج Tawk.to ما تكتبينه وبيانات تقنية (مثل عنوان IP) وتضع كوكيز وظيفية لازمة للدردشة، وفق <a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener">سياسة خصوصية Tawk.to</a>. وإذا اخترت واتساب يُفتح تطبيق واتساب (Meta) وتسري شروطهم.</p>
<h2>فحص الأوقات المتاحة</h2>
<p>عند اختيار تاريخ في نموذج الحجز قد يُرسل طلب إلى تقويم Google لعرض الأوقات المتاحة والمشغولة. لا يحتوي الطلب إلا على التاريخ المختار — دون أي بيانات شخصية — لكن عنوان IP الخاص بك يُنقل إلى Google عند إجراء الطلب.</p>
<h2>الكوكيز والتخزين المحلي</h2>
<p>لا يستخدم الموقع أي كوكيز تتبع أو تسويق. نحفظ فقط اختيارك للغة محلياً في متصفحك (localStorage) — وهذا ضروري لعمل الموقع ولا يُشارك مع أحد. تُحمَّل الخطوط من Google Fonts، ما يعني نقل عنوان IP الخاص بك إلى Google عند جلب الملفات.</p>
<h2>حقوقك (GDPR)</h2>
<p>يحق لك طلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها، والاعتراض على المعالجة أو تقييدها، عبر <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>. كما يحق لك تقديم شكوى إلى هيئة حماية الخصوصية السويدية (IMY): <a href="https://www.imy.se" target="_blank" rel="noopener">www.imy.se</a>.</p>
""",
}

def page_privacy(lang, root):
    t = T[lang]
    html = head(lang, "integritet.html", t["priv_title"], t["priv_desc"], root)
    html += header(lang, "integritet.html", root)
    html += f"""
<main id="main">
<section class="page-hero">
  <div class="container">
    <span class="eyebrow">Integritet · Privacy · الخصوصية</span>
    <h1>{t['priv_h1']}</h1>
  </div>
</section>
<section class="section--tight section">
  <div class="container policy">
    {PRIV[lang]}</div>
  </div>
</section>
</main>
"""
    html += footer(lang, root)
    html += scripts(root)
    return html

# ---------------------------------------------------------------- sitemap
def sitemap():
    urls = []
    prio = {"index.html": "1.0", "behandlingar.html": "0.9", "boka.html": "0.9", "integritet.html": "0.3"}
    for page in PAGES:
        alts = "".join(
            f'\n    <xhtml:link rel="alternate" hreflang="{l}" href="{urlfor(l, page)}"/>' for l in ["sv", "en", "ar"]
        )
        for lang in ["sv", "en", "ar"]:
            urls.append(f"""  <url>
    <loc>{urlfor(lang, page)}</loc>{alts}
    <changefreq>weekly</changefreq>
    <priority>{prio[page]}</priority>
  </url>""")
    urls.append(f"""  <url>
    <loc>{SITE}/app/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>""")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + "\n".join(urls) + "\n</urlset>\n")

# ---------------------------------------------------------------- kör
BUILDERS = {
    "index.html": page_index,
    "behandlingar.html": page_catalog,
    "boka.html": page_booking,
    "integritet.html": page_privacy,
}

def main():
    base = os.path.dirname(os.path.abspath(__file__))
    for lang in ["sv", "en", "ar"]:
        outdir = os.path.join(base, LANG_DIR[lang]) if LANG_DIR[lang] else base
        os.makedirs(outdir, exist_ok=True)
        root = "../" if LANG_DIR[lang] else ""
        for page, fn in BUILDERS.items():
            with open(os.path.join(outdir, page), "w", encoding="utf-8") as f:
                f.write(fn(lang, root))
            print("wrote", os.path.join(LANG_DIR[lang], page))
    with open(os.path.join(base, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap())
    with open(os.path.join(base, "robots.txt"), "w", encoding="utf-8") as f:
        f.write("User-agent: *\nAllow: /\n\nSitemap: " + SITE + "/sitemap.xml\n")
    print("wrote sitemap.xml, robots.txt")

if __name__ == "__main__":
    main()
