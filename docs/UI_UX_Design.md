# Sahakar Celebration Portal - UI/UX Design Document

## 1. Design System & Brand Identity

### Aesthetic Philosophy
The visual architecture is styled around **Ceremonial Luxury**. The layout mirrors high-end physical invitations using deep obsidian backdrops, royal velvet containers, champagne gold typography details, and subtle ivory text.

### Design Tokens (Colors)
* **Obsidian (Primary Background)**: `#0D0C10` (90% layout area)
* **Velvet (Section Backing / Containers)**: `#16141D` (Used in glassmorphic cards)
* **Champagne Gold (Highlights / Monogram)**: `#DFBA73`
* **Light Gold (Gradients / CTA)**: `#F2D794`
* **Dark Gold (Borders / Muted Copy)**: `#A48F65`
* **Ivory (Primary Typography)**: `#F5F3EF`
* **Royal Crimson (Error / Accents)**: `#7D2235`

### Typography Rules
* **Serif Header Font**: `Cinzel`, `Playfair Display`, serif (Used for titles, names, headers)
* **Sans Body Font**: `Inter`, `Montserrat`, sans-serif (Used for timelines, form inputs, navigation links)

---

## 2. Interactive Components

### 2.1 Monogram & Crest
The Splash page displays a custom-designed vector monogram representing the "S" for Sahakar. It utilizes an animated gradient ring stroke, dashed accents, and luxury serif lettering.

### 2.2 Glassmorphic Cards (`glass-card`)
Cards are designed using high blur ratios to overlay sections beautifully on the particle canvas:
* **Background**: `rgba(22, 20, 29, 0.65)`
* **Filter**: `backdrop-filter: blur(12px) saturate(180%)`
* **Border**: `1px solid rgba(223, 186, 115, 0.12)`
* **Hover State**: Border shifts to `rgba(223, 186, 115, 0.3)` with a soft outer drop shadow glow (`0 0 25px rgba(223, 186, 115, 0.1)`).

### 2.3 Falling Gold Dust Canvas
Particles represent gold dust falling down the screen.
* **Canvas blending**: `mix-blend-mode: screen`
* **Glow styling**: Radial gradient fill drawing soft champagne gold circles with a `shadowBlur` shadow offset.
* **Wind Vector**: Pushing particles away dynamically based on cursor coordinates.

### 2.4 Mouse Glow Aura
A radial gradient glow follows the cursor on desktop displays:
* **Style**: `radial-gradient(circle, rgba(223, 186, 115, 0.08) 0%, rgba(22, 20, 29, 0) 70%)`
* **Blend mode**: `screen`
