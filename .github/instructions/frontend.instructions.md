---
name: "Frontend UI Guidelines"
description: "Use when building or editing Next.js App Router pages, layouts, components, forms, and frontend TypeScript. Covers React patterns, Tailwind CSS, Shadcn UI, Lucide icons, accessibility, responsive design, and dark mode."
applyTo:
  - "app/**"
  - "components/**"
  - "lib/**"
---

# Frontend UI Guidelines

## Scope

- Default to Next.js App Router conventions.
- Prefer React Server Components unless interactivity, browser APIs, or local state require a client component.
- Use strict TypeScript and avoid `any`, broad casts, and untyped component props.

## UI And Styling

- Build mobile-first layouts with Tailwind CSS and ensure the result works in both light and dark themes.
- Prefer Shadcn UI primitives from `@/components/ui/` before introducing custom base components.
- Use Lucide React icons only when they improve comprehension.
- Keep visual design intentional and polished. Avoid generic dashboards, flat spacing, and default-looking typography if the task requires new UI.

## Accessibility

- Use semantic HTML first.
- Ensure keyboard navigation, visible focus styles, and accessible names for icon-only controls.
- Add ARIA attributes only when semantic HTML is insufficient.
- Treat form labels, validation messages, and loading or empty states as required UI, not optional polish.

## React And Data Flow

- Keep components small and composable.
- Derive UI state when possible instead of duplicating server data in local state.
- Put reusable formatting, mapping, and helper logic in typed utilities under `lib/` when it serves multiple components.
- Share Zod-backed types or schema-derived types with the frontend when data crosses the API boundary.

## App Router Conventions

- Use route-level `loading` and `error` boundaries when they materially improve UX.
- Keep page files focused on orchestration and rendering. Move reusable UI into feature or shared components.
- Use server actions only when they are a better fit than the existing API shape.

## Output Expectations

- New UI should be production-ready, responsive, and accessible.
- When a task introduces forms, pair frontend validation UX with the server-side contract instead of inventing a separate schema.
- Preserve the repository visual language once the project establishes one.