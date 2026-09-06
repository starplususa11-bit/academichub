import { rateLimit } from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Limits general requests to 100 per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Strict Auth & Sensitive Action Rate Limiter
 * Limits login, password reset, and OTP attempts to 10 per 15 minutes per IP
 * Prevents brute-force attacks and credential stuffing
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

export default {
  apiRateLimiter,
  authRateLimiter
};
