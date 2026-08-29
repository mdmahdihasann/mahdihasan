"use client";

import { useEffect, useState } from "react";

import { useScrollState } from "@/hooks/useScrollState";
import { profile } from "@/data/profile";

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;

/** Module scope so the array identity stays stable across renders. */
const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

const Navber = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, progress, active } = useScrollState(SECTION_IDS);

  // Lock the page behind the full-screen menu, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;

    document.body.classList.add("menu-open");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href: string) => active === href.slice(1);

  return (
    <>
      <nav id="nav" className={scrolled ? "scrolled" : undefined}>
        <div className="nav-inner">
          <a href="#home" className="logo" aria-label={`${profile.name}, home`}>
            {profile.logo.text}
            <span>{profile.logo.accent}</span>
          </a>

          <ul className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isActive(href) ? "true" : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <a href="#contact" className="nav-cta">
            Let&apos;s talk →
          </a>

          <button
            type="button"
            className={`burger${menuOpen ? " open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          className="nav-progress"
          aria-hidden
          style={{ "--progress": progress } as React.CSSProperties}
        />
      </nav>

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        // Keeps the closed menu out of the tab order and the accessibility tree.
        inert={!menuOpen}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            aria-current={isActive(href) ? "true" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>
          Let&apos;s talk →
        </a>
      </div>
    </>
  );
};

export default Navber;
