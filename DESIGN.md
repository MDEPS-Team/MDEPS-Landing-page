---
name: Vantage PMO
description: A celestial-atlas observatory where a project portfolio is read as bodies, orbits and light.
colors:
  brand: "#005B9A"
  brand-deep: "#004A7F"
  brand-glow: "#5FB0EA"
  starlight: "#9FD3FA"
  starlight-bright: "#C4E5FC"
  night: "#031A30"
  plate: "#05233F"
  plate-raised: "#082C4D"
  on-plate: "#EAF3FB"
  on-plate-2: "#A9C3DB"
  plate-line: "rgba(214, 232, 248, 0.14)"
  plate-line-strong: "rgba(214, 232, 248, 0.28)"
  paper: "#F3F7FB"
  paper-alt: "#E8F0F8"
  paper-surface: "#FFFFFF"
  ink: "#0A2238"
  ink-2: "#43607C"
  paper-line: "rgba(10, 34, 56, 0.12)"
  paper-line-strong: "rgba(10, 34, 56, 0.24)"
  sky: "#041F38"
  sky-alt: "#062744"
  sky-surface: "#0A3052"
  light-ok: "#7FE0C9"
  light-warn: "#FFB547"
  light-bad: "#FF7A66"
  ink-ok: "#0B7A62"
  ink-warn: "#8F5600"
  ink-bad: "#B33A27"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.35rem + 4.6vw, 5.25rem)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.15rem + 0.9vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  numeral:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  lead:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.35
rounded:
  s: "10px"
  m: "16px"
  l: "24px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(4.5rem, 3rem + 6vw, 9rem)"
  nav-height: "68px"
  container: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand-deep}"
  button-primary-plate:
    backgroundColor: "{colors.starlight}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "44px"
  button-primary-plate-hover:
    backgroundColor: "{colors.starlight-bright}"
  button-ghost:
    textColor: "{colors.on-plate}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "44px"
  chip-status:
    textColor: "{colors.on-plate}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1rem 0 0.85rem"
    height: "44px"
  input-field:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.s}"
    padding: "0 1rem"
    height: "50px"
  card-plan:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.l}"
    padding: "2rem"
  card-plan-featured:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-plate}"
    rounded: "{rounded.l}"
    padding: "3rem 2rem"
  console:
    backgroundColor: "{colors.plate-raised}"
    textColor: "{colors.on-plate}"
    rounded: "{rounded.l}"
---

# Design System: Vantage PMO

## Overview

**Creative North Star: "The Observatory Plate"**

Vantage means vantage point, and the system is built as an observatory looking down at a portfolio. Projects are bodies on tilted orbits; an orbit's bright arc is progress and a body's light is health. Every surface is one of two materials: the **plate**, a deep Prussian-blue celestial-atlas sheet engraved with white hairlines, a coordinate graticule and fine orbit rings; and the **paper**, a pale blue-tinted sheet that carries the reading content and flips to deep sky in the dark theme. Pages alternate plate and paper bands so the instrument and the explanation take turns.

Density is calm and editorial: large display headlines with tight tracking, generous section rhythm, and data that is always shown working (live orrery, assistant console, forecast drawn to scale) rather than described. Depth is literal where it matters (a hand-projected 3D orrery, cards that turn in 3D) and flat everywhere else; hairlines do the structural work that shadows would do in a generic SaaS page.

The world rejects the split hero with a flat dashboard screenshot and a row of identical feature cards; the hero is an instrument the visitor can turn.

**Key Characteristics:**
- Two materials, plate and paper, with the plate fixing its own tokens regardless of theme.
- Status is light (mint, amber, coral glowing on the plate), printed as darker ink on paper.
- Hairline engraving (1px low-alpha white or ink lines) instead of shadows for structure.
- Pill-shaped controls, softly rounded containers, circular nodes and bodies.
- Bricolage Grotesque for voice and numerals, Geist for everything read.
- Strong out-curves for motion; scenes "come into focus" (blur plus scale) rather than slide.

## Colors

A single-hue world of Prussian blues from night to pale paper, lit by one cool starlight accent and three status lights.

### Primary
- **Vantage Blue** (brand): the brand anchor. Primary buttons and focus rings on light paper, the drawn onboarding route nodes, category and role labels on paper.
- **Deep Vantage Blue** (brand-deep): hover state for brand buttons only.
- **Orbit Glow** (brand-glow): the onboarding route line, the lit side of the portfolio core, text selection. Never body text.

### Secondary
- **Starlight** (starlight): the accent of the plate. Primary buttons, focus rings, selected chip borders, prompt timers and progress bars whenever the ground is dark (plate, or paper in the dark theme). Swaps in for Vantage Blue on dark grounds.
- **Bright Starlight** (starlight-bright): hover state for Starlight buttons.

### Tertiary (status light)
- **On-Track Mint** (light-ok), **At-Risk Amber** (light-warn), **Delayed Coral** (light-bad): emitted light on the plate. Orrery bodies and orbit arcs, readout bars, legend chip dots, timeline bars, meters and KPI numerals.
- **Mint Ink**, **Amber Ink**, **Coral Ink** (ink-ok, ink-warn, ink-bad): the same three states printed on light paper, darkened to hold 4.5:1. Coral Ink is also the form error color.

### Neutral
- **Night** (night): the deepest plate ground, page background, nav glass tint, featured pricing card.
- **Plate** / **Raised Plate** (plate, plate-raised): alternate plate ground and the raised instrument surface (assistant console).
- **Engraving White** / **Engraving Dim** (on-plate, on-plate-2): primary and secondary text on the plate.
- **Hairline** / **Strong Hairline** (plate-line, plate-line-strong): every border, divider and ring on the plate.
- **Paper** / **Paper Alt** / **Paper Surface** (paper, paper-alt, paper-surface): light-theme reading grounds; alt bands alternate with plain paper; surface is cards and inputs.
- **Ink** / **Ink Secondary** (ink, ink-2): text on light paper.
- **Ink Hairline** / **Strong Ink Hairline** (paper-line, paper-line-strong): borders on light paper.
- **Deep Sky** / **Sky Alt** / **Sky Surface** (sky, sky-alt, sky-surface): what paper becomes in the dark theme; text then uses the Engraving pair and status uses the light values.

### Named Rules
**The Plate Holds Rule.** A plate band is always dark and always uses the plate tokens, in both themes. Only paper responds to the theme toggle.

**The Light vs Ink Rule.** Status on a dark ground is emitted light (light-ok/warn/bad); status on light paper is printed ink (ink-ok/warn/bad). Never put the light values on pale paper.

**The One Accent Rule.** Each ground has exactly one action accent: Vantage Blue on light paper, Starlight on any dark ground. They never appear as competing buttons on the same ground.

## Typography

**Display Font:** Bricolage Grotesque (variable, opsz 12..96, wght 400..800; fallback Segoe UI, system-ui)
**Body Font:** Geist (wght 400..700; fallback Segoe UI, system-ui)
**Data Font:** Geist Mono (wght 400..600), only for changing data: split-flap values, forecast axis and dates, deck counter, meter values. Never for labels or captions.

**Character:** Bricolage carries the voice with slightly idiosyncratic, tightly tracked grotesque forms at large sizes; Geist is the quiet, precise instrument text. Numerals in data views are tabular throughout.

### Hierarchy
- **Display** (650, step 4 fluid from 2.6rem to 5.25rem, line-height 1, tracking -0.022em, max 13ch): the hero headline only.
- **Headline** (700, step 3 fluid from 2rem to 3.4rem, line-height 1.05, tracking about -0.03em, max 16 to 18ch): section titles, story-step titles, closing title.
- **Title** (700, step 2 fluid from 1.375rem to 1.75rem, tracking -0.02em): pillar, route, plan and post titles. Module-card titles and testimonial quotes use Bricolage at 500 to 700 between 1.3rem and 2rem.
- **Numeral** (Bricolage 700, 2rem, tabular): KPI values; pricing amounts scale the same treatment to 3.6rem at -0.04em.
- **Lead** (Geist 400, 1.25rem, line-height 1.5 to 1.55, max 44 to 52ch, secondary color): hero and section subheadings.
- **Body** (Geist 400, 1.0625rem, line-height 1.6, max about 48 to 58ch).
- **Label** (Geist 500 to 600, 0.82 to 0.95rem, sentence case): chips, table heads, readout meta, form labels, nav links.

### Named Rules
**The Sentence-Case Rule.** Labels, captions and badges are sentence case at normal tracking. There are no spaced-caps captions, eyebrows or kickers above headlines; a headline stands on its own.

**The Tabular Data Rule.** Any number that can change (progress, dates, KPIs, prices, counters) uses tabular numerals.

## Layout

Content sits in a 1240px container with a fluid gutter (16 to 40px). Sections breathe on a fluid rhythm (4.5rem to 9rem), with the narrative-orrery band at 0.6x and the closing band at 1.2x. Section headers are a small grid (headline, lead) with 2.5 to 4rem below.

Asymmetric two-column splits are the default above about 900 to 1000px: 5/7 (pillars, assistant), roughly 0.95/1.05 (hero copy vs orrery), 5/6 (about), 1/1 sticky instrument plus scrolling story (results). Sticky headers and instruments pin at nav height plus an offset. Below the breakpoint everything stacks copy first, instrument second; the narrative orrery becomes a sticky 40vh strip above its story steps.

The module deck is a horizontal scroll-snap track centered on one card (280 to 400px), with 3D perspective. The onboarding route is three columns joined by a horizontal drawn line, becoming a vertical line with nodes on the left on mobile. Team runs 2, 3, then 5 columns. Breakpoints in use: 480, 560, 640, 720, 860, 900, 960, 1000, 1100px.

## Elevation & Depth

Structure is flat and engraved: hairline borders and tonal grounds separate everything at rest. Shadows exist only to lift objects that float over the plate (the orrery readout, module faces, the console, the featured plan), and they are long, soft, negative-spread drops that read as distance rather than outline. Real depth is reserved for the instruments: the hand-projected orrery (back half, core, front half drawn in depth order, starfield, halo) and CSS 3D for the module deck and the closing rings.

### Shadow Vocabulary
- **Readout float** (`box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.6)`): small overlays on the orrery.
- **Card lift** (`box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.7)`): module faces in the deck; the featured plan uses the same geometry tinted night at 0.6.
- **Instrument drop** (`box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.8)`): the assistant console.

### Named Rules
**The Engraving Rule.** Separation is a 1px hairline or a ground change, never a shadow. Shadows only mean "this floats above the plate."

**The Graticule Rule.** The atlas grid (80px graticule plus concentric rings) lives only on plate bands, at 0.05 to 0.07 alpha, radially masked so it fades out before the edges.

## Shapes

Controls are pills (999px): buttons, chips, nav links, icon buttons, the ask input. Containers soften by size: small (10px) for prompts, KPI tiles, form fields and plan notes; medium (16px) for images inside cards, readouts and assistant answers; large (24px) for module faces, the console, plan cards, portraits and the narrative plate. Celestial objects are circles: orrery bodies, route nodes with a counter badge, status dots (8 to 9px), avatars. The assistant answer bubble breaks the radius at the top-left (4px) to point at its source. Icons are a single inline SVG family on a 24px grid, 1.6 to 2px rounded strokes, no fills.

## Components

### Buttons
Confident pills, quiet until touched.
- **Shape:** full pill (999px), 1px border, minimum 44px tall (52px large), 600 weight.
- **Primary:** Vantage Blue on light paper, Starlight with night text on any dark ground.
- **Ghost:** transparent with a strong hairline border; border turns full foreground on hover.
- **Quiet:** text-only; turns Starlight on hover (nav login).
- **Hover / Focus / Active:** hover is gated to fine pointers; trailing arrow icons nudge 3px right; active scales to 0.97; focus is a 2px outline in the ground's focus color at 3px offset. Transitions 160ms, transforms on the strong out-curve.

### Chips
- **Style:** pill outline in plate hairline, label weight, a 9px status dot leading.
- **State:** pressed chips take a Starlight border and 12% Starlight fill. Chips double as the orrery legend and its selector.

### Cards / Containers
- **Plan card:** large radius, paper surface, ink hairline, 2rem padding. The featured plan becomes a piece of plate (night ground, plate tokens, Starlight button) and extends 1rem past its neighbours on wide screens.
- **Module card:** two-faced card turning on its Y axis (700ms in-out). Front is a tinted plate with engraved orbit rings in the corner; back is pale paper with a short display-type statement and a Vantage Blue action.
- **Pillar row:** not a card; a ruled row (ink hairline above, 220px image plus text) in a list.

### Inputs / Fields
- **Style:** 50px tall, small radius, strong hairline border, surface ground, label above in 600.
- **Focus:** border hides and a 2px focus-color outline sits 1px out.
- **Error:** Coral Ink border plus an inline icon-and-text message in Coral Ink.

### Navigation
Fixed bar, 68px, always plate-colored text. Transparent at the top; once scrolled it becomes night glass (82% night, 14px blur, saturate 140%) with a bottom hairline. Links are pill hovers in Engraving Dim turning Engraving White. Language and theme are 44px circular outline buttons. Below 900px links collapse into a sheet of large Bricolage links separated by hairlines.

### Orrery (signature)
The portfolio core (a glow-gradient sphere) sits at the center of tilted orbit rings, one per project. Each orbit's bright arc is its progress; each body glows in its status light with a white core and a halo. The scene is hand-projected on a 2D canvas over a deterministic starfield, assembles from scattered orbits into order on load ("comes into focus"), turns by horizontal drag with inertia and by arrow keys, pauses off-screen, and holds still under reduced motion. A readout card overlays the stage and the status chips below select bodies. A story mode drives the same orrery from scroll steps.

### Assistant console (signature)
A raised plate panel with a thin top bar, a list of prompts on the left whose bottom edge fills with a Starlight dwell timer while autoplay runs (pausable), and answer panels that arrive with a short blur-rise: plan rows, status board, KPI tiles, meters, and a forecast timeline where bar length is literally duration.

## Do's and Don'ts

### Do:
- **Do** alternate plate and paper bands; open and close a page on plate.
- **Do** show status as light on dark grounds and as ink on light paper, always with a dot or bar, never color alone without a label.
- **Do** use Starlight as the only action accent on dark grounds and Vantage Blue on light paper.
- **Do** separate with 1px hairlines and ground changes; reserve shadows for things floating over the plate.
- **Do** keep controls pill-shaped and at least 44px tall.
- **Do** use the strong out-curve (cubic-bezier(0.23, 1, 0.32, 1)) for UI response, the arrive curve (cubic-bezier(0.16, 1, 0.3, 1)) for entrances and drawn lines, and the in-out curve only for 3D turns; never ease-in on UI.
- **Do** gate hover effects to fine pointers and provide a reduced-motion path for every animation.

### Don't:
- **Don't** put the light status values (mint, amber, coral) on pale paper; use the ink values.
- **Don't** let a plate band follow the theme toggle; only paper changes.
- **Don't** add spaced-caps captions, eyebrows or kickers above headlines.
- **Don't** extend the graticule onto paper bands or raise its alpha above about 0.07.
- **Don't** introduce a second icon family or filled icons.
