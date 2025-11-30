# Armorie — Agent Guidelines

Armorie is a Bible verse mapping chat application built with Next.js 16, AI SDK v6, and assistant-ui. The experience should feel peaceful, calming, and contemplative.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: assistant-ui, shadcn/ui (new-york style), Tailwind CSS v4
- **AI**: AI SDK v6 with OpenAI
- **Database**: Supabase (Postgres + Auth)
- **Language**: TypeScript (strict)
- **Linting**: Biome

## Code Principles

### Always
- Write TypeScript with strict types — avoid `any`
- Use server components by default, `"use client"` only when needed
- Prefer composition over prop drilling
- Handle errors gracefully with proper error boundaries
- Use async/await, not callbacks or raw promises

### Never
- Don't install packages without asking
- Don't modify `package.json` scripts without approval
- Don't create mock data or placeholder content unless explicitly requested
- Don't use `console.log` in production code — use proper logging if needed

## Design

See [DESIGN.md](./DESIGN.md) for the complete design system.

**Key principles:**
- Never assume or invent UI — ask if unclear
- Extract all styles from Figma verbatim (oklch values, exact spacing)
- Use the three color scales: Primary (teal), Secondary (rose), Accent (slate)
- Modular components, max ~150 lines, refactor after 2 repeated patterns
- Download reused icons as SVG from Figma

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
├── AGENTS.md             # This file
└── DESIGN.md             # Design system documentation
```

## Asking for Clarification

If any of the following are unclear, **ask before proceeding**:
- UI layout or visual design
- Database schema changes
- New package installations
- Authentication flows
- API contract changes
