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
  return json_({ ok: true });
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
