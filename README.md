# ISMS Work Order Hub

A modern work order management prototype for Integrated Security Management Systems (ISMS). The app supports role-based authentication and authorization for requesters, secretary staff, technicians, systems administrators, and the manager.

## What it does

- Lets non-ISMS users register as requester accounts and submit work orders.
- Tracks the required work order fields: timestamp, requester email, location, system, status, priority, and issue description.
- Gives manager and sysadmin users the ability to review and assign requests to technicians.
- Gives secretary users a triage role for moving requests into review.
- Gives technician users a focused queue where they can update assigned work.
- Persists prototype data in a local JSON file at data/app-db.json.

## Tech stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Zod for shared contracts and validation
- bcryptjs for password hashing
- jsonwebtoken with an HTTP-only cookie for sessions

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
copy .env.example .env
```

3. Set JWT_SECRET in .env.

4. Start the app:

```bash
npm run dev
```

5. Open http://localhost:3000.

## Demo accounts

The first authenticated request seeds the local data file automatically. These demo accounts all use the same password:

- Password: Password123!
- Manager: manager@isms.local
- Systems administrator: sysadmin1@isms.local
- Secretary: secretary@isms.local
- Technician: marcus.green@isms.local
- Requester: requester@demo.local

## Key routes

- / landing page
- /login sign in
- /register requester registration
- /portal authenticated dashboard
- /api/auth/* auth endpoints
- /api/work-orders work order list and creation
- /api/work-orders/[id] role-aware status and assignment updates

## Notes

- This implementation uses a local JSON-backed store to keep the prototype runnable without provisioning PostgreSQL first.
- Internal ISMS roles are seeded in the prototype rather than self-registered.
- If you want, the next step is to swap the JSON store for a PostgreSQL and Drizzle-backed persistence layer.
