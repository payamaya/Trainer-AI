'use client'

import { useState, useRef } from 'react'
import trainerData from '../data/trainer.json'
import buildSystemPrompt from '../utils/buildSystemPrompt'
import type { UserProfile } from '../types/interfaces'

interface UseChatHandlerProps {
  userProfile: UserProfile
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}

const useChatHandler = ({
  userProfile,
  input,
  setInput,
}: UseChatHandlerProps) => {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const lastRequestTime = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const stopRequest = () => {
    abortControllerRef.current?.abort()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return // prevent double submission
    if (Date.now() - lastRequestTime.current < 2000) return
    if (!input.trim() || !userProfile.completed) return

    setIsLoading(true)
    const controller = new AbortController()
    abortControllerRef.current = controller

    const TIMEOUT_DURATION = 90000 // 1 minute
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, TIMEOUT_DURATION)
    const systemPrompt = buildSystemPrompt(
      trainerData.trainer.trainerPromptSummary,
      userProfile
    )
    const sanitizedInput = input.replace(/<[^>]*>?/gm, '')
    const model = import.meta.env.VITE_MODEL || 'deepseek/deepseek-r1-0528:free'

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/chat`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: systemPrompt,
                // content: `${trainerData.trainer.trainerPromptSummary}
                // User: ${userProfile.name} (${userProfile.age}y, ${userProfile.fitnessLevel})
                // Goals: ${userProfile.goals.join(', ')}`,
              },
              { role: 'user', content: sanitizedInput },
            ],
            temperature: 0.7,
            max_tokens: 500, // <--- Add this line! Adjust the number based on your expected response length
          }),
        }
      )

      clearTimeout(timeoutId)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Error: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data.choices[0]?.message?.content || 'No response received.')
      lastRequestTime.current = Date.now()
      setInput('')
    } catch (error) {
      if (error instanceof Error) {
        if (controller.signal.aborted) {
          setResponse('Request was aborted (timeout or manual stop).')
        } else {
          setResponse('Something went wrong: ' + error.message)
        }

        console.error('Error in handleSubmit:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        })
      } else {
        setResponse('An unexpected error occurred.')
        console.error('Unknown error in handleSubmit:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { response, isLoading, handleSubmit, stopRequest, setResponse }
}

export default useChatHandler
