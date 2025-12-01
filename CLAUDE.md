# Armorie

Bible verse mapping chat application — peaceful, calming, contemplative experience.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: assistant-ui, shadcn/ui (new-york style), Tailwind CSS v4
- **AI**: AI SDK v6 with OpenAI
- **Database**: Supabase (Postgres + Auth) — https://zvkbvmonxmahpitaeyok.supabase.co
- **Language**: TypeScript (strict mode)
- **Linting**: Biome

## Code Standards

### Always
- Write TypeScript with strict types — avoid `any`
- Use server components by default, `"use client"` only when needed
- Prefer composition over prop drilling
- Handle errors gracefully with proper error boundaries
- Use async/await, not callbacks or raw promises
- Limit MCP tokens responses to 4000 tokens

### Never
- Don't install packages without asking
- Don't modify package.json scripts without approval
- Don't create mock data or placeholder content unless explicitly requested
- Don't use console.log in production code
- Don't assume or invent UI — ask if unclear
- Don't use Tailwind's built-in color palettes (slate, zinc, rose) — use our custom scales

### Component Architecture
- Create highly modular components — single responsibility, composable
- Refactor anything longer than 150 lines whenever possible
- Extract repeated patterns into shared components after 2 uses
- Co-locate component styles, types, and tests

## Design System

See [DESIGN.md](./DESIGN.md) for the complete color system.

### Color System: "Teal Haven"

Three semantic oklch color scales:

| Scale | Hue | Anchor (500) | Purpose |
|-------|-----|--------------|---------|
| **Primary** | 192 (Teal) | `oklch(0.772 0.019 192.76)` | Brand identity, backgrounds, navigation, default UI |
| **Secondary** | 359 (Rose) | `oklch(0.72 0.045 359.76)` | Warm emphasis, CTAs, links, important actions |
| **Accent** | 245 (Slate Blue) | `oklch(0.52 0.045 245.52)` | Supporting UI, tags, muted text, subtle elements |

Each scale runs 50–950 (light to dark), anchored at 500. See [DESIGN.md](./DESIGN.md) for full oklch values.

### Design Rules

- Extract all styles from Figma verbatim (colors, typography, spacing, shadows, borders)
- Use Figma Inspect panel for precise values
- Maintain exact oklch values — do not convert to hex/rgb
- Implement exact layout structure shown in designs
- Preserve grid systems, column counts, and breakpoints
- Download reused icons as SVG from Figma
- Do NOT rearrange elements for "better UX" without approval

### Semantic Tokens

| Token | Maps To | Use |
|-------|---------|-----|
| `bg-background` | `primary-50` | Page-level background |
| `text-foreground` | `primary-950` | Primary text |
| `bg-card` | white | Elevated surfaces |
| `bg-muted` | `accent-100` | De-emphasized backgrounds |
| `text-muted-foreground` | `accent-700` | Secondary text |
| `border-border` | `primary-200` | All borders |
| `ring-ring` | `secondary-500` | Focus states |

### Contrast Pairing

Always pair light backgrounds with dark text from the same scale:

```jsx
// ✓ Correct
<span className="bg-primary-100 text-primary-700">Comfort</span>
<span className="bg-secondary-100 text-secondary-700">Shepherd</span>

// ✗ Avoid — mixing scales
<span className="bg-primary-100 text-accent-700">Confusing</span>
```

## Supabase

- **Project URL**: https://zvkbvmonxmahpitaeyok.supabase.co
- **Status**: Not yet integrated in codebase
- When setting up:
  - Use environment variables for API keys (.env.local)
  - Prefer server-side Supabase client for auth/database operations
  - Use Supabase Edge Functions for serverless operations when needed

## Project Structure

```
/armorie
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── globals.css       # Tailwind + color system
│   └── layout.tsx        # Root layout
├── components/
│   ├── assistant-ui/     # Chat components (assistant-ui)
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, helpers
├── AGENTS.md             # Agent guidelines (supplementary)
├── DESIGN.md             # Design system (complete color reference)
└── CLAUDE.md             # This file
```

## Development Workflow

### Scripts
```bash
bun dev        # Start dev server
bun build      # Build for production
bun start      # Start production server
bun lint       # Run Biome linting
bun format     # Format code with Biome
```

### Linting
- Uses Biome (not ESLint/Prettier)
- Check: `bun lint`
- Format: `bun format`

## Ask Before Proceeding

If any of these are unclear, **ask first**:
- UI layout or visual design
- Database schema changes
- New package installations
- Authentication flows
- API contract changes

## References

- Complete color system: [DESIGN.md](./DESIGN.md)
- Agent guidelines: [AGENTS.md](./AGENTS.md)
- Supabase dashboard: https://zvkbvmonxmahpitaeyok.supabase.co
