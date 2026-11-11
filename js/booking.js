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

  /* förval via ?treatment= eller ?paket= */
  var params = new URLSearchParams(location.search);
  var pre = params.get("treatment");
  if (pre) {
    var match = Array.prototype.find.call(select.options, function (o) { return o.value.indexOf(pre) === 0; });
    if (match) match.selected = true;
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
  function fillTimes() {
    if (!timeEl) return;
    var prev = timeEl.value;
    timeEl.innerHTML = "";
    var v = dateEl && dateEl.value;
    if (!v) { timeEl.innerHTML = '<option value="">' + t("pickDate") + "</option>"; timeEl.disabled = true; return; }
    var d = new Date(v + "T12:00:00");
    var hours = OPENING_HOURS[d.getDay()];
    var dur = parseInt(durationFor(select.value), 10) || 60;
    var start = toMin(hours[0]), last = toMin(hours[1]) - dur;
    var now = new Date(), isToday = v === dateEl.min;
    var nowMin = now.getHours() * 60 + now.getMinutes() + 60;   // minst en timme fram
    var html = '<option value="">' + t("pickTime") + "</option>", n = 0;
    for (var m = start; m <= last; m += SLOT_MIN) {
      if (isToday && m < nowMin) continue;
      html += '<option value="' + toHHMM(m) + '">' + toHHMM(m) + "</option>"; n++;
    }
    if (!n) html = '<option value="">' + t("noSlots") + "</option>";
    timeEl.innerHTML = html;
    timeEl.disabled = !n;
    if (prev && timeEl.querySelector('option[value="' + prev + '"]')) timeEl.value = prev;
  }
  if (dateEl) dateEl.addEventListener("change", fillTimes);
  select.addEventListener("change", fillTimes);

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
