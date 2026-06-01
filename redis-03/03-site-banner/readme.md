# 03-site-banner 🚩✨

A tiny Express service that stores a site banner message in Redis. Useful as a simple feature-flagged banner API for demos and learning.

## Features

- 🔁 Store a banner message (POST /banner)
- 📤 Retrieve the current banner (GET /banner)
- ❌ Delete the banner (DELETE /banner)
- ✅ Check whether a banner exists (GET /banner/exists)

## Quick Start 🏁

1. Install dependencies:

```bash
npm install
```

2. Run in development (auto-restart on changes):

```bash
npm run dev
```

The server listens on http://localhost:3000 by default.

## Environment

- `REDIS_URL` (optional) — Redis connection string. Defaults to `redis://localhost:6379`.

## HTTP API 🔌

- POST /banner
	- Body: `{ "message": "Your banner text" }`
	- Response: `{ "success": true }`

- GET /banner
	- Response: `{ "message": "..." }`

- DELETE /banner
	- Response: `{ "success": true }`

- GET /banner/exists
	- Response: `{ "exists": true|false }`

## Examples (curl) 🧪

Set banner:
```bash
curl -X POST -H "Content-Type: application/json" \
	-d '{"message":"Welcome to chai aur redis!"}' \
	http://localhost:3000/banner
```

Get banner:
```bash
curl http://localhost:3000/banner
```

Delete banner:
```bash
curl -X DELETE http://localhost:3000/banner
```

## Notes 📝

- This service uses `ioredis` under the hood and expects a reachable Redis instance.
- Scripts are defined in `package.json` — use `npm run dev` to start with Node's watch mode.

---

Happy hacking! 💫
