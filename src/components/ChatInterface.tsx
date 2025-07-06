'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { FaStop } from 'react-icons/fa'

import useChatHandler from '../hooks/useChatHandler'

import ThinkingMessage from './ThinkingMessage'
import type { AIChatProps, UserProfile } from '../types/interfaces'
import useThinkingMessage from '../hooks/useThinkingMessage'
import useVibrationScheduler from '../hooks/useVibrationScheduler'

interface Props {
  userProfile: UserProfile
  googleUser?: AIChatProps['googleUser']
}

const ChatInterface = ({ userProfile, googleUser }: Props) => {
  const [input, setInput] = useState('')
  const { response, isLoading, handleSubmit, stopRequest } = useChatHandler({
    userProfile,
    input,
    setInput,
  })
  console.log('googleUser :>> ', googleUser)
  const thinkingMessage = useThinkingMessage(userProfile.name, isLoading)
  useVibrationScheduler([]) // replace with your scheduled vibrations

  return (
    <>
      <form onSubmit={handleSubmit} className='ai-chat-form'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder='Ask about workouts, nutrition, or form...'
        />
        {isLoading ? (
          <button
            type='button' // Important: Use 'button' type to prevent form submission
            onClick={stopRequest}
            className='stop-button' // Add a class for styling
            aria-label='Stop request' // Added for accessibility
          >
            <FaStop /> Stop
          </button>
        ) : (
          <button
            type='submit'
            className='submit-button' // Add a class for styling
            disabled={!input.trim()} // Disable submit if input is empty
            aria-label='Submit question' // Added for accessibility
          >
            Submit
          </button>
        )}
      </form>
      {isLoading ? (
        <ThinkingMessage message={thinkingMessage} />
      ) : (
        <ReactMarkdown>{response}</ReactMarkdown>
      )}
    </>
  )
}

export default ChatInterface
