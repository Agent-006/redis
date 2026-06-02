# Redis — 04: Login Optimization with TTL ⏳🔐

A minimal demo showing how to implement one-time passwords (OTP) with Redis TTL (time-to-live). This project demonstrates issuing short-lived OTPs, verifying them, inspecting their remaining TTL, and safely invalidating them after use. Great for login flows, passwordless auth experiments, and learning how Redis EX (expire) works.

**Project Files**
- **`src/index.js`**: Main Express server with OTP endpoints and Redis usage.
- **`package.json`**: Run scripts and dependencies (`express`, `ioredis`).

**What this demo shows** ✨
- **Issue OTP**: Create a numeric OTP and store it in Redis with a short TTL (30 seconds).
- **Verify OTP**: Compare user-supplied OTP with the stored value and delete it after successful verification.
- **Check TTL**: Return the remaining TTL for a phone's OTP key using Redis `TTL` command.

Why use Redis TTL? Redis `EX` (expire) provides a reliable, low-latency mechanism to automatically expire temporary data (like OTPs) without background jobs. This keeps your store clean and reduces race conditions when combined with atomic commands.

Endpoints 📡
- POST `/otp` — Request an OTP
	- Body: `{ "phone": "<phone-number>" }`
	- Behavior: Generates a 6-digit OTP, stores it under key `otp:<phone>` with `EX 30` (30 seconds), and returns `{ message, otp }` (demo only).

- POST `/otp/verify` — Verify an OTP
	- Body: `{ "phone": "<phone-number>", "otp": "<6-digit-otp>" }`
	- Behavior: Reads the stored OTP, returns error if missing/expired or invalid, deletes the key on success, and returns success message.

- GET `/otp/:phone/ttl` — Get remaining TTL
	- Returns JSON `{ ttl: <seconds> }` where `-1` means key exists without TTL, `-2` means key does not exist.

Important implementation notes 📝
- Keys: OTPs are stored with the prefix `otp:` (see `otpKey(phone)` in `src/index.js`). This keeps keys namespaced.
- Expiration: OTPs use `EX 30` (30 seconds). Change the expiration value as needed for your use case.
- Invalidation: On successful verification the code calls `DEL` to immediately remove the OTP and prevent reuse.
- Security: The demo returns the OTP in the JSON response for ease of testing. In production, never return OTPs — send them via a trusted SMS/email provider and only return status responses.

Environment & Configuration ⚙️
- The app connects to Redis using the `REDIS_URL` environment variable, defaulting to `redis://localhost:6379`.

Quick start (development) ▶️
1. Install dependencies (using npm or bun/pnpm as you prefer):

```bash
npm install
# or with bun: bun install
# or with pnpm: pnpm install
```

2. Start the server:

```bash
npm run dev
# This runs: node --watch src/index.js
```

3. Try the endpoints (examples using `curl`):

Request an OTP:

```bash
curl -X POST http://localhost:3000/otp -H "Content-Type: application/json" -d '{"phone":"+15551234567"}'
```

Verify an OTP:

```bash
curl -X POST http://localhost:3000/otp/verify -H "Content-Type: application/json" -d '{"phone":"+15551234567", "otp":"123456"}'
```

Check TTL:

```bash
curl http://localhost:3000/otp/%2B15551234567/ttl
```

Notes & Next steps 🚀
- Production hardening: integrate with a trusted SMS/email gateway, add rate limiting, and use short-lived cryptographically-secure codes (consider HMAC-based schemes or libraries).
- Race conditions: consider using Redis scripts (EVAL) or `SET` with NX and EX flags for atomic issuance if you need to enforce single-issuance guarantees under concurrency.
- Persistence: OTPs are ephemeral by design — do not store them permanently.

If you want, I can also:
- Add example Postman or HTTPie requests.
- Add basic rate limiting middleware to `src/index.js`.
- Replace the random OTP generator with a more secure implementation.

Enjoy experimenting with Redis TTLs! 🔁✨

