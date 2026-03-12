import { redirect } from 'next/navigation'

/** /login redirige vers /auth — conservé pour compatibilité URLs externes */
export default function LoginPage() {
  redirect('/auth')
}
