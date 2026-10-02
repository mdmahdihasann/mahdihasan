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
import { btn, liveDot } from "@/lib/ui";
import { cn } from "@/lib/utils";

import Logo from "./Logo";

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

/** A tab-bar button: lit when current (or, for Menu, when its sheet is open). */
const tab =
  "relative z-1 flex min-h-[54px] flex-col items-center justify-center gap-[3px] rounded-[18px] font-body text-[11px] font-semibold tracking-[.01em] text-fg-3 transition-colors duration-300 ease-smooth [-webkit-tap-highlight-color:transparent] focus-visible:rounded-[18px] focus-visible:-outline-offset-2 " +
  "[&_svg]:transition-[translate,scale] [&_svg]:duration-400 [&_svg]:ease-spring active:[&_svg]:scale-[.86] active:[&_svg]:duration-100 " +
  "aria-[current=true]:text-khaki aria-[current=true]:[&_svg]:-translate-y-px aria-[current=true]:[&_svg]:scale-110 aria-expanded:text-khaki aria-expanded:[&_svg]:-translate-y-px aria-expanded:[&_svg]:scale-110";

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
      <nav
        id="nav"
        className={cn(
          "fixed inset-x-0 top-0 z-100 border-b border-transparent transition-[background-color,backdrop-filter,border-color] duration-300",
          scrolled && "scrolled border-line bg-bg-deep/72 backdrop-blur-lg",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-[clamp(20px,4vw,32px)] transition-[padding] duration-300 ease-smooth",
            scrolled ? "py-3" : "py-[18px]",
          )}
        >
          <Logo />

          {/* Below 960px the tab bar takes over. */}
          <ul className="flex gap-1 rounded-full border border-line bg-bg-deep/45 p-1 text-[14px] text-fg-2 max-[960px]:hidden">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isActive(href) ? "true" : undefined}
                  // Scroll-spy: the section currently in view gets the lit pill.
                  className="block rounded-full px-[clamp(10px,1.1vw,15px)] py-[7px] transition-[color,background-color] duration-[250ms] hover:text-fg-1 aria-[current=true]:bg-sage/14 aria-[current=true]:text-fg-1 aria-[current=true]:shadow-[inset_0_0_0_1px_rgba(169,198,162,.28),0_0_18px_-4px_rgba(169,198,162,.45)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2.5 rounded-xl border border-line-strong bg-bg-deep/45 py-[9px] pr-2.5 pl-3 text-fg-2 transition-[border-color,color,background-color] duration-300 hover:border-sage hover:bg-sage/7 hover:text-fg-1 max-[960px]:rounded-[13px] max-[960px]:p-2.5"
              aria-label="Search the site"
              aria-keyshortcuts="Control+K Meta+K"
              onClick={() => emit(OPEN_PALETTE)}
            >
              <Search size={15} aria-hidden />
              <kbd className="max-[960px]:hidden" aria-hidden>{modKey} K</kbd>
            </button>
            <a
              href={profile.resumeUrl}
              download
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-khaki/35 px-4 py-[9px] font-body text-[14px] font-semibold text-fg-1 transition-[border-color,box-shadow,background-color] duration-300 hover:border-khaki hover:bg-khaki/7 hover:shadow-[0_10px_26px_-12px_rgba(217,210,163,.45)] max-[960px]:rounded-[13px] max-[960px]:bg-bg-deep/45 max-[960px]:p-2.5"
            >
              <Download size={15} className="text-khaki" aria-hidden />
              {/* Icon-only on phones. */}
              <span className="max-[960px]:sr-only">Download CV</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Phone-only: an app-style tab bar pinned to the bottom of the screen. */}
      <nav
        className="pointer-events-none fixed inset-x-0 bottom-0 z-105 hidden animate-tabbar-in px-3 pb-[calc(10px_+_env(safe-area-inset-bottom))] max-[960px]:block"
        aria-label="Quick navigation"
      >
        <div
          className="pointer-events-auto relative mx-auto grid max-w-[460px] grid-cols-5 rounded-3xl border border-sage/18 bg-[rgba(22,34,27,.84)] p-1.5 shadow-[0_20px_40px_-14px_rgba(0,0,0,.75),inset_0_1px_0_rgba(238,240,228,.07)] backdrop-blur-[18px] backdrop-saturate-150"
          style={{ "--tab-i": tabIndex } as React.CSSProperties}
        >
          {/* The lit tile slides between tabs on one transform, driven by --tab-i. */}
          <span
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%_-_12px)/5)] translate-x-[calc(var(--tab-i,0)*100%)] rounded-[18px] bg-[linear-gradient(180deg,rgba(217,210,163,.16),rgba(217,210,163,.06))] shadow-[inset_0_0_0_1px_rgba(217,210,163,.24),0_8px_20px_-10px_rgba(217,210,163,.45)] transition-transform duration-500 ease-spring before:absolute before:top-0 before:left-1/2 before:-ml-[9px] before:h-[3px] before:w-[18px] before:rounded-b-[3px] before:bg-khaki before:shadow-[0_2px_10px_rgba(217,210,163,.7)]"
            aria-hidden
          />
          {TABS.map(({ href, label, icon: Icon }, i) => (
            <a
              key={href}
              href={href}
              className={tab}
              aria-current={!menuOpen && i === tabIndex ? "true" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={21} strokeWidth={1.9} aria-hidden />
              <span>{label}</span>
            </a>
          ))}
          <button
            type="button"
            className={tab}
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
        className={cn(
          "fixed inset-0 z-101 hidden bg-[rgba(9,14,11,.6)] backdrop-blur-[6px] transition-[opacity,visibility] duration-[350ms] ease-smooth max-[960px]:block",
          menuOpen ? "open visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden
        onClick={() => setMenuOpen(false)}
      />

      <div
        id="mobile-menu"
        className={cn(
          "group/menu fixed inset-x-3 bottom-[calc(86px_+_env(safe-area-inset-bottom))] z-102 mx-auto hidden max-w-[460px] origin-bottom rounded-[26px] border border-sage/20 px-4 pt-2 pb-4 max-[960px]:block",
          "bg-[radial-gradient(120%_70%_at_50%_0%,rgba(169,198,162,.12),transparent_60%),linear-gradient(180deg,#22342b,#17231c)] shadow-[0_34px_70px_-24px_rgba(0,0,0,.85),inset_0_1px_0_rgba(238,240,228,.07)]",
          "transition-[translate,scale,opacity,visibility]",
          menuOpen
            ? "open visible translate-y-0 scale-100 opacity-100 duration-500 ease-spring"
            : "invisible translate-y-7 scale-94 opacity-0 duration-[350ms] ease-smooth",
        )}
        role="dialog"
        aria-modal={menuOpen || undefined}
        aria-label="Site menu"
        // Keeps the closed menu out of the tab order and the accessibility tree.
        inert={!menuOpen}
      >
        <span className="mx-auto mb-3 block h-1 w-[38px] rounded bg-fg-1/18" aria-hidden />
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <Logo decorative className="text-[19px]" />
          <span className="inline-flex items-center gap-[7px] rounded-full border border-sage/20 bg-sage/8 py-[5px] pr-[11px] pl-[9px] text-[12px] font-medium text-fg-2">
            <span className={liveDot} aria-hidden />
            {profile.availability}
          </span>
        </div>

        <ul className="grid grid-cols-4 gap-1.5">
          {NAV_LINKS.map(({ href, label, icon: Icon }, i) => (
            <li
              key={href}
              // Tiles rise in one after another as the sheet opens.
              className="translate-y-2.5 opacity-0 transition-[opacity,translate] duration-200 ease-smooth group-[.open]/menu:translate-y-0 group-[.open]/menu:opacity-100 group-[.open]/menu:delay-[calc(60ms_+_var(--i,0)*32ms)] group-[.open]/menu:duration-500 group-[.open]/menu:ease-spring"
              style={{ "--i": i } as React.CSSProperties}
            >
              <a
                href={href}
                aria-current={isActive(href) ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
                className="group/item flex flex-col items-center gap-[7px] rounded-2xl px-0.5 py-2.5 text-center text-[12px] font-semibold text-fg-2 transition-colors duration-[250ms] [-webkit-tap-highlight-color:transparent] aria-[current=true]:text-fg-1"
              >
                <span
                  className="flex size-[50px] items-center justify-center rounded-2xl border border-sage/18 bg-[linear-gradient(160deg,rgba(169,198,162,.14),rgba(169,198,162,.04))] text-sage shadow-[inset_0_1px_0_rgba(238,240,228,.06)] transition-[color,background-color,border-color,scale] duration-300 ease-smooth group-active/item:scale-90 group-aria-[current=true]/item:border-khaki group-aria-[current=true]/item:bg-khaki group-aria-[current=true]/item:bg-none group-aria-[current=true]/item:text-ink group-aria-[current=true]/item:shadow-[0_10px_22px_-10px_rgba(217,210,163,.7)]"
                  aria-hidden
                >
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
          className={btn("primary", "md", "mt-3.5 w-full rounded-[14px]")}
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
