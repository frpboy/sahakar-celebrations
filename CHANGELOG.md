# Changelog

## 2026-05-27

### Performance And Loading (Non-Visual)
- Optimized gallery/couple image delivery by generating responsive asset variants in `public/` (`640`, `960`, `1280` widths).
- Updated `src/sections/CoupleShowcase.tsx` to choose image variant by viewport width and device pixel ratio while preserving the original premium visual rendering.
- Added network warmup hints in `index.html`:
  - `preconnect` for `fonts.googleapis.com`
  - `preconnect` for `fonts.gstatic.com`
  - `preconnect` for `www.clarity.ms`
- Deferred Microsoft Clarity initialization using `requestIdleCallback` fallback timeout so initial render gets higher priority.
- Added `vercel.json` cache headers for long-lived immutable static asset caching and root revalidation.

### Social Metadata
- Created production OG card image at `public/social-preview.png`.
- Confirmed OG/Twitter tags in `index.html` already reference `/social-preview.png`.

### iOS/WebKit Photo Tint Mitigation
- Added iOS/WebKit-specific safety rules in `src/index.css` to reduce yellow-shading risk from blend/filter interactions:
  - softened film grain blend behavior on WebKit
  - safer backdrop filter fallback for `.glass-card`
  - introduced `.ios-photo-safe` rendering isolation class
- Applied `.ios-photo-safe` to the couple photo layer in `src/sections/CoupleShowcase.tsx`.
- Updated `src/sections/VenueMap.tsx` to disable aggressive map iframe color filter only on iOS WebKit.

### Verification
- Built successfully after each major change set with `npm run build`.

### Cross-Project Rollout (Completed In Parallel Repositories)
- Applied the same non-visual optimization strategy to:
  - `E:\K4NN4N\sameer-weds-nihala`
  - `E:\K4NN4N\shabin-weds-sana`
- Included responsive image variants, device-aware image selection, Clarity deferral, and cache header updates in those projects.
