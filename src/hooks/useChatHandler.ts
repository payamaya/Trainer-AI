'use client'

import { useState, useRef } from 'react'
import trainerData from '../data/trainer.json'

interface UserProfile {
  name: string
  age: number
  fitnessLevel: string
  completed: boolean
  goals: string[]
}

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

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 30000)

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
                content: `As ${trainerData.trainer.name}, a ${trainerData.trainer.specialization} trainer, 
                provide ${userProfile.name} (${userProfile.age}y, ${userProfile.fitnessLevel}) 
                with expert advice on: ${userProfile.goals.join(', ')}. 
                Use markdown for clear formatting.`,
              },
              { role: 'user', content: sanitizedInput },
            ],
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (controller.signal.aborted) {
        setResponse('Request was aborted (timeout or manual stop).')
      } else {
        setResponse('Something went wrong: ' + error.message)
      }
      console.error('Error in handleSubmit:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { response, isLoading, handleSubmit, stopRequest, setResponse }
}

export default useChatHandler
