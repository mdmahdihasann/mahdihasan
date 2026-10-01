import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Hero from "@/components/home/Hero";
import { profile } from "@/data/profile";

describe("Hero", () => {
  it("takes its identity from the profile data, not hard-coded copy", () => {
    render(<Hero />);

    expect(screen.getByText(profile.name)).toBeInTheDocument();
    expect(screen.getByText(profile.availability)).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => el?.className === "hero-desc" && el.textContent!.includes(profile.tagline)),
    ).toBeInTheDocument();
  });

  it("types what he builds inside the headline, read once as a list", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", { level: 1, name: /I build websites, web apps, stores, dashboards/i }),
    ).toBeInTheDocument();
  });

  it("offers the calls to action and the résumé", () => {
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

  it("makes both buttons magnetic so the hook can find them", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll(".btn.magnetic")).toHaveLength(2);
  });

  it("labels its own section for the accessibility tree", () => {
    const { container } = render(<Hero />);

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "home");
    expect(section).toHaveAttribute("aria-labelledby", "hero-title");
    expect(container.querySelector("#hero-title")).toBeInTheDocument();
  });
});
