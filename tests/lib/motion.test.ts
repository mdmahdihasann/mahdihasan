import { describe, expect, it } from "vitest";

import { prefersReducedMotion } from "@/lib/motion";
import { setMatchMedia } from "../helpers/matchMedia";

describe("prefersReducedMotion", () => {
  it("is false when the visitor has no preference", () => {
    setMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("is true when the OS asks for reduced motion", () => {
    setMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });
});
