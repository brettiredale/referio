import { randomBytes } from 'crypto'
import { validateMasterKey } from '@/lib/api/auth'
import { createServiceClient } from '@/lib/supabase/server'
import type { ApiResponse } from '@/types'

export async function POST(request: Request) {
  if (!validateMasterKey(request)) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Invalid master key' },
      } satisfies ApiResponse<never>,
      { status: 401 }
    )
  }

  const body = await request.json()
  const { magichire_client_id, company_name, magichire_account_id, logo_url, webhook_secret } = body

  if (!magichire_client_id || !company_name) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'magichire_client_id and company_name are required',
        },
      } satisfies ApiResponse<never>,
      { status: 422 }
    )
  }

  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('employers')
    .select('id')
    .eq('magichire_client_id', magichire_client_id)
    .single()

  if (existing) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'EMPLOYER_ALREADY_EXISTS',
          message: 'An employer with this magichire_client_id already exists',
        },
      } satisfies ApiResponse<never>,
      { status: 409 }
    )
  }

  const api_key = 'ref_live_' + randomBytes(24).toString('hex')

  const { data, error } = await supabase
    .from('employers')
    .insert({
      magichire_client_id,
      company_name,
      magichire_account_id: magichire_account_id ?? null,
      logo_url: logo_url ?? null,
      webhook_secret: webhook_secret ?? null,
      api_key,
    })
    .select('id')
    .single()

  if (error) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'INSERT_FAILED', message: error.message },
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }

  return Response.json(
    {
      success: true,
      data: { employer_id: data.id, api_key },
      error: null,
    },
    { status: 201 }
  )
}
