"use client";

import { useRef } from "react";

import { useParticles } from "@/hooks/useParticles";

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef);

  return <canvas
      id="particles"
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-1"
      aria-hidden
    />;
};

export default Particles;
