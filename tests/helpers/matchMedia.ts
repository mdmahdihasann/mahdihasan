import { vi } from "vitest";

/**
 * jsdom has no `matchMedia`. Everything the site queries is
 * `(prefers-reduced-motion: reduce)`, so one boolean is enough — but the object
 * still has to carry `addEventListener`, because `CodeEditor` subscribes to it
 * through `useSyncExternalStore`.
 */
export function setMatchMedia(reducedMotion: boolean) {
  const listeners = new Set<() => void>();

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      media: query,
      onchange: null,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
      addListener: (fn: () => void) => listeners.add(fn),
      removeListener: (fn: () => void) => listeners.delete(fn),
      dispatchEvent: () => false,
    })),
  );
}
