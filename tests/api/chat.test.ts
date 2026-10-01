import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/chat/route";
import { profile } from "@/data/profile";

let ip = 0;
const post = (body: unknown, from = `10.0.0.${++ip}`) =>
  POST(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": from },
      body: JSON.stringify(body),
    }),
  );

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/chat", () => {
  it("answers from the free local engine when no API key is set", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const res = await post({ messages: [{ role: "user", content: "I want to hire him" }] });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.source).toBe("local");
    expect(data.text).toContain(profile.email);
    expect(data.actions).toHaveLength(2);
  });

  it("rejects a request without a user question", async () => {
    const res = await post({ messages: [{ role: "assistant", content: "hello" }] });
    expect(res.status).toBe(400);
  });

  it("rate-limits one visitor sending too fast", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const body = { messages: [{ role: "user", content: "hi" }] };
    let last = await post(body, "10.9.9.9");
    for (let i = 0; i < 30; i++) last = await post(body, "10.9.9.9");
    expect(last.status).toBe(429);
  });
});
