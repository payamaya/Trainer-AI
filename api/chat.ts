import type { VercelRequest, VercelResponse } from '@vercel/node'
import { chatRequestSchema } from '../src/schemas/chatRequest'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  const REFERER_URL = process.env.APP_REFERER_URL || ''
  const TITLE = process.env.APP_TITLE || ''

  if (!OPENROUTER_API_KEY) {
    return res
      .status(500)
      .json({ error: 'Server misconfiguration: API key missing' })
  }
  try {
    // ✅ Validate the body using Zod
    const parsed = chatRequestSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parsed.error.flatten(), // detailed errors
      })
    }
    const validatedBody = parsed.data
    const openrouterRes = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': REFERER_URL,
          'X-Title': TITLE,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedBody),
        cache: 'no-store', // Prevents caching
      }
    )

    const data = await openrouterRes.json()
    console.log('OpenRouter response status:', openrouterRes.status)
    console.log('OpenRouter response body:', data)
    res.status(openrouterRes.status).json(data)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('OpenRouter proxy error:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      })
    }
    res.status(500).json({ error: 'Failed to contact OpenRouter' })
  }
}
