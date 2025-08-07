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
  getUserProfile,
  saveUserProfile,
} from '../../services/UserProfileService'
import { ChatError } from './ChatError'
import { ChatInput } from './ChatInput'
import { Avatar } from './Avatar'

const AI_RESPONSE_CONTENT_ID = 'ai-model-response-printable-content'

interface ChatInterfaceProps {
  initialUserProfile: UserProfile
  googleUser?: GoogleUser
  setShowProfileForm: (show: boolean) => void
}

export const ChatInterface = ({
  initialUserProfile,
  googleUser,
  setShowProfileForm,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('')
  const [displayResponse, setDisplayResponse] = useState('')

  const [userProfile, setUserProfile] =
    useState<UserProfile>(initialUserProfile)

  const [profileLoaded, setProfileLoaded] = useState(false)

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
  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getUserProfile()
      if (savedProfile) {
        setUserProfile(savedProfile)
        setShowProfileForm(false) // Hide form if profile exists
      }
      setProfileLoaded(true)
    }

    loadProfile()
  }, [])

  // Save profile when it changes
  useEffect(() => {
    if (profileLoaded && userProfile.completed) {
      saveUserProfile(userProfile).catch(console.error)
    }
  }, [userProfile, profileLoaded])

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
  }, [targetLanguage])

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

        {response && (
          <section className='ai-response-section' aria-live='polite'>
            <div className='ai-response-container'>
              <Avatar />
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
