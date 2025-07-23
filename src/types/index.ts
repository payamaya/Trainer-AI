// src/types/index.ts
export interface TrainerMetadata {
  name: string
  specialization: string
  certifications: string[]
  trainingPhilosophy: string
  communicationStyle: string
  // Add other fields from your enhanced trainer.json
}

export interface UserProfile {
  name: string
  age: number
  gender: string
  height: string
  weight: string
  fitnessLevel: string
  goals: string[]
  injuries?: string[]
  userId?: string
  // Add other profile fields
}
