import type { IncomingMessage } from 'http' // Import Node.js IncomingMessage type for accurate typing

// Helper function to parse JSON body from either a Web API Request or Node.js IncomingMessage
async function getJsonBody(
  req: Request | (Request & IncomingMessage)
): Promise<any> {
  // Attempt to use the standard .json() method first (for Web API Request)
  if (typeof (req as Request).json === 'function') {
    try {
      return await (req as Request).json()
    } catch (error) {
      // If .json() exists but fails, re-throw
      throw new Error(`Failed to parse JSON using req.json(): ${error}`)
    }
  }

  // Fallback for Node.js http.IncomingMessage (stream-based parsing)
  // We explicitly cast `req` to `IncomingMessage` to satisfy TypeScript for `.on`
  return new Promise((resolve, reject) => {
    let body = ''
    ;(req as IncomingMessage).on('data', (chunk: Buffer) => {
      body += chunk.toString() // Convert Buffer to string
    })
    ;(req as IncomingMessage).on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(new Error('Failed to parse JSON body from stream'))
      }
    })
    ;(req as IncomingMessage).on('error', (err: Error) => {
      reject(err)
    })
  })
}

export default async function (req: Request) {
  // Keep req: Request for the function signature
  // We handle the potential IncomingMessage type inside getJsonBody
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
    })
  }

  try {
    // Use the robust helper function to get the body
    const { text, targetLang } = await getJsonBody(req)

    const libreTranslateRes = await fetch(
      'https://libretranslate.com/translate',
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
          error: `Translation service error: ${libreTranslateRes.statusText} - ${JSON.stringify(errorData)}`, // Include more error info
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

    let errorMessage = 'Internal Server Error during translation'
    if (error instanceof Error) {
      errorMessage = error.message
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }

    return new Response(
      JSON.stringify({ error: errorMessage }), // Send more specific error if available
      { status: 500 }
    )
  }
}
