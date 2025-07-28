// TranslatingMessage.tsx
import React from 'react'
import './TranslatingMessage.css'

interface TranslatingMessageProps {
  message: string
}

const TranslatingMessage: React.FC<TranslatingMessageProps> = ({ message }) => {
  return (
    <div className='translating-container'>
      <div className='translating-bubble'>
        <span className='dot dot1'></span>
        <span className='dot dot2'></span>
        <span className='dot dot3'></span>
      </div>
      <p className='translating-text'>{message}</p>
    </div>
  )
}

export default TranslatingMessage
