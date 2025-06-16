'use client'
import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiCopy, FiCornerUpLeft } from 'react-icons/fi'
import '../styles/AIChat.css'
import trainerData from '../../public/trainer.json'
import DarkMode from './DarkMode'

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

const AIChat = () => {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner',
    goals: [],
    completed: false,
  })
  const lastRequestTime = useRef(0)

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
    // Send welcome message with initial advice
    setResponse(`Welcome ${userProfile.name}! Based on your profile:
    - Age: ${userProfile.age}
    - Height: ${userProfile.height}
    - Weight: ${userProfile.weight}
    - Fitness Level: ${userProfile.fitnessLevel}
    - Goals: ${userProfile.goals.join(', ')}

    I'll provide personalized fitness advice. What would you like to know first?`)
  }

  const formatTrainerData = () => {
    const { workoutPrograms, exerciseLibrary, nutritionPlans } =
      trainerData.trainer
    return `
      Trainer: ${trainerData.trainer.name}
      Specialization: ${trainerData.trainer.specialization}
      
      Client Profile:
      - Name: ${userProfile.name}
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Height: ${userProfile.height}
      - Weight: ${userProfile.weight}
      - Fitness Level: ${userProfile.fitnessLevel}
      - Goals: ${userProfile.goals.join(', ')}
      
      Available Programs:
      ${Object.entries(workoutPrograms)
        .map(
          ([name, program]) =>
            `- ${name}: ${program.description} (${program.schedule.join(', ')})`
        )
        .join('\n')}
      
      Exercise Library:
      ${exerciseLibrary
        .map(
          (ex) =>
            `- ${ex.name}: Targets ${ex.muscles.join(', ')} (${ex.difficulty})`
        )
        .join('\n')}
      
      Nutrition Plans:
      ${Object.entries(nutritionPlans)
        .map(
          ([name, plan]) =>
            `- ${name}: ${plan.calories}, Protein: ${plan.macros.protein}`
        )
        .join('\n')}
    `
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    setIsLoading(true)
    const trainerContext = formatTrainerData()

    try {
      // Input sanitization
      const sanitizedInput = input.replace(/<[^>]*>?/gm, '')

      // Rate limiting (2 seconds between requests)
      if (Date.now() - lastRequestTime.current < 2000) {
        throw new Error('Please wait before sending another request')
      }

      // const controller = new AbortController()
      // const timeoutId = setTimeout(() => controller.abort(), 10000)

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        // signal: controller.signal,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_OPENROUTER_API_KEY}`,
          'HTTP-Referer': `https://trainer-ai-six.vercel.app/`,
          'X-Title': 'FITNESS_COACH_AI',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            {
              role: 'system',
              content: `You are ${trainerData.trainer.name}, ${trainerData.trainer.specialization} coach.
              Certifications: ${trainerData.trainer.certifications.join(', ')}
              Current date: ${new Date().toLocaleDateString()}
              
              ${trainerContext}
              
              AI Prompt Guidelines:
              - Provide personalized fitness advice based on client profile
              - Modify exercises based on client's fitness level
              - Give clear form instructions
              - Offer nutrition suggestions based on client's goals
              - Be encouraging and professional`,
            },
            {
              role: 'user',
              content: sanitizedInput,
            },
          ],
        }),
      })

      // clearTimeout(timeoutId)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response structure from API')
      }

      let responseText = data.choices[0].message.content.trim()
      responseText = responseText.replace(/^"+|"+$/g, '')

      setResponse(responseText)
      setInput('')
      lastRequestTime.current = Date.now()
    } catch (error) {
      let errorMessage = 'Error fetching response'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out'
        } else {
          errorMessage = error.message
        }
      }
      setResponse(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='ai-chat-container'>
      <DarkMode />
      {showProfileForm ? (
        <form onSubmit={submitProfile} className='profile-form'>
          <h2 className='form-header'>Tell us about yourself</h2>

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
              <option value='other'>Other</option>
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
              <button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='submit-button'
                aria-label='Submit question'
              >
                {isLoading ? (
                  <span className='loading-dots'>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                ) : (
                  'Ask Coach'
                )}
              </button>
            </div>
          </form>

          {response && (
            <div className='ai-response-container'>
              <div className='ai-response'>
                <div className='ai-avatar' aria-hidden='true'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
                      fill='#fff'
                    />
                    <path
                      d='M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z'
                      fill='#fff'
                    />
                  </svg>
                </div>
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
