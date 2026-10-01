import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Page from "@/app/page";

const sectionIds = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("main section"), (s) => s.id);

describe("Page", () => {
  it("renders the sections in order, with testimonials removed", () => {
    const { container } = render(<Page />);

    expect(sectionIds(container)).toEqual([
      "home",
      "about",
      "skills",
      "services",
      "projects",
      "process",
      "experience",
      "numbers",
      "contact",
    ]);
  });

  it("has no testimonial markup left anywhere", () => {
    const { container } = render(<Page />);

    expect(container.querySelector("#testimonials")).toBeNull();
    expect(container.querySelector(".testi-stage")).toBeNull();
    expect(screen.queryByText(/testimonial/i)).toBeNull();
    expect(screen.queryByText(/client name/i)).toBeNull();
  });

  it("opens every panel with its icon and a level-2 title", () => {
    const { container } = render(<Page />);

    const panels = container.querySelectorAll("main section.panel");
    expect(panels).toHaveLength(8);
    panels.forEach((panel) => {
      expect(panel.querySelector("h2"), panel.id).not.toBeNull();
      expect(panel.querySelector(".panel-icon"), panel.id).not.toBeNull();
    });
  });

  it("has exactly one level-1 heading", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("gives keyboard visitors a skip link to the content", () => {
    const { container } = render(<Page />);

    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip).toHaveAttribute("href", "#main");
    expect(container.querySelector("main")).toHaveAttribute("id", "main");
  });

  it("labels every section by its own heading", () => {
    const { container } = render(<Page />);

    container.querySelectorAll("main section").forEach((section) => {
      const id = section.getAttribute("aria-labelledby");
      expect(id, `${section.id} is missing aria-labelledby`).toBeTruthy();
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  it("keeps the class-driven behaviour hooks mounted last", () => {
    const { container } = render(<Page />);

    // Interactions renders null but must come after the markup it queries.
    expect(container.querySelector(".to-top")).toBeInTheDocument();
    expect(container.querySelectorAll(".reveal, .reveal-scale").length)
      .toBeGreaterThan(10);
  });
});
