import { getPromptEngineeringByStrategy } from "../data/promptEngineering";
import { SAMBANOVA_CONFIG } from "../config/constants";

interface SambanovaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface SambanovaResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

class SambanovaService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = SAMBANOVA_CONFIG.API_KEY;
    this.baseUrl = SAMBANOVA_CONFIG.BASE_URL;
    this.model = SAMBANOVA_CONFIG.MODEL;
  }

  async sendMessage(messages: SambanovaMessage[], ragContext?: string): Promise<string> {
    try {
      // Prepare the system message with RAG context if provided
      const systemMessage: SambanovaMessage = {
        role: "system",
        content: ragContext || "You are a helpful Business Growth Hacking Coach for food & beverage businesses.",
      };

      // Combine system message with conversation messages
      const requestMessages = [systemMessage, ...messages];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: requestMessages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`SambaNova API error: ${response.status} ${response.statusText}`);
      }

      const data: SambanovaResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from SambaNova API");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("SambaNova API Error:", error);
      throw new Error("Failed to get response from AI coach. Please try again.");
    }
  }

  // Create concise system instruction that references context
  createSystemInstruction(selectedStrategy: string): string {
    return `You are a specialized Business Growth Hacking Coach for food & beverage businesses.

INSTRUCTIONS:
1. Use the framework content provided in the user's context to guide your responses
2. Follow the methodology and question sequences specified in the context
3. Focus on Singapore F&B businesses facing rising costs and thin profits
4. Ask questions one-by-one following the structured approach
5. Provide specific, actionable advice based on the selected strategy: ${selectedStrategy}

Be professional, direct, and results-focused in your coaching style.`;
  }

  // Create context message with RAG + instructions for user message
  createContextMessage(selectedStrategy: string, ragContent: string, userQuery: string = ""): string {
    const promptEngineering = getPromptEngineeringByStrategy(selectedStrategy);

    const contextPart = `CONTEXT - Growth Framework Knowledge:
${ragContent}

COACHING METHODOLOGY:
${promptEngineering}`;

    if (!userQuery) {
      // Initial coaching session
      return `${contextPart}

USER REQUEST: I need help with my F&B business growth. Please introduce yourself as my specialized ${selectedStrategy} coach and begin with the first introductory question about coaching history.`;
    } else {
      // Ongoing conversation
      return `${contextPart}

USER MESSAGE: ${userQuery}`;
    }
  }

  // Check if API is configured
  isConfigured(): boolean {
    return !!this.apiKey && !!this.baseUrl;
  }
}

export const sambanovaService = new SambanovaService();
export type { SambanovaMessage };
