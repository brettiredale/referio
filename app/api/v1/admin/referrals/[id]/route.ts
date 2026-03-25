import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { ApiResponse, ReferralStatus } from '@/types'

const VALID_STATUSES: ReferralStatus[] = [
  'submitted',
  'reviewing',
  'interviewing',
  'hired',
  'rejected',
]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      } satisfies ApiResponse<never>,
      { status: 401 }
    )
  }

  const serviceClient = createServiceClient()

  const { data: referrer } = await serviceClient
    .from('referrers')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!referrer?.is_admin) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      } satisfies ApiResponse<never>,
      { status: 403 }
    )
  }

  const body = await request.json()
  const updates: Record<string, unknown> = {}

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: `status must be one of: ${VALID_STATUSES.join(', ')}`,
          },
        } satisfies ApiResponse<never>,
        { status: 422 }
      )
    }
    updates.status = body.status
  }

  if (typeof body.is_flagged === 'boolean') {
    updates.is_flagged = body.is_flagged
  }

  if (Object.keys(updates).length === 0) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'VALIDATION_ERROR', message: 'No valid fields to update' },
      } satisfies ApiResponse<never>,
      { status: 422 }
    )
  }

  const { data, error } = await serviceClient
    .from('referrals')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'UPDATE_FAILED', message: error?.message ?? 'Referral not found' },
      } satisfies ApiResponse<never>,
      { status: 404 }
    )
  }

  return Response.json({ success: true, data, error: null })
}
