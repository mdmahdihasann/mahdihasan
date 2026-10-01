"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * The portrait and the light behind it. The photo's own backdrop is the same
 * forest green as the page, so with its edges masked it reads as a cut-out.
 *
 * Pointer position is written to `--px` / `--py` (-1..1) on the wrapper; CSS
 * turns that into a small counter-parallax between the halo and the photo.
 * The rise-in animation lives on a different element than the parallax, so
 * each element still has exactly one transform.
 */
const HeroPortrait = ({ name }: { name: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="hero-portrait" ref={ref}>
      <div className="halo" aria-hidden>
        <div className="halo-light" />
        <div className="halo-ring">
          <span />
        </div>
      </div>

      <div className="portrait-rise">
        <div className="portrait-img">
          <Image
            src="/portrait.jpg"
            alt={`Portrait of ${name}`}
            width={1200}
            height={1200}
            sizes="(max-width: 900px) 88vw, 44vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroPortrait;
