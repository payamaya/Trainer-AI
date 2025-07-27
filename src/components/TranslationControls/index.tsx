import { FaLanguage } from 'react-icons/fa'
import { useTranslation } from './useTranslation'
import './TranslationControls.css'

interface TranslationControlsProps {
  response: string
  onTranslate: (text: string) => void
}

export const TranslationControls = ({
  response,
  onTranslate,
}: TranslationControlsProps) => {
  const { isTranslating, targetLanguage, setTargetLanguage } = useTranslation()

  const handleLanguageChange = (lang: string) => {
    setTargetLanguage(lang)
    onTranslate(response)
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
        onChange={(e) => handleLanguageChange(e.target.value)}
        className='language-selector'
      >
        <option value='es'>Spanish</option>
        <option value='fr'>French</option>
        <option value='de'>German</option>
        <option value='it'>Italian</option>
        <option value='pt'>Portuguese</option>
      </select>
    </div>
  )
}
