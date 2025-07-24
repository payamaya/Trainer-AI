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

  exerciseDatabase: z.object({
    strength: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        mechanics: z.string(),
        primaryMuscles: z.array(z.string()),
        secondaryMuscles: z.array(z.string()),
        equipment: z.array(z.string()),
        difficulty: z.string(),
        formCues: z.array(z.string()),
        breathingCues: z.string(),
        commonMistakes: z.array(z.string()),
        progressions: z.array(z.string()),
        regressions: z.array(z.string()),
        typicalRepsSets: z.object({
          strength: z.string(),
          hypertrophy: z.string(),
        }),
        videoLink: z.string(),
      })
    ),
    conditioning: z.array(
      z.object({
        name: z.string(),
        intensityLevel: z.string(),
        targetMuscles: z.array(z.string()),
        modalities: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
          })
        ),
        workRestRatios: z.array(
          z.object({
            ratio: z.string(),
            goal: z.string(),
          })
        ),
        formCues: z.array(z.string()),
      })
    ),
  }),

  programTemplates: z.object({
    fatLoss: z.object({
      name: z.string(),
      description: z.string(),
      durationWeeks: z.number().int(),
      progressionModel: z.string(),
      macroAdjustmentGuidance: z.string(),
      sampleWeek: z.object({
        strengthDays: z.array(z.string()),
        conditioningDays: z.array(z.string()),
        activeRecovery: z.array(z.string()),
        completeRest: z.array(z.string()),
      }),
      keyPrinciples: z.array(z.string()),
    }),
  }),

  nutritionFramework: z.object({
    macronutrientGuidelines: z.object({
      fatLoss: z.object({
        protein: z.string(),
        carbs: z.string(),
        fats: z.string(),
      }),
    }),
    mealTimingStrategies: z.array(z.string()),
    supplementRecommendations: z.object({
      evidenceBased: z.array(z.string()),
      situational: z.array(z.string()),
    }),
  }),
})
