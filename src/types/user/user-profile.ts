export type Gender = 'male' | 'female' | 'other'
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export interface UserProfile {
  name: string
  age: number
  gender: Gender
  height: string
  weight: string
  fitnessLevel: FitnessLevel
  goals: string[]
  completed: boolean
  customAvatarUrl?: string
}
