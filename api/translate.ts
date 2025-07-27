export default async function (req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
    })
  }

  try {
    // This should now work correctly with nodejs20.x runtime
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
    console.error('🔧🛠️Serverless function error:🔧🛠️', error)

    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return new Response(
      JSON.stringify({ error: 'Internal Server Error during translation' }),
      { status: 500 }
    )
  }
}
