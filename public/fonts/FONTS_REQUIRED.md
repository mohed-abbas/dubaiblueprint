# Required Fonts for Dubai Blueprint

## Haffer-TRIAL (Display Font)

The Figma design uses **Haffer-TRIAL** as the primary display font for headlines and UI elements.

### Required Files
Place the following font files in this directory:
- `Haffer-Regular.woff2` (weight: 400)
- `Haffer-Medium.woff2` (weight: 500)

### Where to Get
Haffer is a commercial font by Displaay Type Foundry:
- Website: https://displaay.net/typeface/haffer/
- Trial version may be available for testing

### Setup After Adding Fonts
1. Add font files to `/public/fonts/`
2. Uncomment the Haffer font config in `/src/app/layout.tsx`
3. Add `${haffer.variable}` to the body className

## Inter (Body Font)

Already configured via Google Fonts in `layout.tsx`. No action needed.

## Current Fallback
Until Haffer is added, the design will use Inter as a fallback (similar clean sans-serif aesthetic).
