import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client with Hugging Face
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Hugging Face Chat API is running" 
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model = "MiniMaxAI/MiniMax-M2:novita" } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: "Message is required" 
      });
    }

    const chatCompletion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      response: chatCompletion.choices[0].message.content,
      model: model,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      error: "Failed to get response from AI",
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});