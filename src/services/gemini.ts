import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/gemini/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (data.data.text) {
                return data.data.text;
            }
            return 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';
        } catch (error) {
            return 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';
        }
    }
} 