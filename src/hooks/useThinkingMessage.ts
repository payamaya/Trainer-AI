'use client'
import { useEffect, useState, useMemo } from 'react'

const useThinkingMessage = (name: string, isLoading: boolean) => {
  const messages: string[] = useMemo(() => {
    return name
      ? [
          `Analyzing your form, ${name.split(' ')[0]}...`,
          `Creating a plan, ${name.split(' ')[0]}...`,
          `Hold on ${name.split(' ')[0]}, getting expert advice...`,
        ]
      : ['Analyzing...', 'Creating plan...', 'Please wait...']
  }, [name])

  const [message, setMessage] = useState(messages[0])
  useEffect(() => {
    // If messages change, reset the current message to the first one
    // This handles cases where the user name might change while loading
    setMessage(messages[0])
  }, [messages]) // Add messages here to reset the current message when the list changes

  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)])
    }, 3000)
    return () => clearInterval(interval)
  }, [name, isLoading, messages])

  return message
}

export default useThinkingMessage
