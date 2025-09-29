import { Injectable } from '@angular/core';
import { z } from 'zod';
import { environment } from '../environments/environment.prod';

const AiOptionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean()
});

const AiQuestionSchema = z.object({
  description: z.string().min(1),
  options: z.array(AiOptionSchema).min(2).max(6)
});

const AiQuestionsResponseSchema = z.object({
  questions: z.array(AiQuestionSchema).min(1)
});

export type AiGeneratedOption = z.infer<typeof AiOptionSchema>;
export type AiGeneratedQuestion = z.infer<typeof AiQuestionSchema>;

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly apiKey: string | undefined = (environment as any).GEMINI_API_KEY;
  private readonly modelEndpoint: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  async generateQuestions(topic: string, numQuestions: number): Promise<AiGeneratedQuestion[]> {
    if (!this.apiKey) {
      throw new Error('Missing GEMINI_API_KEY in environment.');
    }

    const prompt = this.buildPrompt(topic, numQuestions);

    const res = await fetch(`${this.modelEndpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Gemini request failed with status ${res.status}`);
    }

    const data = await res.json();
    const text = this.extractTextFromGeminiResponse(data);
    const parsed = this.safeParseJson(text);

    const validated = AiQuestionsResponseSchema.parse(parsed);
    return validated.questions;
  }

  private buildPrompt(topic: string, num: number): string {
    return [
      `You are generating multiple-choice questions for a quiz app.`,
      `Topic: ${topic}.`,
      `Create exactly ${num} questions.`,
      `Each question must have 4 options, exactly one isCorrect=true and others false.`,
      `Return ONLY valid JSON in this exact schema:`,
      `{"questions":[{"description":"...","options":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]}`,
      `Do not include markdown fences or any commentary, only the JSON.`
    ].join(' ');
  }


  private extractTextFromGeminiResponse(resp: any): string {
    const candidates = resp?.candidates;
    const text = candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Invalid Gemini response payload');
    }
    return text.trim();
  }

  private safeParseJson(raw: string): unknown {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '').trim();
    }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleaned);
  }
}


