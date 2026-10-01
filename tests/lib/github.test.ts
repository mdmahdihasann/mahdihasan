import { describe, expect, it } from "vitest";

import { streaks, toWeeks, usernameFromUrl, type ContribDay } from "@/lib/server/github";

const day = (date: string, count: number): ContribDay => ({ date, count, level: count ? 1 : 0 });

describe("github helpers", () => {
  it("reads the username off the profile URL", () => {
    expect(usernameFromUrl("https://github.com/mdmahdihasann")).toBe("mdmahdihasann");
    expect(usernameFromUrl("https://github.com/someone/")).toBe("someone");
  });

  it("finds the longest and current streaks, letting today still be empty", () => {
    const days = [
      day("2026-09-01", 1),
      day("2026-09-02", 2),
      day("2026-09-03", 3),
      day("2026-09-04", 0),
      day("2026-09-05", 1),
      day("2026-09-06", 4),
      day("2026-09-07", 0),
    ];
    expect(streaks(days)).toEqual({ longest: 3, current: 2 });
  });

  it("starts a new week column every Sunday", () => {
    // 2026-09-26 is a Saturday, 2026-09-27 a Sunday.
    const weeks = toWeeks([day("2026-09-25", 0), day("2026-09-26", 1), day("2026-09-27", 2), day("2026-09-28", 0)]);
    expect(weeks.map((w) => w.length)).toEqual([2, 2]);
    expect(weeks[1][0].date).toBe("2026-09-27");
  });
});
