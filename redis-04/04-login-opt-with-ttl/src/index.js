import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Used for relyablity
function otpKey(phone) {
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 30 seconds
    await redis.set(otpKey(phone), otp, "EX", 30);

    res.json({ message: "OTP sent", otp }); // In production, you would send the OTP via SMS instead of returning it in the response
});

app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    const storedOTP = await redis.get(otpKey(phone));

    if (!storedOTP) {
        return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOTP !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // Invalidate the OTP after successful verification
    await redis.del(otpKey(phone));
    res.json({ message: "OTP verified successfully" });
});

// Get OTP TTL
app.get("/otp/:phone/ttl", async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ ttl });
});

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});
