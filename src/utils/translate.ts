export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  // Option 1: Use a translation API (recommended)
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      targetLang,
    }),
  })

  if (!response.ok) {
    throw new Error('Translation failed')
  }

  const data = await response.json()
  return data.translatedText

  // Option 2: Client-side library (less reliable for large texts)
  // const { translate } = await import('@vitalets/google-translate-api');
  // const res = await translate(text, { to: targetLang });
  // return res.text;
}
