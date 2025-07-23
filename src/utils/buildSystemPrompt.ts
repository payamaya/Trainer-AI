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

// import type { TrainerMetadata, UserProfile } from '../types'

// interface PromptResult {
//   systemPrompt: string
//   contextTokens: number
// }

// export function buildSystemPrompt(
//   trainerData: TrainerMetadata,
//   userProfile: UserProfile
// ): PromptResult {
//   const contextTokens = JSON.stringify(trainerData).length / 4

//   const prompt = `You are ${trainerData.name}, ${trainerData.specialization} coach with:
// ${(trainerData.certifications ?? []).map((c) => `- ${c}`).join('\n')}

// Training Approach:
// ${trainerData.trainingPhilosophy}

// Current Client:
// - Name: ${userProfile.name}
// - Level: ${userProfile.fitnessLevel}
// - Goals: ${(userProfile.goals ?? []).join(', ')}
// - Restrictions: ${(userProfile.injuries ?? []).join(', ') || 'None'}

// Response Guidelines:
// 1. Use ${trainerData.communicationStyle} style
// 2. Provide form cues for exercises
// 3. Suggest modifications when appropriate
// 4. Structure responses with markdown
// 5. Always prioritize safety

// Example Response Format:
// # Exercise Instruction
// - **Primary Muscles**: [muscles]
// - **Form Cues**:
//   - [cue1]
//   - [cue2]
// - **Common Mistakes**:
//   - [mistake1]
//   - [mistake2]`

//   return {
//     systemPrompt: prompt,
//     contextTokens,
//   }
// }
