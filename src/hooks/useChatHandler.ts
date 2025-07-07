'use client'
import { useState, useRef } from 'react'
import trainerData from '../data/trainer.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useChatHandler = ({ userProfile, input, setInput }: any) => {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const lastRequestTime = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const stopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Date.now() - lastRequestTime.current < 2000) return
    if (!input.trim() || !userProfile.completed) return

    setIsLoading(true)
    const controller = new AbortController()
    abortControllerRef.current = controller
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 30000)
    const endpoint = import.meta.env.DEV
      ? 'https://your-vercel-app-name.vercel.app/api/chat' // during local dev
      : '/api/chat' // in production on Vercel

    const sanitizedInput = input.replace(/<[^>]*>?/gm, '')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        signal: abortControllerRef.current?.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
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
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Error: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data.choices[0].message.content)
      lastRequestTime.current = Date.now()
      setInput('')
    } catch (error) {
      setResponse('Something went wrong.' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return { response, isLoading, handleSubmit, stopRequest, setResponse }
}

export default useChatHandler
