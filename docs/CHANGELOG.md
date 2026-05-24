# Sahakar Celebration Portal - Project Changelog

All notable changes and architectural versions of this project are documented below.

---

## v1.9.0 — 2026-05-24 | 3D Landscape Terrain Background & High-Blur Glassmorphism
- **3D Landscape Backdrop**:
  - Integrated the custom-generated abstract 3D sapphire-gold landscape image (`wedding-landscape.png`) into the background container in [App.tsx](file:///e:/K4NN4N/sahakar-celebrations/src/App.tsx).
  - Coded scroll-driven parallax vertical translation and depth scale scaling on the backdrop using `framer-motion`'s `useScroll` and `useTransform` hooks.
  - Implemented a continuous, slow camera-drift float effect utilizing a new `@keyframes landscapeDrift` animation configured in [index.css](file:///e:/K4NN4N/sahakar-celebrations/src/index.css).
- **High-Blur Glassmorphism**:
  - Re-styled the core `glass-card` and `glass-card-hover` utilities in [index.css](file:///e:/K4NN4N/sahakar-celebrations/src/index.css) to support an ultra-premium `24px` backdrop blur, reduced opacity (`0.65`), thin `0.14` gold borders, and subtle internal sapphire glow reflections (`0.08` opacity).
  - This allows the background dunes and mountains to elegantly shimmer and bleed through the container layouts as the user navigates.

---

## v1.8.0 — 2026-05-23 | Corporate Branding Integration & Optimization Polish
- **Corporate Branding**:
  - Maintained the original gold serif `S` monogram crest inside [SplashIntro.tsx](file:///e:/K4NN4N/sahakar-celebrations/src/components/cinematic/SplashIntro.tsx) to match the luxury romantic wedding aesthetic.
- **Visual & Theme Upgrade**:
  - Refined theme tokens in [index.css](file:///e:/K4NN4N/sahakar-celebrations/src/index.css) to support Sapphire Blue and Gold combinations, shifting the body background to a deep sapphire-obsidian gradient.
  - Enhanced glassmorphic cards in [index.css](file:///e:/K4NN4N/sahakar-celebrations/src/index.css) with deeper blurs, gold borders, and internal sapphire glows.
  - Refactored ambient background lighting in [App.tsx](file:///e:/K4NN4N/sahakar-celebrations/src/App.tsx) to blend sapphire blue and warm gold.
- **Interactive Particles**:
  - Upgraded the particle canvas in [ParticleCanvas.tsx](file:///e:/K4NN4N/sahakar-celebrations/src/components/effects/ParticleCanvas.tsx) to draw 3D tumbling diamond-shaped gold-leaf flakes and glistening sapphire stardust with parallax depth and twinkling effects.
  - Coded an interactive **fluid light trail** (ribbon of blue-gold glow) following the mouse, featuring friction velocities, heat-rise drift, and a vector vortex that dynamically swirls falling dust particles in the cursor's wake.
- **Performance & Media Optimization**:
  - Replaced heavy JPEG placeholders with compressed WebP assets in [couples.ts](file:///e:/K4NN4N/sahakar-celebrations/src/content/couples.ts), removing over 19 MB of obsolete images from the repository.
  - Optimized the mouse tracker loop in [MouseGlow.tsx](file:///e:/K4NN4N/sahakar-celebrations/src/components/effects/MouseGlow.tsx) to automatically pause requestAnimationFrame when the cursor is idle.
- **UX & Backend Validation**:
  - Integrated a user feedback error alert block in [RSVPForm.tsx](file:///e:/K4NN4N/sahakar-celebrations/src/sections/RSVPForm.tsx) for network failures.
  - Aligned [Backend_Schema.md](file:///e:/K4NN4N/sahakar-celebrations/docs/Backend_Schema.md) definitions to match the simpler schema in `api/rsvp.ts` (removing unnecessary phone and email column constraints).
- **SEO & Social Previews**:
  - Configured a custom-designed luxury social preview card [social-preview.png](file:///e:/K4NN4N/sahakar-celebrations/public/social-preview.png) and updated Open Graph tags in [index.html](file:///e:/K4NN4N/sahakar-celebrations/index.html).
  - Corrected meta keywords in [index.html](file:///e:/K4NN4N/sahakar-celebrations/index.html) to target the actual couples.

---

## v1.7.0 — 2026-05-20 | Live Database Integration & UX Polish
- **Neon DB Integration**: Fully connected the `api/rsvp.ts` handler to the Neon PostgreSQL database via `DATABASE_URL` environment variables.
- **Dynamic Wishes Wall**: Implemented real-time fetching of guest wishes from the database, replacing all static dummy data in the `RSVPForm` component.
- **Centralized Wedding Config**: Created a modular configuration system (`src/config/wedding/`) to manage venue, couple, and timing data across the entire app from a single source of truth.
- **UX Refinement**: 
  - Removed all hard section dividers and line separators to create a seamless "smudged" single-page flow.
  - Implemented dynamic "Scroll to Explore" indicator that fades out once user engagement is detected.
  - Integrated dynamic WhatsApp/Instagram sharing logic that automatically detects and uses the current website URL.
- **Legal & Branding**: Updated all footer references to "Sahakar Medical Ventures" and added designer credits with GitHub integration.

---

## v1.6.0 — 2026-05-20 | Dynamic Couples Data Structure & Showcase Refactor
- **Dynamic Couples Content**: Created `src/content/couples.ts` defining structured data for each couple (Muhammed Shabin & Sana, Mohammed Sameer & Nihala) supporting themes, invitation URLs, descriptions, and media paths.
- **Showcase Integration**: Refactored `CoupleShowcase.tsx` to dynamically map imported items from the content module instead of hardcoding entries.
- **Local Media**: Copied local JPEG images to the public root folder (`sameer-nihala-1.jpeg` and `sameer-nihala-2.jpeg`) and mapped them as the primary showcase media in the configuration files.
- **Auto-Scrolling Carousel**: Upgraded the `CoupleCard` component to accept arrays of images, rendering them in a cross-fading background carousel that automatically cycles every 5 seconds without user interaction.

---

## v1.5.0 — 2026-05-20 | Documentation Restore & Repository Analysis
- **Documentation Recovery**: Reconstructed the complete documentation directory (`/docs`) containing `PRD.md`, `TRD.md`, `UI_UX_Design.md`, `Appflow.md`, `Backend_Schema.md`, and `Implementation_Plan.md` which were removed during Vite template initialization.
- **Master Index**: Created `plan.md` in the root workspace directory to link all spec files.
- **Verification Audit**: Verified layout performance, asset compilations, and form dispatch fallback flows via automated browser previews.

---

## v1.4.0 — 2026-05-20 | RSVP Validation & Serverless Database API
- **Spam Protection**: Integrated an anti-spam honeypot input field hidden from screen readers and pointer-events.
- **Input Validation**: Added validations for name length, email patterns, phone formats, and conditional guest counters.
- **API Function**: Authored Vercel Serverless Function `api/rsvp.ts` using `pg` clients to route RSVPs into a Neon serverless PostgreSQL instance.
- **Fallback Simulation**: Programmed a 1.5-second fallback delay that returns mock success statuses if the database connection string is absent.

---

## v1.3.0 — 2026-05-20 | Core Page Sections & Calendar Integrations
- **Personalized Welcomes**: Configured `Hero.tsx` to read parameter mappings (`guest`, `invite`) and render custom badge tags and greetings.
- **Couple Showcase**: Integrated `CoupleShowcase.tsx` displaying card previews with spring-loaded reveals.
- **Event Schedule**: Programmed `EventTimeline.tsx` with date, location, and dress code sections along with single-click Add-to-Google-Calendar anchors.
- **Venue Navigation**: Embedded an inverted dark Google Map iframe and directions redirect link in `VenueMap.tsx`.

---

## v1.2.0 — 2026-05-20 | Cinematic Intros & Ambient VFX Engines
- **Splash Sequence**: Created `SplashIntro.tsx` to overlay the screen with an SVG monogram "S" crest. Configured GSAP timelines to reveal elements on load and slide-up the page after click consent is granted.
- **Continuous Audio**: Unlocked browser audio policies upon Splash interaction and coded fade transitions on visibility shifts.
- **Falling Dust Particles**: Created `ParticleCanvas.tsx` rendering falling gold dust circles dynamically at 60 FPS using an HTML5 `<canvas>`.
- **Desktop Cursor Glow**: Added a subtle cursor-tracking radial shadow aura for mouse-driven browsers.

---

## v1.1.0 — 2026-05-20 | Scaffolding & Dependencies
- **Project Bootstrapping**: Scaffolding of React 19 and TypeScript template using Vite 8.
- **Production Packages**: Installed `gsap`, `lenis`, `framer-motion`, `lucide-react`, `clsx`, and `tailwind-merge`.
- **Tailwind CSS v4**: Installed `@tailwindcss/vite` compiler plugin, removing legacy JS config layouts, and set custom color variables (`--color-gold`, `--color-obsidian`) in `src/index.css`.

---

## v1.0.0 — 2026-05-20 | Initial Design Drafts
- **Architecture Blueprints**: Drafted structural outlines, database designs, user journeys, animation division rules, and implementation phases.
