#!/usr/bin/env node
// Creates one fixed-price Stripe Payment Link per treatment in js/treatments.js
// and writes the mapping to js/stripe-links.js, so the booking page opens a
// checkout with the right amount already filled in (card, Klarna, …).
//
//   STRIPE_API_KEY=sk_... node scripts/stripe-sync-links.js
//
// Safe to re-run: links are matched by metadata.nss_key. Unchanged prices reuse
// the existing link; a changed price gets a new link and the old one is
// deactivated; treatments that no longer exist get their link deactivated.
// "Från …" prices (variable amount) are skipped and keep the generic link.
const fs = require("fs");
const path = require("path");

const KEY = process.env.STRIPE_API_KEY;
if (!KEY) { console.error("STRIPE_API_KEY is missing"); process.exit(1); }
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "js/treatments.js"), "utf8");
const CATS = new Function(src + "\nreturn TREATMENT_CATEGORIES;")();

const AUTH = "Basic " + Buffer.from(KEY + ":").toString("base64");
async function stripe(method, url, params) {
  const body = params ? new URLSearchParams(params).toString() : undefined;
  const res = await fetch("https://api.stripe.com/v1/" + url, {
    method, body,
    headers: { Authorization: AUTH, "Content-Type": "application/x-www-form-urlencoded" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${url}: ${json.error ? json.error.message : res.status}`);
  return json;
}

const slug = (s) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const ore = (price) => {
  if (/^\s*fr[åa]n/i.test(price)) return null;           // variable price
  const m = String(price).match(/^\s*(\d[\d\s]*)\s*kr/i);
  return m ? parseInt(m[1].replace(/\s/g, ""), 10) * 100 : null;
};

(async () => {
  // existing links created by this script
  const existing = {};
  let after = null;
  for (;;) {
    const page = await stripe("GET", "payment_links?limit=100&active=true" + (after ? "&starting_after=" + after : ""));
    for (const l of page.data) if (l.metadata && l.metadata.nss_key) existing[l.metadata.nss_key] = l;
    if (!page.has_more) break;
    after = page.data[page.data.length - 1].id;
  }

  const out = {};
  const keep = new Set();
  let created = 0, reused = 0, skipped = 0;
  for (const cat of CATS) for (const t of cat.treatments) {
    const amount = ore(t.price);
    if (!amount) { skipped++; continue; }
    const key = slug(t.name);
    keep.add(key);
    const old = existing[key];
    if (old && old.metadata.nss_amount === String(amount)) {
      if (!old.allow_promotion_codes) await stripe("POST", "payment_links/" + old.id, { allow_promotion_codes: "true" });
      out[t.name] = old.url; reused++; continue;
    }
    if (old) await stripe("POST", "payment_links/" + old.id, { active: "false" });
    const product = await stripe("POST", "products", { name: t.name, "metadata[nss_key]": key });
    const price = await stripe("POST", "prices", { product: product.id, currency: "sek", unit_amount: String(amount) });
    const link = await stripe("POST", "payment_links", {
      "line_items[0][price]": price.id, "line_items[0][quantity]": "1",
      submit_type: "book",
      allow_promotion_codes: "true",
      "metadata[nss_key]": key, "metadata[nss_amount]": String(amount),
    });
    out[t.name] = link.url; created++;
    console.log("created", t.name, amount / 100, "kr");
  }

  let deactivated = 0;
  for (const [key, l] of Object.entries(existing)) {
    if (!keep.has(key)) { await stripe("POST", "payment_links/" + l.id, { active: "false" }); deactivated++; }
  }

  const promoFile = path.join(root, "scripts/stripe-promo.json");
  const promos = fs.existsSync(promoFile) ? (JSON.parse(fs.readFileSync(promoFile, "utf8")).codes || []) : [];
  for (const p of promos) {
    const until = Math.floor(Date.parse(p.until) / 1000);
    if (!until || until * 1000 < Date.now()) { console.log("promo", p.code, "expired – skipped"); continue; }
    const found = await stripe("GET", "promotion_codes?active=true&code=" + encodeURIComponent(p.code));
    if (found.data.length) { console.log("promo", p.code, "already active"); continue; }
    const coupon = await stripe("POST", "coupons", {
      percent_off: String(p.percent_off), duration: "once", redeem_by: String(until), name: p.name || p.code,
    });
    // newer Stripe API versions nest the coupon under "promotion"; older ones take "coupon" directly
    try {
      await stripe("POST", "promotion_codes", {
        "promotion[type]": "coupon", "promotion[coupon]": coupon.id, code: p.code, expires_at: String(until),
      });
    } catch (e) {
      if (!/unknown parameter: promotion/i.test(e.message)) throw e;
      await stripe("POST", "promotion_codes", { coupon: coupon.id, code: p.code, expires_at: String(until) });
    }
    console.log("promo", p.code, "created:", p.percent_off + "% until", p.until);
  }

  const js = "/* Noura Skin Secrets — Stripe-betallänkar per behandling (fast pris, kort/Klarna).\n" +
    "   GENERERAS av scripts/stripe-sync-links.js — redigera inte för hand. */\n" +
    "const STRIPE_LINKS = " + JSON.stringify(out, null, 1) + ";\n";
  fs.writeFileSync(path.join(root, "js/stripe-links.js"), js);
  console.log(`links: ${created} created, ${reused} reused, ${deactivated} deactivated, ${skipped} variable-price skipped`);
})().catch((e) => { console.error(e.message); process.exit(1); });
