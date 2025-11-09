import { NextResponse } from 'next/server';
import { getClientIP, getCurrentUsage, MAX_GENERATIONS_PER_DAY } from '../rateLimitStore';

export async function GET(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const usage = getCurrentUsage(clientIP);

    return NextResponse.json({
      used: usage.used,
      remaining: usage.remaining,
      maxPerDay: MAX_GENERATIONS_PER_DAY,
      isLocalhost: usage.isLocalhost
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}
