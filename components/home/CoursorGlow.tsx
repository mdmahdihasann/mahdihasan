"use client";

import { useCursor } from "@/hooks/useCursor";

const CoursorGlow = () => {
  const { glowRef, dotRef } = useCursor();

  return (
    <>
      <div className="cursor-glow" ref={glowRef} aria-hidden />
      <div className="cursor-dot" ref={dotRef} aria-hidden />
    </>
  );
};

export default CoursorGlow;
