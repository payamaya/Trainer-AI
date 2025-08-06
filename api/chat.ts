// import type { VercelRequest, VercelResponse } from '@vercel/node'
// import { chatRequestSchema } from '../src/schemas/chatRequest'
// import buildSystemPrompt from '../src/utils/buildSystemPrompt'
// import type { UserProfile } from '../src/types/user'

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   const rateLimit = {
//     windowMs: 60 * 1000, // 1 minute
//     max: 10, // 10 requests per minute
//     store: new Map(), // In-memory store (for demo)
//   }

//   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
//   const current = rateLimit.store.get(ip) || { count: 0, lastReset: Date.now() }

//   if (Date.now() - current.lastReset > rateLimit.windowMs) {
//     current.count = 0
//     current.lastReset = Date.now()
//   }

//   if (current.count >= rateLimit.max) {
//     return res.status(429).json({
//       error: `Rate limit exceeded. Try again in ${Math.ceil(
//         (rateLimit.windowMs - (Date.now() - current.lastReset)) / 1000
//       )} seconds`,
//     })
//   }

//   current.count++
//   rateLimit.store.set(ip, current)

//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' })
//   }

//   // Create an AbortController for this request
//   const controller = new AbortController()
//   const signal = controller.signal

//   // Handle client disconnects
//   req.on('close', () => {
//     controller.abort()
//   })

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
//         details: parsed.error.flatten(),
//       })
//     }

//     const validatedBody = parsed.data

//     const systemPromt = buildSystemPrompt(
//       validatedBody?.trainerMetaData,
//       validatedBody.userProfileData as UserProfile
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
//         signal,
//         cache: 'no-store', // Prevents caching
//       }
//     )
//     if (signal.aborted) {
//       return res.status(499).json({ error: 'Client Closed Request' })
//     }
//     const data = await openrouterRes.json()

//     console.log('OpenRouter response status:', openrouterRes.status)
//     console.log('OpenRouter response body:', data)

//     if (!openrouterRes.ok) {
//       console.error('OpenRouter returned an error status:', data)
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
//     if (signal.aborted) {
//       console.log('Request was aborted by client')
//       return res.status(499).json({ error: 'Client Closed Request' })
//     }
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
import buildSystemPrompt from '../src/utils/buildSystemPrompt'
import type { UserProfile } from '../src/types/user'

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 10, // 10 requests per minute per IP
  store: new Map<string, { count: number; lastReset: number }>(),
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Rate limiting implementation
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const current = RATE_LIMIT.store.get(ip as string) || {
    count: 0,
    lastReset: Date.now(),
  }

  // Reset counter if window has passed
  if (Date.now() - current.lastReset > RATE_LIMIT.WINDOW_MS) {
    current.count = 0
    current.lastReset = Date.now()
  }

  // Check if rate limit exceeded
  if (current.count >= RATE_LIMIT.MAX_REQUESTS) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT.WINDOW_MS - (Date.now() - current.lastReset)) / 1000
    )
    res.setHeader('Retry-After', retryAfter)
    return res.status(429).json({
      error: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      retryAfter,
    })
  }

  // Increment counter
  current.count++
  RATE_LIMIT.store.set(ip as string, current)

  // Rest of your existing handler
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const controller = new AbortController()
  const signal = controller.signal
  req.on('close', () => controller.abort())

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  if (!OPENROUTER_API_KEY) {
    return res
      .status(500)
      .json({ error: 'Server misconfiguration: API key missing' })
  }

  try {
    const parsed = chatRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parsed.error.flatten(),
      })
    }

    const validatedBody = parsed.data
    const systemPromt = buildSystemPrompt(
      validatedBody?.trainerMetaData,
      validatedBody.userProfileData as UserProfile
    )

    const openRouterPayload = {
      model: validatedBody.model,
      messages: [
        { role: 'system', content: systemPromt },
        { role: 'user', content: validatedBody.userMessage },
      ],
      temperature: validatedBody.temperature,
      max_tokens: validatedBody.max_tokens || 3000,
    }

    const openrouterRes = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.APP_REFERER_URL || '',
          'X-Title': process.env.APP_TITLE || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openRouterPayload),
        signal,
      }
    )

    if (signal.aborted) {
      return res.status(499).json({ error: 'Client Closed Request' })
    }

    const data = await openrouterRes.json()

    if (!openrouterRes.ok) {
      return res.status(openrouterRes.status).json({
        error: data.error?.message || 'Provider returned an error status',
        details: data,
      })
    }

    if (!data.choices?.length) {
      return res.status(500).json({
        error: 'AI did not return any response',
        details: data,
      })
    }

    return res.status(200).json(data)
  } catch (err: unknown) {
    if (signal.aborted) {
      return res.status(499).json({ error: 'Client Closed Request' })
    }
    if (err instanceof Error) {
      console.error('OpenRouter proxy error:', err)
      return res.status(500).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Failed to contact OpenRouter' })
  }
}
