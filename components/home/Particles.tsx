"use client";

import { useRef } from "react";

import { useParticles } from "@/hooks/useParticles";

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef);

  return <canvas id="particles" ref={canvasRef} aria-hidden />;
};

export default Particles;
