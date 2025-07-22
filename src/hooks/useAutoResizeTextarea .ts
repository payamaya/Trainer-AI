'use client'
import { useEffect, useRef } from 'react'

const useAutoResizeTextarea = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const resizeTextarea = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }

    resizeTextarea()

    // Optional: Add event listener for window resize
    window.addEventListener('resize', resizeTextarea)
    return () => window.removeEventListener('resize', resizeTextarea)
  }, [value])

  return textareaRef
}

export default useAutoResizeTextarea
