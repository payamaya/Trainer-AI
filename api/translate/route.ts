// app/api/translate/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { text, targetLang } = await req.json()

  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLang,
      }),
    })

    const data = await res.json()
    return NextResponse.json({ translatedText: data.translatedText })
  } catch (error) {
    return NextResponse.json(
      { error: 'Free translation service unavailable' },
      { status: 500 }
    )
  }
}
