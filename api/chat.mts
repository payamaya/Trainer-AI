import type { VercelRequest, VercelResponse } from '@vercel/node'

// Define an interface for the expected error structure from OpenRouter
interface OpenRouterAPIErrorResponse {
  error?: {
    message?: string
    // You can add other properties here if they might exist in the error object, e.g.,
    // type?: string;
    // code?: string;
  }
  // Also, consider if there are other top-level properties in the error response.
}
// These variables are accessed from process.env because they are server-side.
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const APP_TITLE = process.env.APP_TITLE // If APP_TITLE should also be server-side

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!OPENROUTER_API_URL || !OPENROUTER_API_KEY) {
    console.error('Server-side API keys not configured!')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  try {
    const { userMessage, userProfileData, trainerMetaData } = req.body

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

    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.APP_REFERER_URL || 'http://localhost:5173', // Use server-side referrer
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
    })

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
