# 🚀 Redis 05: User Profile Cache - JSON String vs. Hash 🚀

Welcome to the **Redis User Profile Cache** project! This module demonstrates the two most common ways to store object data (like a user profile) in Redis: using serialized **JSON Strings** and **Redis Hashes**.

---

## 🌟 Overview

When building applications, we often need to cache objects (e.g., user profiles, settings). Redis offers multiple data structures, but the two primary contenders for this job are:

1.  **JSON Strings** 🧵 (`SET` / `GET`): Serializing the object into a JSON string and storing it under a single key.
2.  **Redis Hashes** 🗂️ (`HSET` / `HGETALL`): Storing the object as a map of field-value pairs.

This project provides a simple Express API to test and understand both approaches! 🚀

---

## 🛠️ Code Deep Dive

The code in `src/index.js` sets up an Express server with four endpoints to contrast these methods:

### 1️⃣ The JSON String Approach 🧵

**Endpoints:**
*   `POST /user/:id/json`: Saves the user object as a JSON string.
*   `GET /user/:id/json`: Retrieves the string and parses it back into a JSON object.

**How it works:**
```javascript
// Saving
await redis.set(`user:${req.params.id}`, JSON.stringify(req.body));

// Retrieving
const raw = await redis.get(`user:${req.params.id}`);
const user = raw ? JSON.parse(raw) : null;
```

**Pros & Cons:**
*   ✅ **Simple:** Very easy to implement. Works universally for any deeply nested JSON object.
*   ✅ **Atomic:** Reading or writing the whole object is atomic.
*   ❌ **Inefficient for partial updates:** If you only want to update the user's `age`, you must fetch the whole string, parse it, update the `age`, stringify it, and send it back.
*   ❌ **Bandwidth heavy:** Fetching a massive user profile just to get their `username` wastes bandwidth.

---

### 2️⃣ The Redis Hash Approach 🗂️

**Endpoints:**
*   `POST /user/:id/hash`: Saves the user object using `HSET`.
*   `GET /user/:id/hash`: Retrieves the user object using `HGETALL`.

**How it works:**
```javascript
// Saving (ioredis handles the object mapping nicely)
await redis.hset(`user:${req.params.id}:hash`, req.body);

// Retrieving
const user = await redis.hgetall(`user:${req.params.id}:hash`);
```

**Pros & Cons:**
*   ✅ **Partial Updates:** You can update a single field instantly using `HSET key field value` without fetching the whole object! ⚡
*   ✅ **Partial Reads:** You can fetch just what you need using `HGET key field` (e.g., just the `email`).
*   ✅ **Memory Efficient:** Redis is highly optimized to store small hashes.
*   ❌ **Flat Structure:** Standard Redis Hashes don't support nested objects natively (you'd have to stringify the nested parts or flatten the structure).

---

## 🧠 Which one should you use?

| Feature | JSON String 🧵 | Redis Hash 🗂️ |
| :--- | :--- | :--- |
| **Object Structure** | Deeply nested objects 🌳 | Flat key-value pairs 🧱 |
| **Partial Updates** | ❌ Fetch -> Update -> Save | ✅ `HSET` a single field |
| **Partial Reads** | ❌ Fetch everything | ✅ `HGET` a single field |
| **Simplicity** | High (just stringify) | Medium (needs flattening for nested) |

💡 **Pro Tip:** If your object is flat and you frequently update or read individual fields, use **Hashes**. If your object is deeply nested and you almost always read/write the entire object at once, use **JSON Strings**. 

*(Note: For advanced use cases with complex JSON, consider using the **RedisJSON** module, which gives you the best of both worlds!)*

---

## 🏃‍♂️ How to Run

1.  Make sure you have Redis running locally (or provide a `REDIS_URL`).
2.  Install dependencies: `npm install` (or `bun install`)
3.  Start the server: `node src/index.js`
4.  Test the endpoints using Postman or `curl`! 🧪

```bash
# Test JSON
curl -X POST http://localhost:3000/user/1/json -H "Content-Type: application/json" -d '{"name": "Alice", "age": 25}'
curl http://localhost:3000/user/1/json

# Test Hash
curl -X POST http://localhost:3000/user/1/hash -H "Content-Type: application/json" -d '{"name": "Bob", "age": 30}'
curl http://localhost:3000/user/1/hash
```

Happy Caching! 🥳
