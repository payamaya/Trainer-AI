'use client'
import { useEffect, useState, useMemo, useRef } from 'react'

const MESSAGE_INTERVAL_DURATION = 5000 // milliseconds
const useThinkingMessage = (name: string, isLoading: boolean) => {
  const firstName = name ? name.split(' ')[0] : 'there'
  const messages: string[] = useMemo(() => {
    return [
      `Analyzing your request, ${firstName}...`,
      `Crafting a personalized response, ${firstName}...`,
      `Just a moment, getting expert advice for you, ${firstName}...`,
      `Almost done, ${firstName}!`,
      `Processing your data, ${firstName}...`,
      // Add more messages here for variety
    ]
  }, [firstName]) // Re-calculate only if firstName changes

  // State to hold the current message being displayed
  const [currentMessage, setCurrentMessage] = useState<string>(messages[0])

  // Use a ref to keep track of the current message index for cycling
  const messageIndexRef = useRef(0)
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isLoading) {
      // Set the initial message when loading starts (or if messages array changes)
      // This handles cases where isLoading becomes true after initial render
      setCurrentMessage(messages[0])
      messageIndexRef.current = 0 // Reset index when loading starts

      // Start cycling messages
      intervalId = setInterval(() => {
        messageIndexRef.current =
          (messageIndexRef.current + 1) % messages.length
        setCurrentMessage(messages[messageIndexRef.current])
      }, MESSAGE_INTERVAL_DURATION)
    } else {
      // If not loading, clear any active interval
      clearInterval(intervalId!) // Use ! to assert it exists, as it's only set in the if block
      // Optionally reset message to a default/empty when loading stops
      setCurrentMessage('')
    }

    // Cleanup function: Clear the interval when the component unmounts or isLoading changes
    return () => clearInterval(intervalId)
  }, [isLoading, messages]) // Dependencies: only re-run if isLoading or messages array itself changes

  return currentMessage
}

export default useThinkingMessage
