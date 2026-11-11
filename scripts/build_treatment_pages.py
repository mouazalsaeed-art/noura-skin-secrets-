#!/usr/bin/env python3
"""Build the Swedish landing pages for the salon's most popular treatments.

    python3 scripts/build_treatment_pages.py

Writes microneedling-uppsala.html, hifu-uppsala.html, hydrafacial-uppsala.html,
laser-uppsala.html and peeling-uppsala.html in the site root. Prices, durations,
descriptions and Bokadirekt links are read from js/treatments.js, so the pages
stay in sync with the catalogue — re-run this after changing prices there.
Header/footer come from build.py so the pages look like the rest of the site.
"""
import html
import json
import re
import sys
from urllib.parse import quote
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import build as B  # noqa: E402  (site templates: head/header/footer/scripts)

BD_BASE = "https://www.bokadirekt.se/boka-tjanst/noura-skin-secrets-kvinnlig-behandling-129600/"
CONSULT = "boka.html?treatment=Hudv%C3%A5rdskonsultation"


def load_treatments():
    """Parse js/treatments.js -> {name: {duration, price, bd, desc}} (Swedish fields)."""
    src = (ROOT / "js/treatments.js").read_text(encoding="utf-8")
    out = {}
    for block in re.split(r"\{\s*name:", src)[1:]:
        block = "name:" + block
        def field(k):
            m = re.search(rf'(?<![A-Za-z]){k}:\s*"((?:[^"\\]|\\.)*)"', block)
            return json.loads('"' + m.group(1) + '"') if m else ""
        name = field("name")
        if name and "treatments" not in block.split("desc:")[0]:
            out.setdefault(name, {"duration": field("duration"), "price": field("price"),
                                  "bd": field("bd"), "desc": field("desc")})
    return out


E = html.escape

PAGES = [
    {
        "slug": "microneedling-uppsala.html",
        "short": "Microneedling",
        "title": "Microneedling i Uppsala – kollagenboost & ärrbehandling | Noura Skin Secrets",
        "desc": "Microneedling i Uppsala med aktiva serum för lyster, porer, pigment, fina linjer och ärr. Från 900 kr. Endast för kvinnor. Boka tid online.",
        "h1": "Microneedling <em>i Uppsala</em>",
        "lede": "Microneedling med skräddarsydda aktiva serum – för jämnare hudton, förfinade porer, fastare hud och mjukare ärr. Utförs av certifierad hudterapeut i en trygg miljö enbart för kvinnor.",
        "main": "Microneedling – valfri aktiv lösning",
        "what_h2": "Vad är microneedling?",
        "what": [
            "Vid microneedling skapar ett instrument med mycket tunna nålar små kontrollerade mikrokanaler i huden. Det sätter igång hudens egen förnyelse och kollagenbildning, och gör att de aktiva serumen kan verka djupare än vid en vanlig ansiktsbehandling.",
            "Hos oss väljer du lösning efter ditt hudbehov – till exempel hudförnyelse med DNA Salmon, pigmentfläckar med tranexamsyra, återfuktning med hyaluronsyra eller ärrbehandling. Vi går igenom din hud och föreslår det som passar bäst.",
        ],
        "fits": ["Glåmig eller trött hud som behöver lyster", "Förstorade porer och ojämn hudstruktur",
                 "Pigmentfläckar och ojämn hudton", "Fina linjer och slappare hud", "Akneärr och andra ytliga ärr"],
        "steps": [("Hudgenomgång", "Vi tittar på din hud och väljer aktiv lösning efter dina mål."),
                  ("Rengöring & förberedelse", "Huden rengörs noggrant och bedövas vid behov."),
                  ("Microneedling", "Behandlingen görs med serum anpassat för din hud."),
                  ("Lugnande avslutning", "Vi avslutar med lugnande produkter och ger dig råd för eftervården.")],
        "treatments": ["Microneedling – Ansikte", "Microneedling – valfri aktiv lösning", "Microneedling med DNA Salmon", "Microneedling – Återfuktning & lyster", "Microneedling för hudens lyster", "Microneedling – Ansikte, hals & dekolletage", "Microneedling – Pigment & hudton", "Microneedling – Anti-age & uppstramning", "Microneedling – Ärrbehandling", "Microneedling + Hydro ansiktsbehandling", "Microneedling mot bristningar – välj område", "Microneedling Lips – med serum & tint", "Glass Skin"],
        "faq": [("Gör microneedling ont?", "De flesta upplever det som ett lätt stickande eller vibrerande. Vi använder bedövning vid behov så att behandlingen känns bekväm."),
                ("Hur ser huden ut efteråt?", "Det är vanligt att huden är rosa eller lätt röd och känns stram en kort tid efteråt. Undvik smink, sol och träning direkt efter – du får tydliga eftervårdsråd av oss."),
                ("Hur många behandlingar behöver jag?", "Det beror på vad du vill uppnå. Många märker skillnad redan efter första gången, medan till exempel ärr och pigment ofta behandlas i en serie med några veckors mellanrum. Vi lägger upp en plan tillsammans."),
                ("Passar microneedling alla?", "Vid graviditet, amning, aktiv akne, hudinfektion eller om du tar vissa läkemedel – kontakta oss innan du bokar så går vi igenom vad som är lämpligt för dig.")],
    },
    {
        "slug": "hifu-uppsala.html",
        "short": "HIFU",
        "title": "HIFU i Uppsala – lyft & uppstramning utan kirurgi | Noura Skin Secrets",
        "desc": "HIFU i Uppsala för ansikte, ögon, haklinje, dekolletage och kropp. Lyft och uppstramning utan kirurgi och utan återhämtningstid. Boka tid online.",
        "h1": "HIFU <em>i Uppsala</em>",
        "lede": "HIFU – fokuserat ultraljud som lyfter och stramar upp huden utan nålar, kirurgi eller återhämtningstid. För ansikte, ögonparti, haklinje, dekolletage och kropp.",
        "main": "VMAX HIFU & RF – Hela ansiktet",
        "what_h2": "Vad är HIFU?",
        "what": [
            "HIFU står för High Intensity Focused Ultrasound. Ultraljudet värmer upp de djupare hudlagren på utvalda punkter, medan hudytan lämnas orörd. Värmen stimulerar hudens egen kollagenproduktion.",
            "Eftersom kollagen byggs upp gradvis kommer resultatet successivt under veckorna efter behandlingen – för ett naturligt lyft och en fastare hud. Du kan gå tillbaka till vardagen direkt.",
        ],
        "fits": ["Slappare hud och tappad kontur i ansiktet", "Dubbelhaka och otydlig haklinje",
                 "Fina linjer runt ögonen", "Dekolletage som tappat fasthet", "Slapp hud på mage, lår eller överarmar"],
        "steps": [("Konsultation", "Vi går igenom vilka områden du vill behandla och vilket resultat du önskar."),
                  ("Rengöring", "Området rengörs och en ultraljudsgel läggs på."),
                  ("HIFU-behandling", "Ultraljudet förs över huden linje för linje – det känns som värme och små stick."),
                  ("Direkt tillbaka", "Ingen återhämtningstid. Resultatet byggs upp under de kommande veckorna.")],
        "treatments": ["VMAX HIFU & RF – Hela ansiktet", "HIFU – Hela ansiktet", "HIFU 4D – Runt ögonen", "HIFU 4D – Dubbelhaka & käklinje", "HIFU 4D – Hals & dekolletage", "HIFU 4D – Kropp (mage, lår eller armar)"],
        "faq": [("Gör HIFU ont?", "Behandlingen känns som värme och korta stick på vissa punkter, mest över ben. Vi anpassar styrkan så att det är uthärdligt för dig."),
                ("När ser jag resultat?", "Vissa ser en direkt fräschare hy, men det verkliga lyftet kommer gradvis när ny kollagen bildas under veckorna efter behandlingen."),
                ("Behöver jag vara ledig efteråt?", "Nej. Huden kan vara lätt röd eller öm en kort stund, men du kan oftast gå tillbaka till jobb och vardag direkt."),
                ("Vem ska inte göra HIFU?", "Vid graviditet, implantat eller fillers i området, aktiva hudproblem eller vissa sjukdomar – kontakta oss före bokning så bedömer vi om behandlingen passar dig.")],
    },
    {
        "slug": "hydrafacial-uppsala.html",
        "short": "Hydro facial",
        "title": "Hydro facial i Uppsala – djuprengöring & direkt lyster | Noura Skin Secrets",
        "desc": "Hydro facial i Uppsala: djuprengöring, pormaskborttagning och återfuktning med aktiva serum. Direkt lyster utan återhämtningstid. Boka tid online.",
        "h1": "Hydro facial <em>i Uppsala</em>",
        "lede": "En djuprengörande ansiktsbehandling som rensar porerna, tar bort pormaskar och återfuktar med aktiva serum. Du går härifrån med direkt lyster – och kan sminka dig och gå vidare med dagen.",
        "main": "Hydro ansiktsbehandling – djuprengöring",
        "what_h2": "Vad är en hydro ansiktsbehandling?",
        "what": [
            "En hydro ansiktsbehandling kombinerar rengöring, skonsam exfoliering och extraktion med vakuum, så att smuts, talg och pormaskar sugs ur porerna utan att huden behöver klämmas.",
            "Därefter tillförs återfuktande och närande serum. Behandlingen passar de flesta hudtyper och är ett bra val både som regelbunden hudvård och inför ett speciellt tillfälle.",
        ],
        "fits": ["Pormaskar och tilltäppta porer", "Glåmig eller trött hy", "Torr eller uttorkad hud",
                 "Fet hud och stora porer", "Inför fest, bröllop eller event"],
        "steps": [("Rengöring", "Huden rengörs och förbereds."),
                  ("Exfoliering", "Döda hudceller avlägsnas skonsamt."),
                  ("Extraktion", "Porerna töms med vakuum – utan klämning."),
                  ("Serum & avslutning", "Återfuktande serum tillförs för lyster och mjukhet.")],
        "treatments": ["Hydro ansiktsbehandling – djuprengöring", "Microneedling + Hydro ansiktsbehandling", "Laser Carbon + Hydro ansiktsbehandling + lugnande mask", "Oxygenbehandling – CO2 Bubble", "VIP Lyxbehandling"],
        "faq": [("Hur ofta bör man göra en hydro facial?", "Många gör den en gång i månaden som en del av sin hudvårdsrutin, men även en enstaka behandling ger en tydlig fräschör. Vi hjälper dig att hitta en rytm som passar din hud."),
                ("Finns det någon återhämtningstid?", "Nej. Huden kan vara lätt rosig direkt efteråt, men det brukar gå över snabbt."),
                ("Passar det känslig hud?", "Ja, behandlingen är skonsam och anpassas efter din hud. Berätta gärna om du har känslig hud eller rosacea när du kommer."),
                ("Kan jag kombinera med andra behandlingar?", "Ja – till exempel med microneedling eller laser carbon. Se kombinationerna nedan, eller fråga oss vid besöket.")],
    },
    {
        "slug": "laser-uppsala.html",
        "short": "Laser",
        "title": "Laserbehandling i Uppsala – pigment, porer & tatueringsborttagning | Noura Skin Secrets",
        "desc": "Laserbehandling i Uppsala: Pico laser mot pigmentering, Laser Carbon för porer och fet hud, tatueringsborttagning och laser mot bristningar. Boka tid online.",
        "h1": "Laserbehandling <em>i Uppsala</em>",
        "lede": "Laser mot pigmentering och ojämn hudton, Laser Carbon för stora porer och fet hud, borttagning av tatueringar och behandling av bristningar – utfört av certifierad hudterapeut.",
        "main": "Komplett ansiktsbehandling: Pico Laser + djupgående rengöring & peeling",
        "what_h2": "Vilken laser passar dig?",
        "what": [
            "Pico laser arbetar med mycket korta ljuspulser som bryter ner pigment och stimulerar kollagen – därför används den mot pigmentfläckar, ojämn hudton och ytliga ärr. Laser Carbon kombinerar en kolmask med laser för att djuprengöra porerna, och passar särskilt fet hud och stora porer.",
            "Vid tatueringsborttagning bryter lasern gradvis ner bläckpartiklarna. Hur många behandlingar som behövs beror på tatueringens storlek, placering och färg – vi gör en bedömning innan vi börjar.",
        ],
        "fits": ["Pigmentfläckar och ojämn hudton", "Stora porer och fet hud", "Ytliga ärr",
                 "Tatueringar du vill bli av med – även på läppar och ögonbryn", "Bristningar på magen"],
        "note_html": 'Letar du efter hårborttagning? Se <a href="laser-harborttagning-uppsala.html">laser hårborttagning i Uppsala</a>.',
        "steps": [("Bedömning", "Vi tittar på huden eller tatueringen och väljer rätt behandling."),
                  ("Förberedelse", "Huden rengörs – i ansiktsbehandlingarna ingår djuprengöring."),
                  ("Laserbehandling", "Lasern förs över området; det känns som snabba, små knäpp."),
                  ("Lugnande & eftervård", "Vi lugnar huden och ger dig råd om solskydd och eftervård.")],
        "treatments": ["Pico Laser – Pigmentbehandling", "Komplett ansiktsbehandling: Pico Laser + djupgående rengöring & peeling", "Carbon Laser Peeling", "Laser Carbon + Hydro ansiktsbehandling + lugnande mask", "Laser – Borttagning av tatuering", "Laser – Borttagning av tatuering (läppar & ögonbryn)", "Laser – Bristningar (stretch marks)"],
        "faq": [("Gör laser ont?", "Det känns som små, snabba knäpp mot huden. De flesta tycker att det är fullt hanterbart, och vi anpassar behandlingen efter dig."),
                ("Hur många gånger behöver jag komma?", "Det varierar. Vid pigment och tatueringar krävs oftast flera behandlingar med uppehåll emellan. Vi ger dig en uppskattning vid första besöket."),
                ("Kan jag sola efter laser?", "Undvik sol och solarium både före och efter behandlingen och använd hög solskyddsfaktor. Det minskar risken för pigmentförändringar."),
                ("Vem ska inte göra laser?", "Vid graviditet, nyligen solbränd hud, ljuskänslighet eller vissa läkemedel – kontakta oss innan du bokar så går vi igenom vad som gäller för dig.")],
    },
    {
        "slug": "laser-harborttagning-uppsala.html",
        "short": "Laser hårborttagning",
        "strip": "Laser hårborttagning – ",
        "title": "Laser hårborttagning i Uppsala – 808 diodlaser | Noura Skin Secrets",
        "desc": "Laser hårborttagning i Uppsala med 808 diodlaser och inbyggd kylning. Ansikte, armhålor, bikini, ben och helkropp – från 250 kr. Endast för kvinnor.",
        "h1": "Laser hårborttagning <em>i Uppsala</em>",
        "lede": "Hårborttagning med 808 diodlaser och inbyggd kylning – skonsamt, nästintill smärtfritt och för de flesta hud- och hårtyper. Från överläpp till helkropp, i en trygg miljö enbart för kvinnor.",
        "main": "Laser hårborttagning – Helkropp",
        "what_h2": "Hur fungerar 808 diodlaser?",
        "what": [
            "Diodlasern med våglängden 808 nm riktar ljusenergi mot pigmentet i hårsäcken. Energin omvandlas till värme som försvagar hårsäcken, så att hårväxten minskar för varje behandling. Den inbyggda kylningen skyddar huden och gör behandlingen bekväm.",
            "Håret växer i olika faser och lasern påverkar bara de hårstrån som växer aktivt just då. Därför behövs en serie – för bästa resultat rekommenderas 6–8 behandlingar med några veckors mellanrum.",
        ],
        "fits": ["Oönskat hår i ansiktet, på överläpp eller haka", "Armhålor och bikini / Brazilian",
                 "Ben och armar", "Dig som är trött på rakning och vaxning", "Hårväxt som ger irritation eller inåtväxande hår"],
        "steps": [("Genomgång", "Vi går igenom hud, hår och vilka områden du vill behandla."),
                  ("Förberedelse", "Området ska vara nyrakat – vi rengör huden innan start."),
                  ("Laserbehandling", "Lasern förs över huden med kylning – det känns som lätt värme."),
                  ("Eftervård", "Vi lugnar huden och ger råd om solskydd och nästa behandling.")],
        "treatments": ["Laser hårborttagning – Överläpp eller Haka", "Laser hårborttagning – Armhålor",
                       "Laser hårborttagning – Hela ansiktet", "Laser hårborttagning – Bikini / Brazilian",
                       "Laser hårborttagning – Armar", "Laser hårborttagning – Halva ben",
                       "Laser hårborttagning – Hela ben", "Laser hårborttagning – Helkropp"],
        "faq": [("Gör laser hårborttagning ont?", "Tack vare den inbyggda kylningen upplever de flesta behandlingen som nästintill smärtfri – det känns som lätt värme eller små knäpp."),
                ("Hur många behandlingar behöver jag?", "För bästa resultat rekommenderas 6–8 behandlingar med några veckors mellanrum, eftersom lasern bara påverkar hår som växer aktivt vid behandlingstillfället."),
                ("Hur förbereder jag mig?", "Raka området dagen innan eller samma dag. Vaxa eller plocka inte de närmaste veckorna före, och undvik sol och brun utan sol på området."),
                ("Fungerar det på alla?", "808 diodlaser passar de flesta hud- och hårtyper. Mycket ljust, grått eller rött hår svarar sämre eftersom lasern söker pigment. Vid graviditet eller ljuskänslighet – kontakta oss före bokning.")],
    },
    {
        "slug": "peeling-uppsala.html",
        "short": "Peeling",
        "title": "Peeling i Uppsala – kemisk peeling, diamantpeeling, aqua peel & algpeeling | Noura Skin Secrets",
        "desc": "Peeling i Uppsala: kemisk peeling, diamantpeeling (microdermabrasion) och algpeeling för jämnare hudton, finare porer och klarare hud. Från 800 kr.",
        "h1": "Peeling <em>i Uppsala</em>",
        "lede": "Kemisk peeling, diamantpeeling och algpeeling som förnyar hudytan – för jämnare hudton, finare porer och en klarare, mjukare hud.",
        "main": "Kemisk peeling",
        "what_h2": "Vilken peeling ska jag välja?",
        "what": [
            "En kemisk peeling använder syror som löser upp döda hudceller och sätter fart på hudens förnyelse. Den passar dig som vill minska ojämnheter, pigment och förbättra hudstrukturen.",
            "Diamantpeeling (microdermabrasion) är en mekanisk peeling som slipar bort döda hudceller skonsamt, vattenpeeling (Aqua Peel) är den mildaste varianten som passar även känslig hud, och algpeeling använder mikroskopiska algspikler som aktiverar cellförnyelsen – bra för porer och akneärr. Är du osäker hjälper vi dig att välja.",
        ],
        "fits": ["Ojämn hudton och pigment", "Grov hudstruktur och stora porer", "Akneärr",
                 "Glåmig hy som behöver förnyas", "Som förberedelse inför andra behandlingar"],
        "steps": [("Hudgenomgång", "Vi väljer typ och styrka av peeling efter din hud."),
                  ("Rengöring", "Huden rengörs och förbereds noggrant."),
                  ("Peeling", "Peelingen appliceras eller utförs och får verka under kontroll."),
                  ("Lugnande & solskydd", "Vi neutraliserar, lugnar huden och avslutar med skydd.")],
        "treatments": ["Kemisk peeling", "Diamantpeeling", "Vattenpeeling – Aqua Peel", "Algpeeling", "Carbon Laser Peeling"],
        "faq": [("Fjällar huden efter en peeling?", "Efter en kemisk peeling eller algpeeling kan huden fjälla lätt några dagar – det är en del av förnyelsen. Diamantpeeling ger oftast ingen fjällning alls."),
                ("Gör det ont?", "Kemisk peeling kan svida eller stickas en kort stund. Diamantpeeling känns som en lätt slipning och är skonsam."),
                ("Vad ska jag tänka på efteråt?", "Använd hög solskyddsfaktor, undvik sol och starka produkter som syror och retinol de närmaste dagarna. Du får tydliga råd av oss."),
                ("Passar peeling känslig hud?", "Ofta ja, men styrkan måste anpassas. Berätta om du har känslig hud, rosacea eller nyligen använt receptbelagda hudprodukter.")],
    },
]


def treatment_cards(names, data, strip=""):
    cards = []
    seen_desc = set()
    for n in names:
        t = data.get(n)
        if not t:
            raise SystemExit(f"treatment not found in js/treatments.js: {n}")
        href = "boka.html?treatment=" + quote(n)
        ext = ""
        cards.append(
            f'<div class="treatment-card"><div class="row"><h3>{E(n[len(strip):] if strip and n.startswith(strip) else n)}</h3><span class="duration">{E(t["duration"])}</span></div>'
            + ("" if t["desc"] in seen_desc else f'<p class="desc">{E(t["desc"])}</p>') +
            f'<div class="footer-row"><span class="t-price">{E(t["price"])}</span>'
            f'<a class="book-link" href="{href}"{ext}>Boka</a></div></div>')
        seen_desc.add(t["desc"])
    return "\n        ".join(cards)


def price_num(p):
    m = re.search(r"\d[\d ]*", p or "")
    return int(m.group(0).replace(" ", "")) if m else None


def schema(page, data):
    url = f"{B.SITE}/{page['slug']}"
    prices = [price_num(data[n]["price"]) for n in page["treatments"]]
    prices = [p for p in prices if p]
    plain_h1 = re.sub(r"<[^>]+>", "", page["h1"])
    return [
        {"@context": "https://schema.org", "@type": "Service", "name": plain_h1, "serviceType": page["short"],
         "url": url, "areaServed": {"@type": "City", "name": "Uppsala"},
         "provider": {"@type": "BeautySalon", "name": "Noura Skin Secrets", "url": B.SITE + "/",
                      "telephone": "+46793333476",
                      "address": {"@type": "PostalAddress", "streetAddress": "Kungsängsgatan 5B",
                                  "postalCode": "753 22", "addressLocality": "Uppsala", "addressCountry": "SE"}},
         "offers": {"@type": "AggregateOffer", "priceCurrency": "SEK", "lowPrice": min(prices),
                    "highPrice": max(prices), "offerCount": len(page["treatments"])}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Hem", "item": B.SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Behandlingar", "item": B.SITE + "/behandlingar.html"},
            {"@type": "ListItem", "position": 3, "name": plain_h1, "item": url}]},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in page["faq"]]},
    ]


def related_links(current):
    return " · ".join(
        f'<a href="{p["slug"]}">{p["short"]} i Uppsala</a>' for p in PAGES if p["slug"] != current)


def render(page, data):
    lang, root, slug = "sv", "", page["slug"]
    main = data[page["main"]]
    main_href = "boka.html?treatment=" + quote(page["main"])
    doc = B.head(lang, slug, page["title"], page["desc"], root, schema(page, data))
    # only a Swedish version exists: drop the en/ar hreflang alternates
    doc = re.sub(r'\n<link rel="alternate" hreflang="(en|ar)" href="[^"]*" />', "", doc)
    hdr = B.header(lang, slug, root)
    # language switch: send EN/AR visitors to their treatment catalogue
    hdr = hdr.replace(f'href="en/{slug}"', 'href="en/behandlingar.html"').replace(f'href="ar/{slug}"', 'href="ar/behandlingar.html"')
    hdr = hdr.replace('<li><a href="behandlingar.html">', '<li><a href="behandlingar.html" class="active">')
    what = "".join(f"<p>{E(p)}</p>" for p in page["what"])
    fits = "".join(f"<li>{E(f)}</li>" for f in page["fits"])
    steps = "".join(f'<li><strong>{E(a)}</strong><span>{E(b)}</span></li>' for a, b in page["steps"])
    faq = "".join(f'<div class="faq-block reveal"><h3>{E(q)}</h3><p>{E(a)}</p></div>' for q, a in page["faq"])
    body = f"""
<main id="main">
<section class="page-hero tp-hero">
  <div class="container">
    <nav class="tp-crumbs" aria-label="Brödsmulor"><a href="index.html">Hem</a> › <a href="behandlingar.html">Behandlingar</a> › <span>{E(page['short'])}</span></nav>
    <span class="eyebrow">Behandling i Uppsala · Endast för kvinnor</span>
    <h1>{page['h1']}</h1>
    <p class="lede">{E(page['lede'])}</p>
    <div class="hero-actions">
      <a href="{main_href}" class="btn btn-gold">Boka {E(page['short'])}<span class="btn-ic">{B.IC['arrow']}</span></a>
      <a href="#priser" class="btn btn-outline">Se priser</a>
    </div>
    <p class="tp-proof"><a href="{B.BOKADIREKT}" target="_blank" rel="noopener">★ 4,9 av 5 på Bokadirekt · Kundernas Bästa val 2026</a></p>
  </div>
</section>

<section class="section section--tight">
  <div class="container tp-split">
    <div class="reveal">
      <h2>{E(page['what_h2'])}</h2>
      {what}
    </div>
    <div class="tp-box reveal" data-d="1">
      <h3>Passar dig som har</h3>
      <ul class="tp-list">{fits}</ul>
    </div>
  </div>
</section>

<section class="section section--tone" id="priser">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">Priser</span>
      <h2>{E(page['short'])} i Uppsala – priser & behandlingar</h2>
    </div>
    <div class="treatment-grid">
        {treatment_cards(page['treatments'], data, page.get('strip', ''))}
    </div>
    {('<p class="tp-note center">' + page['note_html'] + '</p>') if page.get('note_html') else ''}
    <p class="tp-note center">Osäker på vad som passar dig? Boka en <a href="{CONSULT}">hudvårdskonsultation</a> – eller se <a href="behandlingar.html">alla behandlingar</a>.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">Steg för steg</span>
      <h2>Så går behandlingen till</h2>
    </div>
    <ol class="tp-steps reveal">{steps}</ol>
  </div>
</section>

<section class="section section--tone" id="faq">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">Bra att veta</span>
      <h2>Vanliga frågor om {E(page['short'] if page['short'] in ('HIFU', 'Hydro facial') else page['short'].lower())}</h2>
    </div>
    <div class="faq-cols">{faq}</div>
  </div>
</section>

<section class="section">
  <div class="container center tp-cta reveal">
    <h2>Boka {E(page['short'])} i Uppsala</h2>
    <p class="lede">Kungsängsgatan 5B, Uppsala · Öppet mån–fre 16–20, lör–sön 13–19, efter bokning.</p>
    <div class="hero-actions" style="justify-content:center">
      <a href="{main_href}" class="btn btn-gold">Boka tid<span class="btn-ic">{B.IC['arrow']}</span></a>
      <a href="behandlingar.html" class="btn btn-outline">Alla behandlingar</a>
    </div>
    <p class="tp-related">Andra populära behandlingar: {related_links(slug)}</p>
  </div>
</section>
</main>
"""
    return doc + "\n" + hdr + body + B.footer(lang, root) + B.scripts(root)


def main():
    data = load_treatments()
    for page in PAGES:
        (ROOT / page["slug"]).write_text(render(page, data), encoding="utf-8")
        print("wrote", page["slug"])


if __name__ == "__main__":
    main()
