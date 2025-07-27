import { FaDownload } from 'react-icons/fa'
import { FiCopy, FiCornerUpLeft } from 'react-icons/fi'
import './ResponsiveAction.css'
import { useResponseAction } from './useResponseActions'
import type { ResponseActionsProps } from './ResponseActionsProps'

const ResponseActions = ({
  response,
  setInput,
  onDownloadClick,
  children, // Add children to props
}: ResponseActionsProps) => {
  const { copyToClipboard, reuseAsInput, downloadAsPDF } = useResponseAction(
    response,
    setInput,
    onDownloadClick
  )
  const isDisabled = !response.trim()

  return (
    <div className='response-actions'>
      <button onClick={copyToClipboard} aria-label='Copy response'>
        <FiCopy className='icon' />
        <span>Copy</span>
      </button>
      <button
        onClick={reuseAsInput}
        aria-label='Use as new question'
        disabled={isDisabled}
      >
        <FiCornerUpLeft className='icon' />
        <span>Reuse</span>
      </button>
      <button
        onClick={downloadAsPDF}
        aria-label='Download response as PDF'
        disabled={isDisabled}
        className='download-pdf-button'
      >
        <FaDownload className='icon' />
        <span>PDF</span>
      </button>
      {/* Add children here */}
      {children && <div className='additional-actions'>{children}</div>}
    </div>
  )
}
export default ResponseActions
