"use client";

import { useEffect, useRef } from "react";

/**
 * Follows the pointer with two layers: the glow tracks it exactly, the dot
 * eases in behind it. Returns the refs to attach to each element.
 */
export function useCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return;
    // The cursor layers are hidden under 900px — skip the loop on touch sizes.
    if (window.matchMedia("(max-width: 900px)").matches) return;

    let gx = 0;
    let gy = 0;
    let dx = 0;
    let dy = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      gx = e.clientX;
      gy = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      dx += (gx - dx) * 0.18;
      dy += (gy - dy) * 0.18;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      dot.style.left = `${dx}px`;
      dot.style.top = `${dy}px`;
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return { glowRef, dotRef };
}
