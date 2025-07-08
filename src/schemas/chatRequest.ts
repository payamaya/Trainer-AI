import { z } from 'zod'
import { userProfileSchema } from './userProfileSchema'

export const chatRequestSchema = z.object({
  model: z.string().min(1),
  userMessage: z.string(),
  userProfileData: userProfileSchema,
  trainerMetaData: z.any(),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().int().positive(),
})
export type ChatRequest = z.infer<typeof chatRequestSchema>
