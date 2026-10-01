/**
 * Server-only: pushes a message to Mahdi's own Telegram through a bot — free,
 * instant on the phone, and no inbox involved.
 *
 * Setup (once):
 *   1. In Telegram, talk to @BotFather → /newbot → copy the token.
 *   2. Send your new bot any message, then open
 *      https://api.telegram.org/bot<TOKEN>/getUpdates and copy `chat.id`.
 *   3. Put both in `.env.local` (and in the host's env settings):
 *        TELEGRAM_BOT_TOKEN=...
 *        TELEGRAM_CHAT_ID=...
 */
export const telegramConfigured = () =>
  Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

/** Telegram's HTML parse mode only needs these three escaped. */
export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendTelegram(html: string): Promise<boolean> {
  if (!telegramConfigured()) return false;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
