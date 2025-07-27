// Keep the getJsonBody helper (or ensure it's imported from a utils file)

import type { VercelRequest } from '@vercel/node'
// This is the helper that successfully parses req.body on Vercel
async function getJsonBody(req: VercelRequest): Promise<any> {
  // VercelRequest often provides req.body directly if content-type is json
  if (req.body !== undefined) {
    return req.body
  }
  //

  // Fallback for Node.js http.IncomingMessage (stream-based parsing)
  // This is the more robust approach for raw Node.js environments or if req.body isn't auto-parsed
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString() // Convert Buffer to string
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(new Error('Failed to parse JSON body from stream'))
      }
    })
    req.on('error', (err: Error) => {
      reject(err)
    })
  })
}
export default getJsonBody
