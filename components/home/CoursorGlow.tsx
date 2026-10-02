"use client";

import { useCursor } from "@/hooks/useCursor";

const CoursorGlow = () => {
  const { glowRef, dotRef } = useCursor();

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed z-1 size-[360px] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(169,198,162,.07),transparent_70%)] transition-opacity duration-300 max-[900px]:hidden pointer-coarse:hidden"
        aria-hidden
      />
      {/* Grows over anything clickable. */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-9999 size-[22px] -translate-1/2 rounded-full bg-khaki/85 mix-blend-difference transition-[width,height,opacity] duration-300 ease-smooth in-[body:has(a:hover,button:hover)]:size-[46px] max-[900px]:hidden pointer-coarse:hidden"
        aria-hidden
      />
    </>
  );
};

export default CoursorGlow;
