import express from "express";
import Redis from "ioredis";

const app = express();

const redis = new Redis();

app.use(express.json());

app.post("/leaderboard/score", (req, res) => {
    const { score, user } = req.body;

    redis.zincrby(user, score);

    res.json({
        message: "Score updated successfully",
        user,
        score,
    });
});

app.get("/leaderboard", (req, res) => {
    const leaderboard = redis.zrevrange();

    res.json({
        message: "Leaderboard fetched successfully",
        leaderboard,
    });
});

app.get("/leaderboard/:userId/rank", (req, res) => {
    const userId = req.params.userId;
    const rank = redis.zrevrank(userId);

    res.json({
        message: "Rank fetched successfully",
        userId,
        rank,
    });
});

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});
