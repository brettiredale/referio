import { createServiceClient } from '@/lib/supabase/server'
import { Employer } from '@/types'

export async function validateEmployerApiKey(
  request: Request
): Promise<Employer | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const apiKey = authHeader.slice(7)
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('employers')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  return data as Employer | null
}

export function validateMasterKey(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false

  const key = authHeader.slice(7)
  return key === process.env.REFERIO_MASTER_KEY
}
