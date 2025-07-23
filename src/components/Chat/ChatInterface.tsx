// src/components/ChatInterface/ChatInterface.tsx
'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import ResponseActions from './ResponseActions'
import useChatHandler from '../../hooks/useChatHandler'
import useThinkingMessage from '../../hooks/useThinkingMessage'
import useVibrationScheduler from '../../hooks/useVibrationScheduler'
import ThinkingMessage from '../ThinkingMessage/ThinkingMessage'
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage'
import { downloadHtmlAsPdf } from '../../utils/downloadPdf'
import TextAreaInput from '../ProfileForm/inputs/TextAreaInput'

import { FaStop } from 'react-icons/fa'
import '../ProfileForm/inputs/TextArea.css'
import type { GoogleUser } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import useAutoResizeTextarea from '../../hooks/useAutoResizeTextarea '

interface ChatInterfaceProps {
  googleUser?: GoogleUser
  setShowProfileForm: (show: boolean) => void
}

const AI_RESPONSE_CONTENT_ID = 'ai-model-response-printable-content'

const ChatInterface = ({
  googleUser,
  setShowProfileForm,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('')
  const { profile } = useProfile()

  const { response, isLoading, error, handleSubmit, stopRequest } =
    useChatHandler({
      userProfile: profile,
      input,
      setInput,
    })

  const textareaRef = useAutoResizeTextarea(input)
  const thinkingMessage = useThinkingMessage(profile.name, isLoading)
  useVibrationScheduler([])

  const onDownloadClick = () => {
    if (response) {
      const filename = `AI_Chat_Report_${new Date().toISOString().slice(0, 10)}.pdf`
      downloadHtmlAsPdf(AI_RESPONSE_CONTENT_ID, filename)
    }
  }

  return (
    <>
      {error && (
        <div className='error-message'>
          {error.message.includes('Empty response') ? (
            <div className='empty-response-error'>
              <p>We received an incomplete response from the AI.</p>
              <p>The response might be in the console (F12 Console).</p>
              <button
                onClick={() => handleSubmit(new Event('retry') as any)}
                className='retry-button'
              >
                Retry Request
              </button>
            </div>
          ) : (
            <p>{error.message}</p>
          )}
        </div>
      )}

      {profile.completed && (
        <WelcomeMessage
          googleUser={googleUser}
          onEditProfile={setShowProfileForm}
        />
      )}

      <form onSubmit={handleSubmit} className='ai-chat-form'>
        <TextAreaInput
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder='Ask about workouts, nutrition, or form...'
          aria-label='Ask the fitness coach a question'
          className='chat-textarea'
          name='chat-input'
          showClearButton={!isLoading}
          onClear={() => setInput('')}
        />

        {isLoading ? (
          <button
            type='button'
            onClick={stopRequest}
            className='stop-button'
            aria-label='Stop request'
          >
            <FaStop />
          </button>
        ) : (
          <button
            type='submit'
            className='submit-button'
            disabled={!input.trim()}
            aria-label='Submit question'
          >
            Submit
          </button>
        )}
      </form>

      {isLoading && <ThinkingMessage message={thinkingMessage} />}

      {response && (
        <div className='ai-response-container'>
          <div className='ai-avatar' aria-hidden='true'>
            <img
              src={googleUser?.picture}
              alt='AI Trainer Avatar'
              className='profile-img'
            />
          </div>

          <div className='ai-response'>
            <div className='response-actions'>
              <ResponseActions
                response={response}
                setInput={setInput}
                onDownloadClick={onDownloadClick}
              />
            </div>
            <div className='response-content' id={AI_RESPONSE_CONTENT_ID}>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatInterface
