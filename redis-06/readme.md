# 📬 Redis 06: Email Queue with Redis Lists 📬

Welcome to the **Email Queue** project! This module demonstrates how to use **Redis Lists** to build a simple, high-performance background job queue. We'll be using the First-In-First-Out (FIFO) strategy to queue and process emails.

---

## 🌟 Overview

In web applications, some tasks (like sending emails, processing videos, or generating reports) take too long to happen synchronously during a web request. 

Instead of making the user wait, we **queue** the task to be processed later by a background worker. Redis Lists are perfect for this because they allow pushing and popping elements from both ends extremely fast! ⚡

This project provides a simple Express API to demonstrate queuing a job and processing it. 🚀

---

## 🛠️ Code Deep Dive

The code in `src/index.js` sets up an Express server with two endpoints that interact with a Redis List named `queue:emails`.

### 1️⃣ Queuing a Job (Producer) 📥

**Endpoint:** `POST /emails`

When a user wants to send an email, we create a job object, serialize it into a JSON string, and push it onto the **left** side of our Redis List.

```javascript
const QUEUE_KEY = "queue:emails";

// Creating the job object
const job = {
    to: req.body.to,
    subject: req.body.subject || "No subject",
    body: req.body.body || "No content",
    createdAt: new Date().toISOString(),
};

// Pushing to the Left side of the list (LPUSH)
await redis.lpush(QUEUE_KEY, JSON.stringify(job));
```

*   **`LPUSH`**: Inserts one or more values at the head (left side) of the list.

### 2️⃣ Processing a Job (Consumer/Worker) 📤

**Endpoint:** `GET /emails/process-one`

To process jobs in the order they were received (FIFO - First-In-First-Out), our worker will pop items from the **right** side of the list.

```javascript
// Popping from the Right side of the list (RPOP)
const rawJob = await redis.rpop(QUEUE_KEY);

if (!rawJob) {
    return res.json({ message: "No jobs in the queue" });
}

// Deserializing and processing
const job = JSON.parse(rawJob);
// ... simulate email sending ...
```

*   **`RPOP`**: Removes and returns the last element (right side) of the list. 

💡 **Why LPUSH + RPOP?** 
By pushing on the left and popping on the right, the oldest jobs (which have been pushed furthest to the right) are processed first. This creates a standard **FIFO Queue**. 
*(Note: You could also use `RPUSH` + `LPOP` for the exact same effect).*

---

## 🧠 Why Redis Lists for Queues?

| Feature | Description |
| :--- | :--- |
| **Performance** | `LPUSH` and `RPOP` are `O(1)` operations. They are lightning fast regardless of how big the queue gets! 🏎️ |
| **Simplicity** | Very easy to reason about. It's just a linked list of strings. |
| **Scalability** | You can have multiple Node.js instances (workers) all running `RPOP` on the same Redis key to process jobs in parallel! 👯‍♂️ |

⚠️ **Caveats for Production:**
While `RPOP` is great, it requires the worker to constantly "poll" (ask Redis "do you have jobs?" over and over). In a real production environment, you would use **`BRPOP`** (Blocking RPOP), which tells Redis: *"Wait here until a job arrives, and give it to me immediately."* 
Also, for robust queues with retries, failure handling, and scheduled jobs, consider using a library built on top of Redis, like **BullMQ** or **Kue**.

---

## 🏃‍♂️ How to Run

1.  Make sure you have Redis running locally (or provide a `REDIS_URL`).
2.  Install dependencies: `npm install` (or `bun install`)
3.  Start the server on port 3001: `node src/index.js`
4.  Test the endpoints using Postman or `curl`! 🧪

```bash
# 1. Queue some emails (Run this a few times)
curl -X POST http://localhost:3001/emails \
     -H "Content-Type: application/json" \
     -d '{"to": "alice@example.com", "subject": "Hello!"}'

# 2. Process them one by one!
curl http://localhost:3001/emails/process-one
```

Happy Queuing! 📦✨
