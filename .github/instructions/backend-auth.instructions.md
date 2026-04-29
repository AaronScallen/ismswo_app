---
name: "Backend Auth Guidelines"
description: "Use when building or editing Express routes, auth controllers, JWT middleware, RBAC checks, Drizzle schema, PostgreSQL access, Zod validation, and API security. Covers register/login flows, role enforcement, error handling, Helmet, CORS, rate limiting, and environment setup."
applyTo:
  - "server/**"
  - "backend/**"
  - "db/**"
  - "shared/**"
---

# Backend Auth Guidelines

## Architecture

- Build REST APIs with thin route handlers and move business logic into services or dedicated modules.
- Centralize error handling and return predictable JSON error shapes.
- Validate request bodies, params, and query strings with Zod close to the request boundary.

## Security Baseline

- Use `helmet` for default HTTP security headers.
- Use explicit CORS allowlists rather than permissive wildcard configuration.
- Apply rate limiting to public and sensitive endpoints, especially authentication routes.
- Never trust client-supplied authorization state.

## Authentication

- Hash passwords with `argon2` or `bcrypt`.
- Use `jsonwebtoken` for access tokens with a default 1-day expiration unless a task explicitly changes the policy.
- Keep token issuance and verification logic in dedicated auth modules.
- Prefer explicit `register` and `login` flows with consistent success and failure payloads.

## RBAC

- Supported roles are fixed: `dispatch`, `officer`, `supervisor`, `command_staff`.
- Model roles as a PostgreSQL ENUM in Drizzle schema work.
- Standard middleware names are `authenticateToken` and `authorizeRole([...roles])`.
- `authenticateToken` should parse the bearer token, verify it, and attach the authenticated user context.
- `authorizeRole` should reject authenticated users whose role is not in the allowed set.

## Database And Types

- Use Drizzle ORM for schema and query work.
- Keep schema definitions, generated migrations, and shared types aligned.
- Support local PostgreSQL in development and Neon in non-local environments when environment configuration requires it.
- Keep environment handling explicit with `dotenv` and typed config helpers where available.

## Output Expectations

- Auth-related changes should include schema updates, controller logic, middleware, and shared validation/types when applicable.
- Keep controllers and middleware well-documented through clear structure and naming rather than long comments.
- Prefer modular code that is straightforward to test.