import { z } from 'zod'
import { userProfileSchema } from './userProfileSchema'
import { trainerMetaDataSchema } from './trainerMetaDataSchema'

export const chatRequestSchema = z.object({
  model: z.string().min(1),
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
  userMessage: z.string(),
  userProfileData: userProfileSchema,
  trainerMetaData: trainerMetaDataSchema,
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().int().positive(),
})
export type ChatRequest = z.infer<typeof chatRequestSchema>
