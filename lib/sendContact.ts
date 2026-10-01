import { profile } from "@/data/profile";
import type { ContactValues } from "@/lib/contactSchema";

/**
 * A contact-form message goes out on two free channels at once, so it still
 * arrives if one of them is down or not set up yet:
 *
 * - **Telegram** via `/api/contact` — instant on Mahdi's phone, once
 *   TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are set (see `lib/server/telegram.ts`).
 * - **Email** via FormSubmit (formsubmit.co) — no server, account or key. The
 *   very first message triggers an activation email to `profile.email`; once
 *   its link is clicked, every message lands in the inbox with Reply-To set
 *   to the visitor.
 */
export const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;
export const CONTACT_API = "/api/contact";

export type ContactMessage = ContactValues & {
  /** Honeypot — left empty by people, filled in by bots. */
  website?: string;
};

export class ContactSendError extends Error {}

const GENERIC_FAILURE = "The message couldn't be sent. Please try again or email me directly.";

async function viaTelegram(values: ContactMessage): Promise<void> {
  const res = await fetch(CONTACT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !data?.ok) throw new ContactSendError(data?.error || GENERIC_FAILURE);
}

async function viaEmail(values: ContactMessage): Promise<void> {
  let res: Response;
  try {
    res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        message: values.message,
        _subject: `Portfolio: ${values.subject}`,
        _replyto: values.email,
        _honey: values.website ?? "",
        _template: "table",
        _captcha: "false",
      }),
    });
  } catch {
    throw new ContactSendError("Couldn't reach the mail service. Check your connection and try again.");
  }

  // FormSubmit answers 200 with `success: "false"` for its own errors
  // (an unactivated form, a blocked sender), so the body decides, not the status.
  const data = (await res.json().catch(() => null)) as
    | { success?: string | boolean; message?: string }
    | null;
  const ok = res.ok && (data?.success === true || data?.success === "true");
  if (ok) return;
  // An unactivated form is the owner's setup step, not something the visitor
  // can fix, so they get a plain way forward instead of FormSubmit's notice.
  if (/activat/i.test(data?.message ?? "")) {
    console.warn(`[contact] FormSubmit is not activated for ${profile.email}: ${data?.message}`);
    throw new ContactSendError("The contact form is offline for a moment.");
  }
  throw new ContactSendError(data?.message || GENERIC_FAILURE);
}

/** Resolves when at least one channel delivered; otherwise throws the email error. */
export async function sendContact(values: ContactMessage): Promise<void> {
  const [email, telegram] = await Promise.allSettled([viaEmail(values), viaTelegram(values)]);
  if (email.status === "fulfilled" || telegram.status === "fulfilled") return;
  throw email.reason instanceof Error ? email.reason : new ContactSendError(GENERIC_FAILURE);
}
