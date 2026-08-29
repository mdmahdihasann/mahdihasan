"use client";

import { useEffect } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/** How far a button is allowed to drift from its resting position. */
const MAX_PULL = 10;

/**
 * Pulls every `.magnetic` element toward the pointer and ripples on click.
 *
 * The offset goes into `--mag-x` / `--mag-y` rather than `style.transform`, so
 * the `:active` press scale in CSS still applies while a button is being
 * dragged around by the cursor.
 */
export function useMagnetic() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const timers: ReturnType<typeof setTimeout>[] = [];

    const clamp = (n: number) => Math.max(-MAX_PULL, Math.min(MAX_PULL, n));

    const onMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      el.style.setProperty("--mag-x", `${clamp(mx * 0.25)}px`);
      el.style.setProperty("--mag-y", `${clamp(my * 0.35)}px`);
    };

    const onLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.removeProperty("--mag-x");
      el.style.removeProperty("--mag-y");
    };

    const onClick = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${e.clientX - r.left}px`;
      ripple.style.top = `${e.clientY - r.top}px`;
      el.appendChild(ripple);
      timers.push(setTimeout(() => ripple.remove(), 600));
    };

    els.forEach((el) => {
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("click", onClick);
    });

    return () => {
      timers.forEach(clearTimeout);
      els.forEach((el) => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("click", onClick);
        el.style.removeProperty("--mag-x");
        el.style.removeProperty("--mag-y");
      });
    };
  }, []);
}
