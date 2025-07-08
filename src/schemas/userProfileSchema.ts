import { z } from 'zod'

export const userProfileSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
  gender: z.enum(['male', 'female', 'other']),
  height: z.string().min(1),
  weight: z.string().min(1),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  goals: z.array(z.string().min(1)),
  completed: z.boolean(),
  customAvatarUrl: z.string().url().optional(),
})
