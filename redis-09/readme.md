# 🏆 Redis Live Leaderboard (redis-09)

Welcome to the **Live Leaderboard** project! 🚀 This project demonstrates how to build a real-time leaderboard using **Node.js**, **Express**, and **Redis** (via `ioredis`). 

## 🌟 Overview

This application leverages Redis **Sorted Sets (`ZSET`)** to manage scores and rankings efficiently. Sorted Sets are perfect for leaderboards because they automatically keep elements ordered by their score in real-time! ⚡

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime environment 🟢
- **Express.js**: Web framework for building the REST API 🚂
- **Redis**: In-memory data structure store used as the database 🔴
- **ioredis**: A robust, performance-focused Redis client for Node.js 🔌

## 🚀 How It Works

The server provides three main REST API endpoints to interact with the leaderboard:

### 1. Update Score 📈
- **Endpoint**: `POST /leaderboard/score`
- **Description**: Increments or sets the score for a specific user.
- **Under the hood**: Uses the Redis `ZINCRBY` command to increment the score of the user in the sorted set.

### 2. Fetch Top Players 🥇
- **Endpoint**: `GET /leaderboard`
- **Description**: Retrieves the list of users ordered by their scores in descending order (highest score first).
- **Under the hood**: Uses the Redis `ZREVRANGE` command to fetch the sorted set elements from highest to lowest.

### 3. Get User Rank 🎯
- **Endpoint**: `GET /leaderboard/:userId/rank`
- **Description**: Fetches the current rank of a specific user.
- **Under the hood**: Uses the Redis `ZREVRANK` command to determine the 0-based index (rank) of the user in the sorted set.

## 🏃‍♂️ Getting Started

1. **Install dependencies**:
   Make sure you are in the `09-live-leaderboard` directory and run:
   ```bash
   npm install
   ```
2. **Start the server**:
   ```bash
   npm run dev
   ```
   The server will start running at `http://localhost:3000` 🌐.

## 💡 Redis Commands Highlight

- `ZINCRBY key increment member`: Increments the score of a member in a sorted set by the given amount.
- `ZREVRANGE key start stop [WITHSCORES]`: Returns the specified range of elements in the sorted set, with scores ordered from high to low.
- `ZREVRANK key member`: Returns the rank of a member in a sorted set, with scores ordered from high to low.

> **Note ⚠️**: The codebase outlines the core logic and endpoints for a leaderboard system. To make it fully functional, ensure to handle asynchronous Redis operations (using `await`), and pass the correct arguments to the Redis methods (like specifying a unified key name for the leaderboard sorted set). Happy coding! 🎉
