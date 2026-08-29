import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Hero from "@/components/home/Hero";
import { profile } from "@/data/profile";

describe("Hero", () => {
  it("takes its identity from the profile data, not hard-coded copy", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", { level: 1, name: new RegExp(profile.name) }),
    ).toBeInTheDocument();
    expect(screen.getByText(profile.role)).toBeInTheDocument();
    expect(screen.getByText(profile.tagline)).toBeInTheDocument();
  });

  it("offers the three calls to action", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "View Projects" })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: "Contact Me" })).toHaveAttribute(
      "href",
      "#contact",
    );

    const resume = screen.getByRole("link", { name: "Download Resume" });
    expect(resume).toHaveAttribute("href", profile.resumeUrl);
    expect(resume).toHaveAttribute("download");
  });

  it("makes all three buttons magnetic so the hook can find them", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll(".btn.magnetic")).toHaveLength(3);
  });

  it("labels its own section for the accessibility tree", () => {
    const { container } = render(<Hero />);

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "home");
    expect(section).toHaveAttribute("aria-labelledby", "hero-title");
    expect(container.querySelector("#hero-title")).toBeInTheDocument();
  });
});
