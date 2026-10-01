import Anthropic from "@anthropic-ai/sdk";

import { profile } from "@/data/profile";
import { buildKnowledge } from "@/lib/chat/knowledge";
import { actionsFor, localReply, type ChatTurn } from "@/lib/chat/localReply";
import { clientIp, rateLimited } from "@/lib/server/rateLimit";

/**
 * The chat assistant's back end. With ANTHROPIC_API_KEY set it answers with
 * Claude, grounded in the site's own data; without one (or if the call fails)
 * it falls back to the free keyword engine in `lib/chat/localReply.ts`, so the
 * bot always answers.
 */

const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";
const MAX_TURNS = 12;
const MAX_CHARS = 1000;

const SYSTEM = `You are the assistant on ${profile.name}'s portfolio website. You answer visitors' questions about ${profile.firstName} while he is away. Speak about him in the third person; you are his assistant, not him.

Use only the facts below. If something isn't covered, say you don't know and suggest emailing ${profile.email}. Never invent projects, clients, prices, numbers or dates.

When a visitor wants to hire ${profile.firstName}, start a project, asks about price, budget, availability or timelines, warmly ask them to email him at ${profile.email} with their requirements, timeline and budget (the contact form on this page also works). Don't quote prices or promise dates yourself.

Keep replies short and friendly: two to four sentences, plain text, no markdown headings or tables. Reply in the visitor's language — English, Bangla, or Banglish (Bangla written in English letters). Politely decline questions that have nothing to do with ${profile.firstName} or his work.

<facts>
${buildKnowledge()}
</facts>`;

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

/** Keeps only well-formed, size-capped turns, starting with a user turn. */
function cleanHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const turns = raw
    .filter(
      (t): t is ChatTurn =>
        !!t &&
        (t.role === "user" || t.role === "assistant") &&
        typeof t.content === "string" &&
        t.content.trim() !== "",
    )
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CHARS) }));
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns;
}

async function askClaude(turns: ChatTurn[]): Promise<string | null> {
  const response = await getClient().beta.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM,
    cache_control: { type: "ephemeral" },
    output_config: { effort: "low" },
    // If a safety classifier declines, the API retries on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: turns,
  });
  if (response.stop_reason === "refusal") return null;
  const text = response.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("")
    .trim();
  return text || null;
}

export async function POST(req: Request) {
  if (rateLimited(`chat:${clientIp(req)}`, 30, 10 * 60_000)) {
    return Response.json(
      { text: `You're sending messages quickly — please wait a few minutes, or email ${profile.email} directly.` },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
  const turns = cleanHistory(body?.messages);
  const last = turns.at(-1);
  if (!last || last.role !== "user") {
    return Response.json({ error: "No question." }, { status: 400 });
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const text = await askClaude(turns);
      if (text) return Response.json({ text, actions: actionsFor(last.content), source: "ai" });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        console.warn("[chat] rate limited by the API; using the local engine");
      } else if (err instanceof Anthropic.AuthenticationError) {
        console.error("[chat] ANTHROPIC_API_KEY was rejected; using the local engine");
      } else if (err instanceof Anthropic.APIError) {
        console.error(`[chat] API error ${err.status}: ${err.message}`);
      } else {
        console.error("[chat] request failed", err);
      }
    }
  }

  return Response.json({ ...localReply(last.content), source: "local" });
}
