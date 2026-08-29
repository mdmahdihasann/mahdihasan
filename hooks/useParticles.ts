"use client";

import { useEffect, type RefObject } from "react";

import { prefersReducedMotion } from "@/lib/motion";

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  c: string;
  a: number;
};

const COLORS = ["#00E5FF", "#7C3AED", "#22C55E"];

/** Drifting starfield painted onto a full-viewport canvas. */
export function useParticles(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  count = 70,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.5 + 0.15,
    }));

    const still = prefersReducedMotion();
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        if (!still) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!still) frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, count]);
}
