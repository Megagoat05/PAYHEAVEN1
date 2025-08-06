
import { GoogleGenAI, Type } from "@google/genai";
import { FaqItem } from '../types';

// IMPORTANT: In a real application, the API key would be stored in a secure environment variable.
// We are using a placeholder here as per the project guidelines.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. FAQ content will be mocked. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const faqSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: "The frequently asked question."
        },
        answer: {
          type: Type.STRING,
          description: "A clear and concise answer to the question."
        }
      },
      required: ["question", "answer"]
    }
};

const mockFaqs: FaqItem[] = [
    { question: "Are these accounts really verified?", answer: "Yes, every account we sell is 100% verified with all necessary documentation and is ready for immediate use. We guarantee their status upon delivery." },
    { question: "What is the delivery time?", answer: "Account details are delivered instantly to your registered email address upon successful purchase from your wallet balance." },
    { question: "Can I use these accounts in any country?", answer: "Most of our accounts are US or UK/EU based, which provides broad international compatibility. Please check the details of each account for specific regional information." },
    { question: "What if an account gets suspended?", answer: "We guarantee the accounts are fully functional at the time of sale. We also provide documentation and guidance on best practices to maintain account health. However, we are not responsible for suspensions due to user actions that violate the platform's terms of service." },
    { question: "How do I top up my wallet?", answer: "You can top up your wallet using our automated cryptocurrency payment system (supporting BTC, ETH, USDT) or via manual methods like bank transfer by contacting our support on Telegram." },
];

export const generateFaqs = async (): Promise<FaqItem[]> => {
    if (!API_KEY) {
        return Promise.resolve(mockFaqs);
    }
    
    try {
        const prompt = "Generate 5 frequently asked questions and answers for a website that sells pre-verified financial accounts like Stripe, PayPal, and Wise. The tone should be professional, reassuring, and clear. Focus on questions about verification, delivery, usage, and security.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: faqSchema,
            },
        });
        
        const text = response.text.trim();
        const faqs = JSON.parse(text);
        
        // Basic validation
        if (Array.isArray(faqs) && faqs.every(f => f.question && f.answer)) {
            return faqs;
        } else {
            console.error("Gemini API returned data in an unexpected format.");
            return mockFaqs;
        }

    } catch (error) {
        console.error("Error fetching FAQs from Gemini API:", error);
        // Fallback to mock data in case of an API error
        return mockFaqs;
    }
};
