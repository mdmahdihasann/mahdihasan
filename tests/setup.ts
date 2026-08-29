import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

import { installCanvas } from "./helpers/canvas";
import { setMatchMedia } from "./helpers/matchMedia";
import { installIntersectionObserver } from "./helpers/intersectionObserver";

// jsdom ships none of these, and the reveal/counter/skill-bar/particle effects
// all depend on them.
installIntersectionObserver();
// Tests that care about what was painted call `installCanvas()` again to get
// their own handle on the contexts.
installCanvas();

beforeEach(() => {
  // Default every test to "no reduced-motion preference"; the tests that care
  // about the reduced-motion branch opt in explicitly.
  setMatchMedia(false);
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

afterEach(() => {
  cleanup();
  document.body.className = "";
});
