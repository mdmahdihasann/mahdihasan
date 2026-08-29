"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
/** The server has no media queries, so it renders the animated markup. */
const getServerSnapshot = () => false;

/**
 * Reads the reduced-motion preference as render state rather than through an
 * effect, so a component can branch on it while it renders instead of doing a
 * second pass — and it stays hydration-safe.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
