"use client";

import { useEffect, useState } from "react";

import { activeSectionId, scrollProgress } from "@/lib/scroll";

export type ScrollState = {
  /** Past the point where the nav takes on its solid background. */
  scrolled: boolean;
  /** Read progress, `0..1`, for the bar under the nav. */
  progress: number;
  /** Id of the section currently in view, or `null` above the first one. */
  active: string | null;
};

const SCROLLED_AT = 40;

/**
 * One scroll listener driving the nav: background state, progress bar and the
 * scroll-spy highlight. Doing it in a single rAF-throttled handler keeps the
 * work off the scroll thread — three separate listeners would each force their
 * own layout read.
 */
export function useScrollState(sectionIds: readonly string[]): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrolled: false,
    progress: 0,
    active: null,
  });

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const navHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
        ) || 78;

      const sections = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { id, top: el.getBoundingClientRect().top + scrollY };
        })
        .filter((s): s is { id: string; top: number } => s !== null);

      setState({
        scrolled: scrollY > SCROLLED_AT,
        progress: scrollProgress(
          scrollY,
          document.documentElement.scrollHeight,
          window.innerHeight,
        ),
        active: activeSectionId(sections, scrollY, navHeight + 40),
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds]);

  return state;
}
