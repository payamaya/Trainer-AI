'use client'
import { useState, useRef, useCallback } from 'react'
import trainerData from '../data/trainer.json'
import { chatRequestSchema } from '../schemas/chatRequest'
import { logChatToFirestore } from '../services/ChatService'
import { isAIResponse, type AIResponse } from '../types/AIResponseInterface'
import type { UserProfile } from '../types/user/user-profile'

interface UseChatHandlerProps {
  userProfile: UserProfile
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}

interface ChatResponse {
  content: string
  reasoning: string
}

const useChatHandler = ({
  userProfile,
  input,
  setInput,
}: UseChatHandlerProps) => {
  const [response, setResponse] = useState('')
  const [reasoning, setReasoning] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const lastRequestTime = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const TIMEOUT_DURATION = 90000
  const MIN_REQUEST_INTERVAL = 2000

  const clearResources = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const stopRequest = useCallback(() => {
    const controller = abortControllerRef.current
    if (controller && !controller.signal.aborted) {
      controller.abort('Stopped by user')
      setIsLoading(false)
      setError(new Error('Request stopped by user'))
      clearResources()
    }
  }, [clearResources])

  const extractAIResponse = (data: AIResponse): ChatResponse => {
    const message = data.choices?.[0]?.message
    return {
      content: message?.content?.trim() || '',
      reasoning: message?.reasoning?.trim() || '',
    }
  }

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const prepareRequestData = useCallback(() => {
    const sanitizedInput = input.replace(/<[^>]*>?/gm, '')
    const model = import.meta.env.VITE_MODEL || 'deepseek/deepseek-r1-0528:free'

    return {
      model,
      userMessage: sanitizedInput,
      userProfileData: {
        ...userProfile,
        age: Number(userProfile.age),
        completed: Boolean(userProfile.completed),
      },
      trainerMetaData: trainerData.trainer,
      temperature: 0.7,
      max_tokens: 3000,
    }
  }, [input, userProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResponse('')
    setReasoning('')

    if (isLoading) return
    const now = Date.now()
    if (now - lastRequestTime.current < MIN_REQUEST_INTERVAL) {
      setError(
        new Error(
          `Please wait ${MIN_REQUEST_INTERVAL / 1000} seconds between requests`
        )
      )
      return
    }
    if (!input.trim() || !userProfile.completed) return

    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    clearResources()

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort('Request timed out')
        setError(new Error('Request timed out'))
        setIsLoading(false)
      }
    }, TIMEOUT_DURATION)

    try {
      const requestData = prepareRequestData()
      const validated = chatRequestSchema.safeParse(requestData)

      if (!validated.success) {
        const message =
          validated.error.errors?.map((e) => e.message).join('\n') ||
          'Invalid input'
        throw new Error(`Input validation failed:\n${message}`)
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || window.location.origin}/api/chat`
      console.log('Making request to:', apiUrl)

      const res = await fetch(apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })
      // Check if the request was aborted
      if (controller.signal.aborted) {
        throw new Error('Request was aborted')
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP Error: ${res.status}`)
      }

      const data: unknown = await res.json()
      console.log('API Response:', data)

      if (!isAIResponse(data)) {
        throw new Error('Invalid API response structure')
      }

      const { content, reasoning } = extractAIResponse(data)
      if (!content) {
        throw new Error('Empty response content')
      }

      setResponse(content)
      setReasoning(reasoning)
      lastRequestTime.current = Date.now()
      setInput('')

      try {
        await logChatToFirestore({
          userProfile,
          userMessage: requestData.userMessage,
          aiResponse: content,
        })
      } catch (firestoreError) {
        console.error('Failed to log chat:', firestoreError)
      }
    } catch (error: unknown) {
      if (!controller.signal.aborted) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        setError(new Error(errorMessage))
        console.error('API request failed:', error)
      }
    } finally {
      clearResources()
      setIsLoading(false)
    }
    lastRequestTime.current = now // Update this right after validation
  }

  // useEffect(() => {
  //   return () => {
  //     abortControllerRef.current?.abort()
  //   }
  // }, [])

  return {
    response,
    reasoning,
    isLoading,
    error,
    clearError,
    handleSubmit,
    stopRequest,
  }
}

export default useChatHandler
