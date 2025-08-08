import { FaLanguage } from 'react-icons/fa'
import './TranslationControls.css'

interface TranslationControlsProps {
  response: string
  onTranslate: (text: string) => void
  isTranslating: boolean
  targetLanguage: string
  setTargetLanguage: (lang: string) => void
}

export const TranslationControls = ({
  response,
  onTranslate,
  isTranslating,
  targetLanguage,
  setTargetLanguage,
}: TranslationControlsProps) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setTargetLanguage(newLang) // Update the target language in ChatInterface's state
    // onTranslate(response) // Trigger translation of the original response with the new target language
  }

  return (
    <div className='translation-controls'>
      <button
        onClick={() => onTranslate(response)}
        disabled={isTranslating || !response}
        className='translate-button'
      >
        <FaLanguage />
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>
      <select
        value={targetLanguage}
        onChange={handleLanguageChange}
        className='language-selector'
      >
        <option value='sv'>Swedish</option>
        <option value='en'>English</option>
        <option value='es'>Spanish</option>
        <option value='fr'>French</option>
        <option value='ar-lb'>Arabic</option>
        <option value='de'>German</option>
        <option value='it'>Italian</option>
        <option value='pt'>Portuguese</option>
      </select>
    </div>
  )
}
