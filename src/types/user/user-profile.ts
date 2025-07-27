export interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: string
  weight: string
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  completed: boolean
  customAvatarUrl?: string
}
