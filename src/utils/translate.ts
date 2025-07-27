// // src/utils/translate.ts
// export async function translateText(
//   text: string,
//   targetLang: string
// ): Promise<string> {
//   const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY

//   if (!apiKey) {
//     throw new Error('Google Translate API key not configured')
//   }

//   const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         q: text,
//         target: targetLang,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`)
//     }

//     const data = await response.json()
//     return data.data.translations[0].translatedText
//   } catch (error) {
//     console.error('Translation error:', error)
//     throw new Error('Translation service unavailable')
//   }
// }
