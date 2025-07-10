'use client'

import { useState, useRef } from 'react'
import trainerData from '../data/trainer.json'
// import buildSystemPrompt from '../utils/buildSystemPrompt'
import type { UserProfile } from '../types/interfaces'
import { chatRequestSchema } from '../schemas/chatRequest'
import { logChatToFirestore } from '../services/ChatService'
import { isAIResponse, type AIResponse } from '../types/AIResponseInterface'

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
  const [error, setError] = useState<Error | null>(null)
  const lastRequestTime = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const stopRequest = () => {
    abortControllerRef.current?.abort()
  }
  const extractAIResponse = (data: AIResponse): string => {
    // First try to get content
    if (data.choices?.[0]?.message?.content?.trim()) {
      return data.choices[0].message.content.trim()
    }

    // Fallback to reasoning if content is empty
    if (data.choices?.[0]?.message?.reasoning?.trim()) {
      return data.choices[0].message.reasoning.trim()
    }

    return ''
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isLoading) return // prevent double submission
    if (Date.now() - lastRequestTime.current < 2000) return
    if (!input.trim() || !userProfile.completed) return

    setIsLoading(true)
    const controller = new AbortController()
    abortControllerRef.current = controller

    const TIMEOUT_DURATION = 90000
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, TIMEOUT_DURATION)

    const sanitizedInput = input.replace(/<[^>]*>?/gm, '')
    const model = import.meta.env.VITE_MODEL || 'deepseek/deepseek-r1-0528:free'
    const prepareUserProfileData = (userProfile: UserProfile) => ({
      ...userProfile,
      age: Number(userProfile.age),
      completed: Boolean(userProfile.completed),
    })

    // Before sending the request
    const body = {
      model,
      userMessage: sanitizedInput,
      userProfileData: prepareUserProfileData(userProfile),
      trainerMetaData: trainerData.trainer,
      temperature: 0.7,
      max_tokens: 1500,
    }

    const validated = chatRequestSchema.safeParse(body)
    if (!validated.success) {
      console.log('Zod validation result:', validated)

      const message =
        validated.error.errors?.map((e) => e.message).join('\n') ||
        'Invalid input'
      setResponse('⚠️ Input validation failed:\n' + message)
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/chat`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      clearTimeout(timeoutId)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Error: ${res.status}`)
      }

      const data: unknown = await res.json()
      if (!isAIResponse(data)) {
        throw new Error('Invalid API response structure')
      }
      const content = extractAIResponse(data)
      console.log('Full API response:', data)

      console.log('Extracted content:', content)

      if (!content || content.length < 10) {
        // Adjust threshold as needed
        throw new Error('Response content too short')
      }
      setResponse(content)

      try {
        await logChatToFirestore({
          userProfile,
          userMessage: sanitizedInput,
          aiResponse: content,
        })
      } catch (error) {
        console.error('Failed to log chat:', error)
        // Handle error (e.g., show message to user)
      }
      console.log(
        'Received data from /api/chat:',
        JSON.stringify(data, null, 2)
      )

      if (!data.choices || !Array.isArray(data.choices)) {
        console.error('Unexpected response format:', data)
        throw new Error('Unexpected response format from /api/chat')
      }

      lastRequestTime.current = Date.now()
      setInput('')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error)
        // Only set the response if you want to display errors in the chat area
        if (controller.signal.aborted) {
          setResponse('Request was aborted (timeout or manual stop).')
        } else {
          setResponse('Something went wrong: ' + error.message)
        }
      } else {
        const unknownError = new Error('An unexpected error occurred')
        setError(unknownError)
        setResponse(unknownError.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { response, isLoading, error, handleSubmit, stopRequest, setResponse }
}
export default useChatHandler
