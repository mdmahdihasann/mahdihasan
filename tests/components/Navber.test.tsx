import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Navber, { NAV_LINKS } from "@/components/home/Navber";

const openMenu = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /open menu/i }));
  return user;
};

describe("Navber", () => {
  it("links to every section, and no longer to testimonials", () => {
    render(<Navber />);

    const hrefs = NAV_LINKS.map((link) => link.href);
    expect(hrefs).toEqual([
      "#about",
      "#skills",
      "#projects",
      "#experience",
      "#services",
      "#contact",
    ]);
    expect(hrefs).not.toContain("#testimonials");

    // Desktop list + mobile menu + the two CTAs both point at #contact.
    expect(screen.getAllByRole("link", { name: "Projects" })).toHaveLength(2);
  });

  it("keeps the closed mobile menu out of the accessibility tree", () => {
    const { container } = render(<Navber />);
    const menu = container.querySelector("#mobile-menu");

    expect(menu).not.toHaveClass("open");
    // Without `inert`, the off-screen links stay tabbable.
    expect(menu).toHaveAttribute("inert");
  });

  it("opens and closes on the burger, and locks the page while open", async () => {
    const { container } = render(<Navber />);
    const menu = container.querySelector("#mobile-menu");
    const user = await openMenu();

    expect(menu).toHaveClass("open");
    expect(menu).not.toHaveAttribute("inert");
    expect(document.body).toHaveClass("menu-open");
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await user.click(screen.getByRole("button", { name: /close menu/i }));

    expect(menu).not.toHaveClass("open");
    expect(document.body).not.toHaveClass("menu-open");
  });

  it("closes on Escape", async () => {
    const { container } = render(<Navber />);
    const menu = container.querySelector("#mobile-menu");
    const user = await openMenu();

    expect(menu).toHaveClass("open");

    await user.keyboard("{Escape}");

    expect(menu).not.toHaveClass("open");
    expect(document.body).not.toHaveClass("menu-open");
  });

  it("closes when a menu link is followed", async () => {
    const { container } = render(<Navber />);
    const menu = container.querySelector("#mobile-menu");
    const user = await openMenu();

    await user.click(
      screen.getAllByRole("link", { name: "Skills" })[1] ??
        screen.getByRole("link", { name: "Skills" }),
    );

    expect(menu).not.toHaveClass("open");
  });

  it("starts unscrolled with an empty progress bar", () => {
    const { container } = render(<Navber />);

    expect(container.querySelector("nav")).not.toHaveClass("scrolled");
    expect(
      container.querySelector<HTMLElement>(".nav-progress")?.style.getPropertyValue(
        "--progress",
      ),
    ).toBe("0");
  });
});
