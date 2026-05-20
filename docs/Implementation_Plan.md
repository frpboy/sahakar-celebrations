# Sahakar Celebration Portal - Implementation Plan

This plan maps the modular development steps of the Sahakar Celebrations Portal from project bootstrapping to production deployment.

```
Phase 1 (Setup) ──> Phase 2 (Design & Core) ──> Phase 3 (Splash & Audio) ──> Phase 4 (Hero & GSAP)
                                                                                  │
Phase 7 (Release) <── Phase 6 (Backend API & DB) <── Phase 5 (Core Sections) <────+
```

---

## Phased Tasks & Verification

### Phase 1: Setup & Initialization
* [x] Initialize Vite 8 template with React 19 and TypeScript.
* [x] Install dependencies: `gsap`, `lenis`, `framer-motion`, `lucide-react`, `@tailwindcss/vite`, `clsx`, `tailwind-merge`.
* [x] Configure Tailwind CSS v4 in `vite.config.ts` and set up `src/index.css`.
* [x] Verify that `npm run build` succeeds.

### Phase 2: Design Tokens & Custom Effects
* [x] Set custom luxury font-face imports (`Cinzel`, `Playfair Display`, `Inter`).
* [x] Implement the `ParticleCanvas.tsx` canvas dust particle generator.
* [x] Create `MouseGlow.tsx` cursor light tracer.
* [x] Verification: Run local server using `npm run dev` and confirm canvas draws particles fluidly at 60fps.

### Phase 3: Splash Screen & Audio Consent
* [x] Create `MusicContext.tsx` to handle browser autoplay policies.
* [x] Design `SplashIntro.tsx` screen featuring the vector "S" monogram crest.
* [x] Implement entry transition: click triggers GSAP slide-up, starting the audio playback simultaneously.
* [x] Verification: Test tab blur changes. Confirm backgrounding pauses/resumes audio.

### Phase 4: Hero Section & GSAP Revealers
* [x] Code `useGuest.ts` query decoder (processes name capitalizations and VIP tags).
* [x] Design the `Hero.tsx` greeting block and invitation summaries.
* [x] Configure GSAP timelines to stagger fade-in headings on scene entry.

### Phase 5: Core App Sections
* [x] Code `CoupleShowcase.tsx` using spring reveals in Framer Motion.
* [x] Create `EventTimeline.tsx` incorporating Google Calendar template query hooks.
* [x] Add the custom inverted dark maps container in `VenueMap.tsx`.

### Phase 6: RSVP Form Validation & Serverless Integration
* [x] Write `RSVPForm.tsx` fields (Names, Phones, email validation, honeypot inputs).
* [x] Implement `api/rsvp.ts` Vercel function using a connection pool for Neon.
* [x] Verification: Attempt form submits. Check fallback simulation outputs.

### Phase 7: Production Release
* [x] Clean up config files and run a production bundle test build.
* [x] Configure Vercel projects settings (`vercel.json` routing configuration).
* [x] Push commits to production branch.
