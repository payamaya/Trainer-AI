'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiCopy, FiCornerUpLeft } from 'react-icons/fi'
import trainerData from '../data/trainer.json'
import { FaStop } from 'react-icons/fa'
import '../styles/AIChat.css'
import '../styles/Vibration.css'
import '../styles/Avatar.css'
import {
  isVibrationSupported,
  vibrate,
  stopVibration,
} from '../helper/vibration'

interface UserProfile {
  name: string
  age: string
  gender: string
  height: string
  weight: string
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  completed: boolean
}
interface AIChatProps {
  googleUser?: {
    name: string
    email: string
    picture?: string
  }
}
const AIChat = ({ googleUser }: AIChatProps) => {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(false)
  const [scheduledVibrations, setScheduledVibrations] = useState<
    { time: number; pattern: number[] }[]
  >([])

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: googleUser?.name || '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner',
    goals: [],
    completed: false,
  })

  useEffect(() => {
    if (vibrationEnabled) {
      const futureTime = Date.now() + 10000
      setScheduledVibrations((prev) => [
        ...prev,
        { time: futureTime, pattern: [300, 100, 300] },
      ])
    }
  }, [vibrationEnabled])

  const lastRequestTime = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const apiUrl = import.meta.env.VITE_OPENROUTER_API_URL
  const apiKey = import.meta.env.VITE_PUBLIC_OPENROUTER_API_KEY

  useEffect(() => {
    if (!isVibrationSupported) {
      console.warn('Vibration is not supported on this browser.')
    }
  }, [])
  useEffect(() => {
    if (!vibrationEnabled) {
      stopVibration()
      setScheduledVibrations([])
    }
  }, [vibrationEnabled])

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGoalToggle = (goal: string) => {
    setUserProfile((prev) => {
      const newGoals = prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal]
      return { ...prev, goals: newGoals }
    })
  }

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setUserProfile((prev) => ({ ...prev, completed: true }))
    setShowProfileForm(false)
    setResponse(`Welcome ${userProfile.name} (${googleUser?.email})! Based on your profile:
    - Age: ${userProfile.age}
    - Height: ${userProfile.height}
    - Weight: ${userProfile.weight}
    - Fitness Level: ${userProfile.fitnessLevel}
    - Goals: ${userProfile.goals.join(', ')}

    I'll provide personalized fitness advice. What would you like to know first?`)
  }

  // Add this useEffect to handle scheduled vibrations
  useEffect(() => {
    const vibrationTimers: ReturnType<typeof setTimeout>[] = []

    scheduledVibrations.forEach(({ time, pattern }) => {
      const now = Date.now()
      if (time > now) {
        const timer = setTimeout(() => {
          vibrate(pattern)
        }, time - now)
        vibrationTimers.push(timer)
      }
    })

    return () => {
      vibrationTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [scheduledVibrations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Rate limiting
    if (Date.now() - lastRequestTime.current < 2000) {
      setResponse('Please wait a moment before sending another request')
      return
    }

    if (!input.trim()) {
      setResponse('Please enter a message')
      return
    }

    // Validate user profile is complete
    if (!userProfile.completed) {
      setResponse('Please complete your profile first')
      return
    }

    setIsLoading(true)
    abortControllerRef.current = new AbortController()

    try {
      const sanitizedInput = input.replace(/<[^>]*>?/gm, '')

      const response = await fetch(apiUrl + '/chat/completions', {
        method: 'POST',
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          userMessage: sanitizedInput,
          userProfileData: {
            ...userProfile,
            age: Number(userProfile.age), // Ensure age is number
          },
          trainerMetaData: trainerData.trainer,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Error: ${response.status}`)
      }

      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from server (OpenRouter data missing')
      }

      let responseText = data.choices[0].message.content.trim()
      responseText = responseText.replace(/^"+|"+$/g, '')

      // Handle vibration prompts
      if (responseText.includes('[VIBRATE:')) {
        if (vibrationEnabled && confirm('Enable vibration reminder?')) {
          const duration =
            responseText.match(/\[VIBRATE: (\d+)ms\]/)?.[1] || '500'
          vibrate(parseInt(duration))
        }
        responseText = responseText.replace(/\[VIBRATE: \d+ms\]/g, '')
      }

      setResponse(responseText)
      setInput('')
      lastRequestTime.current = Date.now()
    } catch (error) {
      console.error('API Error:', error)
      setResponse(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }
  const stopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  const thinkingMessages = useMemo(
    () =>
      userProfile.name
        ? [
            `Analyzing your form, ${userProfile.name.split(' ')[0]}...`,
            `Creating the perfect plan for you, ${userProfile.name.split(' ')[0]}...`,
            `Checking exercise science, ${userProfile.name.split(' ')[0]}...`,
            `One moment, ${userProfile.name.split(' ')[0]}...`,
          ]
        : [
            'Analyzing your request...',
            'Creating the perfect plan...',
            'Checking exercise science...',
            'One moment please...',
          ],
    [userProfile.name]
  )

  const [currentMessage, setCurrentMessage] = useState(thinkingMessages[0])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessage(
          thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]
        )
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isLoading, thinkingMessages])

  return (
    <div className='ai-chat-container'>
      {showProfileForm ? (
        <form onSubmit={submitProfile} className='profile-form'>
          <h2 className='form-header'>
            Complete Your Profile for Personalized AI Training
            <span className='form-subheader'>
              The more details you provide, the better your AI trainer can
              customize workouts, nutrition plans, and form corrections
              specifically for you.
            </span>
          </h2>

          <div className='form-group'>
            <label>Name</label>
            <input
              type='text'
              name='name'
              value={userProfile.name}
              onChange={handleProfileChange}
              required
              placeholder='Enter your name'
            />
          </div>

          <div className='form-group'>
            <label>Age</label>
            <input
              type='number'
              name='age'
              value={userProfile.age}
              onChange={handleProfileChange}
              required
              min='13'
              max='100'
              placeholder='Enter your age'
            />
          </div>

          <div className='form-group'>
            <label>Gender</label>
            <select
              name='gender'
              value={userProfile.gender}
              onChange={handleProfileChange}
              required
            >
              <option value=''>Select</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='non-binary'>Non-binary</option>
              <option value='prefer-not-to-say'>Prefer not to say</option>
            </select>
          </div>

          <div className='form-group'>
            <label>Height (cm)</label>
            <input
              type='number'
              name='height'
              value={userProfile.height}
              onChange={handleProfileChange}
              required
              min='100'
              max='250'
              placeholder='Enter your Height'
            />
          </div>

          <div className='form-group'>
            <label>Weight (kg)</label>
            <input
              type='number'
              name='weight'
              value={userProfile.weight}
              onChange={handleProfileChange}
              required
              min='30'
              max='200'
              placeholder='Enter your Weight'
            />
          </div>

          <div className='form-group'>
            <label>Fitness Level</label>
            <select
              name='fitnessLevel'
              value={userProfile.fitnessLevel}
              onChange={handleProfileChange}
              required
            >
              <option value='beginner'>Beginner</option>
              <option value='intermediate'>Intermediate</option>
              <option value='advanced'>Advanced</option>
            </select>
          </div>

          <div className='form-group'>
            <label className='select-label'>
              Goals (Select all that apply)
            </label>
            <div className='goals-container'>
              {[
                'Weight Loss',
                'Muscle Gain',
                'Endurance',
                'Flexibility',
                'General Fitness',
              ].map((goal) => (
                <label key={goal} className='goal-checkbox'>
                  <input
                    type='checkbox'
                    checked={userProfile.goals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                  />
                  {goal}
                </label>
              ))}
              <div className='form-group toggle-vibration'>
                <label>
                  <input
                    type='checkbox'
                    checked={vibrationEnabled}
                    onChange={(e) => setVibrationEnabled(e.target.checked)}
                  />
                  Enable Vibration Notifications
                </label>
              </div>
              <button type='submit' className='submit-profile'>
                Save Profile & Continue
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit} className='ai-chat-form'>
            <div className='input-wrapper'>
              <input
                className='ai-chat-input'
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask about workouts, nutrition, or form...'
                disabled={isLoading}
                aria-label='Ask the fitness coach a question'
              />
              {isLoading && (
                <button
                  type='button'
                  onClick={stopRequest}
                  className='stop-button'
                  aria-label='Stop request'
                >
                  <FaStop />
                </button>
              )}
              <button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='submit-button'
                aria-label='Submit question'
              >
                {isLoading ? (
                  <>
                    <span className='thinking-message'>{currentMessage}</span>
                    <div className='loading-dots'>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  </>
                ) : (
                  'Ask Coach'
                )}
              </button>
            </div>
            <div className='vibration-controls'>
              <label className='vibration-toggle'>
                <input
                  type='checkbox'
                  checked={vibrationEnabled}
                  onChange={(e) => setVibrationEnabled(e.target.checked)}
                />
                <span>Enable Vibration</span>
              </label>
              {vibrationEnabled && (
                <>
                  <button
                    onClick={() => vibrate([200, 100, 200])}
                    className='test-vibration'
                  >
                    Test Vibration
                  </button>
                  <button
                    onClick={() => stopVibration()}
                    className='test-vibration'
                  >
                    Stop Vibration
                  </button>
                </>
              )}
            </div>
          </form>

          {response && (
            <div className='ai-response-container'>
              <div className='ai-response'>
                {googleUser?.picture && (
                  <div className='ai-avatar' aria-hidden='true'>
                    <img
                      src={googleUser.picture}
                      alt='User profile'
                      className='profile-img'
                    />
                  </div>
                )}

                <div className='response-content'>
                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AIChat
