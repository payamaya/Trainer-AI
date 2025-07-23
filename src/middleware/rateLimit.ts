import type { Request, Response } from 'express'
import rateLimit, { type Options } from 'express-rate-limit'

export const createRateLimiter = (
  options: {
    windowMs: number
    max: number
  } & Partial<Options>
) => {
  return rateLimit({
    ...options,
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    standardHeaders: true, // Enable `RateLimit-*` headers
    message: {
      error: 'rate_limit_exceeded',
      message: 'Too many requests, please try again later',
    },
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        error: 'Too many requests',
        message: `Please wait ${options.windowMs / 1000} seconds before making another request`,
      })
    },
    keyGenerator: (req: Request) => {
      // Use IP + user ID if available
      return req.ip + (req.body?.userProfileData?.userId || '')
    },
  })
}
