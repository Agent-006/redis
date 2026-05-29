# 🚀 Redis Architecture Notes (from diagram)

<!-- Thumbnail links to full image to avoid huge black preview hiding text -->
<p align="center"><a href="Redis-01.png"><img src="Redis-01.png" alt="Redis Architecture Diagram" width="700"/></a></p>

## 👀 Quick preview tips (VS Code)
- Open Markdown preview: Press `Ctrl+Shift+V` or `Ctrl+K V` to open side-by-side preview.
- If the image looks too dark or large, click the thumbnail to open the full image file.
- If preview is blank, ensure the file is saved and try `Reload Window` from the Command Palette.

---

## 📚 Overview
This document captures the patterns shown in the diagram and explains when to use Redis, how it helps, and concrete command examples you can run today. Sections below are organized by common use cases: leaderboards, caching, sessions, presence, OTPs, rate limiting, queues, TTLs, and trade-offs.

---

## 🗂️ Table of Contents
- [Leaderboards & Rankings](#-leaderboards--rankings)
- [Cache-aside (in-memory DB store)](#-cache-aside-in-memory-db-store)
- [Node servers + Redis + MongoDB (cache hit/miss)](#-node-servers--redis--mongodb-cache-hitmiss)
- [Generic caching patterns](#-generic-caching-patterns)
- [Session store](#-session-store)
- [Presence / User status](#-presence--user-status)
- [OTP store](#-otp-store)
- [Rate limiting](#-rate-limiting)
- [Job queue](#-job-queue)
- [Key-value examples](#-key-value-examples)
- [TTL timeline](#-ttl-timeline)
- [When to use Redis (notes)](#-when-to-use-redis-notes)

---

## 🏆 Leaderboards & Rankings
- What it shows: Redis holds computed ranking data and serves it with very low latency. The primary DB remains the system-of-record.
- Why Redis: Sorted Sets (`ZSET`) offer efficient score-based ranking and range queries.

Example (quiz app):

```text
# add 10 points to user:123
ZINCRBY leaderboard 10 user:123

# read top 10 with scores (descending)
ZREVRANGE leaderboard 0 9 WITHSCORES
```

Notes:
- Periodically persist the leaderboard snapshot to your durable DB for analytics.
- Consider trimming very large leaderboards or using TTLs for ephemeral contests.

---

## ⚡ Cache-aside (in-memory DB store)
- What it shows: App checks Redis first; on miss, fetch from disk-backed DB and populate Redis.
- Why Redis: In-memory reads are microseconds; disk reads are milliseconds. Cache-aside reduces latency and DB load.

Example read/write flow:

```text
# READ flow (cache-aside)
GET product:42                     # check Redis
# if miss -> SELECT from DB, then:
SET product:42 "<json>" EX 300     # cache for 5 minutes

# WRITE flow
UPDATE products SET ...             # update DB
DEL product:42                      # invalidate cache OR update cache value
```

Tip: Use `EX` to set sensible expiry and avoid stale caches.

---

## 🖥️ Node servers + Redis + MongoDB (cache hit/miss)
- What it shows: Multiple stateless app servers serving users; Redis reduces read pressure on MongoDB.

Typical request flow:

```text
GET /products/42
-> try Redis: GET product:42
-> hit? return quickly
-> miss? query MongoDB, then SET product:42 "<json>" EX 120
```

Result: Hot data is fast, MongoDB reads reduce for repeated requests.

---

## 🧩 Generic caching patterns
- Patterns: cache-aside (lazy load), write-through (write both), write-behind (buffer writes).

Example (cache-aside):

```text
if not GET user:55:
		user = DB.fetch(55)
		SET user:55 "<json>" EX 300
		return user
```

Use the pattern that matches your consistency needs.

---

## 🔐 Session store
- What it shows: Session state in Redis so any server instance can serve a user without sticky sessions.
- Why Redis: TTL-based expiry and fast lookup.

Example:

```text
SET session:abc123 "{\"userId\":42,\"role\":\"user\"}" EX 1800
GET session:abc123
```

Benefits:
- Autoscaling app servers no longer need sticky sessions.
- Easy session invalidation via `DEL session:...`.

---

## 👥 Presence / User status
- What it shows: Servers keep ephemeral user status (active/inactive) in Redis and refresh via heartbeat.

Example heartbeat:

```text
SET user:42:status "active" EX 60    # refresh every 30s
GET user:42:status
```

This avoids hitting the DB to check transient status.

---

## 🔑 OTP store
- What it shows: Store short-lived OTPs using TTL for automatic expiry.

Example:

```text
# generate & store
SET otp:login:987654 987654 EX 180

# verify
GET otp:login:987654
# compare then DEL otp:login:987654 (or let it expire)
```

Security notes:
- Use `DEL` after successful verification to avoid reuse.
- Use secure, unpredictable keys for mapping to user contexts.

---

## 🛑 Rate limiting
- What it shows: Track request counts per IP or user with TTL windows.
- Why Redis: Atomic increments and TTLs simplify rate limits.

Fixed-window example:

```text
# increment count for IP
INCR ip:203.0.113.5
# if this was first increment, set expire (can use SETEX or check TTL)
EXPIRE ip:203.0.113.5 600
# if value > limit -> reject
```

Sliding-window example (approx):

```text
# use sorted set of timestamps
ZADD rl:ip:203.0.113.5 <now> <id>
ZREMRANGEBYSCORE rl:ip:203.0.113.5 0 <now - window>
ZCARD rl:ip:203.0.113.5   # current window count
```

Consider using Lua scripts for atomic multi-step checks.

---

## 🧰 Job queue
- What it shows: Use Redis lists (or streams) for simple job queues; workers take tasks.

Example (list queue):

```text
# producer
LPUSH emailQueue "user42:welcome"

# worker
BRPOP emailQueue 0
```

For more advanced needs (durability, consumer groups), consider Redis Streams (`XADD`, `XREADGROUP`).

---

## 🗃️ Key-value usage examples
- Typical keys shown in diagram:

- `product:all` -> list of products
- `otp:login:987654` -> OTP value
- `session:abc123` -> JSON session blob

Store JSON as strings, or use Redis modules (e.g., `ReJSON`) for direct JSON operations.

---

## ⏱️ TTL timeline
- Redis keys can be set to expire automatically using `EX`/`PX`/`EXPIRE`.

Example:

```text
SET temp:token abc EX 90
# key exists between t=0..t=90, removed after expiry
```

TTL is great for ephemeral data (OTPs, caches, sessions) but not for the canonical system of record.

---

## ✅ When to use Redis (notes)

- Good for:
	- Read pressure relief on DB
	- Hot or temporary data caching
	- Shared counters and rate limiting
	- Background jobs and queues
	- Leaderboards and ranking data

- Not a replacement for a durable DB:
	- Keep a durable system-of-record (Postgres, MongoDB, etc.) for critical data
	- Plan for eviction policies and memory limits (LRU, LFU)

---

## 🔧 Next steps I can do for you
- Add a compact Redis command cheat-sheet per section
- Provide language-specific code samples (Node/Python/Java)
- Convert this into slides or PDF

---

If anything is still not visible, tell me whether the preview is blank or the image looks black — I will move the image or provide a text-only version.


