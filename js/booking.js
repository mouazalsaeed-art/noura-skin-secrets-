/* Noura Skin Secrets — bokningsformulär: behandlingslista, förval via URL,
   klientvalidering, Formspree-sändning med mailto-reserv. Flerspråkig. */
(function () {
  "use strict";
  var L = (document.documentElement.lang || "sv").slice(0, 2);
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvdrrby";

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
        confirmBox.innerHTML = t("sent");
        confirmBox.classList.add("show");
        form.reset();
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
