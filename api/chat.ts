// import type { VercelRequest, VercelResponse } from '@vercel/node'

// interface OpenRouterAPIErrorResponse {
//   error?: {
//     message?: string
//   }
// }

// interface RequestBody {
//   userMessage: string
//   userProfileData: {
//     name: string
//     age: number
//     gender: string
//     height: string
//     weight: string
//     fitnessLevel: string
//     goals: string[]
//   }
//   trainerMetaData: {
//     name: string
//     specialization: string
//     certifications: string[]
//     clients?: Array<{
//       id: number
//       name: string
//       goals: string[]
//       currentProgram: string
//       lastSession: string
//       nextSession: string
//     }>
//     workoutPrograms?: Record<
//       string,
//       {
//         description: string
//         schedule: string[]
//         workouts: Array<{
//           day: string
//           exercises: Array<{
//             name: string
//             sets: number
//             reps: string
//             rest: string
//             video?: string
//             modification?: string
//           }>
//         }>
//       }
//     >
//     exerciseLibrary?: Array<{
//       name: string
//       muscles: string[]
//       equipment: string
//       difficulty: string
//     }>
//     nutritionPlans?: Record<
//       string,
//       {
//         calories: string
//         macros: {
//           protein: string
//           carbs: string
//           fats: string
//         }
//         mealPlan: Array<{
//           meal: string
//           example: string
//         }>
//       }
//     >
//     progressTracking?: {
//       metrics: string[]
//       assessmentFrequency: string
//     }
//     aiPromptContext?: string
//   }
// }

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   console.log('--- API Handler Start ---')
//   console.log('Request Method:', req.method)
//   console.log('Request Headers:', JSON.stringify(req.headers, null, 2))

//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//   res.setHeader('Content-Type', 'application/json')

//   // Handle OPTIONS request
//   if (req.method === 'OPTIONS') {
//     console.log('Handling OPTIONS request')
//     return res.status(200).end()
//   }

//   // Verify environment variables
//   const requiredEnvVars = [
//     'VITE_OPENROUTER_API_URL',
//     'VITE_OPENROUTER_API_KEY',
//     'VITE_APP_REFERER_URL',
//     'VITE_APP_TITLE',
//   ]

//   const missingEnvVars = requiredEnvVars.filter(
//     (varName) => !process.env[varName]
//   )
//   if (missingEnvVars.length > 0) {
//     console.error('Missing environment variables:', missingEnvVars)
//     return res.status(500).json({
//       error: `Server configuration error: Missing required environment variables (${missingEnvVars.join(', ')})`,
//     })
//   }

//   // Only accept POST requests
//   if (req.method !== 'POST') {
//     console.warn(`Method Not Allowed: ${req.method}`)
//     return res.status(405).json({ error: 'Method Not Allowed' })
//   }

//   try {
//     // Parse and validate request body
//     if (!req.body) {
//       console.error('No request body provided')
//       return res.status(400).json({ error: 'Request body is required' })
//     }

//     const { userMessage, userProfileData, trainerMetaData } =
//       req.body as RequestBody

//     console.log(
//       'Received user message:',
//       userMessage?.substring(0, 100) + (userMessage?.length > 100 ? '...' : '')
//     )
//     console.log('User profile data:', JSON.stringify(userProfileData, null, 2))
//     console.log(
//       'Trainer metadata:',
//       JSON.stringify(
//         {
//           ...trainerMetaData,
//           clients: trainerMetaData.clients?.length || 0,
//           workoutPrograms: Object.keys(trainerMetaData.workoutPrograms || {})
//             .length,
//           exerciseLibrary: trainerMetaData.exerciseLibrary?.length || 0,
//           nutritionPlans: Object.keys(trainerMetaData.nutritionPlans || {})
//             .length,
//         },
//         null,
//         2
//       )
//     )

//     // Validate required fields
//     const validationErrors: string[] = []

//     if (!userMessage?.trim()) {
//       validationErrors.push('userMessage is required')
//     }

//     if (!userProfileData) {
//       validationErrors.push('userProfileData is required')
//     } else {
//       if (!userProfileData.name?.trim())
//         validationErrors.push('userProfileData.name is required')
//       if (
//         typeof userProfileData.age !== 'number' ||
//         userProfileData.age < 13 ||
//         userProfileData.age > 100
//       ) {
//         validationErrors.push(
//           'userProfileData.age must be a number between 13 and 100'
//         )
//       }
//       if (!userProfileData.gender?.trim())
//         validationErrors.push('userProfileData.gender is required')
//       if (!userProfileData.height?.trim())
//         validationErrors.push('userProfileData.height is required')
//       if (!userProfileData.weight?.trim())
//         validationErrors.push('userProfileData.weight is required')
//       if (!userProfileData.fitnessLevel?.trim())
//         validationErrors.push('userProfileData.fitnessLevel is required')
//       if (
//         !Array.isArray(userProfileData.goals) ||
//         userProfileData.goals.length === 0
//       ) {
//         validationErrors.push('userProfileData.goals must be a non-empty array')
//       }
//     }

//     if (!trainerMetaData) {
//       validationErrors.push('trainerMetaData is required')
//     } else {
//       if (!trainerMetaData.name?.trim())
//         validationErrors.push('trainerMetaData.name is required')
//       if (!trainerMetaData.specialization?.trim())
//         validationErrors.push('trainerMetaData.specialization is required')
//       if (
//         !Array.isArray(trainerMetaData.certifications) ||
//         trainerMetaData.certifications.length === 0
//       ) {
//         validationErrors.push(
//           'trainerMetaData.certifications must be a non-empty array'
//         )
//       }
//     }

//     if (validationErrors.length > 0) {
//       console.error('Validation errors:', validationErrors)
//       return res
//         .status(400)
//         .json({ error: 'Invalid request data', details: validationErrors })
//     }

//     // Construct detailed system prompt
//     const systemPromptContent = `
// # Trainer Identity
// You are ${trainerMetaData.name}, a ${trainerMetaData.specialization} trainer with the following certifications:
// ${trainerMetaData.certifications.map((c) => `- ${c}`).join('\n')}

// ${trainerMetaData.aiPromptContext || 'Always respond in a professional but friendly tone, using simple explanations for beginners and more technical details for advanced clients. Prioritize safety and proper form.'}

// # Client Profile
// You are assisting ${userProfileData.name}:
// - Age: ${userProfileData.age}
// - Gender: ${userProfileData.gender}
// - Height: ${userProfileData.height}cm
// - Weight: ${userProfileData.weight}kg
// - Fitness Level: ${userProfileData.fitnessLevel}
// - Goals: ${userProfileData.goals.join(', ')}

// # Available Programs
// ${
//   trainerMetaData.workoutPrograms
//     ? Object.entries(trainerMetaData.workoutPrograms)
//         .map(
//           ([name, program]) => `
//   ## ${name}
//   ${program.description}
//   Schedule: ${program.schedule.join(', ')}
//   Workouts:
//   ${
//     program.workouts
//       ?.map(
//         (workout) => `
//   ### ${workout.day}
//   ${workout.exercises?.map((ex) => `- ${ex.name}: ${ex.sets}x${ex.reps} (rest ${ex.rest})${ex.modification ? ` (${ex.modification})` : ''}`).join('\n') || 'No exercises defined'}
//   `
//       )
//       .join('\n') || 'No workouts defined'
//   }
//   `
//         )
//         .join('\n')
//     : 'No workout programs available'
// }

// # Exercise Library
// ${trainerMetaData.exerciseLibrary ? trainerMetaData.exerciseLibrary.map((ex) => `- ${ex.name}: Targets ${ex.muscles.join(', ')} (${ex.equipment}, ${ex.difficulty} level)`).join('\n') : 'No exercises in library'}

// # Nutrition Plans
// ${
//   trainerMetaData.nutritionPlans
//     ? Object.entries(trainerMetaData.nutritionPlans)
//         .map(
//           ([name, plan]) => `
// ## ${name}
// Calories: ${plan.calories}
// Macros:
// - Protein: ${plan.macros.protein}
// - Carbs: ${plan.macros.carbs}
// - Fats: ${plan.macros.fats}
// Sample Meals:
// ${plan.mealPlan.map((m) => `- ${m.meal}: ${m.example}`).join('\n')}
// `
//         )
//         .join('\n')
//     : 'No nutrition plans available'
// }

// # Response Guidelines
// 1. Always consider the client's profile when making recommendations
// 2. Provide clear, actionable advice
// 3. Reference specific exercises or programs when appropriate
// 4. Explain the reasoning behind your recommendations
// 5. Keep responses concise but thorough
// 6. Use markdown formatting for better readability
// `.trim()

//     console.log(
//       'System prompt content generated (first 500 chars):',
//       systemPromptContent.substring(0, 500) + '...'
//     )

//     // Call OpenRouter API
//     const apiUrl = process.env.VITE_OPENROUTER_API_URL!
//     const startTime = Date.now()

//     const openRouterResponse = await fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
//         'HTTP-Referer': process.env.VITE_APP_REFERER_URL!,
//         'X-Title': process.env.VITE_APP_TITLE!,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'deepseek/deepseek-r1-0528:free',
//         messages: [
//           { role: 'system', content: systemPromptContent },
//           { role: 'user', content: userMessage },
//         ],
//         temperature: 0.7,
//         max_tokens: 1000,
//       }),
//       signal: AbortSignal.timeout(30000), // 30 second timeout
//     })

//     const responseTime = Date.now() - startTime
//     console.log(`OpenRouter API response time: ${responseTime}ms`)

//     if (!openRouterResponse.ok) {
//       const errorData = (await openRouterResponse
//         .json()
//         .catch(() => ({}))) as OpenRouterAPIErrorResponse
//       console.error('OpenRouter API error:', {
//         status: openRouterResponse.status,
//         statusText: openRouterResponse.statusText,
//         error: errorData.error,
//       })
//       return res.status(openRouterResponse.status).json({
//         error:
//           errorData.error?.message ||
//           `API request failed with status ${openRouterResponse.status}`,
//         status: openRouterResponse.status,
//       })
//     }

//     const responseData = await openRouterResponse.json()
//     console.log('OpenRouter API response received:', {
//       model: responseData.model,
//       usage: responseData.usage,
//       responseLength: responseData.choices?.[0]?.message?.content?.length || 0,
//     })

//     if (!responseData.choices?.[0]?.message?.content) {
//       console.error('Invalid response structure from OpenRouter:', responseData)
//       return res
//         .status(500)
//         .json({ error: 'Invalid response structure from API' })
//     }

//     const responseContent = responseData.choices[0].message.content.trim()
//     console.log(
//       'Response content (first 200 chars):',
//       responseContent.substring(0, 200) + '...'
//     )

//     return res.status(200).json({
//       choices: [
//         {
//           message: {
//             role: 'assistant',
//             content: responseContent,
//           },
//         },
//       ],
//       usage: responseData.usage,
//       model: responseData.model,
//     })
//   } catch (error) {
//     console.error('Error in API handler:', error)

//     if (error instanceof Error) {
//       if (error.name === 'AbortError') {
//         return res.status(504).json({ error: 'Request timed out' })
//       }
//       return res.status(500).json({ error: error.message })
//     }

//     return res.status(500).json({ error: 'An unexpected error occurred' })
//   } finally {
//     console.log('--- API Handler End ---')
//   }
// }
