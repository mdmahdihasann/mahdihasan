"use client";

import { useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

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
      className={`to-top${show ? " show" : ""}`}
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
