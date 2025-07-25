'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FaStop } from 'react-icons/fa'
import type { GoogleUser } from '../../contexts/AuthContext'
import type { UserProfile } from '../../types/user/user-profile'
import useChatHandler from '../../hooks/useChatHandler'
import useThinkingMessage from '../../hooks/useThinkingMessage'
import useVibrationScheduler from '../../hooks/useVibrationScheduler'
import { downloadHtmlAsPdf } from '../../utils/downloadPdf'
import TextAreaInput from '../ProfileForm/inputs/TextAreaInput/TextAreaInput'
import ResponseActions from './ResponsiveAction/ResponseActions'
import ThinkingMessage from '../ThinkingMessage/ThinkingMessage'
import { WelcomeMessage } from '../WelcomeMessage/WelcomeMessage'
import '../ProfileForm/inputs/TextAreaInput/TextArea.css'
import '../../styles/ErrorHandling/Error.css'
import useAutoResizeTextarea from '../../hooks/useAutoResizeTextarea '

const AI_RESPONSE_CONTENT_ID = 'ai-model-response-printable-content'

interface ChatInterfaceProps {
  userProfile: UserProfile
  googleUser?: GoogleUser
  setShowProfileForm: (show: boolean) => void
}

export const ChatInterface = ({
  userProfile,
  googleUser,
  setShowProfileForm,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('')

  const { response, isLoading, error, handleSubmit, stopRequest } =
    useChatHandler({
      userProfile,
      input,
      setInput,
    })

  const textareaRef = useAutoResizeTextarea(input)
  const thinkingMessage = useThinkingMessage(userProfile.name, isLoading)
  useVibrationScheduler([])

  const handleRetry = () => {
    if (input.trim()) {
      handleSubmit(new Event('retry') as unknown as React.FormEvent)
    }
  }

  const onDownloadClick = () => {
    if (response) {
      const filename = `AI_Chat_Report_${new Date().toISOString().slice(0, 10)}.pdf`
      downloadHtmlAsPdf(AI_RESPONSE_CONTENT_ID, filename)
    }
  }

  return (
    <>
      {userProfile.completed && (
        <WelcomeMessage
          name={userProfile.name}
          age={userProfile.age}
          gender={userProfile.gender}
          height={userProfile.height}
          weight={userProfile.weight}
          fitnessLevel={userProfile.fitnessLevel}
          goals={userProfile.goals}
          completed={userProfile.completed}
          googleUser={googleUser}
          onEditProfile={() => setShowProfileForm(true)}
        />
      )}
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
            </div>
          </div>
        </form>
        {isLoading && <ThinkingMessage message={thinkingMessage} />}
        {error && (
          <div className='error-message'>
            {error.message.includes('Empty response') ? (
              <div className='empty-response-error'>
                <p>We received an incomplete response from the AI.</p>
                <p>The response might be in the console (F12 Console).</p>
                <button
                  onClick={handleRetry}
                  className='retry-button'
                  disabled={!input.trim()}
                >
                  Retry Request
                </button>
              </div>
            ) : (
              <p className='error-para'>Error:{error.message} </p>
            )}
          </div>
        )}
        {response && (
          <section className='ai-response-section' aria-live='polite'>
            <div className='ai-response-container'>
              <div className='ai-avatar' aria-hidden='true'>
                <img
                  src={googleUser?.picture || '/default-avatar.png'}
                  alt='AI Trainer Avatar'
                  className='profile-img'
                  width={48}
                  height={48}
                  loading='lazy'
                />
              </div>
              <article className='response-content' id={AI_RESPONSE_CONTENT_ID}>
                <ReactMarkdown>{response}</ReactMarkdown>
              </article>
              <ResponseActions
                response={response}
                setInput={setInput}
                onDownloadClick={onDownloadClick}
              />
            </div>
          </section>
        )}
      </div>
    </>
  )
}
