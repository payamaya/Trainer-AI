import type { VercelRequest, VercelResponse } from '@vercel/node'

// Define an interface for the expected error structure from OpenRouter
interface OpenRouterAPIErrorResponse {
  error?: {
    message?: string
  }
}

interface RequestBody {
  userMessage: string
  userProfileData: {
    name: string
    age: number
    gender: string
    height: string
    weight: string
    fitnessLevel: string
    goals: string[]
  }
  trainerMetaData: {
    name: string
    specialization: string
    certifications: string[]
  }
}

// Environment variables (must be set in Vercel dashboard or .env file)
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const APP_TITLE = process.env.APP_TITLE

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  console.log('Handler started')
  try {
    console.log('Request body:', req.body)

    if (req.method !== 'POST') {
      console.log('Method not allowed')
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    console.log('Checking env vars')
    if (!OPENROUTER_API_URL || !OPENROUTER_API_KEY) {
      console.error('Missing API keys:', {
        OPENROUTER_API_URL: !!OPENROUTER_API_URL,
        OPENROUTER_API_KEY: !!OPENROUTER_API_KEY,
      })
      return res.status(500).json({ error: 'Server configuration error.' })
    }

    const { userMessage, userProfileData, trainerMetaData } =
      req.body as RequestBody

    // ✅ Validate input
    if (
      !userMessage ||
      !userProfileData ||
      !trainerMetaData ||
      !trainerMetaData.name ||
      !trainerMetaData.specialization ||
      !Array.isArray(trainerMetaData.certifications) ||
      !userProfileData.name ||
      typeof userProfileData.age !== 'number' ||
      !userProfileData.gender ||
      !userProfileData.height ||
      !userProfileData.weight ||
      !userProfileData.fitnessLevel ||
      !Array.isArray(userProfileData.goals)
    ) {
      return res.status(400).json({ error: 'Invalid or missing request data.' })
    }

    const systemPromptContent = `You are ${trainerMetaData.name}, ${trainerMetaData.specialization} coach.
Certifications: ${trainerMetaData.certifications.join(', ')}
Current date: ${new Date().toLocaleDateString()}

Client Profile:
- Name: ${userProfileData.name}
- Age: ${userProfileData.age}
- Gender: ${userProfileData.gender}
- Height: ${userProfileData.height}
- Weight: ${userProfileData.weight}
- Fitness Level: ${userProfileData.fitnessLevel}
- Goals: ${userProfileData.goals.join(', ')}

AI Prompt Guidelines:
- Provide personalized fitness advice based on client profile
- Modify exercises based on client's fitness level
- Give clear form instructions
- Offer nutrition suggestions based on client's goals
- Be encouraging and professional
- When creating schedules, ask if the user wants vibration reminders
- For vibration requests, format as: [VIBRATE: Xms] where X is duration
- Example: "Would you like a vibration reminder? [VIBRATE: 500ms]"`

    const openRouterResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
          'HTTP-Referer':
            process.env.APP_REFERER_URL || 'http://localhost:5173',
          'X-Title': APP_TITLE || 'AI Fitness App',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            { role: 'system', content: systemPromptContent },
            { role: 'user', content: userMessage },
          ],
        }),
      }
    )

    if (!openRouterResponse.ok) {
      const errorData = (await openRouterResponse
        .json()
        .catch(() => ({}))) as OpenRouterAPIErrorResponse
      console.error('OpenRouter API error (serverless function):', errorData)
      return res.status(openRouterResponse.status).json({
        error:
          errorData.error?.message ||
          `Failed to fetch from OpenRouter: HTTP ${openRouterResponse.status}`,
      })
    }

    const data = await openRouterResponse.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error in serverless function:', error)
    return res
      .status(500)
      .json({ error: 'An unexpected server error occurred.' })
  }
}
