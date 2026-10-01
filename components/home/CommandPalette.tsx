"use client";

import {
  ArrowRight,
  Copy,
  CornerDownLeft,
  Download,
  GitCommitHorizontal,
  House,
  Mail,
  MessageCircle,
  Phone,
  Search,
  SquareArrowOutUpRight,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { profile } from "@/data/profile";
import { prefersReducedMotion } from "@/lib/motion";
import { emit, OPEN_CHAT, OPEN_PALETTE } from "@/lib/events";

import { NAV_LINKS } from "./Navber";

type Command = {
  id: string;
  group: "Go to" | "Actions" | "Elsewhere";
  label: string;
  icon: LucideIcon;
  /** Extra words the filter matches on, never shown. */
  keywords?: string;
  hint?: string;
  run: () => void | "keep-open";
};

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
};

const openUrl = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

/** Lower is better; -1 means no match. Prefix hits beat word hits beat loose ones. */
function score(cmd: Command, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const label = cmd.label.toLowerCase();
  if (label.startsWith(q)) return 0;
  if (label.split(/\s+/).some((w) => w.startsWith(q))) return 1;
  const hay = `${label} ${cmd.keywords ?? ""} ${cmd.group}`.toLowerCase();
  if (hay.includes(q)) return 2;
  // Every typed letter appears in order: "dcv" → "Download CV".
  let at = 0;
  for (const ch of q.replace(/\s+/g, "")) {
    at = hay.indexOf(ch, at);
    if (at === -1) return -1;
    at += 1;
  }
  return 3;
}

const GROUPS: Command["group"][] = ["Go to", "Actions", "Elsewhere"];

/**
 * Ctrl/⌘ + K anywhere (or the search button in the nav) opens a filterable
 * list of every section and every quick action on the site. Arrow keys move,
 * Enter runs, Escape closes and hands focus back where it was.
 */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const uid = useId();

  const commands = useMemo<Command[]>(
    () => [
      { id: "home", group: "Go to", label: "Home", icon: House, keywords: "top hero start", run: () => scrollToId("home") },
      ...NAV_LINKS.map(({ href, label, icon }) => ({
        id: href.slice(1),
        group: "Go to" as const,
        label,
        icon,
        run: () => scrollToId(href.slice(1)),
      })),
      { id: "github", group: "Go to", label: "GitHub activity", icon: GitCommitHorizontal, keywords: "contributions code commits repos", run: () => scrollToId("github") },
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        icon: Copy,
        keywords: profile.email,
        hint: profile.email,
        run: () => {
          void navigator.clipboard?.writeText(profile.email).then(() => setCopied(true));
          return "keep-open";
        },
      },
      { id: "email", group: "Actions", label: "Send an email", icon: Mail, keywords: "mail contact hire", run: () => { window.location.href = `mailto:${profile.email}`; } },
      { id: "call", group: "Actions", label: "Call Mahdi", icon: Phone, keywords: "phone number", hint: profile.phone, run: () => { window.location.href = `tel:${profile.phone}`; } },
      {
        id: "cv",
        group: "Actions",
        label: "Download CV",
        icon: Download,
        keywords: "resume",
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resumeUrl;
          a.download = "";
          a.click();
        },
      },
      { id: "chat", group: "Actions", label: "Ask the assistant", icon: MessageCircle, keywords: "chat bot question ai", run: () => emit(OPEN_CHAT) },
      { id: "gh-profile", group: "Elsewhere", label: "GitHub profile", icon: SquareArrowOutUpRight, keywords: "code", run: () => openUrl(profile.socials.github) },
      { id: "linkedin", group: "Elsewhere", label: "LinkedIn", icon: SquareArrowOutUpRight, run: () => openUrl(profile.socials.linkedin) },
      { id: "facebook", group: "Elsewhere", label: "Facebook", icon: SquareArrowOutUpRight, run: () => openUrl(profile.socials.facebook) },
    ],
    [],
  );

  const results = useMemo(() => {
    const ranked = commands
      .map((cmd, order) => ({ cmd, order, s: score(cmd, query) }))
      .filter((r) => r.s >= 0);
    // Grouped as listed when browsing; best match first while typing.
    ranked.sort((a, b) =>
      query.trim()
        ? a.s - b.s || a.order - b.order
        : GROUPS.indexOf(a.cmd.group) - GROUPS.indexOf(b.cmd.group) || a.order - b.order,
    );
    return ranked.map((r) => r.cmd);
  }, [commands, query]);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setCopied(false);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.({ preventScroll: true });
  }, []);

  // Global shortcut plus the nav button's event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, show);
    };
  }, [open, show, close]);

  // Lock the page and put the caret in the box while open.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("palette-open");
    inputRef.current?.focus();
    return () => document.body.classList.remove("palette-open");
  }, [open]);

  // Keep the highlighted row in view as the arrows move it.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (cmd: Command | undefined) => {
    if (!cmd) return;
    if (cmd.run() === "keep-open") return;
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = results.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i >= last ? 0 : i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? last : i - 1));
    } else if (e.key === "Home" && e.ctrlKey) {
      setActive(0);
    } else if (e.key === "End" && e.ctrlKey) {
      setActive(last);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // The search box is the dialog's only stop; Tab stays inside.
      e.preventDefault();
    }
  };

  const optionId = (i: number) => `${uid}-opt-${i}`;
  const browsing = !query.trim();

  return (
    <div className={`palette${open ? " open" : ""}`} inert={!open}>
      <div className="palette-scrim" aria-hidden onClick={close} />
      <div
        className="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onKeyDown={onKeyDown}
      >
        <div className="palette-search">
          <Search size={18} aria-hidden />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-activedescendant={results.length ? optionId(active) : undefined}
            aria-autocomplete="list"
            placeholder="Jump to a section or run an action…"
            spellCheck={false}
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setCopied(false);
            }}
          />
          <kbd>Esc</kbd>
        </div>

        <ul className="palette-list" id={`${uid}-list`} role="listbox" aria-label="Commands" ref={listRef}>
          {results.length === 0 && (
            <li className="palette-empty" role="presentation">
              Nothing matches &ldquo;{query.trim()}&rdquo;. Try &ldquo;contact&rdquo; or &ldquo;cv&rdquo;.
            </li>
          )}
          {results.map((cmd, i) => {
            const heading =
              browsing && (i === 0 || results[i - 1].group !== cmd.group) ? cmd.group : null;
            const Icon = cmd.icon;
            const isCopy = cmd.id === "copy-email" && copied;
            return (
              <li key={cmd.id} role="presentation">
                {heading && (
                  <div className="palette-group" role="presentation">
                    {heading}
                  </div>
                )}
                <div
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  className="palette-item"
                  onMouseMove={() => i !== active && setActive(i)}
                  onClick={() => run(cmd)}
                >
                  <span className="palette-ic" aria-hidden>
                    <Icon size={16} strokeWidth={1.9} />
                  </span>
                  <span className="palette-label">{isCopy ? "Email copied" : cmd.label}</span>
                  {cmd.hint && !isCopy && <span className="palette-hint">{cmd.hint}</span>}
                  {i === active && (
                    <span className="palette-go" aria-hidden>
                      {cmd.group === "Go to" ? <ArrowRight size={15} /> : <CornerDownLeft size={15} />}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="palette-foot" aria-hidden>
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
