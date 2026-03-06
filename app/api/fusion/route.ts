import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const API_URL = (process.env.HEXASTRA_API_URL || 'https://hexastra-api-production.up.railway.app').replace(/\/$/, '')
const API_KEY = process.env.HEXASTRA_API_KEY || ''

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    const response = await fetch(`${API_URL}/chart/fusion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Fusion API error:', err)
      return NextResponse.json({ error: 'Service temporairement indisponible' }, { status: 502 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error('Fusion proxy error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
