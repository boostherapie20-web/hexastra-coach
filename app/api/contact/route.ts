import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY
  const toEmail   = process.env.CONTACT_EMAIL_TO
  const fromEmail = process.env.EMAIL_FROM ?? 'noreply@hexastra.coach'

  if (!resendKey || !toEmail) {
    return NextResponse.json({ error: 'Email non configuré' }, { status: 503 })
  }

  let body: { name?: string; email?: string; subject?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const { name, email, subject, message } = body

  if (!email || !message) {
    return NextResponse.json({ error: 'Email et message requis' }, { status: 422 })
  }

  const subjectLabel = subject
    ? `[${subject.toUpperCase()}] `
    : ''

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0d1f1c">Nouveau message — HexAstra Coach</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#555;width:120px"><strong>Nom</strong></td><td>${name ?? '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#555"><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td style="padding:8px 0;color:#555"><strong>Sujet</strong></td><td>${subject ?? '—'}</td></tr>
      </table>
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
      <div style="white-space:pre-wrap;color:#222">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `${subjectLabel}Message de ${name ?? email}`,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Échec envoi email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
