import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  MAX_STAGGER_MS,
  STAGGER_STEP_MS,
  staggerDelay,
  useReveal,
} from "@/hooks/useReveal";
import { intersectAll, observedCount } from "../helpers/intersectionObserver";

describe("staggerDelay", () => {
  it("does not delay the first item", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("steps each sibling further back", () => {
    expect(staggerDelay(1)).toBe(STAGGER_STEP_MS);
    expect(staggerDelay(2)).toBe(STAGGER_STEP_MS * 2);
  });

  it("caps the wait so a long row still lands quickly", () => {
    expect(staggerDelay(50)).toBe(MAX_STAGGER_MS);
  });

  it("treats a missing index as no delay", () => {
    expect(staggerDelay(-1)).toBe(0);
    expect(staggerDelay(Number.NaN)).toBe(0);
  });
});

const Harness = () => {
  useReveal();
  return (
    <div data-testid="grid">
      <p className="reveal">one</p>
      <p className="reveal">two</p>
      <p className="reveal-scale">three</p>
      <p className="plain">four</p>
    </div>
  );
};

describe("useReveal", () => {
  it("adds `.in` to reveal elements once they intersect", () => {
    const { getByText } = render(<Harness />);

    expect(getByText("one")).not.toHaveClass("in");

    intersectAll();

    expect(getByText("one")).toHaveClass("in");
    expect(getByText("two")).toHaveClass("in");
    expect(getByText("three")).toHaveClass("in");
    expect(getByText("four")).not.toHaveClass("in");
  });

  it("staggers siblings by their position in the parent", () => {
    const { getByText } = render(<Harness />);
    intersectAll();

    expect(getByText("one").style.transitionDelay).toBe("");
    expect(getByText("two").style.transitionDelay).toBe(`${STAGGER_STEP_MS}ms`);
    expect(getByText("three").style.transitionDelay).toBe(
      `${STAGGER_STEP_MS * 2}ms`,
    );
  });

  it("stops observing an element after it has revealed", () => {
    render(<Harness />);
    expect(observedCount()).toBe(3);

    intersectAll();

    expect(observedCount()).toBe(0);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<Harness />);
    expect(observedCount()).toBe(3);

    unmount();

    expect(observedCount()).toBe(0);
  });
});
