interface RateLimitState {
  count: number;
  timestamp: number;
}

const RATE_LIMIT_KEY = 'lumi_rate_limit';
const MESSAGE_LIMIT = 10;
const COOLDOWN_HOURS = 24;

export const checkRateLimit = (): { allowed: boolean; remaining: number; resetTime: number } => {
  if (typeof window === 'undefined') {
    return { allowed: true, remaining: MESSAGE_LIMIT, resetTime: 0 };
  }

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  
  if (!stored) {
    return { allowed: true, remaining: MESSAGE_LIMIT, resetTime: 0 };
  }

  try {
    const { count, timestamp }: RateLimitState = JSON.parse(stored);
    const hoursSinceLastMessage = (now - timestamp) / (1000 * 60 * 60);
    
    // Reset counter if 24 hours have passed
    if (hoursSinceLastMessage >= COOLDOWN_HOURS) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { allowed: true, remaining: MESSAGE_LIMIT, resetTime: 0 };
    }

    const remaining = Math.max(0, MESSAGE_LIMIT - count);
    const resetTime = timestamp + (COOLDOWN_HOURS * 60 * 60 * 1000);
    
    return {
      allowed: count < MESSAGE_LIMIT,
      remaining,
      resetTime
    };
  } catch (error) {
    console.error('Error parsing rate limit data:', error);
    return { allowed: true, remaining: MESSAGE_LIMIT, resetTime: 0 };
  }
};

export const incrementMessageCount = (): { allowed: boolean; remaining: number; resetTime: number } => {
  if (typeof window === 'undefined') {
    return { allowed: true, remaining: MESSAGE_LIMIT, resetTime: 0 };
  }

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  let newCount = 1;
  
  if (stored) {
    try {
      const { count, timestamp }: RateLimitState = JSON.parse(stored);
      const hoursSinceLastMessage = (now - timestamp) / (1000 * 60 * 60);
      
      if (hoursSinceLastMessage < COOLDOWN_HOURS) {
        newCount = count + 1;
      }
    } catch (error) {
      console.error('Error parsing rate limit data:', error);
    }
  }

  const state: RateLimitState = {
    count: newCount,
    timestamp: now
  };

  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
  
  const resetTime = Date.now() + (COOLDOWN_HOURS * 60 * 60 * 1000);
  return {
    allowed: newCount <= MESSAGE_LIMIT,
    remaining: Math.max(0, MESSAGE_LIMIT - newCount),
    resetTime
  };
};

export const getRemainingTime = (): string => {
  if (typeof window === 'undefined') return '';
  
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) return '';

  try {
    const { timestamp }: RateLimitState = JSON.parse(stored);
    const now = Date.now();
    const resetTime = timestamp + (COOLDOWN_HOURS * 60 * 60 * 1000);
    const timeLeft = Math.max(0, resetTime - now);
    
    if (timeLeft <= 0) return '';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating remaining time:', error);
    return '';
  }
};
