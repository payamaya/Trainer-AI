// useTranslatingMessage.ts
import { useEffect, useState } from 'react'

const useTranslatingMessage = (
  language: string,
  name: string,
  isTranslating: boolean
) => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isTranslating) {
      const firstName = name?.split(' ')[0] ?? 'there'
      setMessage(`Translating for you, ${firstName}, into ${language}...`)
    } else {
      setMessage('')
    }
  }, [language, name, isTranslating])

  return message
}

export default useTranslatingMessage
