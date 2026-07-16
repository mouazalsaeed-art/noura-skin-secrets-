/* ============================================================
   Noura Skin Secrets — Livechatt & WhatsApp
   ------------------------------------------------------------
   إعدادات (عدّل هنا فقط):

   1) WHATSAPP : رقم الواتساب بصيغة دولية بدون + أو مسافات.
   2) TAWK_ID  : بعد إنشاء حساب مجاني على https://tawk.to
                 خذ الكود من Administration → Chat Widget،
                 وستجد رابطاً مثل:
                 https://embed.tawk.to/68xxxxxxxxxx/1abcdefgh
                 انسخ الجزء بعد embed.tawk.to/ هنا (مثال:
                 "68xxxxxxxxxx/1abcdefgh").
                 اتركه فارغاً "" لإخفاء خيار الدردشة المباشرة
                 وإبقاء واتساب فقط.
   ============================================================ */
var LIVECHAT = {
  WHATSAPP: "46793333476",
  TAWK_ID: ""   // ← ألصق هنا معرف Tawk.to عندما تجهزه
};

(function () {
  "use strict";
  var lang = (document.documentElement.lang || "sv").slice(0, 2);
  var rtl = document.documentElement.dir === "rtl";

  var TXT = {
    sv: {
      launcher: "Kontakt",
      title: "Hur vill du nå oss?",
      wa: "WhatsApp",
      wa_sub: "Skriv till oss direkt",
      live: "Livechatt",
      live_sub: "Chatta med Noura",
      wa_msg: "Hej! Jag har en fråga om era behandlingar."
    },
    en: {
      launcher: "Contact",
      title: "How would you like to reach us?",
      wa: "WhatsApp",
      wa_sub: "Message us directly",
      live: "Live chat",
      live_sub: "Chat with Noura",
      wa_msg: "Hi! I have a question about your treatments."
    },
    ar: {
      launcher: "تواصلي معنا",
      title: "كيف تحبين التواصل معنا؟",
      wa: "واتساب",
      wa_sub: "راسلينا مباشرة",
      live: "دردشة مباشرة",
      live_sub: "تحدثي مع نورا",
      wa_msg: "مرحباً! عندي سؤال عن علاجاتكم."
    }
  };
  var t = TXT[lang] || TXT.sv;

  /* ---------- CSS ---------- */
  var side = rtl ? "right" : "left";
  var css =
    ".lc-root{position:fixed;bottom:86px;" + side + ":16px;z-index:1200;font-family:'Jost',sans-serif}" +
    ".lc-btn{display:flex;align-items:center;gap:8px;border:none;cursor:pointer;background:#25D366;color:#fff;" +
    "border-radius:999px;padding:11px 18px 11px 14px;font-size:.92rem;font-weight:500;letter-spacing:.02em;" +
    "box-shadow:0 6px 22px rgba(0,0,0,.18);transition:transform .18s ease,box-shadow .18s ease}" +
    ".lc-btn:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(0,0,0,.22)}" +
    ".lc-btn svg{flex:0 0 auto}" +
    ".lc-menu{position:absolute;bottom:56px;" + side + ":0;min-width:230px;background:#fff;border-radius:14px;" +
    "box-shadow:0 14px 40px rgba(0,0,0,.16);padding:10px;display:none;flex-direction:column;gap:6px}" +
    ".lc-menu.open{display:flex}" +
    ".lc-menu h5{margin:4px 8px 6px;font-size:.8rem;font-weight:500;color:#8a7a6a;letter-spacing:.04em}" +
    ".lc-opt{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;border:none;width:100%;" +
    "background:transparent;cursor:pointer;text-align:" + (rtl ? "right" : "left") + ";text-decoration:none;color:#2b2118}" +
    ".lc-opt:hover{background:#f6f1ea}" +
    ".lc-ic{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:0 0 auto;color:#fff}" +
    ".lc-ic.wa{background:#25D366}.lc-ic.tk{background:#B98A44}" +
    ".lc-opt strong{display:block;font-size:.92rem;font-weight:500}" +
    ".lc-opt span{display:block;font-size:.78rem;color:#8a7a6a}" +
    "@media (max-width:640px){.lc-root{bottom:78px}.lc-btn span.lbl{display:none}.lc-btn{padding:12px}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- ikoner ---------- */
  var IC_WA = '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.6-1.3.1-.2 0-.4 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.5 3.6 1 2.1 2.7 3.8 4.8 4.8 1.5.7 2.7.4 3.6-.5.2-.2.3-.5.3-.7 0-.3-.1-.5-.3-.6z"/></svg>';
  var IC_CHAT = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.7 8.7 0 0 1-3.5-.8L3 20l1-5.2a8.4 8.4 0 1 1 17-3.3z"/></svg>';

  /* ---------- markup ---------- */
  var root = document.createElement("div");
  root.className = "lc-root";
  var waHref = "https://wa.me/" + LIVECHAT.WHATSAPP + "?text=" + encodeURIComponent(t.wa_msg);

  var menuItems =
    '<a class="lc-opt" href="' + waHref + '" target="_blank" rel="noopener">' +
    '<span class="lc-ic wa">' + IC_WA + "</span>" +
    "<span><strong>" + t.wa + "</strong><span>" + t.wa_sub + "</span></span></a>";
  if (LIVECHAT.TAWK_ID) {
    menuItems +=
      '<button class="lc-opt" id="lc-tawk" type="button">' +
      '<span class="lc-ic tk">' + IC_CHAT + "</span>" +
      "<span><strong>" + t.live + "</strong><span>" + t.live_sub + "</span></span></button>";
  }
  root.innerHTML =
    '<div class="lc-menu" id="lc-menu" role="menu"><h5>' + t.title + "</h5>" + menuItems + "</div>" +
    '<button class="lc-btn" id="lc-launch" type="button" aria-haspopup="true" aria-expanded="false">' +
    IC_WA + '<span class="lbl">' + t.launcher + "</span></button>";
  document.body.appendChild(root);

  var launch = document.getElementById("lc-launch");
  var menu = document.getElementById("lc-menu");
  launch.addEventListener("click", function () {
    /* واتساب فقط؟ افتحه مباشرة بدون قائمة */
    if (!LIVECHAT.TAWK_ID) { window.open(waHref, "_blank", "noopener"); return; }
    var open = menu.classList.toggle("open");
    launch.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", function (e) {
    if (!root.contains(e.target)) { menu.classList.remove("open"); launch.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- Tawk.to: يُحمَّل فقط عند الطلب (خصوصية أفضل) ---------- */
  var tawkLoaded = false;
  function openTawk() {
    menu.classList.remove("open");
    if (tawkLoaded) { if (window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize(); return; }
    tawkLoaded = true;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.onLoad = function () {
      try { window.Tawk_API.maximize(); } catch (e) {}
    };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://embed.tawk.to/" + LIVECHAT.TAWK_ID;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }
  var tawkBtn = document.getElementById("lc-tawk");
  if (tawkBtn) tawkBtn.addEventListener("click", openTawk);
})();
