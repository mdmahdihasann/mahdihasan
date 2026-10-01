import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Timeline from "@/components/home/Timeline";
import Socials from "@/components/home/Socials";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";

describe("Timeline", () => {
  it("renders the career history as an ordered list", () => {
    render(<Timeline />);

    expect(screen.getAllByRole("listitem")).toHaveLength(experience.length);
    experience.forEach((entry) => {
      expect(
        screen.getByRole("heading", { name: entry.role }),
      ).toBeInTheDocument();
    });
  });

  it("marks only the first entry as the current role", () => {
    const { container } = render(<Timeline />);

    expect(screen.getByText("Current role")).toHaveClass("tl-chip", "current");
    expect(container.querySelectorAll(".tl-chip.current")).toHaveLength(1);
    expect(container.querySelectorAll(".tl-item.current")).toHaveLength(1);
  });

  it("says whether each remaining entry is work or study", () => {
    const { container } = render(<Timeline />);

    const chips = Array.from(container.querySelectorAll(".tl-chip"), (chip) =>
      chip.textContent?.trim(),
    );
    // The current role's chip says so instead of repeating "Work".
    expect(chips).toEqual(["Current role", "Education", "Education"]);
    expect(container.querySelectorAll(".tl-item.education")).toHaveLength(
      experience.filter((entry) => entry.kind === "education").length,
    );
  });
});

describe("Socials", () => {
  it("opens the web profiles in a new tab", () => {
    render(<Socials />);

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", profile.socials.github);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("keeps the mailto link in the same tab", () => {
    render(<Socials />);

    const email = screen.getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", `mailto:${profile.email}`);
    // Opening a mail client in a blank tab leaves an empty window behind.
    expect(email).not.toHaveAttribute("target");
  });

  it("shrinks in compact mode for the footer", () => {
    const { container } = render(<Socials compact />);
    expect(container.querySelector(".social-row")).toHaveClass("compact");
  });
});

describe("profile socials", () => {
  it("points at real profiles, not bare site roots", () => {
    Object.entries(profile.socials).forEach(([network, url]) => {
      expect(url, network).toMatch(/^https:\/\//);
      // "https://github.com/" on its own is the placeholder this replaced.
      expect(new URL(url).pathname, network).not.toBe("/");
    });
  });
});
