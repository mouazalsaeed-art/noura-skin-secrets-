/**
 * Noura Skin Secrets — bokningsförfrågningar från webbplatsen → Google Kalender.
 *
 * Installeras som Google Apps Script "Web app" på salongens Google-konto:
 *   Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
 * Webbplatsen (js/booking.js) skickar varje förfrågan hit och här skapas en gul
 * händelse "Förfrågan: …" i kalendern. Bekräfta tiden med kunden och byt färg/titel.
 */
const TOKEN = 'nss-287hiiIunVdWa77RnAu8zkSh';   // samma som CALENDAR_TOKEN i js/booking.js
const TZ = 'Europe/Stockholm';
const MAX_PER_HOUR = 30;                         // skydd mot spam

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.token !== TOKEN || p._gotcha) return json_({ ok: false });
  if (!p.name || !/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) return json_({ ok: false, reason: 'missing' });

  const cache = CacheService.getScriptCache();
  const count = Number(cache.get('count') || 0);
  if (count >= MAX_PER_HOUR) return json_({ ok: false, reason: 'rate' });
  cache.put('count', String(count + 1), 3600);

  const hasTime = /^\d{2}:\d{2}$/.test(p.time || '');
  const minutes = Math.min(Math.max(parseInt(p.duration, 10) || 60, 15), 240);
  const start = Utilities.parseDate(p.date + ' ' + (hasTime ? p.time : '10:00'), TZ, 'yyyy-MM-dd HH:mm');
  const end = new Date(start.getTime() + minutes * 60000);

  const title = 'Förfrågan: ' + p.name + ' – ' + (p.treatment || 'behandling') + (hasTime ? '' : ' (ingen tid angiven)');
  const description = [
    'Bokningsförfrågan från nouraskinsecrets.se — bekräfta tiden med kunden.',
    '',
    'Namn: ' + p.name,
    'Telefon: ' + (p.phone || '—'),
    'E-post: ' + (p.email || '—'),
    'Behandling: ' + (p.treatment || '—'),
    'Betalning: ' + (p.betalning || '—'),
    'Önskad tid: ' + p.date + ' ' + (hasTime ? p.time : '(ej angiven)'),
    '',
    'Meddelande:',
    p.message || '—',
  ].join('\n');

  const event = CalendarApp.getDefaultCalendar().createEvent(title, start, end, { description: description });
  event.setColor(CalendarApp.EventColor.YELLOW);
  event.addPopupReminder(60);
  cache.removeAll(['busy-21', 'busy-14', 'busy-30']);   // nya förfrågan syns direkt som upptagen
  return json_({ ok: true });
}

/**
 * Upptagna tider → webbplatsens bokningsformulär visar bara lediga tider.
 * GET ?action=busy&days=21  →  { ok, busy: { "2026-11-12": [[960, 1020], …] } }
 * Minuter från midnatt (svensk tid). Bara tider skickas – inga namn eller detaljer.
 * Alla händelser i kalendern räknas som upptagna (även gula förfrågningar).
 * Heldagshändelse (t.ex. "Stängt" eller semester) = hela dagen upptagen.
 */
const EXTRA_CALENDARS = [];   // t.ex. ['Bokadirekt'] om du prenumererar på Bokadirekts kalender i Google

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== 'busy') return json_({ ok: true });
  const days = Math.min(Math.max(parseInt(p.days, 10) || 21, 1), 60);
  const cache = CacheService.getScriptCache();
  const key = 'busy-' + days;
  const hit = cache.get(key);
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);

  const today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  const start = Utilities.parseDate(today + ' 00:00', TZ, 'yyyy-MM-dd HH:mm');
  const end = new Date(start.getTime() + days * 86400000);

  const cals = [CalendarApp.getDefaultCalendar()];
  EXTRA_CALENDARS.forEach(function (name) {
    CalendarApp.getCalendarsByName(name).forEach(function (c) { cals.push(c); });
  });

  const busy = {};
  function add(day, a, b) { (busy[day] = busy[day] || []).push([a, b]); }
  cals.forEach(function (cal) {
    cal.getEvents(start, end).forEach(function (ev) {
      let s = ev.getStartTime(), t = ev.getEndTime();
      if (ev.isAllDayEvent()) {
        for (let d = new Date(s.getTime()); d < t; d = new Date(d.getTime() + 86400000)) {
          add(Utilities.formatDate(d, TZ, 'yyyy-MM-dd'), 0, 1440);
        }
        return;
      }
      if (s < start) s = start;
      // dela upp över midnatt
      while (s < t) {
        const day = Utilities.formatDate(s, TZ, 'yyyy-MM-dd');
        const dayEnd = Utilities.parseDate(day + ' 23:59', TZ, 'yyyy-MM-dd HH:mm');
        const e2 = t < dayEnd ? t : new Date(dayEnd.getTime() + 60000);
        const a = Number(Utilities.formatDate(s, TZ, 'H')) * 60 + Number(Utilities.formatDate(s, TZ, 'm'));
        const b = e2.getTime() >= dayEnd.getTime() ? 1440
          : Number(Utilities.formatDate(e2, TZ, 'H')) * 60 + Number(Utilities.formatDate(e2, TZ, 'm'));
        add(day, a, b);
        s = e2;
      }
    });
  });
  const out = JSON.stringify({ ok: true, busy: busy });
  cache.put(key, out, 60);   // 1 minut
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Kör denna en gång i editorn för att ge skriptet tillgång till kalendern och testa. */
function test() {
  doPost({ parameter: {
    token: TOKEN, name: 'Test Testsson', phone: '070-000 00 00', email: 'test@example.com',
    treatment: 'Klassisk ansiktsrengöring (1 195 kr)', duration: '45', betalning: 'Betalar i salongen',
    date: Utilities.formatDate(new Date(Date.now() + 86400000), TZ, 'yyyy-MM-dd'), time: '12:00', message: 'Testbokning – ta bort.',
  } });
}
