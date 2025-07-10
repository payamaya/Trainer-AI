'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FaDownload, FaStop } from 'react-icons/fa'
import { FiCopy, FiCornerUpLeft } from 'react-icons/fi'

import useChatHandler from '../../hooks/useChatHandler'
import ThinkingMessage from '../ThinkingMessage'
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage' // Import the new WelcomeMessage component
import type { AIChatProps, UserProfile } from '../../types/interfaces'
import useThinkingMessage from '../../hooks/useThinkingMessage'
import useVibrationScheduler from '../../hooks/useVibrationScheduler'
import { downloadHtmlAsPdf } from '../../utils/downloadPdf'

interface Props {
  userProfile: UserProfile
  googleUser?: AIChatProps['googleUser']
  setShowProfileForm: (show: boolean) => void
}

const AI_RESPONSE_CONTENT_ID = 'ai-model-response-printable-content' // Consistent ID

const ChatInterface = ({
  userProfile,
  googleUser,
  setShowProfileForm,
}: Props) => {
  const [input, setInput] = useState('')
  const { response, isLoading, error, handleSubmit, stopRequest } =
    useChatHandler({
      userProfile,
      input,
      setInput,
    })

  const thinkingMessage = useThinkingMessage(userProfile.name, isLoading)
  useVibrationScheduler([])

  const handlePdfDownload = () => {
    if (response) {
      const filename = `AI_Chat_Report_${new Date().toISOString().slice(0, 10)}.pdf`
      downloadHtmlAsPdf(AI_RESPONSE_CONTENT_ID, filename)
    }
  }
  // console.log('AI Response:', response)
  console.log('typeof response:', typeof response) // should be "string"

  return (
    <>
      {/* 1. Static User Profile Summary (always visible on initial load, or conditionally) */}
      {error && (
        <div className='error-message'>
          {error.message.includes('Empty response') ? (
            <div className='empty-response-error'>
              <p>We received an incomplete response from the AI.</p>
              <p>The response might be in the console (F12 Console).</p>
              <button
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      {userProfile.completed && ( // Render only if profile is completed
        <WelcomeMessage
          userProfile={userProfile}
          googleUser={googleUser}
          onEditProfile={setShowProfileForm}
        />
      )}
      {/* 2. Chat Input Form */}
      <form onSubmit={handleSubmit} className='ai-chat-form'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder='Ask about workouts, nutrition, or form...'
          aria-label='Ask the fitness coach a question'
        />
        {isLoading ? (
          <button
            type='button'
            onClick={stopRequest}
            className='stop-button'
            aria-label='Stop request'
          >
            <FaStop /> Stop
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
      {/* 3. Dynamic AI Response (only appears if there's an actual AI response) */}
      {isLoading ? (
        <ThinkingMessage message={thinkingMessage} />
      ) : (
        response && ( // Only render this block if there's an actual AI response
          <div className='ai-response-container'>
            <div className='ai-avatar' aria-hidden='true'>
              <img
                src={googleUser?.picture}
                alt='AI Trainer Avatar'
                className='profile-img'
              />
            </div>

            <div className='ai-response'>
              <div>
                Raw response: <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>

              <div className='response-content' id={AI_RESPONSE_CONTENT_ID}>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  {/* <div>{response || 'No response yet'}</div> */}
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </div>
              <div className='response-actions'>
                <button
                  onClick={() => navigator.clipboard.writeText(response)}
                  aria-label='Copy response'
                >
                  <FiCopy className='icon' />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => setInput(response)}
                  aria-label='Use as new question'
                  disabled={!response}
                >
                  <FiCornerUpLeft className='icon' />
                  <span>Reuse</span>
                </button>
                <button
                  onClick={handlePdfDownload}
                  aria-label='Download response as PDF'
                  disabled={!response}
                  className='download-pdf-button'
                >
                  <FaDownload className='icon' />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default ChatInterface
