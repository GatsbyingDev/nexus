# Nexus

Nexus is a production-quality Discord clone portfolio project built with a TypeScript monorepo architecture. It includes real-time chat, servers/channels, direct messages, presence, and voice signaling foundations.

## Feature List

- JWT authentication (access + refresh token strategy)
- Server/channel management with role and member models
- Real-time messaging via Socket.io
- Direct messages and DM message history
- Presence tracking with Upstash Redis TTL heartbeat
- Image/file upload pipeline using Multer + Cloudinary
- Cursor-based message pagination
- WebRTC voice mesh signaling primitives
- React Query + Zustand state architecture

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Zustand, TanStack Query, React Hook Form, Zod, Axios, Socket.io-client |
| Backend | Node.js, Express, TypeScript, Mongoose, Socket.io, JSON Web Token, bcryptjs, Multer, Cloudinary, Zod, Helmet, CORS, Morgan |
| Data / Services | MongoDB Atlas, Upstash Redis |
| Deployment | Vercel (client), Render (server) |

## Folder Structure

```txt
nexus/
├── apps/
│   ├── client/
│   └── server/
├── packages/
│   └── shared/
├── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account + cluster
- Upstash Redis database
- Cloudinary account
- Vercel account (client deploy)
- Render account (server deploy)

## Local Setup

1. Clone repository:

```bash
git clone <your-repo-url>
cd nexus
```

2. Install dependencies (workspace root):

```bash
npm install
```

3. Create env files:

- Copy values from `.env.example`
- Set server variables in `apps/server/.env`
- Set client variables in `apps/client/.env`

4. Run development:

```bash
npm run dev
```

- Client default: `http://localhost:5173`
- Server default: `http://localhost:5000`

## MongoDB Atlas Setup

1. Create a new project and cluster (M0 free tier is enough).
2. Create a database user with password.
3. In Network Access, allow your development IP (or temporary `0.0.0.0/0` for testing).
4. Copy connection string and set `MONGODB_URI`.
5. Ensure DB name in URI points to your Nexus database.

## Upstash Redis Setup

1. Create a Redis database in Upstash.
2. Open REST API details in the database dashboard.
3. Copy values into:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

4. Save and restart server.

## Cloudinary Setup

1. Create Cloudinary account.
2. Open Dashboard and copy credentials.
3. Set:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

4. Restart server after update.

## Deploy Client to Vercel

1. Import repo into Vercel.
2. Set project root to `apps/client`.
3. Confirm config from `apps/client/vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite: all routes -> `index.html`

4. Set client env vars in Vercel:

- `VITE_API_URL`
- `VITE_SOCKET_URL`

5. Deploy.

## Deploy Server to Render

1. Create new Web Service from repo.
2. Set root directory to `apps/server`.
3. Use render blueprint config in `apps/server/render.yaml`:

- `type: web`
- `runtime: node`
- `buildCommand: npm run build`
- `startCommand: node dist/index.js`

4. Add all server env vars listed in `.env.example`.
5. Deploy and verify `/health` endpoint.

## Scripts

From repository root:

- `npm run dev` -> run client + server concurrently
- `npm run build` -> build all workspaces
- `npm run lint` -> workspace typecheck/lint script aggregation

## Notes

- Access token is short-lived and stored in memory (Zustand)
- Refresh token uses HTTP-only cookie
- Socket auth relies on JWT handshake token
- Presence uses Redis keys with TTL heartbeat refresh
