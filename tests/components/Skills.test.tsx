import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Skills from "@/components/home/Skills";
import { skillGroups } from "@/data/skills";
import { intersectAll } from "../helpers/intersectionObserver";
import { setMatchMedia } from "../helpers/matchMedia";

const allSkills = skillGroups.flatMap((group) => group.items);

describe("Skills", () => {
  it("renders every group and every skill from the data", () => {
    render(<Skills />);

    skillGroups.forEach((group) => {
      expect(
        screen.getByRole("heading", { name: group.cat }),
      ).toBeInTheDocument();
    });
    expect(screen.getAllByRole("meter")).toHaveLength(allSkills.length);
  });

  it("exposes each bar's level to assistive tech", () => {
    render(<Skills />);

    const first = allSkills[0];
    expect(screen.getByRole("meter", { name: first.name })).toHaveAttribute(
      "aria-valuenow",
      String(first.level),
    );
  });

  it("leaves the bars empty until the card scrolls into view", () => {
    const { container } = render(<Skills />);

    container
      .querySelectorAll<HTMLElement>(".skill-fill")
      .forEach((bar) => expect(bar.style.width).toBe(""));
  });

  it("fills each bar to its own level on intersection", () => {
    const { container } = render(<Skills />);

    act(() => intersectAll());

    const bars = container.querySelectorAll<HTMLElement>(".skill-fill");
    bars.forEach((bar, i) => {
      expect(bar.style.width).toBe(`${allSkills[i].level}%`);
    });
  });

  it("fills the bars immediately under reduced motion", () => {
    setMatchMedia(true);
    const { container } = render(<Skills />);

    // No intersection: an observer would never fire for someone who has
    // animation turned off, so the bars have to be filled up front.
    const bars = container.querySelectorAll<HTMLElement>(".skill-fill");
    expect(bars[0].style.width).toBe(`${allSkills[0].level}%`);
  });
});

describe("skills data", () => {
  it("keeps every level within 0–100", () => {
    allSkills.forEach((skill) => {
      expect(skill.level).toBeGreaterThan(0);
      expect(skill.level).toBeLessThanOrEqual(100);
    });
  });

  it("has no duplicate skill names inside a group", () => {
    skillGroups.forEach((group) => {
      const names = group.items.map((item) => item.name);
      expect(new Set(names).size).toBe(names.length);
    });
  });
});
