import { vi } from "vitest";

type Observed = { observer: FakeIntersectionObserver; target: Element };

const registry: Observed[] = [];

/**
 * Minimal IntersectionObserver stand-in. jsdom has none, and every scroll-driven
 * effect in the app (reveals, stat counters, skill bars) is built on one, so the
 * tests need a handle to say "this element is now on screen".
 */
class FakeIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    registry.push({ observer: this, target });
  }

  unobserve(target: Element) {
    for (let i = registry.length - 1; i >= 0; i -= 1) {
      if (registry[i].observer === this && registry[i].target === target) {
        registry.splice(i, 1);
      }
    }
  }

  disconnect() {
    for (let i = registry.length - 1; i >= 0; i -= 1) {
      if (registry[i].observer === this) registry.splice(i, 1);
    }
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  fire(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this,
    );
  }
}

export function installIntersectionObserver() {
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
}

/** Number of elements currently being watched — handy for teardown assertions. */
export function observedCount() {
  return registry.length;
}

/**
 * Reports every observed element as intersecting, which is how the tests move
 * the page "into view" without a real scroll.
 */
export function intersectAll() {
  // Copied because the callbacks call `unobserve`, mutating the registry.
  [...registry].forEach(({ observer, target }) => observer.fire(target));
}
