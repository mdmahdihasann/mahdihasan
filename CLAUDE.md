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
repo and untracked): a `<style>` block (lines 9–507, originally copied into `app/globals.css`, since converted to
Tailwind utilities), the
markup (lines 517–733), and a `<script>` block (lines 735–1108). If a section's styling or behavior
looks unexplained, read the corresponding region of that file rather than inventing something.

`app/page.tsx` composes the whole site in section order: skip link → Background → Particles →
CoursorGlow → Navber → Hero → TechStrip → `.wrap.panels` (About, Skills, Services, Projects,
GitHubActivity, Process, Experience, Numbers, Contact) → Footer → BackToTop → ChatBot →
CommandPalette → Interactions. `Page` is `async`: it reads GitHub on the server (see below), so tests
render it with `render(await Page())` and mock `@/lib/server/github`.

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
| Command palette (Ctrl/⌘+K or the nav search button): every section plus quick actions (copy email, call, CV, open chat, socials), fuzzy filter, combobox/listbox keyboard model | `CommandPalette.tsx`. Islands talk through window events in `lib/events.ts` (`OPEN_PALETTE`, `OPEN_CHAT`, `PREFILL_CONTACT`) instead of shared state. |
| Project timeline estimator ("Plan Your Project") — **hidden on the owner's request**: not rendered in `app/page.tsx`, no palette entry, no link from Services. The component and its tests still exist; re-add `<Estimate />` after `<Numbers />` to bring it back. Timeline only, no prices. | `Estimate.tsx`, weightings in `data/estimate.ts`, maths in `lib/estimate.ts` |
| GitHub panel: contribution calendar (hover readout) and streaks — the "Recently pushed" repo list was removed on request, and the repo fetch with it | `GitHubActivity.tsx` (server) + `ContribGraph.tsx`; data from `lib/server/github.ts` — a keyless source, `fetch` with `next.revalidate` 6h (so `/` is ISR), and the panel renders nothing if GitHub can't be reached |
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
- The favicon (`app/icon.png`, 256px, round) and `app/apple-icon.png` (180px, square) are the
  whole of `public/portrait.jpg` scaled down — the owner wants the full photo, not a face crop;
  there is no `favicon.ico` any more.
- `resumeUrl` points at the PNG résumé; swap it for a PDF export when there is one.
- `app/layout.tsx` sets no `metadataBase` and no OG image, because there is no domain yet; add both
  together when the site gets one.

## Styling

**Everything is Tailwind v4** (`@import "tailwindcss"`, PostCSS-only config, no
`tailwind.config`). Each component styles itself with utilities in its own `className`; there are no
per-section stylesheets. `app/globals.css` holds only what utilities can't express:

1. **`@theme` tokens.** The palette is lifted from `public/portrait.jpg`: `bg` (#1a271e) is the
   photo's own backdrop. The hero shows `public/portrait-cutout.png` — the same photo with the
   backdrop removed (rembg, isnet-general-use) — so no photo background shows around him; regenerate
   it if `portrait.jpg` changes. `portrait.jpg` is still the icon and chat avatar. Colours: `bg`, `bg-deep`, `bg-elevated`, `sage`, `khaki`, `khaki-hi`,
   `olive`, `leaf`, `ink` (dark text on khaki), `fg-1..3` (text), `danger`, `card`, `line`,
   `line-strong` — so `text-fg-2`, `border-line`, `bg-sage/8` etc. Easing: `ease-smooth`,
   `ease-spring`. Fonts: `font-display` / `font-body` / `font-mono` (fed by `next/font` in
   `app/layout.tsx` through `@theme inline`). A few named animations (`animate-live-ping`,
   `animate-marquee`, …); one-off timings use `animate-[name_1s_var(--ease-smooth)_.7s_both]`.
2. **`@layer base`**: body, headings, the site-wide `:focus-visible` ring, `kbd`, the scrollbar,
   `section { scroll-margin-top }` and the reduced-motion kill switch.
3. **`@utility` classes** for script hooks and layered effects: `reveal` / `reveal-scale`, `lift`,
   `magnetic`, `ripple`, `spotlight` (all driven by hooks, see below), `panel` (section frame + rim
   sweep), `glow-border`, `aurora` / `grain` (background), `halo-light` / `halo-glow` /
   `portrait-cutout` (hero portrait), `text-palette` (the typed hero word), `process-rail` /
   `process-node`, `skill-fill`, `range-khaki`, `fade-edges-x`, `scrollbar-none`.
4. **All `@keyframes`.**

Shared class strings live in `lib/ui.ts`: `wrap` (page container), `btn(variant, size, extra)`,
`khakiTile`, `ringIcon`, `liveDot`, `hoverKhaki`, `floatingPane` and the panel `span` widths.
Keep shared strings there, not in a `"use client"` component module: a Server Component that imports
a plain string from a client module gets a client reference instead of the string (the hero chip
lost its surface that way once). `PanelHead.tsx` exports `panelLink` for a panel head's action slot.

Conventions inside the utilities:

- Breakpoints are the design's own, as `max-[600px]:`, `max-[900px]:`, `max-[960px]:` (phone nav),
  `max-[1100px]:` etc. Larger `max-*` variants are emitted first, so a smaller breakpoint always
  wins — a `max-[560px]` rule under a `max-[600px]` one would be dead.
- Animations that start when a panel scrolls in use the custom `revealed:` variant (any ancestor
  with `.in`); `useReveal` adds that class.
- State that tests or the menu read stays as a plain class or attribute (`open`, `scrolled`,
  `show`, `in`, `aria-current`, `data-filled`, `data-level`) and is styled through `group-[.open]/…:`,
  `aria-[current=true]:` or `data-[…]:` variants. Tests select by `data-slot` / `data-*`
  attributes, never by utility classes.
- Write spaces inside arbitrary `calc()` as underscores: `pt-[calc(var(--nav-h)_+_28px)]`.
- Arbitrary colours use the tokens with an opacity modifier (`bg-khaki/8`) rather than raw `rgba`,
  except inside gradients and shadows.

Spacing is fluid: section padding, gutters, grid gaps and section-head margins all use `clamp()`
(`p-[clamp(20px,3.2vw,48px)]`), so nothing needs a per-breakpoint override to stay proportional.
Keep new spacing on that pattern.

Project cards get their artwork from `components/home/ProjectThumb.tsx` — inline SVG UI mockups
(`storefront`, `cms`, `dashboard`, `app`, `landing`, `portfolio`) painted in translucent white over
each card's own gradient, so there are no image files to ship. A project with a real screenshot sets
`image` in `data/projects.ts` and renders through `next/image` instead.

shadcn is configured (`components.json`, `base-nova` style on `@base-ui/react`) and
`components/ui/button.tsx` was generated, but **nothing imports it and its theme tokens are not
loaded** — the `@import "shadcn/tailwind.css"` line was removed because that path is not exported by
the `shadcn` package and broke the CSS build. Adding a shadcn component means bringing its tokens in
first. `components/home/Testimonials.tsx` is dead and still carries the old pre-Tailwind class names.

### One transform per element

**Nothing writes `element.style.transform`.** Every animated transform is composed in a single CSS
declaration out of custom properties, and the hooks only set those properties:

| Property | Set by | Effect |
| --- | --- | --- |
| `--rv-y`, `--rv-s` | the `reveal` utility (`.reveal` / `.reveal.in`) | scroll entrance |
| `--lift` | the `lift` utility (`.lift.in:hover`) | hover raise |
| `--mag-x`, `--mag-y`, `--press` | `useMagnetic` + `:active` | magnetic buttons |
| `--mx`, `--my` | `useSpotlight` | paints a gradient, no transform at all |

This is deliberate. The previous `useTilt` hook assigned `style.transform` on `.project-card`,
`.service-card` and `.skill-cat` — the same property `.reveal` animates — so hovering a card before
it had revealed pinned it at `opacity: 0` forever. If you add a new hover or pointer effect, add a
custom property to the existing chain rather than a second `transform` declaration. Tailwind's own
`translate-*` / `scale-*` / `rotate-*` utilities write the separate `translate` / `scale` / `rotate`
properties, not `transform`, so they compose with the chain safely.

Classes named `.magnetic`, `.lift`, `.spotlight`, `.reveal` and the `data-filled` attribute are hooks
for script behavior (magnetic hover, hover raise, card spotlight, scroll entrance, skill-bar fills) — preserve them
when converting markup, or port the behavior to React instead.

Phones (≤600px) get `max-[600px]:` variants in each component: the hero puts the portrait above the
copy, projects become a horizontal scroll-snap carousel (cards forced visible, since off-screen cards
never cross the reveal observer), the process rail turns vertical (inside the `process-rail`
utility), and the GitHub facts are 2×2. Below 960px the back-to-top button is hidden (the tab bar's
Home does that) and the footer and floating buttons clear the tab bar (`--fab-b` in `:root`).

Layout notes worth keeping: `section` carries `scroll-margin-top: var(--nav-h)` so anchor links
don't land under the fixed nav; the card grids use `repeat(auto-fit, minmax(...))` rather than a
fixed column count; and `fg-3` is `#8fa08e` (5.4:1 on `bg`) so the quietest text still passes WCAG AA.

## Conventions

- Path alias `@/*` maps to the repo root (`@/components`, `@/lib/utils`, `@/hooks`).
- `cn()` in `lib/utils.ts` (clsx + tailwind-merge) merges class lists; shared class strings are in `lib/ui.ts`.
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
