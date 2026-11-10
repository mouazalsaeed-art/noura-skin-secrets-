#!/usr/bin/env node
// Regenerates worker/src/catalog.js (the treatment list the AI skin analysis may
// recommend from) out of js/treatments.js, so the AI and the website never drift.
//   node scripts/build-worker-catalog.js
// Then redeploy the worker (GitHub → Actions → "Deploy AI Analysis Worker").
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "js/treatments.js"), "utf8");
const TREATMENT_CATEGORIES = new Function(src + "\nreturn TREATMENT_CATEGORIES;")();

const text = TREATMENT_CATEGORIES.map((c) =>
  "## " + c.name + "\n" +
  c.treatments.map((t) => `- ${t.name} | ${t.duration} | ${t.price} | ${t.desc}`).join("\n")
).join("\n");

fs.writeFileSync(path.join(root, "worker/src/catalog.js"), "export const CATALOG = " + JSON.stringify(text) + ";\n");
const n = TREATMENT_CATEGORIES.reduce((s, c) => s + c.treatments.length, 0);
console.log(`worker/src/catalog.js: ${TREATMENT_CATEGORIES.length} categories, ${n} treatments`);
