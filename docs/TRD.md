# Sahakar Celebration Portal - Technical Requirements Document (TRD)

## 1. System Architecture
The portal is structured as a high-performance Single Page Application (SPA) leveraging Vercel Serverless Functions for database integration.

* **Frontend**: React 19 (TypeScript) + Vite 8
* **Styling**: Tailwind CSS v4 (@tailwindcss/vite plugin integration)
* **Animations**: GSAP (GreenSock Animation Platform) + Framer Motion
* **Scrolling**: Lenis Smooth Scroll
* **Backend API**: Vercel Serverless Function (`api/rsvp.ts`)
* **Database**: Neon Serverless PostgreSQL (optional, fallback simulation)

---

## 2. Directory Layout & Code Standards
```
/
├── api/
│   └── rsvp.ts              # Vercel serverless function
├── public/
│   ├── favicon.svg          # Custom favicon
│   └── icons.svg            # Asset icons
├── src/
│   ├── assets/              # Standard image files
│   ├── components/
│   │   ├── cinematic/       # SplashIntro loading orchestrations
│   │   ├── effects/         # ParticleCanvas & MouseGlow canvas components
│   │   └── ui/              # AudioToggle audio controls
│   ├── context/
│   │   └── MusicContext.tsx # Global audio toggle & volume fader controller
│   ├── hooks/
│   │   └── useGuest.ts      # Query string URL parameter decoder
│   ├── sections/            # Hero, CoupleShowcase, EventTimeline, VenueMap, RSVPForm
│   ├── App.tsx              # Main entry orchestration
│   ├── index.css            # Tailwind theme tokens & global classes
│   └── main.tsx             # React DOM bootstrapper
└── vite.config.ts           # Vite bundler & Tailwind v4 plugin configuration
```

---

## 3. Core Technical Orchestrations

### 3.1 Audio Autoplay Bypass Algorithm
To comply with strict browser policies (e.g. Chrome's MEI, iOS Safari autoplay restrictions), the web page initializes in a locked state.
1. The **SplashIntro** mounts a SVG monogram crest and displays an "Enter Experience" button.
2. Clicking "Enter Experience" serves as a direct user interaction context.
3. This triggers `setHasInteracted(true)` and invokes `playMusic()`, loading and playing the background audio track via a fade-in volume transition.

### 3.2 Smooth Scrolling & Animation Coexistence
* **Lenis Smooth Scroll** is initialized globally to decouple standard page scroll updates and map them to custom easing frames.
* **GSAP** governs absolute timeline transitions (e.g. the Splash exit slide-up sequence and the Hero section reveals).
* **Framer Motion** manages component-level structural triggers (e.g. the CoupleShowcase card reveals and RSVP conditional inputs).

---

## 4. Performance Targets
* **First Contentful Paint (FCP)**: < 1.0s
* **Time to Interactive (TTI)**: < 1.5s
* **Frame Rate (FPS)**: Constant 60 FPS on both desktop and mobile, achieved by offloading falling particles to an HTML5 `<canvas>` instead of managing DOM node overlays.
