import { describe, expect, it } from "vitest";

import { activeSectionId, scrollProgress } from "@/lib/scroll";

describe("scrollProgress", () => {
  it("reports 0 at the top and 1 at the bottom", () => {
    expect(scrollProgress(0, 4000, 1000)).toBe(0);
    expect(scrollProgress(3000, 4000, 1000)).toBe(1);
  });

  it("is linear in between", () => {
    expect(scrollProgress(1500, 4000, 1000)).toBeCloseTo(0.5);
  });

  it("returns 0 when the page is not scrollable", () => {
    // A page shorter than the viewport has no progress to report — the old
    // shape of this maths would have divided by zero.
    expect(scrollProgress(0, 600, 1000)).toBe(0);
    expect(scrollProgress(0, 1000, 1000)).toBe(0);
  });

  it("clamps overscroll at both ends", () => {
    expect(scrollProgress(-200, 4000, 1000)).toBe(0);
    expect(scrollProgress(99999, 4000, 1000)).toBe(1);
  });
});

describe("activeSectionId", () => {
  const sections = [
    { id: "about", top: 1000 },
    { id: "skills", top: 2000 },
    { id: "projects", top: 3000 },
  ];

  it("highlights nothing above the first section", () => {
    expect(activeSectionId(sections, 0, 100)).toBeNull();
  });

  it("highlights a section once its top passes the nav line", () => {
    // 940 + 100 offset = 1040, which is past `about`'s top of 1000.
    expect(activeSectionId(sections, 940, 100)).toBe("about");
    expect(activeSectionId(sections, 899, 100)).toBeNull();
  });

  it("keeps the last section that qualifies, not the first", () => {
    expect(activeSectionId(sections, 2500, 100)).toBe("skills");
    expect(activeSectionId(sections, 5000, 100)).toBe("projects");
  });

  it("handles an empty section list", () => {
    expect(activeSectionId([], 500, 100)).toBeNull();
  });
});
