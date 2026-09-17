import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Doodle from "./models/Doodle.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_guestbook";

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow image data URLs

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(" Connected to MongoDB successfully"))
  .catch((err) =>
    console.warn(" MongoDB connection error:", err.message, "(Make sure MongoDB is running or configure MONGODB_URI)")
  );

// API Routes
app.get("/api/doodles", async (req, res) => {
  try {
    const doodles = await Doodle.find({}).sort({ createdAt: -1 });
    res.json({ success: true, doodles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/doodles", async (req, res) => {
  try {
    const { author, note, drawing } = req.body;
    if (!author || !drawing) {
      return res
        .status(400)
        .json({ success: false, error: "Author and drawing are required." });
    }

    const newDoodle = await Doodle.create({
      author: author.trim(),
      note: (note || "").trim(),
      drawing,
    });

    res.status(201).json({ success: true, doodle: newDoodle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Express Backend Server running on http://localhost:${PORT}`);
});
