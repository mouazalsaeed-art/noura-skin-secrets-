/* Noura Skin Secrets — bokningsformulär: behandlingslista, förval via URL,
   klientvalidering, Formspree-sändning med mailto-reserv. Flerspråkig. */
(function () {
  "use strict";
  var L = (document.documentElement.lang || "sv").slice(0, 2);
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvdrrby";
  /* Google Kalender: URL till Apps Script-webbappen (scripts/google-calendar/Code.gs). Tomt = av. */
  var CALENDAR_ENDPOINT = "";
  var CALENDAR_TOKEN = "nss-287hiiIunVdWa77RnAu8zkSh";

  var UI = {
    choose: { sv: "Välj en behandling", en: "Choose a treatment", ar: "اختاري علاجاً" },
    klippkort: { sv: "Klippkort", en: "Packages", ar: "باقات الجلسات" },
    wantPaket: { sv: "Jag vill köpa detta klippkort: ", en: "I would like to buy this package: ", ar: "أرغب بشراء هذه الباقة: " },
    sending: { sv: "Skickar…", en: "Sending…", ar: "جارٍ الإرسال…" },
    sent: {
      sv: "Tack! Din bokningsförfrågan har skickats. Vi kontaktar dig via e-post eller telefon inom 24 timmar för att bekräfta din tid.",
      en: "Thank you! Your booking request has been sent. We will contact you by email or phone within 24 hours to confirm your appointment.",
      ar: "شكراً لك! تم إرسال طلب الحجز. سنتواصل معك عبر الإيميل أو الهاتف خلال 24 ساعة لتأكيد موعدك.",
    },
    failed: {
      sv: 'Något gick fel med den automatiska sändningen. Din e-postklient öppnas istället — skicka det förifyllda meddelandet, eller maila oss direkt på <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>.',
      en: 'The automatic sending failed. Your email app will open instead — please send the pre-filled message, or email us directly at <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>.',
      ar: 'حدث خطأ في الإرسال التلقائي. سيُفتح تطبيق البريد لديك بدلاً من ذلك — أرسلي الرسالة المعبأة مسبقاً، أو راسلينا مباشرة على <a href="mailto:info@nouraskinsecrets.se">info@nouraskinsecrets.se</a>.',
    },
    submit: { sv: "Skicka bokningsförfrågan", en: "Send booking request", ar: "أرسلي طلب الحجز" },
    reqName: { sv: "Fyll i ditt namn.", en: "Please enter your name.", ar: "يرجى إدخال اسمك." },
    reqEmail: { sv: "Fyll i en giltig e-postadress.", en: "Please enter a valid email.", ar: "يرجى إدخال بريد إلكتروني صحيح." },
    reqPhone: { sv: "Fyll i ditt telefonnummer.", en: "Please enter your phone number.", ar: "يرجى إدخال رقم هاتفك." },
    reqTreatment: { sv: "Välj en behandling.", en: "Please choose a treatment.", ar: "يرجى اختيار علاج." },
    reqDate: { sv: "Välj ett datum.", en: "Please choose a date.", ar: "يرجى اختيار تاريخ." },
    noPref: { sv: "Ingen preferens", en: "No preference", ar: "بدون تفضيل" },
  };
  function t(k) { return UI[k][L] || UI[k].sv; }
  function pick(o, base) { return (L === "en" && o[base + "En"]) || (L === "ar" && o[base + "Ar"]) || o[base] || ""; }

  var form = document.getElementById("booking-form");
  var select = document.getElementById("treatment");
  if (!form || !select) return;

  /* fyll behandlingslistan (värdet alltid svenskt namn + pris = det Nour läser i mailet) */
  select.innerHTML = '<option value="" disabled selected>' + t("choose") + "</option>";
  if (typeof TREATMENT_CATEGORIES !== "undefined") {
    TREATMENT_CATEGORIES.forEach(function (cat) {
      var group = document.createElement("optgroup");
      group.label = pick(cat, "name");
      cat.treatments.forEach(function (tr) {
        var opt = document.createElement("option");
        opt.value = tr.name + " (" + tr.price + ")";
        opt.textContent = pick(tr, "name") + " — " + (typeof tPrice === "function" ? tPrice(tr) : tr.price);
        group.appendChild(opt);
      });
      select.appendChild(group);
    });
  }

  /* erbjudanden (js/offers.js) överst i listan */
  UI.offersGroup = { sv: "Erbjudanden", en: "Offers", ar: "العروض" };
  var liveOffers = typeof OFFERS !== "undefined" ? OFFERS.filter(function (o) {
    return o.active && (!o.until || Date.now() <= Date.parse(o.until));
  }) : [];
  if (liveOffers.length) {
    var og = document.createElement("optgroup");
    og.label = t("offersGroup");
    liveOffers.forEach(function (o) {
      var op = document.createElement("option");
      op.value = "Erbjudande: " + o.title + " (" + o.price + ")";
      op.textContent = pick(o, "title") + " — " + o.price + (o.oldPrice ? " (" + o.oldPrice + ")" : "");
      og.appendChild(op);
    });
    select.insertBefore(og, select.children[1] || null);
  }

  /* förval via ?treatment=, ?erbjudande= eller ?paket= */
  var params = new URLSearchParams(location.search);
  var pre = params.get("treatment");
  if (pre) {
    var match = Array.prototype.find.call(select.options, function (o) { return o.value.indexOf(pre + " (") === 0; }) ||
                Array.prototype.find.call(select.options, function (o) { return o.value.indexOf(pre) === 0; });
    if (match) match.selected = true;
  }
  var erbj = params.get("erbjudande");
  if (erbj) {
    var om = Array.prototype.find.call(select.options, function (o) { return o.value.indexOf("Erbjudande: " + erbj + " (") === 0; });
    if (om) om.selected = true;
  }
  var paket = params.get("paket");
  if (paket) {
    var g2 = document.createElement("optgroup");
    g2.label = t("klippkort");
    var opt2 = document.createElement("option");
    opt2.value = "Klippkort: " + paket;
    opt2.textContent = "Klippkort: " + paket;
    opt2.selected = true;
    g2.appendChild(opt2);
    select.insertBefore(g2, select.children[1] || null);
    var msg = document.getElementById("message");
    if (msg && !msg.value) msg.value = t("wantPaket") + paket + ".";
  }

  /* ---------- öppettider: tidsval per dag ----------
     Ändra här om öppettiderna ändras. 0 = söndag … 6 = lördag. */
  var OPENING_HOURS = {
    0: ["13:00", "19:00"], 6: ["13:00", "19:00"],                       // lör–sön
    1: ["16:00", "20:00"], 2: ["16:00", "20:00"], 3: ["16:00", "20:00"], // mån–ons
    4: ["16:00", "20:00"], 5: ["16:00", "20:00"],                       // tor–fre
  };
  var SLOT_MIN = 30;
  UI.pickDate = { sv: "Välj datum först", en: "Choose a date first", ar: "اختاري التاريخ أولاً" };
  UI.pickTime = { sv: "Välj tid", en: "Choose a time", ar: "اختاري الوقت" };
  UI.noSlots = { sv: "Inga tider kvar denna dag", en: "No times left this day", ar: "لا أوقات متاحة في هذا اليوم" };
  function toMin(hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; }
  function toHHMM(m) { return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2); }
  var dateEl = document.getElementById("date");
  var oldTime = document.getElementById("time");
  var timeEl = oldTime;
  if (oldTime && oldTime.tagName === "INPUT") {
    timeEl = document.createElement("select");
    timeEl.id = "time"; timeEl.name = "time";
    oldTime.parentNode.replaceChild(timeEl, oldTime);
  }
  if (dateEl) {
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateEl.min = today.toISOString().slice(0, 10);
  }
  /* ---------- lediga tider från Google Kalender (scripts/google-calendar/Code.gs) ---------- */
  UI.loadingTimes = { sv: "Hämtar lediga tider…", en: "Loading free times…", ar: "جارٍ تحميل الأوقات المتاحة…" };
  UI.nextFree = { sv: "Nästa lediga tid:", en: "Next free time:", ar: "أقرب وقت متاح:" };
  UI.pickThis = { sv: "Välj", en: "Choose", ar: "اختيار" };
  UI.noneSoon = { sv: "Inga lediga tider de närmaste veckorna – ring eller skriv till oss.", en: "No free times in the coming weeks – call or message us.", ar: "لا أوقات متاحة في الأسابيع القادمة – اتصلي بنا أو راسلينا." };
  var BUSY_DAYS = 21;
  var busyMap = null;                      // null = inte hämtat (än); {} = inga upptagna
  var busyLoading = false;
  function loadBusy() {
    if (!CALENDAR_ENDPOINT || busyLoading) return;
    busyLoading = true;
    fetch(CALENDAR_ENDPOINT + "?action=busy&days=" + BUSY_DAYS)
      .then(function (r) { return r.json(); })
      .then(function (j) { busyMap = (j && j.busy) || {}; })
      .catch(function () { busyMap = {}; })          // fel → visa alla tider inom öppettiderna
      .then(function () { busyLoading = false; fillTimes(); showNextFree(); });
  }
  function ymd(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function slotsFor(v) {
    var d = new Date(v + "T12:00:00");
    var hours = OPENING_HOURS[d.getDay()];
    var dur = parseInt(durationFor(select.value), 10) || 60;
    var start = toMin(hours[0]), last = toMin(hours[1]) - dur;
    var now = new Date(), isToday = v === ymd(now);
    var nowMin = now.getHours() * 60 + now.getMinutes() + 60;   // minst en timme fram
    var busy = (busyMap && busyMap[v]) || [];
    var out = [];
    for (var m = start; m <= last; m += SLOT_MIN) {
      if (isToday && m < nowMin) continue;
      var clash = busy.some(function (b) { return m < b[1] && m + dur > b[0]; });
      if (!clash) out.push(m);
    }
    return out;
  }
  function fillTimes() {
    if (!timeEl) return;
    var prev = timeEl.value;
    var v = dateEl && dateEl.value;
    if (!v) { timeEl.innerHTML = '<option value="">' + t("pickDate") + "</option>"; timeEl.disabled = true; return; }
    if (CALENDAR_ENDPOINT && busyMap === null) {
      timeEl.innerHTML = '<option value="">' + t("loadingTimes") + "</option>"; timeEl.disabled = true; loadBusy(); return;
    }
    var list = slotsFor(v);
    var html = '<option value="">' + t("pickTime") + "</option>";
    list.forEach(function (m) { html += '<option value="' + toHHMM(m) + '">' + toHHMM(m) + "</option>"; });
    if (!list.length) html = '<option value="">' + t("noSlots") + "</option>";
    timeEl.innerHTML = html;
    timeEl.disabled = !list.length;
    if (prev && timeEl.querySelector('option[value="' + prev + '"]')) timeEl.value = prev;
  }
  /* "Nästa lediga tid" under datum/tid – ett klick fyller i båda */
  var hintEl = null;
  function showNextFree() {
    if (!CALENDAR_ENDPOINT || busyMap === null || !dateEl) return;
    if (!hintEl) {
      hintEl = document.createElement("p");
      hintEl.className = "next-free";
      var row = dateEl.closest(".two-col") || dateEl.closest(".form-row");
      row.parentNode.insertBefore(hintEl, row.nextSibling);
    }
    var d = new Date();
    for (var i = 0; i < BUSY_DAYS; i++, d.setDate(d.getDate() + 1)) {
      var v = ymd(d), list = slotsFor(v);
      if (list.length) {
        var label = d.toLocaleDateString(L === "ar" ? "ar" : L === "en" ? "en-GB" : "sv-SE", { weekday: "short", day: "numeric", month: "short" });
        hintEl.innerHTML = t("nextFree") + ' <strong>' + label + " " + toHHMM(list[0]) + '</strong> <button type="button" class="next-free-btn">' + t("pickThis") + "</button>";
        var when = { v: v, m: toHHMM(list[0]) };
        hintEl.querySelector("button").onclick = function () {
          dateEl.value = when.v; fillTimes(); timeEl.value = when.m;
          timeEl.dispatchEvent(new Event("change"));
        };
        return;
      }
    }
    hintEl.textContent = t("noneSoon");
  }
  if (CALENDAR_ENDPOINT) loadBusy();
  if (dateEl) dateEl.addEventListener("change", fillTimes);
  select.addEventListener("change", function () { fillTimes(); showNextFree(); });

  /* klientvalidering */
  var checks = [
    ["name", function (v) { return v.trim().length > 1; }, "reqName"],
    ["email", function (v) { return /.+@.+\..+/.test(v); }, "reqEmail"],
    ["phone", function (v) { return v.replace(/\D/g, "").length >= 7; }, "reqPhone"],
    ["treatment", function (v) { return !!v; }, "reqTreatment"],
    ["date", function (v) { return !!v; }, "reqDate"],
  ];
  function validate() {
    var ok = true;
    checks.forEach(function (c) {
      var el = document.getElementById(c[0]);
      if (!el) return;
      var row = el.closest(".form-row");
      var valid = c[1](el.value || "");
      if (row) {
        row.classList.toggle("invalid", !valid);
        var err = row.querySelector(".field-error");
        if (err) err.textContent = valid ? "" : t(c[2]);
      }
      if (!valid) ok = false;
    });
    return ok;
  }

  function buildMailto(data) {
    var subject = "Bokningsförfrågan — " + (data.treatment || "");
    var body = [
      "Namn: " + data.name, "E-post: " + data.email, "Telefon: " + data.phone,
      "Behandling: " + data.treatment, "Önskat datum: " + data.date,
      "Önskad tid: " + (data.time || t("noPref")), "", "Meddelande:", data.message || "-",
    ].join("\n");
    return "mailto:info@nouraskinsecrets.se?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  /* behandlingens längd i minuter (första talet i t.ex. "75–90 min") */
  function durationFor(value) {
    var name = String(value || "").replace(/\s*\([^()]*\)\s*$/, "");
    if (typeof TREATMENT_CATEGORIES === "undefined") return "";
    for (var i = 0; i < TREATMENT_CATEGORIES.length; i++) {
      var list = TREATMENT_CATEGORIES[i].treatments;
      for (var j = 0; j < list.length; j++) {
        if (list[j].name === name) { var m = String(list[j].duration).match(/\d+/); return m ? m[0] : ""; }
      }
    }
    return "";
  }
  function sendToCalendar(data) {
    if (!CALENDAR_ENDPOINT) return;
    try {
      var body = new URLSearchParams();
      ["name", "email", "phone", "treatment", "date", "time", "message", "betalning", "_gotcha"].forEach(function (k) {
        if (data[k]) body.append(k, data[k]);
      });
      body.append("duration", durationFor(data.treatment));
      body.append("token", CALENDAR_TOKEN);
      fetch(CALENDAR_ENDPOINT, { method: "POST", mode: "no-cors", body: body }).catch(function () {});
    } catch (e) {}
  }

  fillTimes();

  var confirmBox = document.getElementById("confirm-box");
  var submitBtn = form.querySelector("button[type=submit]");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    submitBtn.disabled = true;
    submitBtn.textContent = t("sending");
    confirmBox.classList.remove("show", "confirm-error");

    fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
      .then(function (res) { if (!res.ok) throw new Error("formspree"); return res; })
      .then(function () {
        sendToCalendar(data);
        if (busyMap && data.date && data.time) {
          var dm = parseInt(durationFor(data.treatment), 10) || 60, sm = toMin(data.time);
          (busyMap[data.date] = busyMap[data.date] || []).push([sm, sm + dm]);
        }
        confirmBox.innerHTML = t("sent");
        confirmBox.classList.add("show");
        form.reset();
        fillTimes();
        confirmBox.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function () {
        confirmBox.innerHTML = t("failed");
        confirmBox.classList.add("show", "confirm-error");
        window.location.href = buildMailto(data);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = t("submit");
      });
  });
})();
