// src/utils/buildSystemPrompt.ts
import type { UserProfile } from '../types/user/user-profile' // Assuming this path

// Define a type for your trainer JSON structure
// You should ensure this type matches your actual trainer.json file.
// For example, if trainerMetaDataSchema is your Zod schema, you can infer the type:
import { trainerMetaDataSchema } from '../schemas/trainerMetaDataSchema' // Adjust path if needed
import type z from 'zod'
type TrainerData = z.infer<typeof trainerMetaDataSchema> // Import z from Zod if not already

const buildSystemPrompt = (
  trainerData: TrainerData, // This is the full trainer object from your JSON
  userProfile: UserProfile
): string => {
  const { metadata, aiBehavior } = trainerData // Destructure here

  // ... (rest of the prompt building logic using metadata and aiBehavior)

  const rolePreamble = aiBehavior.rolePreamble || ''
  const responseGuidelines = aiBehavior.responseGuidelines.join('; ')
  const personalityTraits = aiBehavior.personalityTraits.join(', ')
  const formattingPreferences = aiBehavior.formattingPreferences

  const metadataSummary = `Trainer Name: ${metadata.name}, Specialization: ${metadata.specialization}, Experience: ${metadata.yearsOfExperience} years, Philosophy: ${metadata.trainingPhilosophy}, Communication: ${metadata.communicationStyle}.`

  const formattingInstruction = formattingPreferences.useMarkdown
    ? `Use Markdown for formatting, with: ${formattingPreferences.structure.join(', ')}.`
    : 'Do not use Markdown.'

  const interactionFlowInstructions = aiBehavior.interactionFlow
    ? `Initial Greeting: "${aiBehavior.interactionFlow.initialGreeting}". Clarification Questions: ${aiBehavior.interactionFlow.clarificationQuestions.join('; ')}.`
    : ''

  return `${rolePreamble}
  ${metadataSummary}

  AI Response Guidelines: ${responseGuidelines}.
  Personality Traits: ${personalityTraits}.
  Formatting Preferences: ${formattingInstruction}
  ${interactionFlowInstructions}

  User Profile:
  Name: ${userProfile.name}
  Age: ${userProfile.age}
  Gender: ${userProfile.gender}
  Height: ${userProfile.height}cm
  Weight: ${userProfile.weight}kg
  Fitness Level: ${userProfile.fitnessLevel}
  Goals: ${userProfile.goals.join(', ')}

  Your task is to act as Andre Yashouh, the AI Trainer, adhering to all guidelines and leveraging your knowledge base to assist the user.
  `
}

export default buildSystemPrompt
