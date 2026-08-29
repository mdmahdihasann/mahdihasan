"use client";

import { useEffect } from "react";

import { prefersReducedMotion } from "@/lib/motion";

const SPOTLIGHT_TARGETS = ".spotlight";

/**
 * Tracks the pointer across every `.spotlight` card and writes its position to
 * `--mx` / `--my`, which `app/globals.css` paints as a soft highlight.
 *
 * This replaces the old 3D tilt hook on purpose: tilt wrote directly to
 * `element.style.transform`, which is the same property the scroll-reveal and
 * hover-lift rules use, so hovering a card before it had revealed left it
 * stuck at `opacity: 0`. Painting a gradient touches nothing else.
 */
export function useSpotlight() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(SPOTLIGHT_TARGETS),
    );

    const onMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    const onLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      });
    };
  }, []);
}
