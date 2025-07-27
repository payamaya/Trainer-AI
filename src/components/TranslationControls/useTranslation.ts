import { useState } from 'react'

interface TranslationResponse {
  translatedText: string
}

export const useTranslation = (initialLanguage = 'en') => {
  const [translatedResponse, setTranslatedResponse] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState(initialLanguage)
  const [translationCache, setTranslationCache] = useState<
    Record<string, string>
  >({})

  const handleTranslate = async (text: string) => {
    if (!text || isTranslating) return

    const cacheKey = `${text}-${targetLanguage}`
    if (translationCache[cacheKey]) {
      setTranslatedResponse(translationCache[cacheKey])
      return
    }

    setIsTranslating(true)
    try {
      const payload = { text, targetLang: targetLanguage }
      console.log('Sending translation payload from frontend:', payload)
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: targetLanguage }),
      })

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const data = (await res.json()) as TranslationResponse
      setTranslatedResponse(data.translatedText)
      setTranslationCache((prev) => ({
        ...prev,
        [cacheKey]: data.translatedText,
      }))
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message.includes('429')
            ? 'Translating too fast - please wait'
            : error.message
          : 'Translation service unavailable'
      setTranslatedResponse(errorMessage)
    } finally {
      setIsTranslating(false)
    }
  }

  return {
    translatedResponse,
    isTranslating,
    targetLanguage,
    setTargetLanguage,
    handleTranslate,
  }
}
