"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * The portrait and the light behind it. `portrait-cutout.png` is the photo
 * with its backdrop removed (transparent), so the sphere shows through around
 * him; only the crop at the waist is faded into the page.
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
    <div
      className="relative z-1 aspect-square w-[min(100%,640px,calc(100svh_-_var(--nav-h)_-_24px))] [--px:0] [--py:0] max-[900px]:w-[min(92%,480px)] max-[600px]:w-[min(84%,340px)]"
      ref={ref}
    >
      {/* The lit sphere: lit from the upper left with a rim on the right, like
          the light behind him in the photo. */}
      <div
        className="pointer-events-none absolute -top-[6%] -right-[2%] left-[6%] z-0 aspect-square [transform:translate3d(calc(var(--px)*18px),calc(var(--py)*12px),0)] max-[600px]:-top-[2%] max-[600px]:right-[2%] max-[600px]:left-[2%]"
        aria-hidden
      >
        <div className="halo-glow absolute inset-[8%]" />
        <div className="halo-light absolute inset-0 animate-bloom" />
        <div className="absolute -inset-[7%] animate-[fadeIn_1.2s_var(--ease-smooth)_.6s_both,orbit_32s_linear_1.8s_infinite] rounded-full border border-khaki/14">
          <span className="absolute top-1/2 -left-[5px] -mt-[5px] size-2.5 rounded-full bg-khaki shadow-[0_0_18px_4px_rgba(217,210,163,.45)]" />
        </div>
      </div>

      <div className="absolute inset-0 z-1 animate-rise">
        <div className="portrait-cutout absolute inset-0 [transform:translate3d(calc(var(--px)*-8px),calc(var(--py)*-5px),0)]">
          <Image
            src="/portrait-cutout.png"
            alt={`Portrait of ${name}`}
            width={1200}
            height={1200}
            sizes="(max-width: 900px) 88vw, 44vw"
            loading="eager"
            fetchPriority="high"
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroPortrait;
