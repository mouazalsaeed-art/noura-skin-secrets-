/* ============================================================
   Noura Skin Secrets — فحص الأوقات المتاحة (تقويم Google)
   ------------------------------------------------------------
   الفكرة: عندك تقويم Google خاص بالصالون. كل ما تجيك زبونة
   بالمحل أو حجز هاتفي، تضيف حدثاً في التقويم من جوالك —
   والفورم على الموقع يقرأ الأوقات المشغولة تلقائياً ويمنع
   الزبونات من اختيارها.

   إعدادات (عدّل هنا فقط):
   1) CALENDAR_ID : إيميل التقويم (مثل abc123@group.calendar.google.com)
                    من إعدادات التقويم → Integrate calendar.
   2) API_KEY     : مفتاح من console.cloud.google.com
                    (فعّل Google Calendar API → Credentials → API key،
                    وقيّده بموقعك nouraskinsecrets.se).
   مهم: اجعل التقويم عاماً بخيار
   "See only free/busy (hide details)" — فلا تظهر أي تفاصيل
   للزوار، فقط مشغول/متاح.

   إذا تركت الحقلين فارغين، الفورم يشتغل مثل قبل تماماً.
   ============================================================ */
var AVAILABILITY = {
  CALENDAR_ID: "",  // ← إيميل التقويم
  API_KEY: "",      // ← مفتاح API
  OPEN: "10:00",    // ساعة الفتح
  CLOSE: "20:00",   // ساعة الإغلاق
  STEP_MIN: 30      // طول الخانة بالدقائق
};

(function () {
  "use strict";
  if (!AVAILABILITY.CALENDAR_ID || !AVAILABILITY.API_KEY) return;

  var dateInput = document.getElementById("date");
  var timeInput = document.getElementById("time");
  if (!dateInput || !timeInput) return;

  var lang = (document.documentElement.lang || "sv").slice(0, 2);
  var TXT = {
    sv: {
      loading: "Hämtar lediga tider…",
      pick: "Lediga tider den valda dagen:",
      none: "Tyvärr är denna dag fullbokad — välj gärna en annan dag.",
      err: "Kunde inte hämta kalendern just nu. Skicka din förfrågan så bekräftar vi tiden.",
      busy: "Denna tid är upptagen — välj gärna en ledig tid nedan.",
      past: "Välj ett datum framåt i tiden."
    },
    en: {
      loading: "Checking available times…",
      pick: "Available times on the selected day:",
      none: "This day is fully booked — please choose another day.",
      err: "Couldn't check the calendar right now. Send your request and we'll confirm the time.",
      busy: "This time is taken — please pick a free slot below.",
      past: "Please choose a future date."
    },
    ar: {
      loading: "جاري فحص الأوقات المتاحة…",
      pick: "الأوقات المتاحة في اليوم المختار:",
      none: "هذا اليوم محجوز بالكامل — الرجاء اختيار يوم آخر.",
      err: "تعذّر فحص التقويم حالياً. أرسلي طلبك وسنؤكد الوقت معك.",
      busy: "هذا الوقت محجوز — اختاري وقتاً متاحاً من الأسفل.",
      past: "الرجاء اختيار تاريخ قادم."
    }
  };
  var t = TXT[lang] || TXT.sv;

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".av-box{margin-top:8px;font-size:.85rem;color:#8a7a6a}" +
    ".av-note{margin:0 0 8px}" +
    ".av-note.err{color:#b0563a}" +
    ".av-slots{display:flex;flex-wrap:wrap;gap:6px}" +
    ".av-slot{border:1px solid #d9cbb8;background:#fff;border-radius:999px;padding:5px 12px;font-size:.82rem;" +
    "cursor:pointer;color:#2b2118;font-family:inherit;transition:all .15s ease}" +
    ".av-slot:hover{border-color:#B98A44}" +
    ".av-slot.sel{background:#B98A44;border-color:#B98A44;color:#fff}" +
    ".av-slot[disabled]{opacity:.35;cursor:not-allowed;text-decoration:line-through}";
  document.head.appendChild(st);

  var box = document.createElement("div");
  box.className = "av-box";
  box.setAttribute("aria-live", "polite");
  timeInput.closest(".form-row").appendChild(box);

  function hm(str) { var p = str.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }
  /* دقائق اليوم بتوقيت ستوكهولم دائماً — مهما كانت منطقة المتصفح */
  var TZ = "Europe/Stockholm";
  function stockholmMinutes(dateObj) {
    var s = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(dateObj);
    var p = s.split(":");
    return (+p[0]) * 60 + (+p[1]);
  }
  function stockholmToday() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }

  var busyRanges = [];

  function isBusy(startMin) {
    var endMin = startMin + AVAILABILITY.STEP_MIN;
    for (var i = 0; i < busyRanges.length; i++) {
      if (startMin < busyRanges[i][1] && endMin > busyRanges[i][0]) return true;
    }
    return false;
  }

  function render() {
    var open = hm(AVAILABILITY.OPEN), close = hm(AVAILABILITY.CLOSE);
    var slots = "", anyFree = false;
    var isToday = dateInput.value === stockholmToday();
    var nowMin = stockholmMinutes(new Date());
    for (var m = open; m < close; m += AVAILABILITY.STEP_MIN) {
      var dis = isBusy(m) || (isToday && m <= nowMin);
      if (!dis) anyFree = true;
      slots += '<button type="button" class="av-slot" data-t="' + fmt(m) + '"' + (dis ? " disabled" : "") + ">" + fmt(m) + "</button>";
    }
    box.innerHTML = anyFree
      ? '<p class="av-note">' + t.pick + '</p><div class="av-slots">' + slots + "</div>"
      : '<p class="av-note err">' + t.none + "</p>";
    var btns = box.querySelectorAll(".av-slot:not([disabled])");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var sel = box.querySelector(".av-slot.sel");
        if (sel) sel.classList.remove("sel");
        this.classList.add("sel");
        timeInput.value = this.getAttribute("data-t");
        timeInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
  }

  function check() {
    var d = dateInput.value;
    if (!d) { box.innerHTML = ""; return; }
    if (d < stockholmToday()) {
      box.innerHTML = '<p class="av-note err">' + t.past + "</p>"; return;
    }
    box.innerHTML = '<p class="av-note">' + t.loading + "</p>";
    /* حدود اليوم بتوقيت السويد (صيفي +02:00 / شتوي +01:00 — نغطي الحالتين بهامش) */
    var timeMin = d + "T00:00:00+02:00";
    var timeMax = d + "T23:59:59+01:00";
    fetch("https://www.googleapis.com/calendar/v3/freeBusy?key=" + encodeURIComponent(AVAILABILITY.API_KEY), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timeMin: timeMin, timeMax: timeMax,
        timeZone: "Europe/Stockholm",
        items: [{ id: AVAILABILITY.CALENDAR_ID }]
      })
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var cal = data.calendars && data.calendars[AVAILABILITY.CALENDAR_ID];
        if (!cal || cal.errors) throw new Error("calendar error");
        busyRanges = (cal.busy || []).map(function (b) {
          var s = stockholmMinutes(new Date(b.start));
          var e = stockholmMinutes(new Date(b.end));
          if (e <= s) e = 1440; /* حدث يمتد حتى منتصف الليل أو طوال اليوم */
          return [s, e];
        });
        render();
      })
      .catch(function () {
        busyRanges = [];
        box.innerHTML = '<p class="av-note">' + t.err + "</p>";
      });
  }

  dateInput.addEventListener("change", check);

  /* منع إرسال وقت محجوز يدوياً */
  timeInput.addEventListener("change", function () {
    if (!timeInput.value || !busyRanges.length) return;
    if (isBusy(hm(timeInput.value))) {
      timeInput.value = "";
      var n = box.querySelector(".av-note");
      if (n) { n.textContent = t.busy; n.className = "av-note err"; }
    }
  });
})();
