🚀 **Overview**

This folder contains a minimal Node.js Express app that demonstrates local connections to **Redis** and **MongoDB**, plus project metadata. The Redis and MongoDB services are provided by the repository-level Docker Compose file so you can run both databases locally. 🐳

📁 **Files of interest**

- 🐳 **Docker Compose**: [redis-02/docker-compose.yml](redis-02/docker-compose.yml#L1-L20) — defines `redis` and `mongo` services and persistent volumes.
- 📦 **Project manifest**: [redis-02/02_setup_local_redis/package.json](redis-02/02_setup_local_redis/package.json#L1-L20) — scripts and dependencies (`express`, `ioredis`, `mongoose`).
- 🧩 **Server code**: [redis-02/02_setup_local_redis/src/index.js](redis-02/02_setup_local_redis/src/index.js#L1-L27) — sets up endpoints to test Redis and Mongo connectivity.

✨ **What we implemented in this folder**

- 🟢 **Local Node app**: A tiny Express server (`src/index.js`) with two endpoints:
    - 🔴 `GET /redis` — connects to Redis (uses `process.env.REDIS_URL` or `redis://localhost:6379`) and returns the result of `PING`.
    - 🍃 `GET /mongo` — connects to MongoDB (uses `process.env.MONGO_URL` or `mongodb://localhost:27017/chai_aur_redis`) and returns connection status and DB name.
- 🧰 **Dependencies**: `ioredis` for Redis client, `mongoose` for MongoDB, and `express` for the HTTP server. The `dev` script runs the server with `node src/index.js`.

🛠️ **Step-by-step: Run this setup locally**

1️⃣ Start the Docker services (run from repository root `redis-02`):

```bash
cd redis-02
docker compose up -d
```

2️⃣ Confirm both containers are running:

```bash
docker ps --filter "name=chai-aur-"
```

3️⃣ Install Node dependencies (from the app folder):

```bash
cd 02_setup_local_redis
npm install
```

4️⃣ Start the Node app:

```bash
npm run dev
```

5️⃣ Test the endpoints (from your machine):

```bash
curl http://localhost:3000/redis
curl http://localhost:3000/mongo
```

✅ The `/redis` endpoint should respond with `{"redis":"PONG"}` when Redis is reachable. The `/mongo` endpoint returns a JSON object with `mongo: 'connected'` and the database name.

🩺 **Notes & troubleshooting**

- 🔎 If the Node app cannot reach Redis or Mongo, ensure the Docker services are up and listening on the expected ports (Redis: `6379`, Mongo: `27017`).
- ⚙️ You can override connections using environment variables before starting the Node app:

```bash
export REDIS_URL="redis://localhost:6379"
export MONGO_URL="mongodb://localhost:27017/chai_aur_redis"
npm run dev
```

- 💾 Data is persisted to the Docker volumes configured in [redis-02/docker-compose.yml](redis-02/docker-compose.yml#L1-L20).

🔭 **Next steps**

- Want me to add a simple health-check endpoint, tests, or a `.env.example` for local overrides? Reply which one and I will implement it. ✨
