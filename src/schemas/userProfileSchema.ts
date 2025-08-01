// src/schemas/userProfileSchema.ts
import { z } from 'zod'

export const genderSchema = z.enum(['male', 'female', 'other'])
export const fitnessLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
])

export const userProfileSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
  gender: genderSchema,
  height: z.string().min(1),
  weight: z.string().min(1),
  fitnessLevel: fitnessLevelSchema,
  goals: z.array(z.string().min(1)),
  completed: z.boolean(),
  customAvatarUrl: z
    .string()
    .refine(
      (val) => val.startsWith('/') || z.string().url().safeParse(val).success,
      {
        message: "Must be a valid URL or local path starting with '/'",
      }
    )
    .optional(),
})

export type UserProfile = z.infer<typeof userProfileSchema>
