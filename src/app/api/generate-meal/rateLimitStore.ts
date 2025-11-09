// Shared rate limit storage across all endpoints
// In production, use a database like Redis

export interface RateLimitData {
  count: number;
  lastReset: string; // ISO date string
}

export const rateLimitStore = new Map<string, RateLimitData>();
export const MAX_GENERATIONS_PER_DAY = 2;

export function getClientIP(request: Request): string {
  // Try to get IP from various headers (in case of proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  // Use the first available IP, fallback to a default for localhost
  const ip = forwarded?.split(',')[0]?.trim() ||
             realIP ||
             clientIP ||
             '127.0.0.1';

  return ip;
}

export function isLocalhost(ip: string): boolean {
  return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
}

export function isRateLimited(ip: string): boolean {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const data = rateLimitStore.get(ip);

  if (!data || data.lastReset !== today) {
    // Reset or initialize for today
    rateLimitStore.set(ip, { count: 0, lastReset: today });
    return false;
  }

  return data.count >= MAX_GENERATIONS_PER_DAY;
}

export function incrementUsage(ip: string): void {
  const today = new Date().toISOString().split('T')[0];
  const data = rateLimitStore.get(ip);

  if (data && data.lastReset === today) {
    data.count += 1;
  } else {
    // Reset for new day
    rateLimitStore.set(ip, { count: 1, lastReset: today });
  }
}

export function getCurrentUsage(ip: string): { used: number; remaining: number; isLocalhost: boolean } {
  const isLocal = isLocalhost(ip);
  if (isLocal) {
    return { used: 0, remaining: 2, isLocalhost: true }; // Unlimited for localhost
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const data = rateLimitStore.get(ip);

  if (!data || data.lastReset !== today) {
    return { used: 0, remaining: MAX_GENERATIONS_PER_DAY, isLocalhost: false };
  }

  return {
    used: data.count,
    remaining: Math.max(0, MAX_GENERATIONS_PER_DAY - data.count),
    isLocalhost: false
  };
}
