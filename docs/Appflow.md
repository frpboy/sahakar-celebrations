# Sahakar Celebration Portal - Appflow and Navigation Document

## 1. User Journey Flow
The portal operates as a single-page application (SPA) structured as a choreographed journey. The path from initial link click to RSVP confirmation is mapped below:

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Invited Guest
    participant URL as URL Decoder
    participant Splash as Splash Intro Scene
    participant MainApp as Main Experience (Hero, Showcase, Timeline, Map)
    participant Audio as Music Engine
    participant API as RSVP Endpoint (Vercel Node)

    Guest->>URL: Visits invitation link (with guest/invite params)
    URL->>URL: Extracts guest name & invite tier (VIP/General/Family)
    Guest->>Splash: Lands on loading screen (Crest and "Enter Experience" visible)
    Guest->>Splash: Clicks "Enter Experience"
    Splash->>Audio: Play luxury background track (Fades in from 0.0 to 0.3)
    Splash->>MainApp: GSAP slide-up transition & reveal main website content
    Guest->>MainApp: Scroll down with Lenis smooth easing
    MainApp->>MainApp: View Hero (Personalized Greeting)
    MainApp->>MainApp: View Couples Showcase & Event Timeline
    MainApp->>MainApp: View Google Maps Venue Navigation
    Guest->>MainApp: Fills and Submits RSVP Form
    MainApp->>API: POST /api/rsvp (payload containing attendance details)
    API-->>MainApp: Returns success message and registration ID
    MainApp->>Guest: Displays "Thank You" confirmation card
```

---

## 2. Interactive Navigation States

### 2.1 Audio State Machine
* **Init (Default)**: Volume is at `0`. State is unplayed.
* **Consent Granted (Enter Clicked)**: Player executes `play()`, fading volume up to `0.3` over 2 seconds.
* **User Manual Toggle (Mute Button)**: Smoothly fades volume down to `0` over 1 second, then pauses. Toggling back plays and fades volume to `0.3`.
* **Tab Focus Loss (visibilitychange)**: Fades volume to `0` and pauses. Resuming tab focus restarts play and fades back to `0.3`.

### 2.2 Content Easing & Layout
* **Smooth Easing**: Governed by Lenis to ensure uniform velocity across varying trackpads and mouse wheels.
* **Conditional Visibility**: The RSVP "Total Guests" input is hidden unless the user selects "Accepts With Pleasure".
