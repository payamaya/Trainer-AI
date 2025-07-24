// src/schemas/trainerMetaDataSchema.ts (new file)
import { z } from 'zod'

export const trainerMetaDataSchema = z.object({
  metadata: z.object({
    name: z.string(),
    specialization: z.string(),
    yearsOfExperience: z.number().int().positive(),
    trainingPhilosophy: z.string(),
    communicationStyle: z.string(),
  }),
  certifications: z.array(
    z.object({
      name: z.string(),
      year: z.number().int(),
      credentialId: z.string().optional(),
    })
  ),
  methodologies: z.object({
    strengthTraining: z.array(z.string()),
    conditioning: z.array(z.string()),
    recovery: z.array(z.string()),
  }),
  aiBehavior: z.object({
    rolePreamble: z.string().optional(),
    responseGuidelines: z.array(z.string()),
    personalityTraits: z.array(z.string()),
    formattingPreferences: z.object({
      useMarkdown: z.boolean(),
      structure: z.array(z.string()),
    }),
    interactionFlow: z
      .object({
        initialGreeting: z.string(),
        clarificationQuestions: z.array(z.string()),
      })
      .optional(),
  }),
  // ... and so on for exerciseDatabase, programTemplates, nutritionFramework
  // For brevity, I'm just showing the parts relevant to your buildSystemPrompt
})
