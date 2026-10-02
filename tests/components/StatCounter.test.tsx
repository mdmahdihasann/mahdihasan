import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import StatCounter, {
  COUNT_DURATION_MS,
  easeOut,
} from "@/components/home/StatCounter";
import { intersectAll } from "../helpers/intersectionObserver";
import { setMatchMedia } from "../helpers/matchMedia";

describe("easeOut", () => {
  it("starts at 0 and finishes at 1", () => {
    expect(easeOut(0)).toBe(0);
    expect(easeOut(1)).toBe(1);
  });

  it("front-loads the movement", () => {
    // Past the halfway mark in time, well past it in value.
    expect(easeOut(0.5)).toBeGreaterThan(0.8);
  });
});

describe("StatCounter", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("always exposes the final figure to screen readers", () => {
    render(<StatCounter count={20} suffix="+" label="PROJECTS COMPLETED" />);

    // The digits tick up as decoration; the real value is announced once.
    expect(screen.getByText("20+")).toHaveClass("sr-only");
    expect(screen.getByText("PROJECTS COMPLETED")).toBeInTheDocument();
  });

  it("starts at zero until the card is on screen", () => {
    const { container } = render(
      <StatCounter count={100} suffix="%" label="CLIENT SATISFACTION" />,
    );

    expect(container.querySelector("[data-slot=stat-num]")).toHaveTextContent("0%100%");
  });

  it("counts up to the target once revealed", () => {
    vi.useFakeTimers({
      toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"],
    });

    const { container } = render(
      <StatCounter count={100} suffix="%" label="CLIENT SATISFACTION" />,
    );

    act(() => intersectAll());
    act(() => {
      vi.advanceTimersByTime(COUNT_DURATION_MS + 100);
    });

    const [digits] = container.querySelectorAll("[data-slot=stat-num] span");
    expect(digits).toHaveTextContent("100");
  });

  it("skips the animation entirely under reduced motion", () => {
    setMatchMedia(true);

    const { container } = render(
      <StatCounter count={16} suffix="" label="TECHNOLOGIES USED" />,
    );

    // No intersection needed: the number is there from the first paint.
    const [digits] = container.querySelectorAll("[data-slot=stat-num] span");
    expect(digits).toHaveTextContent("16");
  });
});
