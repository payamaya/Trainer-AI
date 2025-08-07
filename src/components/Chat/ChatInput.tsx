import React from 'react'
import TextAreaInput from '../ProfileForm/inputs/TextAreaInput/TextAreaInput'
import { FaStop } from 'react-icons/fa'
import useAutoResizeTextarea from '../../hooks/useAutoResizeTextarea'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  handleSubmit: (e: React.FormEvent) => void
  stopRequest: () => void
  loadingText?: string
}

export const ChatInput = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  stopRequest,
}: ChatInputProps) => {
  const textareaRef = useAutoResizeTextarea(input)
  return (
    <div className='chat-interface-container'>
      <form onSubmit={handleSubmit} className='ai-chat-form'>
        <div className='chat-input-wrapper'>
          <TextAreaInput
            className='chat-textarea'
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder='Ask about workouts, nutrition, or form...'
            aria-label='Ask the fitness coach a question'
            name='chat-input'
            showClearButton={!isLoading}
            onClear={() => setInput('')}
          />
          <div className='chat-controls'>
            {isLoading ? (
              <button
                type='button'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Stop clicked, current loading state:', isLoading)
                  if (isLoading) {
                    stopRequest()
                  }
                }}
                className='stop-button'
                aria-label='Stop request'
                disabled={!isLoading}
              >
                <FaStop />
              </button>
            ) : (
              <button
                type='submit'
                className='submit-button'
                disabled={!input.trim() || isLoading}
                aria-label='Submit question'
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
