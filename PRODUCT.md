# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
PMO directors, project/portfolio leads and team managers who run several projects at once and today chase status across spreadsheets, chats and tools. They evaluate Vantage PMO on a marketing landing page (desktop and mobile) before signing up.

## Product Purpose
Vantage PMO centralizes projects in one platform: real-time portfolio visibility, standardized processes, and an AI assistant that answers questions from real project data (plans, status summaries, at-risk tasks, stakeholder reports, delivery forecasts). Success on the landing page = the visitor signs up (registration page) or logs in to the app.

## Positioning
"Centralize your projects, control your future." One source of truth for the whole portfolio plus an AI assistant grounded in that data, built by software engineers who saw projects fail from lack of clarity, not lack of skill.

## Operating Context
Modules presented: Projects (AI-driven planning/execution), Portfolio, Analytics, Automation, Resources, Reporting, Integrations (Jira, Slack, Teams, 40+ tools). Onboarding in three steps: connect projects, see portfolio come into focus, lead with data. App lives at https://vantagepmo-297ec.web.app; sign-up page is Session_registration.html.

## Capabilities and Constraints
- Static site: HTML + CSS + vanilla JS, no build step, deployed on GitHub Pages. No heavy dependencies.
- Bilingual EN/ES via `public/js/i18n.js` (inline dictionaries keyed by `data-i18n`). Every visible string must have EN and ES.
- Light and dark themes, user-toggleable and persisted.
- Primary CTA ("Start now" / "Get started") → `Session_registration.html` (confirmed 2026-11-05). Login → app.
- Pricing: 19 / 29 / 39 per month (Basic / Business / Enterprise). Feature lists are a DRAFT written for a PMO SaaS (confirmed as draft 2026-11-05), pending owner validation.
- Registration form currently posts to `/api/register`, which does not exist on static hosting (undecided backend).

## Brand Commitments
- Name: Vantage PMO. Brand blue #005B9A. Logos: `public/assets/images/logo/light-logo.png`, `dark-logo.png`.
- Value proposition copy (hero heading/subheading) must be preserved.

## Evidence on Hand
- Team: 5 real members with photos in `public/assets/images/team/`.
- Testimonials and "Trusted by" logos (Webflow/Relume) are PLACEHOLDERS (confirmed 2026-11-05): do not present company names or logos as real customers. Numbers in product mockups are illustrative, not customer metrics.
- No case studies, press, or verified usage statistics.

## Product Principles
1. Clarity over noise: every section should make project status easier to understand, mirroring what the product does.
2. Show the product working: demonstrate the dashboard and AI assistant rather than describe them.
3. Honest proof: never fabricate customers, logos or metrics.
4. Bilingual and accessible by default.

## Accessibility & Inclusion
WCAG 2.2 AA: visible focus, keyboard operable, 4.5:1 text contrast in both themes, pausable auto-rotating content, respects prefers-reduced-motion.
