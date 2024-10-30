// // import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// // const apiKey: string | undefined = process.env.GEMINI_API_KEY;
// // if (!apiKey) {
// //   throw new Error("API key is not defined");
// // }

// // const genAI = new GoogleGenerativeAI(apiKey);

// // const model = genAI.getGenerativeModel({
// //   model: "gemini-1.5-flash",
// // });

// // const generationConfig = {
// //   temperature: 1,
// //   topP: 0.95,
// //   topK: 64,
// //   maxOutputTokens: 8192,
// //   responseMimeType: "application/json",
// // };

// // interface ChatHistory {
// //   role: "user" | "model";
// //   parts: Array<{ text: string }>;
// // }

// // async function run(): Promise<void> {
// //   const chatSession = model.startChat({
// //     generationConfig,
// //     history: [] as ChatHistory[],
// //   });

// //   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// //   console.log(result.response.text());
// // }

// // run().catch((error) => {
// //   console.error("Error during AI chat session:", error);
// // });



import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();  // Load .env file contents into process.env

const apiKey: string | undefined = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("API key is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

interface ChatHistory {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

// Function to start a chat session and send a message
export async function AiChatSession(input: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [] as ChatHistory[],
  });

  // Send the message input passed from the UI
  const result = await chatSession.sendMessage(input);
  return result;
}



// // AiModel.ts
// import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel, ChatSession, ChatResult } from "@google/generative-ai";

// // Fetch the API key from the environment variables
// const apiKey: string | undefined = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// if (!apiKey) {
//   throw new Error("API key is not defined");
// }

// const genAI = new GoogleGenerativeAI(apiKey);

// const model: GenerativeModel = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// // Function to create a chat session and send a message
// export async function sendAiMessage(userInput: string): Promise<ChatResult> {
//   const chatSession: ChatSession = model.startChat({
//     generationConfig,
//     history: [
//       {
//         role: "user",
//         parts: [{ text: userInput }],
//       },
//     ],
//   });

//   const result: ChatResult = await chatSession.sendMessage(userInput);
//   return result;
// }