"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type StatCounterProps = {
  count: number;
  suffix: string;
  label: string;
  /** Optional glyph shown in a tile beside the number. */
  icon?: React.ReactNode;
};

/** Every counter takes the same time regardless of how big its number is. */
export const COUNT_DURATION_MS = 1400;

/** Ease-out cubic — fast off the mark, gentle landing. */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts up from zero the first time the card scrolls into view.
 *
 * Driven by rAF over a fixed duration rather than a fixed-step interval: the
 * old version stepped by `count / 40` every 30ms, so "2+" finished in two
 * frames while "100%" took a second — the row never landed together.
 */
const StatCounter = ({ count, suffix, label, icon }: StatCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    // Reduced motion shows the final figure straight away, so there is nothing
    // to observe and nothing to animate.
    if (!el || reduced) return;

    let frame = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);

          const start = performance.now();
          const step = (now: number) => {
            // The first frame's timestamp can predate `start`; clamp so the
            // count never dips below zero.
            const t = Math.min(1, Math.max(0, (now - start) / COUNT_DURATION_MS));
            setValue(Math.round(easeOut(t) * count));
            if (t < 1) frame = requestAnimationFrame(step);
          };
          frame = requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );

    io.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [count, reduced]);

  return (
    <div className="stat-card" ref={ref}>
      {icon && (
        <span className="stat-icon" aria-hidden>
          {icon}
        </span>
      )}
      <div>
        <p className="stat-num">
          {/* The animated digits are decoration; the final figure is announced once. */}
          <span aria-hidden>{reduced ? count : value}</span>
          <span className="suffix" aria-hidden>
            {suffix}
          </span>
          <span className="sr-only">{`${count}${suffix}`}</span>
        </p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCounter;
