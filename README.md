# sambatra.os

Personal site of **Sambatra Andriamihaja** — Growth Engineer & Full-Stack
Developer, Antananarivo. Version 3: the portfolio doesn't describe the work,
it runs it.

Next.js 14 App Router · TypeScript · Tailwind · Framer Motion · Three.js ·
next-intl (EN/FR) · pnpm.

---

## Getting started

This repository uses **pnpm**. The version is pinned in `package.json` via
`packageManager`, so `corepack` will pick it up automatically.

```bash
corepack enable          # once, if you have never used corepack
pnpm install
pnpm dev                 # http://localhost:3000 → redirects to /en
```

| Script              | What it does                               |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Dev server                                 |
| `pnpm build`        | Production build                           |
| `pnpm start`        | Serve the production build                 |
| `pnpm lint`         | ESLint (`next/core-web-vitals`)            |
| `pnpm typecheck`    | `tsc --noEmit`                             |
| `pnpm format`       | Prettier, including Tailwind class sorting |
| `pnpm format:check` | Verify formatting without writing          |

Set `NEXT_PUBLIC_SITE_URL` in the environment for correct canonical URLs,
sitemap entries and OG image resolution. It defaults to `https://sambatra.dev`.

---

## The idea

The site is an operating system, and every page reads as a running **Make
scenario**. Sections are modules — `trigger`, `router`, `scenario`, `work`,
`connections`, `history`, `contact` — carried as `data-module` attributes and
mirrored by a rail on the left (`components/flow/spine.tsx`) that lights the
active one. A real terminal sits at the centre of the home page, and every
project ships as a **playable window** rather than a screenshot.

Dark mode boots into **Ubuntu**. Light mode boots into **Windows 11**. Neither
is a colour scheme; each is a full skin — chrome, wallpaper, fonts, terminal
emulator, hero object.

---

## Two operating systems, one DOM

Switching is pure CSS. Both skins live in the markup at once and two Tailwind
variants pick one, so the first paint is always right and there is no flash:

```
os-ubuntu:   →  html:not(.light) &
os-win:      →  html.light &
```

`next-themes` toggles the `.light` class (`attribute="class"`, dark by
default). Every token is an `R G B` triplet in `app/globals.css` so Tailwind
can apply alpha with `rgb(var(--token) / <alpha>)`:

|               | Ubuntu (`:root`)                                                           | Windows 11 (`.light`)                                            |
| ------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Canvas        | `33 20 30` — Jammy aubergine                                               | `198 211 228` — the Bloom's grey-blue ground                     |
| Accent        | `233 84 32` — Ubuntu orange                                                | `0 95 184` — Windows accent blue                                 |
| Window chrome | Yaru headerbar, `44 44 44` surface, 12px radius                            | Mica title bar, 8px radius, 46px caption buttons                 |
| UI font       | Ubuntu 400 / 500 / 700                                                     | Segoe UI Variable → Open Sans fallback                           |
| Code font     | Ubuntu Mono                                                                | Cascadia Mono / Consolas → JetBrains Mono fallback               |
| Terminal      | GNOME Terminal, `#300a24`, Tango palette                                   | Windows Terminal running PowerShell, `#012456`, Campbell palette |
| Terminal bar  | Aubergine headerbar, bold centred title, `~` subtitle, Yaru round controls | Dark tab row — one tab, `+`, `⌄`, white caption buttons          |
| Wallpaper     | Aubergine → orange gradients (`--wallpaper`)                               | Soft grey-blue gradient, lighter top-left                        |
| Hero object   | Three.js point wave (`components/os/hero-field.tsx`)                       | Three.js **Bloom** (`components/os/bloom.tsx`) — grab it         |

Fonts are loaded per OS in `lib/fonts.ts`; the Windows faces are system fonts
with Google fallbacks, so nothing is downloaded for them.

### The Bloom

A hand-built recreation of the Windows 11 wallpaper: nine wraps of one wide
satin-cobalt ribbon around a leaning axis, each a parametric sheet whose
cross-section flares at the base, leans in, then rolls over at the rim.
Vertex colours bake occlusion (navy in the creases, brighter on the folds),
a `MeshPhysicalMaterial` with sheen and a soft clearcoat sits under a
`RoomEnvironment`, and the key light casts real shadows into the folds.

It can be **grabbed**: pointer events are read on the window (the hero text
sits above the canvas), a raycast against a hidden proxy decides whether the
pointer is on the ribbon, interactive elements are never hijacked. Drag spins
it with inertia and a small tilt that springs back; released, it resumes its
slow turn. It pauses off-screen and when the tab is hidden.

Both hero objects load after the page is idle, on desktop fine pointers only,
never under `prefers-reduced-motion`.

---

## The terminal

Open it with `⌘K` / `Ctrl+K`, from the nav icon, or use the inline copy on
the home page. The prompt is `sambatra@ubuntu:~$` on one OS and
`PS C:\Users\sambatra>` on the other; each prints its own MOTD first.

| Command                        | Effect                                                 |
| ------------------------------ | ------------------------------------------------------ |
| `help` · `?`                   | List commands                                          |
| `whois`                        | Identity record                                        |
| `skills [auto\|dev\|data\|ml]` | Technical skills, all or by group (alias `stack`)      |
| `projects [--all]`             | Featured (or all) projects (alias `work`)              |
| `experience` · `education`     | Career / academic timeline                             |
| `timeline`                     | Everything, newest first                               |
| `automation`                   | Automation & workflow expertise                        |
| `run` · `scenario`             | Scroll to and execute the scenario on the home page    |
| `1sa <number>` · `isa`         | Spell a number in Malagasy — runs the published module |
| `quote`                        | A line I work by                                       |
| `contact` · `hire`             | Channels, and opens the contact sheet                  |
| `resume` · `cv`                | CV download                                            |
| `goto <home\|about\|projects>` | Navigate                                               |
| `theme [dark\|light]`          | Switch OS                                              |
| `lang [en\|fr]`                | Switch locale                                          |
| `clear`                        | Clear the buffer (`Ctrl+L` too)                        |

Tab or `→` accepts the ghost completion; `↑`/`↓` walk the history. Two
commands are hidden from `help` — try `sudo` and `exit`. Commands are declared
in `components/console/registry.ts`; the overlay lives in
`console-provider.tsx`.

`1sa` is a real dependency (`pnpm add 1sa`). `lib/isa.ts` validates input
(0 – 999 999 999 999) and patches the module's `undefined tapitrisa` bug on
exact multiples of 10⁶ / 10⁹.

---

## Playable project windows

Every project declares a `demo` — an interactive component that renders inside
its window (`components/demos/`). Each one is skinned to the **real product**
it was built in or for, with that product's own colours, not the site's tokens:

| `demo`     | What it is                                                                 | Looks like                    |
| ---------- | -------------------------------------------------------------------------- | ----------------------------- |
| `scenario` | Live Make canvas drawn from a declared scenario — run it, drag modules     | Make                          |
| `enrich`   | Waterfall enrichment — type an email, watch providers answer in turn       | Brevo                         |
| `agent`    | Agent chat with visible tool calls into the CRM and the data mirror        | Slack thread / Dust           |
| `graphql`  | One query feeding a web calendar and a phone at the same time              | GraphiQL + Orizon             |
| `docs`     | Versioned document search — index, open, browse versions                   | WikIT (Bootstrap 4) for Telma |
| `barcode`  | Odoo reference + Code 128 barcode, derived live from category & attributes | Odoo 16                       |
| `print`    | Odoo report preview — variant `sheet` (product sheet) or `bill` (drafts)   | Odoo 16, real report replicas |
| `shop`     | Packaging catalogue search + quote builder                                 | FOCICOM                       |
| `board`    | Project monitoring board with blockers                                     | Phidia                        |
| `color`    | A working colour picker — drag the swatch, copy hex / RGB / HSL            | The Electron app              |
| `biogas`   | Sensor dashboard, burner control, depletion forecast                       | The Flutter "Kit App"         |
| `landing`  | Section builder — toggle and reorder, the page rebuilds without a reload   | mozar.io                      |
| `isa`      | The npm page, with a live input into the published module                  | npm                           |

The contract is `components/demos/types.ts` — `DemoProps { locale; variant?;
compact? }` — and `registry.tsx` maps `TDemo → component` with `next/dynamic`.
`ProjectWindow` mounts a demo only when it is about to scroll into view
(`IntersectionObserver`, `rootMargin: 320px`), so the work index stays light.
Each window's status bar carries a one-line "what to try" hint (`tryEn` /
`tryFr`).

---

## The scenario canvas

`components/scenario/` renders Make-style automation flows declared in
`scenarios.ts` (`hero`, `sync`, `enrich`, `mirror`, `agents`, `platform`).
It uses Make's own palette — `#F4F4F7` canvas, `#6D00CC` active route — with
solid brand-coloured modules and white glyphs (`apps.tsx`). Modules drag,
routes are beziers with filter pills, an error-handler route hangs off the
side, a **Run once** control walks the graph tier by tier while bundles travel
the edges and per-module operation badges tick up, and hovering opens an
inspector. The `requestAnimationFrame` loop runs only while bundles exist.

Projects that declare a `scenario` id get this canvas as their window and in
their detail view.

---

## The mark

Two braces written by hand — `{` above, `}` below — the closing of one meeting
the opening of the other so that, leaned 24°, they read as an **S**. The
opening and closing of a function.

The paths live once, in `components/os/logo.tsx` (`LOGO_OPEN`, `LOGO_CLOSE`,
`LOGO_LEAN`), and feed everything: the nav and footer, the boot screen, the
OpenGraph card (`app/opengraph-image.tsx`) and the favicons, which are
**generated at build time** from the same constants (`app/icon.tsx` → 32 and
192 px, `app/apple-icon.tsx` → 180 px). The logo cannot drift.

---

## Signature details

- **Live wire** — `components/os/pointer-fx.tsx`. A node (ring + dot) trails
  the pointer. Over anything interactive it docks 10px outside the nearest
  edge and a wire is drawn from pointer to node — dashed bezier with a comet
  tail on Ubuntu, a solid elbow with a dotted frame on Windows. Clicking sends
  a bundle down the wire. Off on touch and under `prefers-reduced-motion`.
- **Boot** — `components/os/boot.tsx`. An 800ms plymouth-style boot on the
  first visit of a session (`sessionStorage`), then never again.
- **Window** — `components/os/window.tsx`. One component, both chromes.
  `chrome="terminal"` swaps in the two terminal emulators' own bars.
- **Hire me** — `components/layout/hire-me.tsx`. A contact sheet that composes
  a ready-to-send email in the visitor's mail app; no backend.
- **Route change** — `app/[locale]/template.tsx`, a 320ms fade-up. No
  `loading.tsx`, no frozen router: nothing between click and page.

### Design rules

The v2 site was too loud; v3 is quiet on purpose. No eyebrows or kickers, no
pulsing "live" dots, no status pills, no numbered headers, no clock, no serif
italics — emphasis is a single `text-accent` span via `t.rich(..., { em })`.
Routes are a `divide-y` list, not three equal cards. UI transitions are
150–300ms ease-out (`[0.23, 1, 0.32, 1]` / `[0.16, 1, 0.3, 1]`). Nothing
animates forever except the terminal caret and the bundles of a running
scenario. Demos use their product's brand colours, never the site's tokens,
and never `dark:` prefixes.

---

## Layout

```
app/
  layout.tsx              pass-through root (metadataBase only)
  globals.css             token layer — :root Ubuntu, .light Windows — + component classes
  icon.tsx apple-icon.tsx generated favicons, from the logo paths
  opengraph-image.tsx     1200×630 social card (GNOME Terminal on aubergine)
  robots.ts sitemap.ts    generated
  [locale]/
    layout.tsx            document shell: Backdrop · PointerFx · Spine · Nav · main · Footer · HireMe · Boot
    template.tsx          route fade
    page.tsx              home — Hero · Routes · Scenario · Featured · Connections · History · Contact
    about/ projects/      routes
    error.tsx not-found.tsx

components/
  os/                     the operating system — window chrome, backdrop, boot, logo,
                          live-wire pointer, hero point field, the Bloom
  console/                the terminal — commands, line renderer, ⌘K provider
  demos/                  the twelve playable windows + registry + contract
  scenario/               Make canvas — engine, app glyphs, declared scenarios
  flow/                   section rail (spine) and quiet section headers
  home/ about/ work/      page sections
  layout/                 nav, footer, hire-me, theme toggle, locale switch
  ui/                     actions, icons, section wrapper
constants/                all content: profile, site, projects, skills, timeline, menu, lang
i18n/messages/            en.json · fr.json — every string on the site
lib/                      fonts (per OS), motion tokens, cn(), the 1sa wrapper
public/images/            project shots, company logos, tech-stack SVGs
```

Content never lives in JSX. Structure lives in `constants/`, copy lives in
`i18n/messages/`. Adding a project means editing one array.

---

## Adding a project

Append to the array in `constants/projects.ts`:

```ts
{
  id: 17,
  slug: "thing",
  category: PROFESSIONAL,       // PROFESSIONAL | PERSONAL | STUDIES
  demo: "scenario",             // one of TDemo — what plays inside the window
  demoVariant: "sheet",         // optional sub-mode (print: sheet | bill)
  scenario: "sync",             // optional — a scenario id, for `scenario`/`enrich`/`agent`
  tryEn: "Run it, then drag a module",
  tryFr: "Exécutez-le, puis déplacez un module",
  year: "2025",
  ongoing: true,                // shows "Present" instead of the year
  client: "Someone",
  via: "Valano Tech",           // optional umbrella employer
  titleEn: "...", titleFr: "...",
  descEn: "...",  descFr: "...",
  shot: "/images/projects/thing.png",   // optional — used by the detail view
  live: "https://...",
  source: "https://github.com/...",
  npm: "thing",                 // optional — when published
  tags: [T.react, T.postgres],
}
```

A new kind of demo is a component in `components/demos/` that takes
`DemoProps`, a new member of the `TDemo` union, and one line in
`registry.tsx`.

`FEATURED_SLUGS` gives a project the badge and the `projects` command;
`HOME_SLUGS` in `components/home/featured.tsx` chooses the four shown on the
home page.

---

## Internationalisation

`next-intl` with the locale as the first path segment (`localePrefix:
"always"`, EN default). `middleware.ts` negotiates, `i18n/i18n.ts` loads the
bundle, and `constants/lang.ts` is the single place the locale list is
declared. Project titles and descriptions are bilingual in `constants/`; every
other string is in `i18n/messages/`.

---

## Verification

`pnpm typecheck && pnpm lint && pnpm build` must be clean. Visual QA is done
headlessly against `next start` in both OS modes, on desktop (1600×1000) and
a 390px handset — grids use explicit `grid-cols-1` and `minmax(0, 1fr)` tracks
so nothing ever pushes the viewport wider than the phone.
