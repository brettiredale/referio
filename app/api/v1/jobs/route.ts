import { validateEmployerApiKey } from '@/lib/api/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils/slug'
import type { ApiResponse } from '@/types'

const VALID_PAYOUT_TRIGGERS = ['at_hire', 'on_start', '3_months_after_start']

export async function POST(request: Request) {
  const employer = await validateEmployerApiKey(request)

  if (!employer) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Invalid API key' },
      } satisfies ApiResponse<never>,
      { status: 401 }
    )
  }

  const body = await request.json()
  const {
    magichire_job_id,
    magichire_job_ad_id,
    title,
    description,
    location,
    referral_fee,
    fee_currency,
    payout_trigger,
  } = body

  if (!magichire_job_id || !title || !description || !referral_fee || !fee_currency || !payout_trigger) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            'magichire_job_id, title, description, referral_fee, fee_currency, and payout_trigger are required',
        },
      } satisfies ApiResponse<never>,
      { status: 422 }
    )
  }

  if (referral_fee < 5000) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'FEE_TOO_LOW',
          message: 'Referral fee must be at least 5000',
        },
      } satisfies ApiResponse<never>,
      { status: 422 }
    )
  }

  if (!VALID_PAYOUT_TRIGGERS.includes(payout_trigger)) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'payout_trigger must be one of: at_hire, on_start, 3_months_after_start',
        },
      } satisfies ApiResponse<never>,
      { status: 422 }
    )
  }

  const url_slug = generateSlug(title, magichire_job_id)
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('jobs')
    .upsert(
      {
        employer_id: employer.id,
        magichire_job_id,
        magichire_job_ad_id: magichire_job_ad_id ?? null,
        title,
        url_slug,
        company_name: employer.company_name,
        company_logo_url: employer.logo_url,
        location: location ?? null,
        description,
        referral_fee,
        fee_currency,
        payout_trigger,
        status: 'active',
      },
      { onConflict: 'magichire_job_id' }
    )
    .select('id, magichire_job_id')
    .single()

  if (error) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'UPSERT_FAILED', message: error.message },
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }

  return Response.json({
    success: true,
    data: {
      job_id: data.id,
      magichire_job_id: data.magichire_job_id,
      referio_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${url_slug}`,
    },
    error: null,
  })
}
