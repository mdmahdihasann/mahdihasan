# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build (also the only real typecheck; tsconfig is noEmit)
npm run start    # serve the production build
npm run lint     # bare `eslint` (flat config, eslint-config-next core-web-vitals + typescript)
npm test         # vitest run — the whole suite, once
npm run test:watch
```

Tests are Vitest + Testing Library in `tests/`, configured by `vitest.config.mts` (jsdom,
`vite-tsconfig-paths` for the `@/*` alias, no `globals` — every test imports what it uses).
`tests/setup.ts` installs the three browser APIs jsdom lacks and the app depends on:
`IntersectionObserver`, `matchMedia` and a canvas 2D context, each with a helper in
`tests/helpers/` so a test can drive it (`intersectAll()`, `setMatchMedia(true)`,
`installCanvas()`).

## What this project actually is

A one-page personal portfolio, **ported from a single-file vanilla site into the Next.js 16 App
Router**. The design's source of truth is `../portfoliotest/index(2).html` (1110 lines, outside this
repo and untracked): a `<style>` block (lines 9–507, copied verbatim into `app/globals.css`), the
markup (lines 517–733), and a `<script>` block (lines 735–1108). If a section's styling or behavior
looks unexplained, read the corresponding region of that file rather than inventing something.

`app/page.tsx` composes the whole site in section order: skip link → Background → Particles →
CoursorGlow → Navber → Hero → TechStrip → `.wrap.panels` (About, Skills, Services, Projects,
Process, Experience, Numbers, Contact) → Footer → BackToTop → Interactions.

The layout follows a Pinterest reference (pin 1096133996835958068) in this site's own palette:
everything after the hero is a framed `.panel` on one 12-column grid (`.panels`). About + Skills
("My Expertise") share a row, as do Experience ("My Journey") + Numbers; the rest run full width.
Each panel opens with `PanelHead` (icon tile + h2) — there are no eyebrow labels any more. The
reference's testimonials block is deliberately not reproduced (see Known gaps).

### Server/client split

Sections that only render markup and data are Server Components. Everything the original `<script>`
did is browser-only (`window`, `document`, `requestAnimationFrame`, `IntersectionObserver`, canvas),
so it lives in `"use client"` components and the hooks under `hooks/`, each with effect-based
setup and teardown:

| Behavior | Lives in |
| --- | --- |
| `.reveal` → `.in` on scroll (with sibling stagger), magnetic buttons + ripple, card spotlight | `Interactions.tsx` (renders `null`, kept **last** on the page so the DOM it queries exists) via `useReveal` / `useMagnetic` / `useSpotlight` |
| Drifting canvas starfield | `Particles.tsx` + `useParticles` |
| Cursor glow and eased dot | `CoursorGlow.tsx` + `useCursor` |
| Nav background, scroll-spy | `Navber.tsx` + `useScrollState` (one rAF-throttled listener) over the pure maths in `lib/scroll.ts` |
| Phone nav (≤960px): app-style bottom tab bar (Home / About / Work / Contact / Menu, lit tile slides via `--tab-i`), Menu sheet of every section, scrim, body scroll lock, Escape-to-close | `Navber.tsx` (React state, not class toggling). The top bar keeps only the logo and an icon-only CV button there. |
| Back-to-top button | `BackToTop.tsx` |
| Hero portrait parallax (`--px`/`--py`) and the typed "Websites / Web apps…" line | `HeroPortrait.tsx`, `RoleCycler.tsx` — the hero's load sequence itself is pure CSS keyframes |
| Stat count-up, skill tabs + bar fills | `StatCounter.tsx`, `Skills.tsx` (own observers; bars fill via `data-filled` — an attribute, because re-rendering `className` on a `.reveal` element wipes the `.in` that `useReveal` added and hides it) |
| Contact form (react-hook-form + zod, schema shared with the server in `lib/contactSchema.ts`, honeypot field) sent on two channels at once — FormSubmit email from the browser and Telegram via `app/api/contact/route.ts` | `Contact.tsx` + `lib/sendContact.ts` + `lib/server/telegram.ts` |
| Chat assistant (floating launcher, answers about Mahdi, sends hiring questions to email) | `ChatBot.tsx` → `app/api/chat/route.ts`: Claude when `ANTHROPIC_API_KEY` is set, else the free keyword engine `lib/chat/localReply.ts` (English/Banglish/Bangla); facts come from `lib/chat/knowledge.ts`, built from `data/*.ts` — projects deliberately excluded |

`useMagnetic` and `useSpotlight` bind by class name at mount, so markup added later (or rendered
conditionally) will not pick them up without re-running the hook.

`lib/motion.ts` exposes `prefersReducedMotion()` for one-shot checks inside effects; components that
need to *branch while rendering* use `hooks/useReducedMotion.ts` (`useSyncExternalStore`, server
snapshot `false`) so they stay hydration-safe and never call `setState` from an effect — the
`react-hooks/set-state-in-effect` lint rule fails the build otherwise.

Filenames carry typos that are load-bearing for imports: `Navber.tsx` (nav) and `CoursorGlow.tsx`.

### Content

The site is Mahdi Hasan's portfolio. Identity (name, role, contact details, résumé link, social
URLs) is single-sourced in `data/profile.ts` and read by the hero, nav, footer, contact card and
page metadata — change it there, never in the JSX. Skills, services and the experience/education
timeline are transcribed from `public/CV.png`, which is the résumé the Download Resume button serves.

### Known gaps

- **`data/projects.ts` is a placeholder.** The CV lists no projects, so those entries are invented
  and the file says so at the top. Do not present them as real work — replace them, and add `demo` /
  `repo` URLs, before the site ships. Until a project has a URL its card renders muted text rather
  than a link, so nothing pretends to be clickable.
- **The testimonials section was removed** (styles and nav entry; `Testimonials.tsx` and
  `data/testimonials.ts` are dead files) because the quotes were invented. If real quotes ever
  arrive, rebuild it as a panel with `PanelHead`.
- `data/process.ts` (the six-step work process) is written copy, not from the CV.
- Skill percentages in `data/skills.ts` and the counters in `data/stats.ts` are weightings, not
  measured numbers.
- The contact form emails `profile.email` through FormSubmit (`formsubmit.co/ajax/<email>`, no
  server or key). The **first** submission sends an activation email to that inbox; until its link
  is clicked, sends fail and the form offers a prefilled `mailto:` fallback. Changing
  `profile.email` needs a fresh activation.
  It also posts to `/api/contact`, which forwards to Telegram once `TELEGRAM_BOT_TOKEN` /
  `TELEGRAM_CHAT_ID` are set (answers 503 until then); a send counts as delivered if either
  channel succeeds. Env vars are documented in `.env.example`. Both API routes rate-limit per IP
  in memory (`lib/server/rateLimit.ts`), so the site needs a Node host, not a static export.
- `resumeUrl` points at the PNG résumé; swap it for a PDF export when there is one.
- `app/layout.tsx` sets no `metadataBase` and no OG image, because there is no domain yet; add both
  together when the site gets one.

## Styling

Two systems coexist deliberately:

1. **`app/globals.css` is hand-written plain CSS copied from the source page** — the real design
   system. The palette is lifted from `public/portrait.jpg`: `--bg` (#1a271e) is the photo's own
   backdrop, so the edge-masked portrait sits on the page with no seam — change one and you must
   change the other. `:root` holds `--sage`, `--khaki`, `--olive`, `--leaf` (with `--primary` /
   `--secondary` / `--accent` kept as aliases), `--bg`, `--text-1..3` and `--ease`, plus the vocabulary every `components/home/*` component uses:
   `.wrap` (page container), `.panel` + `.panel-head` (section frame), `.reveal` / `.reveal-scale`
   (animate in when JS adds `.in`), `.lift` (hover raise), `.spotlight` (pointer-tracked
   highlight), `.btn` / `.btn-sm`, `.magnetic`. Section styles are grouped by banner comments
   matching the section ids.
2. **Tailwind v4** (`@import "tailwindcss"`, PostCSS-only config, no `tailwind.config`) — used only
   for the few utilities on `<html>`/`<body>` in `app/layout.tsx`.

Spacing is fluid: section padding, gutters, grid gaps and section-head margins all use `clamp()`,
so nothing needs a per-breakpoint override to stay proportional. Keep new spacing on that pattern
rather than adding fixed pixel values with media queries.

Project cards get their artwork from `components/home/ProjectThumb.tsx` — inline SVG UI mockups
(`storefront`, `cms`, `dashboard`, `app`, `landing`, `portfolio`) painted in translucent white over
each card's own gradient, so there are no image files to ship. A project with a real screenshot sets
`image` in `data/projects.ts` and renders through `next/image` instead.

The three display faces load through `next/font/google` in `app/layout.tsx` and feed the
`--font-display` / `--font-body` / `--font-mono` tokens, which are declared *after* the Tailwind
import so they win. Note the `:root` block must stay below `@import "tailwindcss"` for that.

shadcn is configured (`components.json`, `base-nova` style on `@base-ui/react`) and
`components/ui/button.tsx` was generated, but **nothing imports it and its theme tokens are not
loaded** — the `@import "shadcn/tailwind.css"` line was removed because that path is not exported by
the `shadcn` package and broke the CSS build. Adding a shadcn component means bringing its tokens in
first.

Portfolio sections use the hand-written classes, not Tailwind utilities. Follow the existing class
vocabulary when adding markup; reach for Tailwind/shadcn only for genuinely new UI.

### One transform per element

**Nothing writes `element.style.transform`.** Every animated transform is composed in a single CSS
declaration out of custom properties, and the hooks only set those properties:

| Property | Set by | Effect |
| --- | --- | --- |
| `--rv-y`, `--rv-s` | `.reveal` / `.reveal.in` in CSS | scroll entrance |
| `--lift` | `.lift.in:hover` in CSS | hover raise |
| `--mag-x`, `--mag-y`, `--press` | `useMagnetic` + `:active` | magnetic buttons |
| `--mx`, `--my` | `useSpotlight` | paints a gradient, no transform at all |

This is deliberate. The previous `useTilt` hook assigned `style.transform` on `.project-card`,
`.service-card` and `.skill-cat` — the same property `.reveal` animates — so hovering a card before
it had revealed pinned it at `opacity: 0` forever. If you add a new hover or pointer effect, add a
custom property to the existing chain rather than a second `transform` declaration.

Classes named `.magnetic`, `.lift`, `.spotlight` and elements with `data-val` attributes are hooks
for script behavior (magnetic hover, hover raise, card spotlight, skill-bar fills) — preserve them
when converting markup, or port the behavior to React instead.

Layout notes worth keeping: `section` carries `scroll-margin-top: var(--nav-h)` so anchor links
don't land under the fixed nav; the card grids use `repeat(auto-fit, minmax(...))` rather than a
fixed column count; and `--text-3` is `#7c88a6` because the original `#6b7690` sat at 4.48:1 on
`--bg` and missed WCAG AA.

## Conventions

- Path alias `@/*` maps to the repo root (`@/components`, `@/lib/utils`, `@/hooks`).
- `cn()` in `lib/utils.ts` (clsx + tailwind-merge) is the only shared utility.
- Components are arrow functions with a default export, one section per file under `components/home/`.
- Content lives in `data/*.ts` as typed exported values (`profile`, `projects`, `skillGroups`,
  `services`, `experience`, `stats`, `process`) — edit those, not the JSX, to change what the site says.
- Keyframe names must not collide with Tailwind's (`ping`, `pulse`, `spin`, `bounce`): Tailwind's
  definition wins and silently replaces ours. The live-dot pulse is `livePing` for that reason.
- Icons: UI glyphs come from `lucide-react` (services, stats, contact rows, arrows); technology logos
  come from `simple-icons` path data, stored per skill as `mark` in `data/skills.ts` and drawn by
  `components/home/TechIcon.tsx` (logos stay sage until hovered, then take `--brand`). A skill with
  no logo uses `{ monogram: "…" }`. The scrolling strip under the hero (`TechStrip.tsx`) is
  `techStrip` from that file.
- `.glow-border` (animated conic edge) is deliberately on one card only — the contact form. Don't
  spread it.
- Declared but still unused: `framer-motion`, `emailjs-com`.
- There is no reading-progress bar any more — it was removed on request; don't bring it back.
- The background (`Background.tsx`) is four drifting radial-gradient pools (`.bg-aurora i`,
  transform-only loops) under the static light and grain. A grid overlay was tried and dropped as
  generic; don't re-add one.
