'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
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
    abortControllerRef.current = null
  }, [])

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
    if (Date.now() - lastRequestTime.current < MIN_REQUEST_INTERVAL) {
      setError(new Error('Please wait 2 seconds between requests'))
      return
    }
    if (!input.trim() || !userProfile.completed) return

    // Clear previous controller if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    const controller = new AbortController()
    abortControllerRef.current = controller
    console.log('New AbortController created', controller)
    setIsLoading(true)
    clearResources()

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
        throw new Error(
          `Input validation failed:\n${
            validated.error.errors?.map((e) => e.message).join('\n') ||
            'Invalid input'
          }`
        )
      }

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || window.location.origin}/api/chat`
      const res = await fetch(apiUrl, {
        method: 'POST',
        signal: abortControllerRef.current?.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })
      // Explicit check if aborted DURING fetch
      if (abortControllerRef.current?.signal.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      if (controller.signal.aborted) {
        throw new Error('Request was aborted')
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.error?.includes('Rate limit exceeded')
          ? `Server busy: ${errorData.error}. Please wait a moment.`
          : errorData.message || `HTTP Error: ${res.status}`
        throw new Error(errorMessage)
      }

      const data = await res.json()
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

      // Fire-and-forget logging
      logChatToFirestore({
        userProfile,
        userMessage: requestData.userMessage,
        aiResponse: content,
      }).catch(console.error)
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Request was successfully aborted')
          return // Don't show error for user aborts
        }

        if (!controller.signal.aborted) {
          let errorMessage = error.message

          // Handle OpenRouter rate limits specifically
          if (
            error.message.includes('Rate limit exceeded: free-models-per-day')
          ) {
            errorMessage = `
          You've used all free requests for today. 
          Options:
          1. Wait until tomorrow
          2. Add credits to OpenRouter account
          3. Try a different model
        `
          }

          setError(new Error(errorMessage))
          console.error('API request failed:', error)
        }
      } else {
        setError(new Error('An unexpected error occurred'))
        console.error('Unknown error:', error)
      }
    } finally {
      clearResources()
      setIsLoading(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      clearResources()
    }
  }, [clearResources])

  const stopRequest = useCallback(() => {
    console.log('Attempting to stop request...') // Debug log
    if (abortControllerRef.current) {
      console.log('AbortController exists, aborting...')
      try {
        abortControllerRef.current.abort('Request stopped by user')
        console.log(
          'Abort called, signal state:',
          abortControllerRef.current.signal.aborted
        )
      } catch (err) {
        console.error('Error while aborting:', err)
      }
      // Immediate state cleanup
      setIsLoading(false)
      setError(new Error('Request stopped by user'))
      setResponse('')
      setReasoning('')
      clearResources()
    } else {
      console.log('No AbortController found')
    }
  }, [clearResources])
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
