---
name: auth-feature
description: 'Create or update authentication and authorization features for this app. Use for register/login flows, JWT issuance, password hashing, RBAC middleware, Drizzle role schema changes, auth routes, and shared Zod auth validation.'
argument-hint: 'Describe the auth task, such as register/login endpoints, RBAC middleware, or a Drizzle schema update for roles.'
user-invocable: true
---

# Auth Feature Workflow

Use this skill when the task touches authentication or authorization in the Node.js, Express.js, PostgreSQL, and Next.js stack defined for this repository.

## Target Outcomes

- Production-ready authentication code.
- JWT-based session handling with a 1-day default expiration.
- RBAC enforcement using the fixed roles `dispatch`, `officer`, `supervisor`, and `command_staff`.
- Shared validation and types that stay aligned across backend and frontend boundaries.

## Required Deliverables

When the task requires a full auth slice, produce the relevant combination of:

- Drizzle schema updates for users and role enum changes.
- Register and login controller logic.
- `authenticateToken` middleware.
- `authorizeRole([...roles])` middleware.
- Zod schemas for request and response contracts where appropriate.
- Route wiring and consistent JSON response shapes.

## Standards

- Hash passwords with `argon2` or `bcrypt`.
- Use `jsonwebtoken` for signing and verifying tokens.
- Keep authorization as a server-side concern.
- Keep route handlers thin and move reusable auth logic into dedicated services or utilities.
- Use `helmet`, explicit CORS allowlists, and rate limiting for auth-facing endpoints when the server surface exists.
- Keep Drizzle schema, migrations, and shared types synchronized.

## Procedure

1. Find the nearest auth entry point or create a minimal auth module layout that matches the repository structure.
2. Identify whether the task requires schema changes, route changes, middleware changes, or all three.
3. Update or create Zod schemas first so request and response contracts stay explicit.
4. Implement password hashing and JWT issuance or verification in dedicated auth utilities or services.
5. Add or update `authenticateToken` and `authorizeRole([...roles])` middleware using the fixed role set.
6. Keep controllers focused on input validation, service calls, and consistent response payloads.
7. If role data changes, update Drizzle schema and migrations together.
8. Run the narrowest available validation after edits, such as auth tests, targeted type checks, or linting for touched files.

## Guardrails

- Do not invent additional RBAC roles unless the task explicitly changes the policy.
- Do not enforce permissions in the frontend as the primary protection.
- Do not split validation rules between frontend and backend when a shared Zod schema can define the contract once.
- Do not leave auth logic duplicated across route files.

## Notes For This Repository

- Prefer `server/` or `backend/` for Express app code.
- Prefer `db/` for Drizzle schema and migrations.
- Prefer `shared/` for Zod schemas and cross-runtime auth types.