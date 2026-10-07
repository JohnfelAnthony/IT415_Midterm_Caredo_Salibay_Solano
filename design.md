---
version: "alpha"
name: "Steampunk Vitoriano"
description: "Victorian steampunk landing page. Ideal for landing pages, saas. AI-ready template."
colors:
  primary: "#B5A642"
  secondary: "#5C0000"
  tertiary: "#704214"
  neutral: "#F5DEB3"
  surface: "#B87333"
  accent: "#008080"
typography:
  h1:
    fontFamily: IM Fell English
    fontSize: 2.5rem
    fontWeight: 700
  body-md:
    fontFamily: IM Fell English
    fontSize: 1rem
    fontWeight: 400
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    padding: 12px
---

## Overview

Victorian steampunk landing page. Ideal for landing pages, saas. AI-ready template. Victorian Steampunk isn't just cogs glued onto top hats. It's a specific design lineage rooted in the speculative machinery of Jules Verne and H.G. Wells — writers who imagined futures built from brass, steam, and obsessive ornamentation. Their worlds weren't minimalist. They were layered, riveted, overwrought in the best possible way. Every surface carried information.

The Victorian era itself was drunk on mechanical complexity. Exposed clockwork, filigree ventilation grilles, engraved nameplates on industrial equipment — these weren't decorative afterthoughts, they were the interface. The machine communicated its function through its form. That's the translation opportunity for UI: borders that feel forged rather than drawn, typography with the weight of letterpress, navigation that suggests physical mechanisms rather than flat abstractions.

What separates Victorian Steampunk from generic steampunk is restraint within excess. Real Victorian engineering had rules — symmetry, proportion, hierarchical ornamentation that guided the eye. The best steampunk interfaces honor that structure instead of just piling on texture. Gears should turn with purpose. Brass should patina where hands would touch.

- Density: 5/10 — Balanced
- Variance: 8/10 — Expressive
- Motion: 6/10 — Expressive

- **Style:** Ornate, Mechanical, Adventurous
- **Keywords:** steampunk, victorian, ornate, mechanical, adventurous, brass, gears, leather, intricate, imaginative
- **Era:** 19th Century, Industrial Revolution Fantasy
- **Light/Dark:** ✓ Full / ✗ No

## Colors

- **Brass** (#B5A642) — Primary surface or dominant color
- **Rich Mahogany** (#5C0000) — Secondary surface or text color
- **Sepia** (#704214) — Supporting palette color
- **Parchment** (#F5DEB3) — Supporting palette color
- **Copper** (#B87333) — Metallic accent, decorative detail
- **Deep Teal** (#008080) — Secondary accent
- **Clockwork Orange** (#D46A00) — Warm accent, call-to-action secondary
- **Ivory** (#FFFFF0) — Secondary surface


## Typography

- **Display / Hero:** IM Fell English — Weight 700, tight tracking, used for headline impact
- **Body:** IM Fell English — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** IM Fell English — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, and technical values

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem


## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Asymmetric composition.
- **Feature sections:** Asymmetric grid with varied card sizes. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).


## Elevation & Depth

Intricate gear animations, brass borders, leather textures, detailed illustrations, vintage typography, gas lamp glows, schematic overlays, interactive mechanical elements

- **Physics:** Spring — stiffness 120, damping 20. Confident, weighted transitions.
- **Entry animations:** Fade + translate-Y (16px → 0) over 480ms ease-out. Staggered cascades for lists: 100ms between items.
- **Hover states:** Scale(1.03) + shadow lift over 200ms.
- **Page transitions:** Fade + slide (300ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.


## Shapes

Base corner radius: 8px. See rounded tokens in front matter for the full scale.


## Components

- **Primary Button:** Subtly rounded (0.5rem) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Subtly rounded (0.5rem) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.


## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No pure black (#000000) — use off-black or charcoal variants
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

- Do Intricate gear animations
- Do Brass borders
- Do Leather textures
- Do Detailed illustrations
- Do Vintage typography
- Do Gas lamp glows


## Use Case

Landing pages, SaaS

<!-- Source: https://designmd.app/library/steampunk-vitoriano · designmd.app -->
