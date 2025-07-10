interface AIMessage {
  role: string
  content?: string
  reasoning?: string
  refusal?: string | null
}

interface AIChoice {
  message: AIMessage
  finish_reason: string
  index: number
  logprobs: null
  native_finish_reason: string
}

interface AIUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface AIResponse {
  id: string
  provider: string
  model: string
  object: string
  created: number
  choices: AIChoice[]
  usage: AIUsage
}
export function isAIResponse(data: unknown): data is AIResponse {
  return !!(
    data &&
    typeof data === 'object' &&
    'choices' in data &&
    Array.isArray(data.choices)
  )
}
