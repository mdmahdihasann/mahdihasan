import { describe, expect, it } from "vitest";

import { activeSectionId } from "@/lib/scroll";

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
