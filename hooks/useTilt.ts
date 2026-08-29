"use client";

import { useEffect } from "react";

import { prefersReducedMotion } from "@/lib/motion";

const TILT_TARGETS = ".project-card, .service-card, .skill-cat";

/** Subtle 3D tilt on the card grids as the pointer moves across them. */
export function useTilt() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>(TILT_TARGETS));

    const onMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
    };

    const onLeave = (e: MouseEvent) => {
      (e.currentTarget as HTMLElement).style.transform = "";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
        card.style.transform = "";
      });
    };
  }, []);
}
