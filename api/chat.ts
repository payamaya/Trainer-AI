// import type { VercelRequest, VercelResponse } from '@vercel/node'
// import { chatRequestSchema } from '../src/schemas/chatRequest'
// import buildSystemPrompt from '../src/utils/buildSystemPrompt'

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' })
//   }

//   const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
//   const REFERER_URL = process.env.APP_REFERER_URL || ''
//   const TITLE = process.env.APP_TITLE || ''

//   if (!OPENROUTER_API_KEY) {
//     return res
//       .status(500)
//       .json({ error: 'Server misconfiguration: API key missing' })
//   }
//   try {
//     // ✅ Validate the body using Zod
//     const parsed = chatRequestSchema.safeParse(req.body)

//     if (!parsed.success) {
//       console.error(
//         'Zod validation error in API handler:',
//         parsed.error.flatten()
//       )
//       return res.status(400).json({
//         error: 'Invalid request body',
//         details: parsed.error.flatten(), // detailed errors
//       })
//     }

//     const validatedBody = parsed.data

//     const systemPromt = buildSystemPrompt(
//       validatedBody.trainerMetaData?.trainerPromtSummary,
//       validatedBody.userProfileData
//     )

//     const messageForOpenRouter = [
//       { role: 'system', content: systemPromt },
//       { role: 'user', content: validatedBody.userMessage },
//     ]

//     const openRouterPayload = {
//       model: validatedBody.model,
//       messages: messageForOpenRouter,
//       temperature: validatedBody.temperature,
//       max_tokens: validatedBody.max_tokens || 3000,
//     }
//     console.log(
//       'Sending payload to OpenRouter:',
//       JSON.stringify(openRouterPayload, null, 2)
//     )
//     const openrouterRes = await fetch(
//       'https://openrouter.ai/api/v1/chat/completions',
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           'HTTP-Referer': REFERER_URL,
//           'X-Title': TITLE,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(openRouterPayload),
//         cache: 'no-store', // Prevents caching
//       }
//     )

//     const data = await openrouterRes.json()

//     console.log('OpenRouter response status:', openrouterRes.status)
//     console.log('OpenRouter response body:', data)

//     // IMPORTANT: Check if OpenRouter returned an error.
//     if (!openrouterRes.ok) {
//       console.error('OpenRouter returned an error status:', data)
//       // Pass the error message from OpenRouter back to the frontend
//       return res.status(openrouterRes.status).json({
//         error: data.error?.message || 'Provider returned an error status',
//         details: data,
//       })
//     }
//     if (
//       !data.choices ||
//       !Array.isArray(data.choices) ||
//       data.choices.length === 0
//     ) {
//       console.error('OpenRouter returned no choices:', data)
//       return res.status(500).json({
//         error: 'AI did not return any response',
//         details: data,
//       })
//     }

//     return res.status(200).json(data)
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       console.error('OpenRouter proxy error:', {
//         message: err.message,
//         stack: err.stack,
//         name: err.name,
//       })
//     }
//     res.status(500).json({ error: 'Failed to contact OpenRouter' })
//   }
// }
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { chatRequestSchema } from '../src/schemas/chatRequest'
import { buildSystemPrompt } from '../src/utils/buildSystemPrompt'
import { createRateLimiter } from '../src/middleware/rateLimit'
import { createHash } from 'crypto'
import { kv } from '@vercel/kv'
// Initialize rate limiter (15 requests per minute)
const limiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Apply rate limiting
    await new Promise<void>((resolve, reject) => {
      limiter(req as any, res as any, (err?: unknown) => {
        return err ? reject(err) : resolve()
      })
    })

    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method Not Allowed',
        allowedMethods: ['POST'],
      })
    }

    // Create request hash for caching
    const requestHash = createHash('sha256')
      .update(
        JSON.stringify({
          userMessage: req.body?.userMessage,
          userProfileData: req.body?.userProfileData,
        })
      )
      .digest('hex')
    // Check cache first
    const cachedResponse = await kv.get(`response:${requestHash}`)
    if (cachedResponse) {
      return res.status(200).json(cachedResponse)
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
    const REFERER_URL = process.env.APP_REFERER_URL || ''
    const TITLE = process.env.APP_TITLE || ''

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: 'Server misconfiguration: API key missing',
      })
    }

    // Validate request body
    const validation = chatRequestSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: validation.error.flatten(),
      })
    }

    const validatedBody = validation.data

    // Build system prompt
    const systemPrompt = buildSystemPrompt(
      validatedBody.trainerMetaData?.trainerPromptSummary,
      validatedBody.userProfileData
    )

    // Prepare messages
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: validatedBody.userMessage },
    ]

    const payload = {
      model: validatedBody.model,
      messages,
      temperature: validatedBody.temperature,
      max_tokens: validatedBody.max_tokens || 3000,
    }

    // Make API call
    const apiResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': REFERER_URL,
          'X-Title': TITLE,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }
    )

    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader(
      'Cache-Control',
      'public, max-age=60, stale-while-revalidate=30'
    )

    const data = await apiResponse.json()

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: data.error?.message || 'Provider returned an error status',
        details: data,
      })
    }

    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      data.choices.length === 0
    ) {
      return res.status(500).json({
        error: 'AI did not return any response',
        details: data,
      })
    }
    // Cache the successful response
    await kv.set(`response:${requestHash}`, data, {
      ex: 3600, // Cache for 1 hour
    })
    return res.status(200).json(data)
  } catch (err: unknown) {
    console.error('API handler error:', err)
    return res.status(500).json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : undefined,
    })
  }
}
