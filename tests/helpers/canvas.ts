import { vi } from "vitest";

export type FakeContext = {
  calls: { arc: number; fill: number; clearRect: number };
} & Record<string, unknown>;

/**
 * jsdom has no canvas implementation and logs a "Not implemented" error every
 * time `getContext` is called. `useParticles` only needs a handful of 2D calls,
 * so this stubs exactly those and counts them.
 */
export function installCanvas() {
  const contexts: FakeContext[] = [];

  HTMLCanvasElement.prototype.getContext = vi.fn(function () {
    const calls = { arc: 0, fill: 0, clearRect: 0 };
    const ctx: FakeContext = {
      calls,
      clearRect: () => void (calls.clearRect += 1),
      beginPath: () => {},
      arc: () => void (calls.arc += 1),
      fill: () => void (calls.fill += 1),
      fillStyle: "",
      globalAlpha: 1,
    };
    contexts.push(ctx);
    return ctx;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  return contexts;
}

/** The context handed to the most recently mounted canvas. */
export function lastContext(contexts: FakeContext[]) {
  return contexts[contexts.length - 1];
}
