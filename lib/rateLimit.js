import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 10000,
  duration: 60,
});

export const checkRateLimit = async (ip) => {
  try {
    await rateLimiter.consume(ip);
  } catch (error) {
    if (error?.msBeforeNext) {
      throw new Error("RateLimitExceeded");
    }
    throw error;
  }
};
