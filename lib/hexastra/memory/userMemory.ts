import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserMemoryRecord } from '@/lib/hexastra/types'

export async function readUserMemory(supabase: SupabaseClient | null, userId?: string | null): Promise<UserMemoryRecord | null> {
  if (!supabase || !userId) return null
  try {
    const { data } = await supabase.from('user_memory').select('*').eq('user_id', userId).maybeSingle()
    return (data as UserMemoryRecord | null) ?? null
  } catch {
    return null
  }
}

export async function writeUserMemory(
  supabase: SupabaseClient | null,
  userId: string | null | undefined,
  patch: Partial<UserMemoryRecord>,
): Promise<void> {
  if (!supabase || !userId || !Object.keys(patch).length) return
  try {
    await supabase.from('user_memory').upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  } catch {
    // table may not exist yet
  }
}
