"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { floatingPane, khakiTile } from "@/lib/ui";
import { cn } from "@/lib/utils";

type StatCounterProps = {
  count: number;
  suffix: string;
  label: string;
  /** Optional glyph shown in a tile beside the number. */
  icon?: React.ReactNode;
  /** "hero" floats over the portrait; "grid" is a tile in the Numbers panel. */
  variant?: "hero" | "grid";
};

const VARIANT = {
  hero: {
    card: cn(
      floatingPane,
      "gap-3 px-[18px] py-4 max-[900px]:min-w-0 max-[900px]:flex-1 max-[900px]:p-3.5 max-[600px]:rounded-[14px] max-[600px]:px-3 max-[600px]:pt-3 max-[600px]:pb-[11px]",
    ),
    icon: "size-[34px] rounded-[10px] max-[1100px]:hidden [&_svg]:size-[17px]",
    num: "text-[clamp(26px,2.2vw,32px)] max-[600px]:text-[24px]",
    label: "mt-1 text-[13px] leading-[1.35] max-[600px]:mt-0.5 max-[600px]:text-[11.5px]",
  },
  grid: {
    // A tint, not a second frame — the panel around it is already the box.
    card: "gap-3.5 rounded-2xl border border-sage/7 bg-fg-1/[.025] px-[18px] py-4",
    icon: "size-9 rounded-[10px]",
    num: "text-[clamp(26px,2.4vw,34px)]",
    label: "mt-[5px] text-[13.5px]",
  },
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
const StatCounter = ({ count, suffix, label, icon, variant = "grid" }: StatCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  const v = VARIANT[variant];

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
    <div className={cn("flex flex-col items-start", v.card)} ref={ref}>
      {icon && (
        <span className={cn(khakiTile, v.icon)} aria-hidden>
          {icon}
        </span>
      )}
      <div>
        <p
          data-slot="stat-num"
          className={cn(
            "flex items-baseline gap-0.5 font-display leading-none font-bold tracking-[-0.03em] text-fg-1 tabular-nums",
            v.num,
          )}
        >
          {/* The animated digits are decoration; the final figure is announced once. */}
          <span aria-hidden>{reduced ? count : value}</span>
          <span className="text-[0.6em] text-khaki" aria-hidden>
            {suffix}
          </span>
          <span className="sr-only">{`${count}${suffix}`}</span>
        </p>
        <p className={cn("text-fg-2", v.label)}>{label}</p>
      </div>
    </div>
  );
};

export default StatCounter;
