# Armorie — Design System

A peaceful, calming design system for contemplative Bible study.

---

## Always

### Component Architecture
- Create highly modular components — single responsibility, composable
- Refactor anything longer than 150 lines whenever possible
- Extract repeated patterns into shared components after 2 uses
- Co-locate component styles, types, and tests

### Never Assume Designs
- Do NOT create or invent UI elements, layouts, or styling
- Do NOT use generic templates or boilerplate designs
- If design specifications are unclear, ASK before proceeding
- Wait for explicit design files, mockups, or detailed descriptions

### Use Styling from Figma
- Extract all styles directly from Figma (colors, typography, spacing, shadows, borders)
- Use Figma Inspect panel for precise values
- Copy CSS properties verbatim when provided
- Maintain exact oklch values — do not convert to hex/rgb

### Stick to the Layout
- Implement the exact layout structure shown in designs
- Preserve grid systems, column counts, and breakpoints
- Do NOT rearrange elements for "better UX" without approval
- Match component hierarchy exactly as designed

### Always Download Reused Icons as SVG
- Extract icons as SVG from Figma (unless explicitly told otherwise)
- Preserve viewBox, stroke-width, and path data
- Maintain icon dimensions and styling properties
- Use inline SVG or optimize with SVGO when appropriate

---

## Color System — Teal Haven

Armorie uses three semantic color scales built on oklch for perceptual uniformity.

### The Three Scales

| Scale | Hue | Anchor (500) | Purpose |
|-------|-----|--------------|---------|
| **Primary** | 192 (Teal) | `oklch(0.772 0.019 192.76)` | Brand identity, backgrounds, navigation, default UI |
| **Secondary** | 359 (Rose) | `oklch(0.72 0.045 359.76)` | Warm emphasis, CTAs, links, important actions |
| **Accent** | 245 (Slate Blue) | `oklch(0.52 0.045 245.52)` | Supporting UI, tags, muted text, subtle elements |

### Scale Structure (50–950)

Each scale runs from light to dark, anchored at 500. **Compressed range** — scales start at ~0.94 lightness (not 0.98) so light values have visible color.

| Range | Use |
|-------|-----|
| **50–100** | Subtle backgrounds, tag fills |
| **200–300** | Borders, dividers, hover states |
| **400–500** | Mid-tone (500 = anchor color) |
| **600–700** | Text on light backgrounds (accessible contrast) |
| **800–950** | Headings, maximum contrast |

### Scale Values

#### Primary (Teal — Hue 192)
Anchor: `oklch(0.772 0.019 192.76)` — soft teal
```css
--primary-50:  oklch(0.97 0.008 192);   /* Very light bg */
--primary-100: oklch(0.94 0.012 192);   /* Light bg */
--primary-200: oklch(0.90 0.016 192);   /* Borders, subtle */
--primary-300: oklch(0.86 0.018 192);   /* Hover states */
--primary-400: oklch(0.81 0.019 192);   /* Approaching anchor */
--primary-500: oklch(0.772 0.019 192.76); /* ⬅ ANCHOR */
--primary-600: oklch(0.65 0.022 192);   /* Darker, icons */
--primary-700: oklch(0.52 0.028 192);   /* Text on light bg */
--primary-800: oklch(0.40 0.032 192);   /* Strong text */
--primary-900: oklch(0.28 0.028 192);   /* Very dark */
--primary-950: oklch(0.18 0.020 192);   /* Near black */
```

#### Secondary (Rose — Hue 359)
Anchor: `oklch(0.72 0.045 359.76)` — warm rose
```css
--secondary-50:  oklch(0.94 0.022 359);   /* Light bg, visible pink */
--secondary-100: oklch(0.90 0.035 359);   /* Tag fills */
--secondary-200: oklch(0.86 0.048 359);   /* Borders */
--secondary-300: oklch(0.82 0.052 359);   /* Hover states */
--secondary-400: oklch(0.77 0.050 359);   /* Approaching anchor */
--secondary-500: oklch(0.72 0.045 359.76); /* ⬅ ANCHOR */
--secondary-600: oklch(0.60 0.065 359);   /* Darker, emphasis */
--secondary-700: oklch(0.48 0.075 359);   /* Text on light bg */
--secondary-800: oklch(0.38 0.068 359);   /* Strong text */
--secondary-900: oklch(0.28 0.050 359);   /* Very dark */
--secondary-950: oklch(0.18 0.035 359);   /* Near black */
```

#### Accent (Slate Blue — Hue 245)
Anchor: `oklch(0.52 0.045 245.52)` — slate blue
```css
--accent-50:  oklch(0.94 0.018 245);   /* Light bg, visible blue */
--accent-100: oklch(0.90 0.028 245);   /* Tag fills */
--accent-200: oklch(0.84 0.038 245);   /* Borders */
--accent-300: oklch(0.76 0.045 245);   /* Hover states */
--accent-400: oklch(0.64 0.048 245);   /* Approaching anchor */
--accent-500: oklch(0.52 0.045 245.52); /* ⬅ ANCHOR */
--accent-600: oklch(0.42 0.050 245);   /* Darker, icons */
--accent-700: oklch(0.34 0.048 245);   /* Text on light bg */
--accent-800: oklch(0.26 0.042 245);   /* Strong text */
--accent-900: oklch(0.20 0.032 245);   /* Very dark */
--accent-950: oklch(0.14 0.022 245);   /* Near black */
```

### Usage Principles

#### Contrast Pairing
Always pair light backgrounds with dark text from the same scale:

```jsx
// ✓ Correct — same scale, accessible contrast
<span className="bg-primary-100 text-primary-700">Comfort</span>
<span className="bg-secondary-100 text-secondary-700">Shepherd</span>
<span className="bg-accent-100 text-accent-700">Peace</span>

// ✗ Avoid — mixing scales for bg/text without intention
<span className="bg-primary-100 text-accent-700">Confusing</span>
```

#### Semantic Tokens
Use semantic tokens for consistency with shadcn/ui components:

| Token | Maps To | Use |
|-------|---------|-----|
| `bg-background` | `primary-50` | Page-level background |
| `text-foreground` | `primary-950` | Primary text |
| `bg-card` | white | Elevated surfaces |
| `bg-muted` | `accent-100` | De-emphasized backgrounds |
| `text-muted-foreground` | `accent-700` | Secondary text |
| `border-border` | `primary-200` | All borders |
| `ring-ring` | `secondary-500` | Focus states |

#### Scale Selection Guide

| Intent | Scale | Example |
|--------|-------|---------|
| Default UI, navigation | Primary | Sidebar, cards, primary buttons |
| Draw attention, action | Secondary | Submit buttons, links, notifications |
| Supporting, neutral | Accent | Tags, badges, secondary text |

### Dark Mode

Scales automatically invert in dark mode (50 becomes dark, 950 becomes light). Semantic tokens handle this — prefer tokens over raw scale values when possible.

### Never

- Do NOT use raw oklch values — always reference scale variables
- Do NOT mix scales arbitrarily — each scale has semantic meaning
- Do NOT invent new colors — if a color doesn't exist in the scales, ask
- Do NOT use Tailwind's built-in color palettes (slate, zinc, rose, etc.) — use our scales exclusively

---

## Typography

*To be defined — waiting for Figma specs.*

---

## Spacing

*To be defined — waiting for Figma specs.*

---

## Components

*Component-specific guidelines will be added as patterns emerge.*
