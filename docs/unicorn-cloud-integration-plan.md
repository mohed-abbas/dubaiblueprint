# Plan: Unicorn Studio Cloud Embed Integration for HeroDay

## Overview
Integrate Unicorn Studio animated cloud effect into the HeroDay section. The cloud animation will layer between the background image and the Burj Khalifa, creating a dynamic sky effect.

---

## Current Layer Stack Analysis

```
CURRENT Z-INDEX HIERARCHY:
┌─────────────────────────────────────────────┐
│ .heroDetails    (z-index: 10 / --z-dropdown)│  ← TOP
│ .headline       (z-index: 10 / --z-dropdown)│
│ .lensFlare      (z-index: 0  / --z-base)    │
│ .heroAsset      (z-index: 0  / --z-base)    │
│ .heroBackground (z-index: -1 / --z-behind)  │  ← BOTTOM
└─────────────────────────────────────────────┘
```

---

## Target Layer Stack (After Integration)

```
NEW Z-INDEX HIERARCHY:
┌─────────────────────────────────────────────┐
│ .heroDetails    (z-index: 10 / --z-dropdown)│  ← TOP
│ .headline       (z-index: 10 / --z-dropdown)│
│ .lensFlare      (z-index: 2)                │
│ .heroAsset      (z-index: 2)                │  Burj ON TOP of clouds
│ .cloudsLayer    (z-index: 1) ← NEW          │  Animated clouds
│ .heroBackground (z-index: -1 / --z-behind)  │  ← BOTTOM (sky gradient)
└─────────────────────────────────────────────┘
```

---

## Unicorn Studio Embed Details

- **Project ID:** `Gf7AK4z8RSeGsyIugEo7`
- **Native Dimensions:** 1512px × 982px
- **Technology:** WebGL canvas with animated clouds
- **Script URL:** `https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.2/dist/unicornStudio.umd.js`

---

## Implementation Steps

### Step 1: Create UnicornEmbed Component

**New File:** `src/components/UnicornEmbed/UnicornEmbed.tsx`

```typescript
"use client";

import { useEffect, useRef } from "react";
import styles from "./UnicornEmbed.module.css";

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}

interface UnicornEmbedProps {
  projectId: string;
  className?: string;
}

export function UnicornEmbed({ projectId, className }: UnicornEmbedProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize Unicorn Studio
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.2/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init?.();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init?.();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  return (
    <div
      data-us-project={projectId}
      className={`${styles.embed} ${className || ""}`}
    />
  );
}
```

**New File:** `src/components/UnicornEmbed/UnicornEmbed.module.css`

```css
.embed {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Ensure canvas fills container */
.embed > canvas,
.embed > div {
  width: 100% !important;
  height: 100% !important;
}
```

**New File:** `src/components/UnicornEmbed/index.ts`

```typescript
export { UnicornEmbed } from "./UnicornEmbed";
```

### Step 2: Add Cloud Layer CSS to HeroDay

**Modify:** `src/components/HeroDay/HeroDay.module.css`

Add new `.cloudsLayer` class:

```css
/* ===================
 * CLOUDS LAYER
 * Unicorn Studio animated clouds
 * =================== */

.cloudsLayer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: screen;
}

/* Hide on mobile for performance */
@media (max-width: 768px) {
  .cloudsLayer {
    display: none;
  }
}
```

Update `.heroAsset` and `.lensFlare` z-index to ensure they appear ABOVE clouds:

```css
.heroAsset {
  /* ... existing styles ... */
  z-index: 2;  /* Changed from var(--z-base) */
}

.lensFlare {
  /* ... existing styles ... */
  z-index: 2;  /* Changed from var(--z-base) */
}
```

### Step 3: Integrate into HeroDay Component

**Modify:** `src/components/HeroDay/HeroDay.tsx`

Add import:
```typescript
import { UnicornEmbed } from "@/components/UnicornEmbed";
```

Add clouds layer between background and heroAsset in JSX:
```tsx
{/* Background Image */}
<div className={styles.heroBackground} data-node-id="122:135">
  <Image ... />
</div>

{/* Animated Clouds Layer - NEW */}
<div className={styles.cloudsLayer}>
  <UnicornEmbed projectId="Gf7AK4z8RSeGsyIugEo7" />
</div>

{/* Hero 3D Asset (Burj) */}
<div ref={assetRef} className={styles.heroAsset} data-node-id="122:242">
  ...
</div>
```

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/UnicornEmbed/UnicornEmbed.tsx` | Create | Reusable Unicorn Studio wrapper |
| `src/components/UnicornEmbed/UnicornEmbed.module.css` | Create | Embed positioning styles |
| `src/components/UnicornEmbed/index.ts` | Create | Barrel export |
| `src/components/HeroDay/HeroDay.tsx` | Modify | Add clouds layer |
| `src/components/HeroDay/HeroDay.module.css` | Modify | Add cloudsLayer, update z-indexes |

---

## Rollback Safety

**Zero Breaking Changes:**
- All changes are additive (new component, new layer)
- Existing background image remains as fallback
- To disable: remove UnicornEmbed import and cloudsLayer div
- No modifications to existing functionality

**Fallback Behavior:**
- If Unicorn Studio fails to load, background image is still visible
- On mobile (< 768px), clouds hidden for performance
- respects `prefers-reduced-motion` if needed (future enhancement)

---

## Verification Checklist

- [ ] `npm run build` completes without errors
- [ ] Clouds animate above background, below Burj Khalifa
- [ ] CTA button and links remain clickable (pointer-events: none on clouds)
- [ ] Mobile view: clouds hidden, Burj still visible
- [ ] No console errors related to Unicorn Studio
- [ ] GSAP animations still work correctly
