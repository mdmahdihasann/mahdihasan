import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Projects, { ProjectLink } from "@/components/home/Projects";
import { projects } from "@/data/projects";

describe("ProjectLink", () => {
  it("renders a real anchor that opens safely in a new tab", () => {
    render(
      <ProjectLink href="https://example.com" icon="↗" label="Live Demo" />,
    );

    const link = screen.getByRole("link", { name: /live demo/i });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders muted text — not a link — when there is no URL", () => {
    render(<ProjectLink icon="⌥" label="GitHub" />);

    // The old markup used href="#projects" here, which looked clickable but
    // only scrolled back to the grid the visitor was already reading.
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(/github/i)).toHaveClass("muted");
  });
});

describe("Projects", () => {
  it("renders one card per project", () => {
    render(<Projects />);

    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
    projects.forEach((project) => {
      expect(
        screen.getByRole("heading", { name: project.name }),
      ).toBeInTheDocument();
    });
  });

  it("lists each project's tech stack", () => {
    render(<Projects />);

    const first = screen.getAllByRole("article")[0];
    projects[0].tech.forEach((tech) => {
      expect(within(first).getByText(tech)).toBeInTheDocument();
    });
  });

  it("never emits a link that points back at its own section", () => {
    render(<Projects />);

    screen
      .queryAllByRole("link")
      .forEach((link) =>
        expect(link).not.toHaveAttribute("href", "#projects"),
      );
  });
});

describe("projects data", () => {
  it("gives every entry a name, description and at least one tech tag", () => {
    projects.forEach((project) => {
      expect(project.name.trim()).not.toBe("");
      expect(project.desc.trim()).not.toBe("");
      expect(project.tech.length).toBeGreaterThan(0);
    });
  });

  it("has no duplicate names, since the name is the React key", () => {
    const names = projects.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
