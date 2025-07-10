'use client'

import { useState, useRef } from 'react'
import trainerData from '../data/trainer.json'
// import buildSystemPrompt from '../utils/buildSystemPrompt'
import type { UserProfile } from '../types/interfaces'
import { chatRequestSchema } from '../schemas/chatRequest'
import { logChatToFirestore } from '../services/ChatService'

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
      max_tokens: 500,
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

      const data = await res.json()
      await logChatToFirestore({
        userProfile,
        userMessage: sanitizedInput,
        aiResponse: data.choices[0]?.message?.content ?? 'No response',
      })
      console.log(
        'Received data from /api/chat:',
        JSON.stringify(data, null, 2)
      )

      if (!data.choices || !Array.isArray(data.choices)) {
        console.error('Unexpected response format:', data)
        throw new Error('Unexpected response format from /api/chat')
      }

      if (!Array.isArray(data.choices) || !data.choices[0]?.message?.content) {
        console.error('Invalid response format from API:', data)
        setResponse('No valid response') // fallback
      } else {
        const content = data.choices[0].message.content.trim()
        setResponse(content)
      }

      lastRequestTime.current = Date.now()
      setInput('')
    } catch (error: unknown) {
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
