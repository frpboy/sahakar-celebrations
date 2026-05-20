---
alwaysApply: true
scene: git_message
---

Write your rules here to customize the style of AI-generated commit messages.

## 1. Framework Versions & Dependencies
- Core: React 19.2.6 (Vite)
- Styling: Tailwind CSS 4.3.0
- Animations: GSAP 3.15.0, Framer Motion 12.39.0
- Scrolling: Lenis 1.3.23 (Smooth Scrolling)
- Icons: Lucide React 1.16.0
- Database: Neon PostgreSQL
- Language: TypeScript 6.0.2

## 2. Testing Framework Details
- No automated testing framework is currently configured.
- Manual verification of responsive behavior and database integration is required.

## 3. Prohibited APIs & UI Patterns
- No Hard Dividers: All sections must use "smudged" ambient backgrounds.
- No Standard Alerts: Use custom animated toasts or overlays.
- No Hardcoded Guest Data: All interaction data must flow through `/api/rsvp.ts`.
- No Native Share without Fallback: Always provide clipboard fallback.
- No Section Vignettes: Avoid horizontal lines between sections.
