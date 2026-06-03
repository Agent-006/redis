# 🚀 Order Confirmation Jobs with BullMQ and Redis

This project demonstrates how to use **BullMQ** with **Redis** to handle background jobs in a Node.js application. Specifically, it simulates sending a welcome email 📧 asynchronously when a user triggers a specific endpoint. This pattern is useful for offloading time-consuming tasks (like sending emails, processing images 🖼️, or generating reports 📊) from the main request-response cycle, ensuring a fast response time for the user ⚡.

## 📂 Project Structure

- `src/queue.js`: Configures the connection to the Redis server (localhost:6379) and initializes a BullMQ `Queue` instance named `"emails"`. 
- `src/api.js`: An Express web server that exposes a `POST /welcome-email` endpoint 🌐. When hit, it adds a new job (`"send-welcome-email"`) to the `"emails"` queue with the provided user data (e.g., `to` and `name`). It also configures job retries (3 attempts 🔄) and exponential backoff in case of job processing failure.
- `src/worker.js`: A BullMQ `Worker` 👷‍♂️ that continuously listens to the `"emails"` queue. When a job is added, it processes it by simulating a delay (1.5 seconds ⏳) to represent the time it takes to send an email. It also includes event listeners for `completed` ✅ and `failed` ❌ jobs to log the results.

## 🛠️ Technologies Used

- **Node.js** 🟢: The JavaScript runtime environment.
- **Express** 🚂: A minimal and flexible web application framework for Node.js APIs.
- **BullMQ** 🐂: A robust, fast message queue system based on Redis, ideal for handling background jobs and microservices.
- **ioredis** 🔌: A robust, performance-focused, and full-featured Redis client for Node.js, used internally by BullMQ.
- **Redis** 🟥: The in-memory data structure store used as a message broker and storage for BullMQ's queue data.

## 🧠 How the Architecture Works

1. **Redis Server** 🗄️: A running instance of Redis acts as the message broker.
2. **Producer (API)** 📤: A client sends a POST request to `http://localhost:3000/welcome-email`. The Express server (Producer) adds the job to the BullMQ queue stored in Redis and immediately responds to the client. The client doesn't have to wait for the actual email to be sent.
3. **Consumer (Worker)** 📥: The worker script (`worker.js`), which can run in a separate process or even on a separate machine, polls the Redis queue for new jobs. It picks up the job, processes it (simulating the email sending with a delay), and updates the job's status in Redis.
4. **Completion/Failure** 🏁: Once the worker finishes processing, it marks the job as completed or failed in Redis, triggering the respective event listeners.

## 🏃‍♂️ How to Run

1. **Prerequisites** 📌: Ensure you have a Redis server running locally on the default port `6379`.
2. **Install Dependencies** 📦:
   Navigate to the project directory and install the required npm packages:
   ```bash
   npm install
   ```
3. **Start the Services** 🚦:
   You will need to start both the API server and the Worker. Open two separate terminal windows.
   - **Terminal 1 (API Server)** 💻:
     ```bash
     node src/api.js
     ```
   - **Terminal 2 (Worker)** ⚙️:
     ```bash
     node src/worker.js
     ```
4. **Trigger a Job** 🎯:
   Send a POST request to the API to trigger the background job. You can use curl, Postman, or any HTTP client:
   ```bash
   curl -X POST http://localhost:3000/welcome-email \
   -H "Content-Type: application/json" \
   -d '{"to": "test@example.com", "name": "Alice"}'
   ```
5. **Observe the Logs** 📝: Check the terminal running `worker.js`. You should see logs indicating that the job has been picked up, processed, and completed.

### ⚠️ Note on Module Exports
The code in `src/queue.js` uses `module.exports`, but `src/api.js` and `src/worker.js` use `import`. Since the `package.json` specifies `"type": "module"`, the CommonJS `module.exports` in `queue.js` will likely cause an error when you try to import it. It is recommended to update `src/queue.js` to use ES module exports (which was proactively fixed!):
```javascript
export const emailQueue = new Queue("emails", { connection });
export { connection };
```
