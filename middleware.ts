import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request })
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedPaths = ['/chat', '/library', '/reading']
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))

  // Redirect to login if accessing protected page without auth
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from login to app
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  // Homepage: show landing page (not redirect)
  // Logged-in users visiting "/" go straight to /chat
  if (request.nextUrl.pathname === '/' && user) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|logo).*)'],
}
