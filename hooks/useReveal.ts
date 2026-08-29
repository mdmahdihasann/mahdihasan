"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".reveal, .reveal-scale";

/** Longest entrance a single element can wait, in ms. */
export const MAX_STAGGER_MS = 320;
/** Gap between two siblings entering, in ms. */
export const STAGGER_STEP_MS = 80;

/**
 * Siblings in a grid enter one after another instead of all at once — capped so
 * a six-card row never keeps the last card waiting half a second.
 */
export function staggerDelay(index: number) {
  if (!Number.isFinite(index) || index <= 0) return 0;
  return Math.min(index * STAGGER_STEP_MS, MAX_STAGGER_MS);
}

/**
 * Adds `.in` to every `.reveal` / `.reveal-scale` element the first time it
 * scrolls into view — the CSS in `app/globals.css` handles the transition.
 *
 * The stagger delay is cleared once the entrance is over, so it doesn't slow
 * down the hover transitions that share the same `transition` shorthand.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    if (els.length === 0) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Position within the run of reveal siblings sharing a parent.
    const indexInParent = new Map<HTMLElement, number>();
    els.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return indexInParent.set(el, 0);
      const siblings = Array.from(parent.children).filter((child) =>
        child.matches(REVEAL_SELECTOR),
      );
      indexInParent.set(el, siblings.indexOf(el));
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = staggerDelay(indexInParent.get(el) ?? 0);

          if (delay > 0) {
            el.style.transitionDelay = `${delay}ms`;
            timers.push(
              setTimeout(() => {
                el.style.transitionDelay = "";
              }, delay + 800),
            );
          }

          el.classList.add("in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    els.forEach((el) => io.observe(el));

    return () => {
      timers.forEach(clearTimeout);
      io.disconnect();
    };
  }, []);
}
