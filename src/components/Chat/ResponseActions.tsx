import { FaDownload } from 'react-icons/fa'
import { FiCopy, FiCornerUpLeft } from 'react-icons/fi'
import './AIChat.css'

interface ResponseActionsProps {
  response: string
  setInput: (input: string) => void
  onDownloadClick: () => void
}

const ResponseActions = ({
  response,
  setInput,
  onDownloadClick,
}: ResponseActionsProps) => {
  return (
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
        onClick={onDownloadClick}
        aria-label='Download response as PDF'
        disabled={!response}
        className='download-pdf-button'
      >
        <FaDownload className='icon' />
        <span>PDF</span>
      </button>
    </div>
  )
}
export default ResponseActions
