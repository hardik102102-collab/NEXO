import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const sendMessageToGemini = async (
    history: { role: "user" | "model"; parts: { text: string }[] }[],
    message: string
) => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        tools: [{
            functionDeclarations: [{
                name: "logTicket",
                description: "Log a customer support ticket to Google Sheets when a user reports an issue that needs tracking.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        issue: { type: SchemaType.STRING, description: "The specific issue reported by the user." },
                        priority: { type: SchemaType.STRING, description: "Priority level: Login/Critical/Normal." },
                        user_name: { type: SchemaType.STRING, description: "Name of the user if provided, else 'Unknown'." }
                    },
                    required: ["issue", "priority"]
                }
            }]
        }]
    });

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    const result = await chat.sendMessage(message);
    return result.response;
};
