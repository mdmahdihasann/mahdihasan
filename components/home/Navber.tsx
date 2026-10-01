"use client";

import {
  BriefcaseBusiness,
  Download,
  FolderKanban,
  House,
  LayoutGrid,
  Layers,
  Mail,
  Route,
  Search,
  Sparkles,
  UserRound,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { useScrollState } from "@/hooks/useScrollState";
import { profile } from "@/data/profile";
import { emit, OPEN_PALETTE } from "@/lib/events";

const noSubscribe = () => () => {};
/** Apple keyboards say ⌘; the server can't know, so it renders Ctrl. */
const useModKey = () =>
  useSyncExternalStore(
    noSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );

export const NAV_LINKS = [
  { href: "#about", label: "About", icon: UserRound },
  { href: "#skills", label: "Skills", icon: Sparkles },
  { href: "#services", label: "Services", icon: Layers },
  { href: "#projects", label: "Projects", icon: FolderKanban },
  { href: "#process", label: "Process", icon: Workflow },
  { href: "#experience", label: "Journey", icon: Route },
  { href: "#contact", label: "Contact", icon: Mail },
] as const satisfies readonly { href: string; label: string; icon: LucideIcon }[];

/** Module scope so the array identity stays stable across renders. */
const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

/**
 * The phone tab bar: four destinations plus the menu. Each tab owns the
 * sections that belong to it, so the lit tab follows the reader through the
 * page instead of going dark between its anchors.
 */
const TABS: { href: string; label: string; icon: LucideIcon; owns: (string | null)[] }[] = [
  { href: "#home", label: "Home", icon: House, owns: [null] },
  { href: "#about", label: "About", icon: UserRound, owns: ["about", "skills", "experience"] },
  { href: "#projects", label: "Work", icon: BriefcaseBusiness, owns: ["services", "projects", "process"] },
  { href: "#contact", label: "Contact", icon: Mail, owns: ["contact"] },
];

const Navber = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, active } = useScrollState(SECTION_IDS);
  const modKey = useModKey();

  // Lock the page behind the menu sheet, and let Escape close it.
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
  // The menu tab takes the light while its sheet is open.
  const tabIndex = menuOpen
    ? TABS.length
    : Math.max(0, TABS.findIndex((tab) => tab.owns.includes(active)));

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

          <div className="nav-actions">
            <button
              type="button"
              className="nav-search"
              aria-label="Search the site"
              aria-keyshortcuts="Control+K Meta+K"
              onClick={() => emit(OPEN_PALETTE)}
            >
              <Search size={15} aria-hidden />
              <kbd aria-hidden>{modKey} K</kbd>
            </button>
            <a href={profile.resumeUrl} download className="nav-cta">
              <Download size={15} aria-hidden />
              <span className="nav-cta-label">Download CV</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Phone-only: an app-style tab bar pinned to the bottom of the screen. */}
      <nav className="tabbar" aria-label="Quick navigation">
        <div
          className="tabbar-inner"
          style={{ "--tab-i": tabIndex } as React.CSSProperties}
        >
          <span className="tabbar-light" aria-hidden />
          {TABS.map(({ href, label, icon: Icon }, i) => (
            <a
              key={href}
              href={href}
              className="tab"
              aria-current={!menuOpen && i === tabIndex ? "true" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={21} strokeWidth={1.9} aria-hidden />
              <span>{label}</span>
            </a>
          ))}
          <button
            type="button"
            className="tab"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={21} strokeWidth={1.9} aria-hidden />
            ) : (
              <LayoutGrid size={21} strokeWidth={1.9} aria-hidden />
            )}
            <span aria-hidden>Menu</span>
          </button>
        </div>
      </nav>

      <div
        className={`sheet-scrim${menuOpen ? " open" : ""}`}
        aria-hidden
        onClick={() => setMenuOpen(false)}
      />

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal={menuOpen || undefined}
        aria-label="Site menu"
        // Keeps the closed menu out of the tab order and the accessibility tree.
        inert={!menuOpen}
      >
        <span className="sheet-grabber" aria-hidden />
        <div className="sheet-head">
          <span className="logo" aria-hidden>
            {profile.logo.text}
            <span>{profile.logo.accent}</span>
          </span>
          <span className="sheet-status">{profile.availability}</span>
        </div>

        <ul className="sheet-grid">
          {NAV_LINKS.map(({ href, label, icon: Icon }, i) => (
            <li key={href} style={{ "--i": i } as React.CSSProperties}>
              <a
                href={href}
                aria-current={isActive(href) ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="sheet-ic" aria-hidden>
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.resumeUrl}
          download
          className="btn btn-primary sheet-cta"
          onClick={() => setMenuOpen(false)}
        >
          <Download size={16} aria-hidden />
          Download CV
        </a>
      </div>
    </>
  );
};

export default Navber;
