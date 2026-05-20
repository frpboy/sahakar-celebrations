---
alwaysApply: true
---

# Project Standards & Technical Requirements

## 1. Framework Versions & Dependencies
- **Core**: React 19.2.6 (Vite)
- **Styling**: Tailwind CSS 4.3.0
- **Animations**: GSAP 3.15.0, Framer Motion 12.39.0
- **Scrolling**: Lenis 1.3.23 (Smooth Scrolling)
- **Icons**: Lucide React 1.16.0
- **Database**: Neon PostgreSQL (via `@vercel/node` and `pg`)
- **Language**: TypeScript 6.0.2

## 2. Testing Framework Details
- **Current Status**: No automated testing framework is currently configured for this project. 
- **Requirement**: Manual verification of responsive behavior and database integration is required for all changes.

## 3. Prohibited APIs & UI Patterns
- **Hard Dividers**: Prohibited. All sections must use "smudged" ambient backgrounds and global blurred glows to create a seamless scroll experience.
- **Standard Alerts**: Prohibited. Use custom animated toasts or overlays (e.g., the gold-themed toast in `SharingSection.tsx`) for user notifications.
- **Hardcoded Guest Data**: Prohibited for RSVP/Wishes. All guest interaction data must flow through the serverless API in `/api/rsvp.ts` connected to the Neon database.
- **Native Share without Fallback**: Do not use `navigator.share` without providing a copy-to-clipboard fallback for desktop/unsupported browsers.
- **Section Vignettes**: Avoid using section-specific vignettes or dark gradients that create horizontal lines between sections.
