import type { UserProfile } from '../types/user/user-profile'

const buildSystemPrompt = (
  trainerPrompt: string,
  userProfile: UserProfile
): string => {
  return `${trainerPrompt}
User: ${userProfile.name} (${userProfile.age}y, ${userProfile.gender}, ${userProfile.height}cm, ${userProfile.weight}kg, ${userProfile.fitnessLevel})
Goals: ${userProfile.goals.join(', ')}`
}
export default buildSystemPrompt
