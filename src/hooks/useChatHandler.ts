'use client'

import { useState, useRef, useEffect } from 'react'
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const TIMEOUT_DURATION = 90000

  // ERROR stop Request is not working correctly
  const stopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('Stopped by user')
      setIsLoading(false)
      setResponse('Request was manually stopped')
    }
  }

  const extractAIResponse = (data: AIResponse): string => {
    return (
      data.choices?.[0]?.message?.content?.trim() ||
      data.choices?.[0]?.message?.reasoning?.trim() ||
      ''
    )
  }

  const clearResources = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const prepareRequestData = () => {
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
      max_tokens: 1500,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isLoading) return
    if (Date.now() - lastRequestTime.current < 2000) return
    if (!input.trim() || !userProfile.completed) return

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    clearResources()

    timeoutRef.current = setTimeout(() => {
      controller.abort('Request timed out')
      setError(new Error('Request timed out'))
      setIsLoading(false)
    }, TIMEOUT_DURATION)

    const requestData = prepareRequestData()
    const validated = chatRequestSchema.safeParse(requestData)

    if (!validated.success) {
      const message =
        validated.error.errors?.map((e) => e.message).join('\n') ||
        'Invalid input'
      setResponse('⚠️ Input validation failed:\n' + message)
      setIsLoading(false)
      return
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || window.location.origin}/api/chat`
      console.log('Making request to:', apiUrl) // Debug log

      const res = await fetch(apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })

      clearResources()

      if (!res.ok) {
        let errorData
        try {
          errorData = await res.json()
        } catch {
          errorData = { error: { message: await res.text() } }
        }
        throw new Error(errorData.error?.message || `HTTP Error: ${res.status}`)
      }

      const data: unknown = await res.json()
      console.log('API Response:', data) // Debug log

      if (!isAIResponse(data)) {
        throw new Error('Invalid API response structure')
      }

      const content = extractAIResponse(data)
      if (!content || content.length < 10) {
        throw new Error('Response content too short')
      }

      setResponse(content)
      lastRequestTime.current = Date.now()
      setInput('')

      try {
        await logChatToFirestore({
          userProfile,
          userMessage: requestData.userMessage,
          aiResponse: content,
        })
      } catch (error) {
        console.error('Failed to log chat:', error)
      }
    } catch (error: unknown) {
      clearResources()
      if (!controller.signal.aborted) {
        console.error('Fetch error:', error)
      }
      if (controller.signal.aborted) {
        const reason = controller.signal.reason || 'unknown reason'
        if (reason === 'Stopped by user') {
          setResponse('❌ Request was manually stopped.')
        } else if (reason === 'Request timed out') {
          setResponse('⚠️ Request timed out. Please try again.')
          setError(new Error(reason))
        } else {
          setResponse('⚠️ Request was aborted.')
          setError(new Error(reason))
        }
        return
      } else if (error instanceof Error) {
        setError(error)
        setResponse(`Error: ${error.message}`)
      } else {
        const unknownError = new Error('An unexpected error occurred')
        setError(unknownError)
        setResponse(unknownError.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      clearResources()
    }
  }, [])

  return { response, isLoading, error, handleSubmit, stopRequest, setResponse }
}

export default useChatHandler
