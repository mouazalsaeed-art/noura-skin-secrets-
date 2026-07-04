/* Noura Skin Secrets — online payment at booking (Swish + card)
   Works like Bokadirekt: the customer chooses to pay now (Swish or card)
   or at the salon. The choice is included in the booking email.

   ═══════════════ ACTIVATION (fill these in) ═══════════════
   SWISH_NUMBER        → your Swish Företag number, e.g. "123 456 78 90"
   STRIPE_PAYMENT_LINK → a Stripe Payment Link URL, e.g. "https://buy.stripe.com/xxxx"
                         (create one link with "Customers choose what to pay")
   Leave a value empty ("") to hide that payment method.
   ══════════════════════════════════════════════════════════ */

(function () {
  const SWISH_NUMBER = "";
  const STRIPE_PAYMENT_LINK = "";

  const swishOn = /\d/.test(SWISH_NUMBER);
  const stripeOn = STRIPE_PAYMENT_LINK.indexOf("https://") === 0;
  if (!swishOn && !stripeOn) return; // nothing configured yet — section stays hidden

  const form = document.getElementById("booking-form");
  const treatmentSelect = document.getElementById("treatment");
  if (!form || !treatmentSelect) return;

  /* ---------- i18n ---------- */
  const lang = () => localStorage.getItem("nss-lang") || "sv";
  const T = {
    title: { sv: "Betalning", en: "Payment", ar: "الدفع" },
    paySalon: { sv: "💵 Betala i salongen", en: "💵 Pay at the salon", ar: "💵 الدفع في الصالون" },
    paySwish: { sv: "📱 Betala nu med Swish", en: "📱 Pay now with Swish", ar: "📱 الدفع الآن عبر Swish" },
    payCard: { sv: "💳 Betala nu med kort", en: "💳 Pay now by card", ar: "💳 الدفع الآن بالبطاقة" },
    amount: { sv: "Belopp (kr)", en: "Amount (kr)", ar: "المبلغ (كرون)" },
    swishTo: { sv: "Swisha till", en: "Swish to", ar: "أرسلي عبر Swish إلى" },
    swishMsg: {
      sv: "Skriv ditt namn som meddelande i Swish, betala, och skicka sedan formuläret. 💕",
      en: "Write your name as the Swish message, pay, then send the form. 💕",
      ar: "اكتبي اسمك في رسالة Swish، ادفعي، ثم أرسلي النموذج. 💕",
    },
    qrHint: { sv: "Eller skanna QR-koden med Swish-appen:", en: "Or scan the QR code with the Swish app:", ar: "أو امسحي رمز QR بتطبيق Swish:" },
    copy: { sv: "Kopiera", en: "Copy", ar: "نسخ" },
    copied: { sv: "Kopierat ✓", en: "Copied ✓", ar: "تم النسخ ✓" },
    cardBtn: { sv: "Öppna säker kortbetalning →", en: "Open secure card payment →", ar: "فتح صفحة الدفع الآمن →" },
    cardMsg: {
      sv: "Ange beloppet och ditt namn på betalsidan (öppnas i ny flik), betala, och skicka sedan formuläret. 💕",
      en: "Enter the amount and your name on the payment page (opens in a new tab), pay, then send the form. 💕",
      ar: "أدخلي المبلغ واسمك في صفحة الدفع (تفتح في تبويب جديد)، ادفعي، ثم أرسلي النموذج. 💕",
    },
    salonMsg: {
      sv: "Du betalar smidigt på plats — kort eller Swish går bra.",
      en: "You pay at the salon — card or Swish both work.",
      ar: "تدفعين في الصالون بكل سهولة — بطاقة أو Swish.",
    },
  };
  const tr = (o) => o[lang()] || o.sv;

  /* ---------- payment section markup ---------- */
  const section = document.createElement("div");
  section.className = "form-row pay-section";
  const noteEl = form.querySelector(".form-note");
  form.insertBefore(section, noteEl);

  const methods = [["salon", "paySalon", "Betalar i salongen"]];
  if (swishOn) methods.push(["swish", "paySwish", "Swish (betalar online)"]);
  if (stripeOn) methods.push(["kort", "payCard", "Kort via Stripe (betalar online)"]);

  let chosen = "salon";

  function treatmentPrice() {
    const v = treatmentSelect.value || "";
    const m = v.match(/(\d[\d ]*)\s*kr/i);
    return m ? m[1].replace(/\s/g, "") : "";
  }

  function swishDigits() {
    return SWISH_NUMBER.replace(/\D/g, "");
  }

  function render() {
    const amount = treatmentPrice();
    let html = `<label class="pay-title">${tr(T.title)}</label><div class="pay-options">`;
    methods.forEach(([val, key, emailValue]) => {
      html += `<label class="pay-opt${chosen === val ? " pay-opt--on" : ""}">
        <input type="radio" name="betalning" value="${emailValue}" data-val="${val}" ${chosen === val ? "checked" : ""} />
        <span>${tr(T[key])}</span></label>`;
    });
    html += `</div><div class="pay-panel">`;

    if (chosen === "salon") {
      html += `<p class="pay-note">${tr(T.salonMsg)}</p>`;
    }

    if (chosen === "swish") {
      html += `<p class="pay-note">${tr(T.swishMsg)}</p>
        <div class="pay-line"><strong>${tr(T.swishTo)}:</strong>
          <span class="pay-number">${SWISH_NUMBER}</span>
          <button type="button" class="pay-copy">${tr(T.copy)}</button></div>
        <div class="pay-line"><strong>${tr(T.amount)}:</strong>
          <input type="number" class="pay-amount" value="${amount}" min="1" step="1" style="width:110px;" /></div>
        <p class="pay-note">${tr(T.qrHint)}</p>
        <div class="pay-qr"></div>`;
    }

    if (chosen === "kort") {
      html += `<p class="pay-note">${tr(T.cardMsg)}</p>
        <div class="pay-line"><strong>${tr(T.amount)}:</strong> <span>${amount ? amount + " kr" : "—"}</span></div>
        <a class="btn btn-primary" style="margin-top:8px;display:inline-block;" href="${STRIPE_PAYMENT_LINK}" target="_blank" rel="noopener">${tr(T.cardBtn)}</a>`;
    }

    html += `</div>`;
    section.innerHTML = html;

    section.querySelectorAll("input[type=radio]").forEach((r) => {
      r.addEventListener("change", () => {
        chosen = r.dataset.val;
        render();
      });
    });

    const copyBtn = section.querySelector(".pay-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard && navigator.clipboard.writeText(swishDigits());
        copyBtn.textContent = tr(T.copied);
        setTimeout(() => (copyBtn.textContent = tr(T.copy)), 2000);
      });
    }

    const amountInput = section.querySelector(".pay-amount");
    if (amountInput) {
      drawQr(amountInput.value);
      amountInput.addEventListener("input", () => drawQr(amountInput.value));
    }
  }

  function drawQr(amount) {
    const box = section.querySelector(".pay-qr");
    if (!box || typeof qrcode !== "function") return;
    try {
      // Official Swish QR format: C<number>;<amount>;<message>;<lock flags>
      const data = `C${swishDigits()};${amount || ""};Bokning;0`;
      const qr = qrcode(0, "M");
      qr.addData(data);
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2 });
    } catch (e) {
      box.innerHTML = "";
    }
  }

  treatmentSelect.addEventListener("change", render);
  window.addEventListener("nss-lang-change", render);
  render();
})();
