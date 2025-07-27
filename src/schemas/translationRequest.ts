// src/schemas/translationRequest.ts (create this new file)
import { z } from 'zod'

export const translationRequestSchema = z.object({
  text: z.string().min(1, 'Text to translate cannot be empty.'),
  targetLang: z.string().min(1, 'Target language cannot be empty.'),
})
