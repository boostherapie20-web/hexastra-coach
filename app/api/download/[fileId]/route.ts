import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: fileRef } = await supabase
    .from('file_refs').select('*')
    .eq('id', params.fileId).eq('user_id', user.id).single()

  if (!fileRef) return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 })

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: signedUrl } = await serviceClient.storage
    .from(fileRef.bucket)
    .createSignedUrl(fileRef.storage_path, 60)

  if (!signedUrl) return NextResponse.json({ error: 'Impossible de générer le lien' }, { status: 500 })

  return NextResponse.redirect(signedUrl.signedUrl)
}
