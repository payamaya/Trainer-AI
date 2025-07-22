import React from 'react'
import './ThinkingMessage.css'

interface ThinkingMessageProps {
  message: string
}

const ThinkingMessage: React.FC<ThinkingMessageProps> = ({ message }) => {
  return (
    <div className='thinking-container'>
      <div className='thinking-bubble'>
        <span className='dot dot1'></span>
        <span className='dot dot2'></span>
        <span className='dot dot3'></span>
      </div>
      <p className='thinking-text'>{message}</p>
    </div>
  )
}

export default ThinkingMessage
