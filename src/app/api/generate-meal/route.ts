import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  getClientIP,
  isRateLimited,
  incrementUsage,
  isLocalhost
} from './rateLimitStore';

export async function POST(request: Request) {
  try {
    // Check for API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json({
        error: 'Server configuration error. Please contact support.'
      }, { status: 500 });
    }

    // Initialize OpenAI client inside the handler
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const clientIP = getClientIP(request);

    // Skip rate limiting for localhost
    const skipRateLimit = false; // Set to true to skip rate limiting for testing

    // Check rate limit (only for non-localhost)
    if (!skipRateLimit && isRateLimited(clientIP)) {
      return NextResponse.json({
        error: 'Rate limit exceeded. You can only generate 2 meals per day.'
      }, { status: 429 });
    }

    const { prompt } = await request.json();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    });

    // Increment usage after successful generation (only for non-localhost)
    if (!skipRateLimit) {
      incrementUsage(clientIP);
    }

    console.log('OpenAI full response:', completion);
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}
