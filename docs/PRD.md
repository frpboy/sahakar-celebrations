# Sahakar Celebration Portal - Product Requirements Document (PRD)

## 1. Document Control
* **Status**: Approved / Implemented
* **Author**: Antigravity
* **Date**: 2026-05-20 (IST)
* **Target Release**: v1.0.0 (Production Ready)

---

## 2. Product Vision & Philosophy
The **Sahakar Celebrations Portal** is a high-end, premium digital invitation and RSVP coordination platform designed specifically for the matrimonial unions and ceremonial gatherings of the Sahakar Family. 

Unlike generic digital invitation cards, this portal delivers an **elite, cinematic, and emotional experience** that reflects the prestige of the Sahakar Family. It establishes a premium visual narrative using bespoke typography, smooth animations, ambient orchestral audio, and dynamic particle effects.

---

## 3. User Personas
1. **VIP / Distinguished Guests**: State dignitaries, business partners, and elders who expect flawless rendering, clear schedules, and dedicated family concierge numbers.
2. **General Guests & Friends**: Tech-savvy peers who want instant access to navigation links, calendar sync options, and a simple mobile-optimized RSVP form.
3. **Internal Family Admin / Event Planners**: Rely on accurate guest counts, dietary notes, and contact details gathered through the RSVP mechanism.

---

## 4. Key Product Features (MVP)
* **Cinematic Entry (Splash Screen)**: A luxurious intro page showcasing the "S" monogram crest, locking interaction, and fading transitions before revealing the main invitation details.
* **Ambient FX Engine**: Continuous falling gold dust particles and a dynamic desktop cursor glow to create an immersive, premium environment.
* **Contextual Personalization**: Decodes invitation parameters from the URL (`guest`, `invite`, `to`) to display custom greetings and set general or VIP invite badges.
* **Celebration Schedule**: A detailed, responsive timeline highlighting events, locations, dress codes, and single-click Google Calendar integration.
* **Interactive Venue Routing**: Dark-mode customized Google Maps frame with a "Navigate to Venue" action directing users to Google Maps.
* **Secure, Validated RSVP Form**: A responsive input form capturing guest details, dietary preferences, and total guest counts with integrated honeypot anti-spam protection.

---

## 5. Non-Functional Requirements & Constraints
* **Device Compatibility**: Responsive layouts targeting high-end iOS (Safari webkit optimization) and Android devices.
* **Audio Constraints**: Autoplay restrictions are bypassed by securing user consent via the Splash "Enter Experience" button.
* **Performance**: Lightweight canvas rendering for particles to prevent battery drain and preserve device frames-per-second (FPS).
