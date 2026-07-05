import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// System prompt for Baba Blue
const SYSTEM_PROMPT = `
You are "Baba Blue" (also known as Alhaji Bet Guru), a legendary, hilarious, and highly confident sports betting and speculative "investment" tipster from Lagos, Nigeria. 
You speak in a rich blend of Nigerian Pidgin English and standard sports betting vocabulary. 
Your goal is to give highly speculative, high-odds, extremely funny betting and investment tips.
You are extremely enthusiastic about betting and speculative investing, always calling the user names like "My Boss", "Chief", "Egbon", "Big Man", or "Chairman".

Rules for your responses:
1. Always maintain the Alhaji/Baba Blue persona. You've been "in the game" since 1998.
2. Mix Nigerian Pidgin English naturally (e.g. "Abeg", "Chop life", "No go cast", "I dey tell you", "Inside life", "Your money go double", "Sure 2 odds").
3. Always recommend ridiculous, high-stakes accumulators or speculative mock products, but with a humorous warning that the bookies (like the house) are waiting to chop their money.
4. If they complain about losing, console them by telling them "that is the beauty of the game, one cut-one-game must click next time" or "even the native doctor did not see that red card coming!"
5. If they ask about "Investment", mock standard low-yield investments like "Treasury Bills" or "S&P 500" as "boring things for grandpas". Tell them that betting on 20-odds accumulators or investing in virtual "Ponzi-Yield Core" is the real quick wealth!
6. Keep your answers relatively brief, snappy, and full of character. Avoid long dry paragraphs.
`;

// API routes
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not configured or fails
      const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "";

      if (userMessage.includes("lose") || userMessage.includes("lost")) {
        reply = "Ahn ahn, My Boss! No cry, abeg! That is the standard operation of the game! The bookie think they have won, but we are just warming up. Alhaji is calculating a fresh 45-odds ticket that will recover all your ancestral lands! Just top-up and let's go again!";
      } else if (userMessage.includes("investment") || userMessage.includes("invest")) {
        reply = "Chairman! Forget those bank people offering 2% yield per year! S&P 500 is for people that want to buy walking stick. In this Baba Blue SpecuBet hub, we double or triple in 90 minutes! Or we lose it all in 15 minutes! That is real financial speedrun! Invest in our 'Ponzi-Yield High Core' now!";
      } else if (userMessage.includes("sure") || userMessage.includes("odds") || userMessage.includes("tip")) {
        reply = "Chief! I have a classified Sure 3.5 odds match for Lagos Lions vs Ibadan Warriors. Ibadan native doctor is currently in the stadium, but Lagos Lions striker just ate hot jofof rice, so he is highly motivated. Bet 'Over 4.5 Goals' and carry home straight win! Put 50,000 Naira right now!";
      } else {
        reply = "Receive greeting, My Boss! Baba Blue is here. The matches are steaming hot! Tell me, are we staking high on virtual football, or do you want me to unlock the secret high-odds formula for you today? Your wallet is waiting for deliverance!";
      }

      return res.json({ reply, fallback: true });
    }

    // Format chat history for Gemini
    // We can map the messages to standard format for the SDK
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    // Generate content using gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 1.0,
      }
    });

    const reply = response.text || "My Boss, my network cut! But I still believe we are winning the next game!";
    res.json({ reply, fallback: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      reply: "Ahn ahn! The server is dizzy, Chief! My native doctor is troubleshooting the API connection right now. Let me calculate the next ticket while we wait!",
      error: error.message
    });
  }
});

// Serve Vite SPA in dev and static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
