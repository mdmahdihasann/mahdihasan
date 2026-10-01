import { describe, expect, it } from "vitest";

import { profile } from "@/data/profile";
import { actionsFor, detectIntent, localReply } from "@/lib/chat/localReply";

describe("detectIntent", () => {
  it.each([
    ["I want to hire Mahdi for a project", "hire"],
    ["How much does a website cost?", "hire"],
    ["ami apnake diye kaj korate chai", "hire"],
    ["website banate koto taka lagbe?", "hire"],
    ["What's his email?", "contact"],
    ["Is he good at React?", "skills"],
    ["What services do you offer?", "services"],
    ["Tell me about his experience", "experience"],
    ["Which university does he study at?", "education"],
    ["Where is he based?", "location"],
    ["Can I see his CV?", "resume"],
    ["hi, what's his tech stack?", "skills"],
    ["Hello!", "greeting"],
    ["আসসালামু আলাইকুম", "greeting"],
    ["thanks!", "thanks"],
  ])("%s → %s", (text, intent) => {
    expect(detectIntent(text)).toBe(intent);
  });

  it("returns null for something it can't place", () => {
    expect(detectIntent("qwerty zxcv")).toBeNull();
  });
});

describe("localReply", () => {
  it("asks a would-be client to email, with email and contact-form buttons", () => {
    const reply = localReply("I want to hire him");
    expect(reply.text).toContain(profile.email);
    expect(reply.actions?.map((a) => a.href)).toEqual([
      expect.stringContaining(`mailto:${profile.email}`),
      "#contact",
    ]);
  });

  it("confirms a named skill from the data", () => {
    expect(localReply("Is he good at Next.js?").text).toMatch(/Next\.js is part of/);
  });

  it("never presents the placeholder projects as real work", () => {
    const text = localReply("show me his projects").text;
    expect(text).toMatch(/being updated/);
    expect(text).not.toMatch(/E-commerce Storefront/);
  });

  it("still points to email when it doesn't understand", () => {
    expect(localReply("qwerty zxcv").text).toContain(profile.email);
  });
});

describe("actionsFor", () => {
  it("adds the hire buttons only to hiring and contact questions", () => {
    expect(actionsFor("what is your rate?")).toHaveLength(2);
    expect(actionsFor("what are his skills?")).toBeUndefined();
  });
});
