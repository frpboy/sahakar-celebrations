# Sahakar Celebration Portal 🥂

A sophisticated, high-end digital invitation platform built for the Sahakar Family matrimonial unions. Focused on luxury, cinematic storytelling, and seamless guest coordination.

---

## ✨ Features

- **Cinematic Experience**: Immersive splash entry with SVG monogram reveals and ambient audio transitions.
- **Live Wishes Wall**: Real-time guest blessings fetched directly from a **Neon (PostgreSQL)** database.
- **Smart RSVP**: Robust form with guest count steppers, automated spam protection (honeypot), and instant database synchronization.
- **Concierge Integration**: One-click Google Calendar scheduling and direct Google Maps navigation for the venue.
- **Social Sharing**: Dynamic WhatsApp and Instagram invite generators that automatically use the live site URL.
- **Adaptive Personalization**: Dynamic greetings based on URL parameters (e.g., `?guest=Name`).
- **Luxury UI**: Obsidian & Gold theme built with **Tailwind CSS v4**, featuring glassmorphism and smooth inertia scrolling via **Lenis**.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Animations**: GSAP (Cinematic transitions), Framer Motion (UI reveals)
- **Styling**: Tailwind CSS v4 (Alpha/Vite plugin)
- **Backend**: Vercel Serverless Functions (Node.js/TypeScript)
- **Database**: Neon Serverless PostgreSQL
- **Utilities**: Lenis (Smooth scroll), Lucide React (Icons)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Neon.tech database account
- Vercel CLI (for local API testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/frpboy/sahakar-celebrations.git
   cd sahakar-celebrations
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your_neon_postgresql_connection_string"
   ```

4. **Database Schema**
   Run the following SQL in your Neon console:
   ```sql
   CREATE TABLE IF NOT EXISTS rsvps (
       id SERIAL PRIMARY KEY,
       full_name TEXT NOT NULL,
       attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'declined')),
       guest_count INTEGER DEFAULT 0,
       wishes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

- `api/`: Vercel Serverless Functions (Backend logic)
- `docs/`: Comprehensive project documentation (PRD, TRD, UI/UX)
- `src/components/`: Reusable UI elements and VFX engines
- `src/config/`: Centralized wedding and venue data
- `src/sections/`: High-level page sections (Hero, Timeline, RSVP, etc.)
- `src/lib/`: Shared utility functions (Maps, Calendar)

---

## 📜 Credits

Designed and brought to life with love by **[Rahul](https://github.com/frpboy)**.

© 2026 **Sahakar Medical Ventures**. All rights reserved.
