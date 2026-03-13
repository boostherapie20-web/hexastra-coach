import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Si pas de code → retour page auth
  if (!code) {
    return NextResponse.redirect(new URL('/auth', origin))
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('auth/callback: variables Supabase manquantes')
    return NextResponse.redirect(new URL('/auth', origin))
  }

  // Build the success response upfront so cookies can be set directly on it.
  // Using cookieStore.set() + NextResponse.redirect() does NOT reliably
  // forward cookies in all Next.js versions — explicit response cookies do.
  const response = NextResponse.redirect(new URL('/chat', origin))

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('auth/callback exchangeCodeForSession:', error.message)
    return NextResponse.redirect(new URL('/auth?error=callback', origin))
  }

  return response
}
