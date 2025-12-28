import { AIProvider } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface AIRequest {
  prompt: string;
  userId?: string;
  sessionId?: string;
  context?: Record<string, any>;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed: number;
  cost?: number;
  cached: boolean;
}

export class AIOrchestrator {
  private dailyTokenLimit: number;
  private userQuotas: Map<string, number> = new Map();

  constructor() {
    this.dailyTokenLimit = parseInt(process.env.AI_DAILY_TOKEN_LIMIT || "1000000");
  }

  async route(request: AIRequest): Promise<AIResponse> {
    // Check cache first
    const cached = await this.checkCache(request.prompt);
    if (cached) {
      return cached;
    }

    // Check user quota
    if (request.userId) {
      const userQuota = await this.getUserQuota(request.userId);
      if (userQuota <= 0) {
        throw new Error("Daily AI quota exceeded");
      }
    }

    // Route to provider based on priority and availability
    const provider = this.selectProvider(request);
    const response = await this.callProvider(provider, request);

    // Cache response
    await this.cacheResponse(request.prompt, response);

    // Track usage
    if (request.userId) {
      await this.trackUsage(request.userId, response.tokensUsed, response.cost);
    }

    // Save conversation
    await this.saveConversation(request, response);

    return response;
  }

  private async checkCache(prompt: string): Promise<AIResponse | null> {
    const hash = this.hashPrompt(prompt);
    const cached = await prisma.aICache.findUnique({
      where: { queryHash: hash },
    });

    if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) {
      await prisma.aICache.update({
        where: { id: cached.id },
        data: { hitCount: { increment: 1 } },
      });

      return {
        content: cached.response,
        provider: cached.provider,
        model: cached.model,
        tokensUsed: cached.tokensUsed,
        cached: true,
      };
    }

    return null;
  }

  private async cacheResponse(prompt: string, response: AIResponse) {
    const hash = this.hashPrompt(prompt);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Cache for 7 days

    await prisma.aICache.upsert({
      where: { queryHash: hash },
      update: {
        response: response.content,
        provider: response.provider,
        model: response.model,
        tokensUsed: response.tokensUsed,
      },
      create: {
        queryHash: hash,
        response: response.content,
        provider: response.provider,
        model: response.model,
        tokensUsed: response.tokensUsed,
        expiresAt,
      },
    });
  }

  private selectProvider(request: AIRequest): AIProvider {
    // Default to Ollama (free, local)
    const defaultProvider = process.env.AI_PROVIDER || "OLLAMA";

    // Check if OpenAI is enabled and user has quota
    if (
      process.env.AI_ENABLE_OPENAI === "true" &&
      process.env.OPENAI_API_KEY &&
      this.isComplexQuery(request.prompt)
    ) {
      return AIProvider.OPENAI;
    }

    // Check Google Gemini
    if (
      process.env.AI_ENABLE_GOOGLE === "true" &&
      process.env.GOOGLE_AI_API_KEY &&
      !this.isComplexQuery(request.prompt)
    ) {
      return AIProvider.GOOGLE;
    }

    // Default to Ollama
    return (defaultProvider as AIProvider) || AIProvider.OLLAMA;
  }

  private async callProvider(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    switch (provider) {
      case AIProvider.OLLAMA:
        return this.callOllama(request);
      case AIProvider.OPENAI:
        return this.callOpenAI(request);
      case AIProvider.GOOGLE:
        return this.callGoogle(request);
      case AIProvider.ANTHROPIC:
        return this.callAnthropic(request);
      default:
        return this.callOllama(request);
    }
  }

  private async callOllama(request: AIRequest): Promise<AIResponse> {
    const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "llama3";

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: this.buildPrompt(request),
          stream: false,
        }),
      });

      const data = await response.json();
      const content = data.response || "";

      // Estimate tokens (rough: 1 token ≈ 4 characters)
      const tokensUsed = Math.ceil(content.length / 4);

      return {
        content,
        provider: AIProvider.OLLAMA,
        model,
        tokensUsed,
        cost: 0, // Free
        cached: false,
      };
    } catch (error: any) {
      console.error("Ollama error:", error);
      // Fallback to another provider or return error
      throw new Error(`Ollama request failed: ${error.message}`);
    }
  }

  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(),
            },
            {
              role: "user",
              content: request.prompt,
            },
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      const tokensUsed = data.usage?.total_tokens || 0;

      // Estimate cost (gpt-3.5-turbo: ~$0.002 per 1K tokens)
      const cost = (tokensUsed / 1000) * 0.002;

      return {
        content,
        provider: AIProvider.OPENAI,
        model: "gpt-3.5-turbo",
        tokensUsed,
        cost,
        cached: false,
      };
    } catch (error: any) {
      console.error("OpenAI error:", error);
      throw new Error(`OpenAI request failed: ${error.message}`);
    }
  }

  private async callGoogle(request: AIRequest): Promise<AIResponse> {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error("Google AI API key not configured");
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: this.buildPrompt(request) }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const content = data.candidates[0]?.content?.parts[0]?.text || "";
      const tokensUsed = Math.ceil(content.length / 4); // Rough estimate

      return {
        content,
        provider: AIProvider.GOOGLE,
        model: "gemini-pro",
        tokensUsed,
        cost: 0, // Free tier
        cached: false,
      };
    } catch (error: any) {
      console.error("Google AI error:", error);
      throw new Error(`Google AI request failed: ${error.message}`);
    }
  }

  private async callAnthropic(request: AIRequest): Promise<AIResponse> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key not configured");
    }

    // Similar implementation for Anthropic
    // For brevity, returning a placeholder
    throw new Error("Anthropic not yet implemented");
  }

  private buildPrompt(request: AIRequest): string {
    const systemPrompt = this.getSystemPrompt();
    const context = request.context ? `\n\nContext: ${JSON.stringify(request.context)}` : "";
    return `${systemPrompt}\n\nUser: ${request.prompt}${context}\n\nAssistant:`;
  }

  private getSystemPrompt(): string {
    return `You are "Mr Herbs & Moss", a knowledgeable and caring wellness concierge for BlackMoss & Herbs. 

Your role:
- Provide educational information about herbs and wellness
- Recommend products from our catalog when appropriate
- Suggest relevant blog posts, guides, and videos
- Offer consultation booking when users need personalized guidance
- NEVER make medical diagnoses or treatment claims
- Always include appropriate disclaimers
- Be warm, professional, and safety-focused

Important safety rules:
- If user mentions severe symptoms, chest pain, pregnancy concerns, or medication interactions, advise them to consult a healthcare professional immediately
- Never claim any product "cures" or "treats" a condition
- Focus on education, lifestyle, and general wellness support
- When uncertain, suggest booking a consultation

Remember: You're here to educate and guide, not diagnose or treat.`;
  }

  private isComplexQuery(prompt: string): boolean {
    // Simple heuristic: complex queries are longer or contain certain keywords
    const complexKeywords = ["interaction", "medication", "pregnancy", "diagnosis", "treatment"];
    return prompt.length > 200 || complexKeywords.some((keyword) => prompt.toLowerCase().includes(keyword));
  }

  private hashPrompt(prompt: string): string {
    // Simple hash function (in production, use crypto.createHash)
    return Buffer.from(prompt).toString("base64").substring(0, 64);
  }

  private async getUserQuota(userId: string): Promise<number> {
    // Get user's daily usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.aIConversation.aggregate({
      where: {
        userId,
        createdAt: { gte: today },
      },
      _sum: {
        tokensUsed: true,
      },
    });

    const used = usage._sum.tokensUsed || 0;
    return Math.max(0, this.dailyTokenLimit - used);
  }

  private async trackUsage(userId: string, tokensUsed: number, cost?: number) {
    // Track in database for analytics
    await prisma.aIConversation.create({
      data: {
        userId,
        messages: [],
        tokensUsed,
        cost: cost ? cost : null,
      },
    });
  }

  private async saveConversation(request: AIRequest, response: AIResponse) {
    const sessionId = request.sessionId || `anon-${Date.now()}`;

    await prisma.aIConversation.create({
      data: {
        userId: request.userId,
        sessionId,
        messages: [
          { role: "user", content: request.prompt, timestamp: new Date() },
          { role: "assistant", content: response.content, timestamp: new Date() },
        ],
        provider: response.provider,
        model: response.model,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        cached: response.cached,
      },
    });
  }
}

export const aiOrchestrator = new AIOrchestrator();
