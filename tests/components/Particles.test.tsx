import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Particles from "@/components/home/Particles";
import { installCanvas, lastContext } from "../helpers/canvas";
import { setMatchMedia } from "../helpers/matchMedia";

describe("Particles", () => {
  it("paints one dot per particle on the first frame", () => {
    const contexts = installCanvas();
    render(<Particles />);

    const ctx = lastContext(contexts);
    expect(ctx.calls.clearRect).toBe(1);
    // The hook's default count.
    expect(ctx.calls.arc).toBe(70);
    expect(ctx.calls.fill).toBe(70);
  });

  it("sizes the canvas to the viewport", () => {
    const { container } = render(<Particles />);

    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("draws a single static frame under reduced motion", () => {
    setMatchMedia(true);
    const contexts = installCanvas();
    render(<Particles />);

    // One pass and no animation loop — the starfield is there but frozen.
    expect(lastContext(contexts).calls.clearRect).toBe(1);
  });
});
