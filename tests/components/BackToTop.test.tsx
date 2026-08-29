import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BackToTop, { SHOW_AFTER_PX } from "@/components/home/BackToTop";
import { setMatchMedia } from "../helpers/matchMedia";

const scrollTo = (y: number) => {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  act(() => {
    fireEvent.scroll(window);
  });
};

describe("BackToTop", () => {
  it("stays hidden and untabbable near the top of the page", () => {
    render(<BackToTop />);

    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button).not.toHaveClass("show");
    expect(button).toHaveAttribute("tabindex", "-1");
  });

  it("appears once the visitor has scrolled past the threshold", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });

    scrollTo(SHOW_AFTER_PX + 1);

    expect(button).toHaveClass("show");
    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("scrolls smoothly back to the top", () => {
    const spy = vi.fn();
    window.scrollTo = spy as unknown as typeof window.scrollTo;
    render(<BackToTop />);

    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));

    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("jumps instead of scrolling under reduced motion", () => {
    setMatchMedia(true);
    const spy = vi.fn();
    window.scrollTo = spy as unknown as typeof window.scrollTo;
    render(<BackToTop />);

    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));

    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
