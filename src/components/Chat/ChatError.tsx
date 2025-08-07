import React from 'react'
import '../../styles/ErrorHandling/Error.css'
interface ChatErrorProps {
  error: Error
  input: string
  onRetry: (e: React.FormEvent) => void
  onClear: () => void
}

export const ChatError = ({
  error,
  input,
  onRetry,
  onClear,
}: ChatErrorProps) => {
  const handleRetry = () => {
    if (input.trim()) {
      onRetry(new Event('retry') as unknown as React.FormEvent)
    }
  }

  return (
    <div className='error-message'>
      {error.message.includes('Rate limit exceeded') ? (
        <div className='rate-limit-error'>
          <h3>Rate Limit Reached</h3>
          <p>You've exceeded the available requests for your current plan.</p>
          <div className='solutions'>
            <p>Possible solutions:</p>
            <ul>
              <li>Wait 24 hours for limits to reset</li>
              <li>Upgrade your OpenRouter plan</li>
              <li>Try again later</li>
            </ul>
          </div>
          <button onClick={onClear} className='dismiss-button'>
            Understood
          </button>
        </div>
      ) : error.message.includes('stopped by user') ? (
        <div className='user-aborted-message'>
          <p>Request stopped. You can modify your question and try again.</p>
          <button onClick={onClear} className='dismiss-button'>
            Dismiss
          </button>
        </div>
      ) : error.message.includes('Empty response') ? (
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
        <div className='generic-error'>
          <h3>Something went wrong</h3>
          <p className='error-para'>{error.message}</p>
          {input.trim() && (
            <button onClick={handleRetry} className='retry-button'>
              Try Again
            </button>
          )}
          <button onClick={onClear} className='dismiss-button'>
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
