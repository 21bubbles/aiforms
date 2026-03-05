import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const apiKey: string | undefined = process.env.NEXT_PUBLIC_GROQ_API_KEY;
if (!apiKey) {
  throw new Error("API key is not defined");
}

const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

interface ChatHistory {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

// Function to start a chat session and send a message
export async function AiChatSession(input: string) {
  const result = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: input }],
    temperature: 1,
    top_p: 0.95,
    max_tokens: 8192,
    response_format: { type: "json_object" },
  });

  // Wrap Groq response to match Gemini's response shape
  return {
    response: {
      text: () => result.choices[0]?.message?.content ?? "",
    },
  };
}