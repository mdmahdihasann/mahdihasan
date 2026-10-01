import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Page from "@/app/page";
import type { GitHubActivity } from "@/lib/server/github";

// The page reads GitHub on the server; the tests use a fixed year instead.
const FIXTURE = vi.hoisted<GitHubActivity>(() => ({
  username: "mdmahdihasann",
  total: 12,
  weeks: [
    Array.from({ length: 7 }, (_, d) => ({
      date: `2026-09-${String(20 + d).padStart(2, "0")}`,
      count: d % 3,
      level: (d % 3) as 0 | 1 | 2,
    })),
  ],
  longestStreak: 2,
  currentStreak: 1,
  busiest: { date: "2026-09-22", count: 2, level: 2 },
}));
vi.mock("@/lib/server/github", () => ({
  getGitHubActivity: vi.fn(async () => FIXTURE),
  usernameFromUrl: () => "mdmahdihasann",
}));

const renderPage = async () => render(await Page());

const sectionIds = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("main section"), (s) => s.id);

describe("Page", () => {
  it("renders the sections in order, with testimonials removed", async () => {
    const { container } = await renderPage();

    expect(sectionIds(container)).toEqual([
      "home",
      "about",
      "skills",
      "services",
      "projects",
      "github",
      "process",
      "experience",
      "numbers",
      "contact",
    ]);
  });

  it("has no testimonial markup left anywhere", async () => {
    const { container } = await renderPage();

    expect(container.querySelector("#testimonials")).toBeNull();
    expect(container.querySelector(".testi-stage")).toBeNull();
    expect(screen.queryByText(/testimonial/i)).toBeNull();
    expect(screen.queryByText(/client name/i)).toBeNull();
  });

  it("opens every panel with its icon and a level-2 title", async () => {
    const { container } = await renderPage();

    const panels = container.querySelectorAll("main section.panel");
    expect(panels).toHaveLength(9);
    panels.forEach((panel) => {
      expect(panel.querySelector("h2"), panel.id).not.toBeNull();
      expect(panel.querySelector(".panel-icon"), panel.id).not.toBeNull();
    });
  });

  it("has exactly one level-1 heading", async () => {
    await renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("gives keyboard visitors a skip link to the content", async () => {
    const { container } = await renderPage();

    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip).toHaveAttribute("href", "#main");
    expect(container.querySelector("main")).toHaveAttribute("id", "main");
  });

  it("labels every section by its own heading", async () => {
    const { container } = await renderPage();

    container.querySelectorAll("main section").forEach((section) => {
      const id = section.getAttribute("aria-labelledby");
      expect(id, `${section.id} is missing aria-labelledby`).toBeTruthy();
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  it("keeps the class-driven behaviour hooks mounted last", async () => {
    const { container } = await renderPage();

    // Interactions renders null but must come after the markup it queries.
    expect(container.querySelector(".to-top")).toBeInTheDocument();
    expect(container.querySelectorAll(".reveal, .reveal-scale").length)
      .toBeGreaterThan(10);
  });
});
