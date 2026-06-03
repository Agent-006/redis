# 🚀 Redis Pub/Sub: Live Admin Notification System

Welcome to the **Live Admin Notification System** project! 🌟 This repository demonstrates how to implement a real-time Publish/Subscribe (Pub/Sub) messaging pattern using **Redis** and **Node.js**.

## 🛠️ Tech Stack
*   **Node.js**: JavaScript runtime environment 🟢
*   **Express.js**: Web framework for building the API 🚂
*   **Redis**: In-memory data structure store used as a message broker 🔴
*   **ioredis**: A robust, performance-focused Redis client for Node.js 🔌

## 📂 Project Structure

*   📁 `08-live-admin-notification-pubsub/src`
    *   📜 `api.js`: The Publisher (Express API server) 📢
    *   📜 `subscriber.js`: The Subscriber (Listens for events) 🎧

## 🔍 How It Works

This project is built around the **Publisher/Subscriber** pattern:

1.  **📢 The Publisher (`api.js`)**: 
    *   Runs an Express API server on port `3000`.
    *   Exposes a `POST /notifications` endpoint.
    *   When an HTTP POST request is made to this endpoint, it publishes a JSON payload (containing a title and timestamp) to the `notifications` Redis channel.
    *   Responds with the number of subscribers that received the message.

2.  **🎧 The Subscriber (`subscriber.js`)**:
    *   Connects to the same Redis instance.
    *   Subscribes to the `notifications` channel.
    *   Whenever a new message is published to this channel, the subscriber receives it instantly and logs the parsed JSON payload to the console.

## 🚀 Getting Started

### 1️⃣ Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Redis](https://redis.io/) installed and running on your machine.
By default, the application attempts to connect to Redis at `redis://localhost:6379`.

### 2️⃣ Installation
Navigate to the project directory and install the dependencies:
```bash
cd 08-live-admin-notification-pubsub
npm install # or bun install
```

### 3️⃣ Running the Application

You will need two separate terminal windows to run both the API and the subscriber concurrently.

**Terminal 1: Start the Subscriber 🎧**
```bash
node src/subscriber.js
```
*(You should see a "Subscribed successfully!" message)*

**Terminal 2: Start the Publisher API 📢**
```bash
node src/api.js
```
*(You should see "API server is running at http://localhost:3000")*

### 4️⃣ Trigger a Notification 🔔

Open a third terminal window (or use an API client like Postman/Insomnia) and send a POST request to the API:

```bash
curl -X POST http://localhost:3000/notifications \
     -H "Content-Type: application/json" \
     -d '{"title": "System Update Completed!"}'
```

**What happens?**
*   The **API** will respond with: `{"message": "Notification sent to 1 subscribers"}`
*   The **Subscriber** terminal will instantly log the received message with the title and timestamp! ✨

## 💡 Key Takeaways
*   **Decoupling**: The publisher doesn't need to know who the subscribers are.
*   **Real-time**: Messages are delivered instantly.
*   **Scalability**: You can spin up multiple subscribers, and they will all receive the message simultaneously. 🌐

Happy Coding! 🎉
