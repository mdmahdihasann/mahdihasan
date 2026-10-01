import { contactSchema } from "@/lib/contactSchema";
import { clientIp, rateLimited } from "@/lib/server/rateLimit";
import { escapeHtml, sendTelegram, telegramConfigured } from "@/lib/server/telegram";

/**
 * Relays a contact-form message to Mahdi's Telegram. The browser sends the
 * same message to FormSubmit (email) in parallel — see `lib/sendContact.ts` —
 * so either channel alone is enough for it to arrive.
 */
export async function POST(req: Request) {
  if (rateLimited(`contact:${clientIp(req)}`, 5, 10 * 60_000)) {
    return Response.json({ ok: false, error: "Too many messages — try again in a few minutes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

  // Honeypot: real visitors never see this field, bots fill everything in.
  if (body && typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Invalid message." }, { status: 400 });
  }

  if (!telegramConfigured()) {
    return Response.json({ ok: false, configured: false }, { status: 503 });
  }

  const { name, email, subject, message } = parsed.data;
  const sent = await sendTelegram(
    [
      "📩 <b>New message from your portfolio</b>",
      "",
      `<b>Name:</b> ${escapeHtml(name)}`,
      `<b>Email:</b> ${escapeHtml(email)}`,
      `<b>Subject:</b> ${escapeHtml(subject)}`,
      "",
      escapeHtml(message),
    ].join("\n"),
  );

  return sent
    ? Response.json({ ok: true })
    : Response.json({ ok: false, error: "Couldn't deliver the message." }, { status: 502 });
}
