# sambatra-portfolio

Personal site of **Sambatra Andriamihaja** — Growth Engineer & Full-Stack
Developer, Antananarivo.

Next.js App Router · TypeScript · Tailwind · Framer Motion · next-intl (EN/FR).

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

## Identity

The site keeps the structure and personality of the first version — a
centered "Hi, I'm Sambatra" hero, stat cards, an interactive terminal, a
floating **Hire me** button, and the cursor glow — on a new palette.

**Palette** — midnight canvas `#0B0B0F`, indigo `#3F51B5` as the primary
(buttons, active states, glow), gold `#D6A84F` as the accent. Tokens live in
`app/globals.css` as `R G B` triplets so Tailwind can apply alpha via
`rgb(var(--token) / <alpha>)`. Dark is the native state; `.light` overrides
with a warm paper canvas. Indigo is never small text — `signal` is the
text-safe tint.

**Type** — Space Grotesk for everything, JetBrains Mono inside the terminal.

**Signature elements**

- `components/ui/cursor-glow.tsx` — a soft dot with five satellites in slow
  orbit. Over any link or button the satellites settle on the control's
  outline, which lights up as a dotted, sparkling circuit. Canvas, one rAF
  loop, off on touch and under `prefers-reduced-motion`.
- `components/ui/particle-field.tsx` — the hero's drifting constellation,
  leaning gently toward the pointer.
- `components/layout/hire-me.tsx` — the floating paper-plane button. Pressing
  it launches the plane and opens a contact sheet; submitting composes a
  ready-to-send email in the visitor's mail app (no backend needed).
- The terminal wears an Ubuntu skin in dark mode and Windows PowerShell in
  light mode.

**Motion** — spring-based hover/tap on controls, `layoutId` pills for the
active nav link, filters and tabs, staggered entrances, count-up stats, a
quiet route transition. Only `transform` and `opacity` animate.

---

## Pages

- **Home** — hero · stats · interactive terminal · workflow automation
  (live Make-style scenario) · featured projects
- **About** — a line I work by, an intro, every tool in one cloud · skills by
  family · Experience / Education tabs on an alternating, brand-coloured
  timeline (real logos: Brevo, Valano Tech, Mozar, Smart Predict, MGBI,
  Orange, Telma)
- **Projects** — filters, search, cards with Featured badges, View Code /
  Live Demo, and an expanding detail dialog

---

## The terminal

Open it with `⌘K` / `Ctrl+K`, from the nav icon, or use the inline copy on
the home page.

| Command                            | Effect                                             |
| ---------------------------------- | -------------------------------------------------- |
| `help`                             | List commands                                      |
| `whois`                            | Identity record                                    |
| `skills [auto\|dev\|data\|ml]`     | Technical skills, all or by group                  |
| `projects [--all]`                 | Featured (or all) projects                         |
| `experience` · `education`         | Career / academic timeline                         |
| `timeline`                         | Everything, newest first                           |
| `automation`                       | Automation & workflow expertise                    |
| `run` · `scenario`                 | Execute the workflow scenario on the home page     |
| `1sa <number>` · `isa`             | Spell a number in Malagasy — runs the real module  |
| `quote`                            | A line I work by                                   |
| `contact` · `hire`                 | Channels, and opens the contact sheet              |
| `resume` · `cv`                    | CV download                                        |
| `goto <home\|about\|projects>`     | Navigate                                           |
| `theme [dark\|light]` · `lang`     | Theme and locale                                   |
| `clear`                            | Clear the buffer                                   |

Tab or `→` accepts the inline completion; `↑`/`↓` walk the history.
Commands are declared in `components/console/registry.ts`.

`1sa` is a real dependency (`pnpm add 1sa`). `lib/isa.ts` validates input
(0 – 999 999 999 999) and patches the module's `undefined tapitrisa` bug on
exact multiples of 10⁶ / 10⁹. The **1sa** project detail embeds a live input.

---

## The scenario canvas

`components/scenario/` renders Make-style automation flows declared in
`scenarios.ts`: draggable modules, bezier routes with filter pills, an
error-handler route, gold bundles travelling the edges, a **Run once** control
that walks the graph tier by tier and increments per-module operation badges,
hover cards, and an idle mode that sends a faint packet down a random route.
Automation projects declare `frame: "scenario"` and a `scenario` id to get a
living preview on their card.

---

## Layout

```
app/
  layout.tsx              pass-through root (metadataBase only)
  globals.css             token layer + component classes
  robots.ts sitemap.ts    generated
  opengraph-image.tsx     1200×630 social card
  [locale]/
    layout.tsx            document shell, providers, JSON-LD
    page.tsx              home
    about/ projects/      routes
    loading.tsx error.tsx not-found.tsx

components/
  console/                the terminal — commands, renderer, provider
  scenario/               Make-style canvas
  home/ about/ work/      page sections
  layout/                 nav, footer, hire-me, transition, theme, locale
  ui/                     cursor glow, particle field, section header, actions, icons
constants/                all content: profile, projects, skills, timeline
i18n/messages/            en.json · fr.json — every string on the site
lib/                      fonts, motion tokens, cn(), the 1sa wrapper
public/images/experiences real company logos (SVG/PNG)
```

Content never lives in JSX. Structure lives in `constants/`, copy lives in
`i18n/messages/`. Adding a project means editing one array.

---

## Adding a project

Append to the array in `constants/projects.ts`:

```ts
{
  id: 16,
  slug: "thing",
  category: PROFESSIONAL,     // PROFESSIONAL | PERSONAL | STUDIES
  frame: "desktop",           // desktop | mobile | duo | terminal | artifact | scenario
  year: "2025",
  ongoing: true,              // shows "Present" instead of the year
  client: "Someone",
  via: "Valano Tech",         // optional umbrella employer
  titleEn: "...", titleFr: "...",
  descEn: "...",  descFr: "...",
  shot: "/images/projects/thing.png",
  live: "https://...",
  source: "https://github.com/...",
  tags: [T.react, T.postgres],
}
```

Add its slug to `FEATURED_SLUGS` to give it the badge; the first three
featured slugs are the ones shown on the home page.

---

## Internationalisation

`next-intl` with the locale as the first path segment. `middleware.ts`
negotiates, `i18n/i18n.ts` loads the bundle, and `constants/lang.ts` is the
single place the locale list is declared.
