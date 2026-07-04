/* Noura Skin Secrets — AI skin analysis proxy (Cloudflare Worker)
   Receives a photo from the website chatbot, sends it to the Claude API
   for analysis, and returns structured recommendations drawn only from
   the salon's real treatment catalog.

   Privacy by design:
   - Images are processed in memory only — never stored or logged.
   - The Anthropic API key lives in a Worker secret, never in the browser.
   - Only requests from the salon's own website origins are accepted. */

import Anthropic from "@anthropic-ai/sdk";
import { CATALOG } from "./catalog.js";

const ALLOWED_ORIGINS = [
  "https://nouraskinsecrets.se",
  "https://www.nouraskinsecrets.se",
  "https://mouazalsaeed-art.github.io",
];

const MAX_IMAGE_BASE64_CHARS = 5_600_000; // ~4 MB decoded
const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"];
const LANGS = ["sv", "en", "ar"];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["valid", "message", "skin_type", "observations", "concerns", "recommended_treatments", "routine_morning", "routine_evening", "warnings"],
  properties: {
    valid: { type: "boolean", description: "false if the image is not a usable photo of skin/face" },
    message: { type: ["string", "null"], description: "shown to the user when valid=false, in the requested language" },
    skin_type: { type: "string", enum: ["torr", "fet", "kombinerad", "kanslig", "normal", "oklar"] },
    observations: { type: "array", items: { type: "string" } },
    concerns: { type: "array", items: { type: "string" } },
    recommended_treatments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "why"],
        properties: {
          name: { type: "string", description: "EXACT treatment name copied from the catalog" },
          why: { type: "string" },
        },
      },
    },
    routine_morning: { type: "array", items: { type: "string" } },
    routine_evening: { type: "array", items: { type: "string" } },
    warnings: { type: "array", items: { type: "string" } },
  },
};

function systemPrompt(lang) {
  const langName = { sv: "Swedish", en: "English", ar: "Arabic" }[lang];
  return `You are the AI skin advisor for "Noura Skin Secrets", a women-only beauty salon in Uppsala, Sweden, run by a certified skin therapist.

You will receive a photo a client took of her own skin (usually her face). Analyse it carefully as a cosmetic (NOT medical) skin assessment.

Rules:
- Respond ONLY with the requested JSON. All user-facing text in ${langName}.
- Be honest and specific about what you can observe: apparent skin type, texture, shine, dryness, visible pores, blemishes, pigmentation, redness, fine lines, dark circles.
- Never diagnose medical conditions. If you see anything that could be a medical issue (suspicious moles, infections, severe inflammation), add a warning advising the client to see a doctor or dermatologist — do not name a diagnosis.
- Recommend 2-3 treatments, chosen ONLY from the catalog below. Copy the treatment "name" field EXACTLY, character for character, from the catalog. Never invent treatments.
- Suggest a short realistic morning and evening home routine (product types, not brands).
- If the photo is not a usable photo of human skin (blurry, dark, an object, a screenshot, etc.), set valid=false with a friendly message asking for a clearer photo taken in daylight without makeup, and leave other fields empty.
- If the photo shows a child, set valid=false with a polite message that the service is for adults.
- Keep every text string short and warm in tone. The client is a valued salon guest, not a patient.

TREATMENT CATALOG (name | duration | price | description):
${CATALOG}`;
}

const USER_TEXT = {
  sv: "Analysera min hud på fotot och rekommendera behandlingar.",
  en: "Analyse my skin in the photo and recommend treatments.",
  ar: "حللي بشرتي في الصورة واقترحي العلاجات المناسبة.",
};

const MAX_CHAT_MESSAGES = 16;
const MAX_CHAT_CHARS = 1500;

function chatSystemPrompt(lang) {
  const langName = { sv: "Swedish", en: "English", ar: "Arabic" }[lang];
  return `You are the friendly AI assistant on the website of "Noura Skin Secrets", a women-only beauty salon in Uppsala, Sweden, run by a certified skin therapist.

Salon facts:
- Address: Kungsängsgatan 5B, 753 22 Uppsala (city centre).
- Phone / WhatsApp: +46 79 333 34 76.
- Open every day 10:00-20:00.
- Booking: the "Boka tid" page on the website, or by phone/WhatsApp.
- Women only. Instagram: @noura_skin_secrets.
- The chatbot also offers an AI photo skin analysis — suggest it when someone wonders what treatment suits her skin.

Rules:
- Reply in ${langName} unless the customer clearly writes in another language — then answer in her language.
- Only discuss: the salon, its treatments, prices, durations, booking, opening hours, skincare advice, home routines (product TYPES like cleanser/vitamin C serum/SPF — never brand names), and pre/post-treatment care.
- Recommend treatments ONLY from the catalog below, with their exact names and prices. Never invent treatments, prices or discounts.
- Never give medical diagnoses. For anything that sounds medical (infections, suspicious moles, severe reactions), warmly advise seeing a doctor or dermatologist.
- If asked about something unrelated (politics, tech, homework...), politely say you can only help with the salon and skincare, and steer back.
- Keep answers short and warm: 2-5 sentences, plain text only (no markdown, no headers), at most one emoji.

TREATMENT CATALOG (name | duration | price | description):
${CATALOG}`;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

/* Free-text chat: the website sends the recent conversation and gets a
   short answer grounded in the salon's real catalog. Messages are processed
   in memory only — never stored or logged. */
async function handleChat(payload, env, allowedOrigin) {
  const { messages, lang } = payload || {};
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_CHAT_MESSAGES ||
    !LANGS.includes(lang) ||
    messages.some(
      (m) =>
        !m ||
        (m.role !== "user" && m.role !== "assistant") ||
        typeof m.content !== "string" ||
        m.content.length === 0 ||
        m.content.length > MAX_CHAT_CHARS
    )
  ) {
    return json({ error: "bad_request" }, 400, allowedOrigin);
  }

  // The API requires the first message to be from the user
  const firstUser = messages.findIndex((m) => m.role === "user");
  if (firstUser === -1) {
    return json({ error: "bad_request" }, 400, allowedOrigin);
  }
  const turns = messages.slice(firstUser).map((m) => ({ role: m.role, content: m.content }));

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: chatSystemPrompt(lang),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: turns,
    });

    if (response.stop_reason === "refusal") {
      return json({ error: "refused" }, 422, allowedOrigin);
    }

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || !textBlock.text) {
      return json({ error: "empty", detail: "stop=" + response.stop_reason }, 502, allowedOrigin);
    }
    return json({ reply: textBlock.text }, 200, allowedOrigin);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const detail = String((err && err.message) || err).slice(0, 300);
    if (status === 429) return json({ error: "busy", detail }, 429, allowedOrigin);
    if (status === 401) return json({ error: "not_configured", detail }, 503, allowedOrigin);
    return json({ error: "chat_failed", detail }, 502, allowedOrigin);
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || (url.pathname !== "/analyze" && url.pathname !== "/chat")) {
      return json({ error: "not_found" }, 404, allowedOrigin);
    }

    // Only accept calls from the salon's own pages
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: "forbidden" }, 403, allowedOrigin);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: "not_configured" }, 503, allowedOrigin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "bad_request" }, 400, allowedOrigin);
    }

    if (url.pathname === "/chat") {
      return handleChat(payload, env, allowedOrigin);
    }

    const { image, mediaType, lang } = payload || {};
    if (
      typeof image !== "string" ||
      image.length === 0 ||
      image.length > MAX_IMAGE_BASE64_CHARS ||
      !ALLOWED_MEDIA_TYPES.includes(mediaType) ||
      !LANGS.includes(lang)
    ) {
      return json({ error: "bad_request" }, 400, allowedOrigin);
    }

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    try {
      const response = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 3500,
        system: [
          {
            type: "text",
            text: systemPrompt(lang),
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
              { type: "text", text: USER_TEXT[lang] },
            ],
          },
        ],
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
      });

      if (response.stop_reason === "refusal") {
        return json({ error: "refused" }, 422, allowedOrigin);
      }

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock) {
        return json({ error: "empty", detail: "no text block, stop=" + response.stop_reason }, 502, allowedOrigin);
      }

      let analysis;
      try {
        analysis = JSON.parse(textBlock.text);
      } catch {
        return json({ error: "parse_failed", detail: "stop=" + response.stop_reason }, 502, allowedOrigin);
      }
      return json({ analysis }, 200, allowedOrigin);
    } catch (err) {
      const status = err && err.status ? err.status : 500;
      const detail = String((err && err.message) || err).slice(0, 300);
      if (status === 429) return json({ error: "busy", detail }, 429, allowedOrigin);
      if (status === 401) return json({ error: "not_configured", detail }, 503, allowedOrigin);
      return json({ error: "analysis_failed", detail }, 502, allowedOrigin);
    }
  },
};
