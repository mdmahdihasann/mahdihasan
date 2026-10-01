import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/contact/route";

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "New site",
  message: "I would like a five page marketing site built in Next.js.",
};

let ip = 0;
const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": `10.1.0.${++ip}` },
      body: JSON.stringify(body),
    }),
  );

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/contact", () => {
  it("says so when Telegram isn't configured, so email carries the message", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    const res = await post(VALID);
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ configured: false });
  });

  it("forwards a valid message to the Telegram chat, HTML-escaped", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:abc");
    vi.stubEnv("TELEGRAM_CHAT_ID", "42");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const res = await post({ ...VALID, message: "<b>Hi</b> — I need a store & a blog." });

    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.telegram.org/bot123:abc/sendMessage");
    const sent = JSON.parse(init.body);
    expect(sent.chat_id).toBe("42");
    expect(sent.text).toContain("ada@example.com");
    expect(sent.text).toContain("&lt;b&gt;Hi&lt;/b&gt; — I need a store &amp; a blog.");
  });

  it("rejects an invalid message", async () => {
    const res = await post({ ...VALID, email: "nope" });
    expect(res.status).toBe(400);
  });

  it("quietly drops a bot that filled the honeypot", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await post({ ...VALID, website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
