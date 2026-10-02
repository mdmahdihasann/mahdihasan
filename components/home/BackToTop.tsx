"use client";

import { useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Appears once the visitor is a viewport-and-a-half down the page. */
export const SHOW_AFTER_PX = 900;

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={cn(
        // Sits above the chat launcher, which takes the corner. Hidden under
        // 960px, where the tab bar's Home tab does the same job.
        "to-top fixed right-[clamp(16px,3vw,28px)] bottom-[calc(var(--fab-b)_+_66px)] z-90 mr-[5px] flex size-[46px] items-center justify-center rounded-full border border-line bg-bg-elevated/80 text-[18px] leading-none text-fg-2 backdrop-blur-md max-[960px]:hidden",
        "transition-[opacity,translate,visibility,color,border-color,box-shadow] duration-[350ms] ease-smooth hover:border-khaki hover:text-khaki hover:shadow-[0_0_22px_rgba(217,210,163,.28)]",
        show ? "show visible translate-y-0 opacity-100" : "invisible translate-y-3.5 opacity-0",
      )}
      aria-label="Back to top"
      // Hidden from the tab order until it is actually on screen.
      tabIndex={show ? 0 : -1}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        })
      }
    >
      <span aria-hidden>↑</span>
    </button>
  );
};

export default BackToTop;
