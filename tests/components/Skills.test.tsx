import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Skills from "@/components/home/Skills";
import { skillGroups } from "@/data/skills";
import { intersectAll } from "../helpers/intersectionObserver";
import { setMatchMedia } from "../helpers/matchMedia";

const allSkills = skillGroups.flatMap((group) => group.items);

describe("Skills", () => {
  it("offers one tab per group, the first one selected", () => {
    render(<Skills />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(
      skillGroups.map((group) => group.cat),
    );
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("meter")).toHaveLength(skillGroups[0].items.length);
  });

  it("keeps every group's bars in the DOM, hiding the inactive ones", () => {
    render(<Skills />);

    expect(screen.getAllByRole("meter", { hidden: true })).toHaveLength(
      allSkills.length,
    );
  });

  it("switches groups on click and with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Skills />);

    await user.click(screen.getByRole("tab", { name: skillGroups[2].cat }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      skillGroups[2].items[0].name,
    );

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: skillGroups[3].cat })).toHaveFocus();
    expect(screen.getByRole("tab", { name: skillGroups[3].cat })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("exposes each bar's level to assistive tech", () => {
    render(<Skills />);

    const first = allSkills[0];
    expect(screen.getByRole("meter", { name: first.name })).toHaveAttribute(
      "aria-valuenow",
      String(first.level),
    );
  });

  it("gives each bar its real width, and fills them once in view", () => {
    const { container } = render(<Skills />);
    const section = container.querySelector("section")!;

    const bars = container.querySelectorAll<HTMLElement>(".skill-fill");
    bars.forEach((bar, i) => expect(bar.style.width).toBe(`${allSkills[i].level}%`));
    expect(section).not.toHaveAttribute("data-filled");

    act(() => intersectAll());
    expect(section).toHaveAttribute("data-filled");
  });

  it("never rewrites its class list, so the reveal's .in survives filling", () => {
    const { container } = render(<Skills />);
    const section = container.querySelector("section")!;

    section.classList.add("in");
    act(() => intersectAll());
    expect(section).toHaveClass("in");
  });

  it("still fills under reduced motion", () => {
    setMatchMedia(true);
    const { container } = render(<Skills />);

    act(() => intersectAll());
    expect(container.querySelector("section")).toHaveAttribute("data-filled");
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
