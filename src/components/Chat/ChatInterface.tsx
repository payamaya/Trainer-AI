'use client'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import type { UserProfile } from '../../types/user/user-profile'
import useChatHandler from '../../hooks/useChatHandler'
import useThinkingMessage from '../../hooks/useThinkingMessage'
import useVibrationScheduler from '../../hooks/useVibrationScheduler'
import { downloadHtmlAsPdf } from '../../utils/downloadPdf'

import ThinkingMessage from '../ThinkingMessage/ThinkingMessage'
import { WelcomeMessage } from '../WelcomeMessage/WelcomeMessage'
import '../../styles/Translate.css'
import '../../styles/Avatar.css'
import '../../styles/ErrorHandling/Error.css'
import '../ProfileForm/inputs/TextAreaInput/TextArea.css'

import type { GoogleUser } from '../../types/user/google-user'
import { ResponseActions } from './ResponsiveAction/ResponseActions'
import { useTranslation } from '../TranslationControls/useTranslation'
import useTranslatingMessage from '../TranslationControls/useTranslatingMessage'
import TranslatingMessage from '../TranslationControls/TranslatingMessage'
import {
  getLatestChatLog,
  saveUserProfile,
} from '../../services/UserProfileService'
import { ChatError } from './ChatError'
import { ChatInput } from './ChatInput'
import { Avatar } from './Avatar'

const AI_RESPONSE_CONTENT_ID = 'ai-model-response-printable-content'

interface ChatInterfaceProps {
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
  googleUser?: GoogleUser
  showProfileForm?: boolean
  setShowProfileForm: (show: boolean) => void
}

export const ChatInterface = ({
  userProfile,
  googleUser,
  setShowProfileForm,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('')
  const [displayResponse, setDisplayResponse] = useState('')
  const [latestAiResponse, setLatestAiResponse] = useState<string | null>(null)

  const { response, isLoading, error, clearError, handleSubmit, stopRequest } =
    useChatHandler({
      userProfile,
      input,
      setInput,
    })

  const {
    translatedResponse,
    isTranslating,
    targetLanguage,
    setTargetLanguage,
    handleTranslate,
  } = useTranslation()

  const translatingMessage = useTranslatingMessage(
    targetLanguage,
    userProfile.name,
    isTranslating
  )
  useEffect(() => {
    if (userProfile.completed) {
      saveUserProfile(userProfile).catch(console.error)
    }
  }, [userProfile])

  useEffect(() => {
    if (response && !isTranslating) {
      setDisplayResponse(response)
    }
  }, [response, isTranslating])

  useEffect(() => {
    if (translatedResponse) {
      setDisplayResponse(translatedResponse)
    }
  }, [translatedResponse])

  const thinkingMessage = useThinkingMessage(userProfile.name, isLoading)
  useVibrationScheduler([])

  const onDownloadClick = () => {
    if (displayResponse) {
      const filename = `AI_Chat_Report_${new Date().toISOString().slice(0, 10)}.pdf`
      downloadHtmlAsPdf(AI_RESPONSE_CONTENT_ID, filename)
    }
  }

  useEffect(() => {
    if (response && targetLanguage) {
      handleTranslate(response)
      console.log('response :>> ', response)
    }
  }, [response, targetLanguage, handleTranslate])

  useEffect(() => {
    const fetchLatestResponse = async () => {
      const chatLog = await getLatestChatLog()
      if (chatLog && chatLog.aiResponse) {
        setLatestAiResponse(chatLog.aiResponse)
      }
    }
    fetchLatestResponse()
  }, [userProfile.userId])

  useEffect(() => {
    if (userProfile.completed) {
      saveUserProfile(userProfile).catch(console.error)
    }
  }, [userProfile])
  useEffect(() => {
    // If there's a new response from the chat handler, display it.
    // Otherwise, default to the latest response fetched from Firestore.
    if (response) {
      setDisplayResponse(response)
    } else if (latestAiResponse) {
      setDisplayResponse(latestAiResponse)
    }
  }, [response, latestAiResponse])
  return (
    <>
      {userProfile.completed && (
        <WelcomeMessage
          {...userProfile}
          googleUser={googleUser}
          onEditProfile={() => setShowProfileForm(true)}
        />
      )}
      <div className='chat-interface-container'>
        <ChatInput
          input={input}
          setInput={setInput}
          stopRequest={stopRequest}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {isLoading && <ThinkingMessage message={thinkingMessage} />}
        {error && (
          <ChatError
            error={error}
            input={input}
            onRetry={handleSubmit}
            onClear={clearError}
          />
        )}

        {displayResponse && (
          <section className='ai-response-section' aria-live='polite'>
            <div className='ai-response-container'>
              <Avatar gender={userProfile.gender} size={80} />
              <article
                className={`response-content ${isTranslating ? 'translating' : ''}`}
                id={AI_RESPONSE_CONTENT_ID}
              >
                {isTranslating ? (
                  <TranslatingMessage message={translatingMessage} />
                ) : (
                  <ReactMarkdown>{displayResponse}</ReactMarkdown>
                )}
              </article>
              <ResponseActions
                response={response}
                setInput={setInput}
                onDownloadClick={onDownloadClick}
                onTranslate={() => handleTranslate(response)}
                isTranslating={isTranslating}
                targetLanguage={targetLanguage}
                setTargetLanguage={setTargetLanguage}
                translatedResponse={translatedResponse}
              />
            </div>
          </section>
        )}
      </div>
    </>
  )
}
