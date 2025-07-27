import { FaDownload } from 'react-icons/fa'
import { FiCopy, FiCornerUpLeft } from 'react-icons/fi'

import './ResponsiveAction.css'
import { useResponseAction } from './useResponseActions'
import type { ResponseActionsProps } from './ResponseActionsProps'
import { TranslationControls } from '../../TranslationControls'

export const ResponseActions = ({
  response,
  setInput,
  onDownloadClick,
  onTranslate, // This is now handleTranslate from ChatInterface
  isTranslating, // New prop
  targetLanguage, // New prop
  setTargetLanguage, // New prop
}: ResponseActionsProps) => {
  const { copyToClipboard, reuseAsInput, downloadAsPDF } = useResponseAction(
    response,
    setInput,
    onDownloadClick
  )

  return (
    <div className='response-actions'>
      <button onClick={copyToClipboard} aria-label='Copy response'>
        <FiCopy className='icon' />
        <span>Copy</span>
      </button>
      <button
        onClick={reuseAsInput}
        aria-label='Use as new question'
        disabled={!response.trim()}
      >
        <FiCornerUpLeft className='icon' />
        <span>Reuse</span>
      </button>
      <button
        onClick={downloadAsPDF}
        aria-label='Download response as PDF'
        disabled={!response.trim()}
        className='download-pdf-button'
      >
        <FaDownload className='icon' />
        <span>PDF</span>
      </button>
      {onTranslate && ( // Still conditional, but now onTranslate will always be defined
        <TranslationControls
          response={response} // Original response
          onTranslate={onTranslate} // From ChatInterface's handleTranslate
          isTranslating={isTranslating} // From ChatInterface's state
          targetLanguage={targetLanguage} // From ChatInterface's state
          setTargetLanguage={setTargetLanguage} // From ChatInterface's state
        />
      )}
    </div>
  )
}
