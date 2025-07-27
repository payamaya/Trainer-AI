import type { VercelRequest, VercelResponse } from '@vercel/node'
import { translationRequestSchema } from '../src/schemas/translationRequest'
import getJsonBody from '../src/helper/getJsonBody'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  const REFERER_URL = process.env.APP_REFERER_URL || ''
  const TITLE = process.env.APP_TITLE || 'AI Translator'
  const TRANSLATION_MODEL = process.env.VITE_MODEL || 'deepseek/deepseek-chat' // <--- NEW LINE: Get model from env

  if (!OPENROUTER_API_KEY) {
    return res
      .status(500)
      .json({ error: 'Server misconfiguration: OPENROUTER_API_KEY missing' })
  }

  try {
    const rawBody = await getJsonBody(req)
    const parsed = translationRequestSchema.safeParse(rawBody)
    if (!parsed.success) {
      console.error(
        'Zod validation error for translation request:',
        parsed.error.flatten()
      )
      return res.status(400).json({
        error: 'Invalid translation request body',
        details: parsed.error.flatten(), // This will show which fields are missing/invalid
      })
    }
    const { text, targetLang } = parsed.data
    // --- Core Logic for LLM Translation ---
    const modelToUse = TRANSLATION_MODEL // This is the DeepSeek model ID on OpenRouter

    const messagesForDeepSeek = [
      {
        role: 'system',
        content: `You are a highly skilled and accurate language translator. Your task is to translate the given text into ${targetLang}. Preserve the original meaning, tone, and formatting as much as possible. If the text contains any special characters or markdown, ensure they are correctly handled in the translation. Only return the translated text. Do NOT add any extra commentary, explanations, or conversational filler.`,
      },
      {
        role: 'user',
        content: text,
      },
    ]

    const openRouterPayload = {
      model: modelToUse,
      messages: messagesForDeepSeek,
      temperature: 0.2, // Keep temperature low for more literal/accurate translation
      max_tokens: 2000, // Adjust based on expected translation length, less than full context
    }

    console.log(
      'Sending translation payload to OpenRouter (DeepSeek):',
      JSON.stringify(openRouterPayload, null, 2)
    )

    const openrouterRes = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': REFERER_URL, // Your frontend URL for OpenRouter attribution
          'X-Title': TITLE, // Your app title for OpenRouter attribution
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openRouterPayload),
        cache: 'no-store',
      }
    )

    const data = await openrouterRes.json()

    console.log('OpenRouter translation response status:', openrouterRes.status)
    console.log('OpenRouter translation response body:', data)

    if (!openrouterRes.ok) {
      console.error(
        'OpenRouter returned an error status for translation:',
        data
      )
      return res.status(openrouterRes.status).json({
        error:
          data.error?.message ||
          'AI provider returned an error status for translation',
        details: data,
      })
    }

    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      data.choices.length === 0 ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error('OpenRouter returned no valid translation choice:', data)
      return res.status(500).json({
        error: 'AI did not return any translation response',
        details: data,
      })
    }

    const translatedText = data.choices[0].message.content

    // Return the translated text
    return res.status(200).json({ translatedText })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('OpenRouter translation proxy error:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      })
    }
    res
      .status(500)
      .json({ error: 'Failed to contact OpenRouter for translation' })
  }
}
