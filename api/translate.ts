export default async function (req: Request) {
  // This is the standard Vercel serverless function signature
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
    })
  }

  try {
    const { text, targetLang } = await req.json()

    const libreTranslateRes = await fetch(
      'https://libretranslate.de/translate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang,
        }),
      }
    )

    if (!libreTranslateRes.ok) {
      // Handle non-200 responses from LibreTranslate
      const errorData = await libreTranslateRes.json()
      console.error('LibreTranslate API error:', errorData)
      return new Response(
        JSON.stringify({
          error: `Translation service error: ${libreTranslateRes.statusText}`,
        }),
        { status: libreTranslateRes.status }
      )
    }

    const data = await libreTranslateRes.json()
    return new Response(
      JSON.stringify({ translatedText: data.translatedText }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Serverless function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error during translation' }),
      { status: 500 }
    )
  }
}
