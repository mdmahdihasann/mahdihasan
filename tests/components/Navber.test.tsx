import { render, screen, within } from "@testing-library/react";
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
      "#services",
      "#projects",
      "#process",
      "#experience",
      "#contact",
    ]);
    expect(hrefs).not.toContain("#testimonials");

    // Desktop list + mobile menu.
    expect(screen.getAllByRole("link", { name: "Projects" })).toHaveLength(2);
  });

  it("offers the CV as a download from both the bar and the menu", () => {
    render(<Navber />);

    const cv = screen.getAllByRole("link", { name: /download cv/i, hidden: true });
    expect(cv).toHaveLength(2);
    cv.forEach((link) => expect(link).toHaveAttribute("download"));
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

  it("starts unscrolled, with no reading-progress bar", () => {
    const { container } = render(<Navber />);

    expect(container.querySelector("nav")).not.toHaveClass("scrolled");
    expect(container.querySelector(".nav-progress")).toBeNull();
  });

  it("gives phones an app-style tab bar that starts on Home", () => {
    render(<Navber />);

    const bar = screen.getByRole("navigation", { name: /quick navigation/i });
    const tabs = within(bar).getAllByRole("link");
    expect(tabs.map((tab) => tab.getAttribute("href"))).toEqual([
      "#home",
      "#about",
      "#projects",
      "#contact",
    ]);
    expect(within(bar).getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(within(bar).getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });
});
