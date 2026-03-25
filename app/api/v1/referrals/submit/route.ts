import { createClient, createServiceClient } from '@/lib/supabase/server'
import { pushReferralToMagicHire } from '@/lib/magichire/push'
import { sendReferralConfirmation, sendAdminReferralAlert } from '@/lib/email/resend'
import type { ApiResponse } from '@/types'

export async function POST(request: Request) {
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

  const body = await request.json()
  const {
    job_id,
    referee_name,
    referee_email,
    referee_phone,
    relationship_duration,
    relationship_context,
    why_referring,
  } = body

  if (!job_id || !referee_name || !referee_email || !relationship_duration || !relationship_context || !why_referring) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            'job_id, referee_name, referee_email, relationship_duration, relationship_context, and why_referring are required',
        },
      } satisfies ApiResponse<never>,
      { status: 422 }
    )
  }

  if (why_referring.length < 50) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please provide at least 50 characters explaining why you are referring this person',
        },
      } satisfies ApiResponse<never>,
      { status: 422 }
    )
  }

  const serviceClient = createServiceClient()

  // Fetch job
  const { data: job } = await serviceClient
    .from('jobs')
    .select('*')
    .eq('id', job_id)
    .single()

  if (!job || job.status !== 'active') {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'JOB_NOT_FOUND', message: 'Job not found or no longer active' },
      } satisfies ApiResponse<never>,
      { status: 404 }
    )
  }

  // Check for duplicate
  const { data: existing } = await serviceClient
    .from('referrals')
    .select('id')
    .eq('referrer_id', user.id)
    .eq('job_id', job_id)
    .eq('referee_email', referee_email)
    .single()

  if (existing) {
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: 'DUPLICATE_REFERRAL',
          message: 'You have already referred this person for this role',
        },
      } satisfies ApiResponse<never>,
      { status: 409 }
    )
  }

  // Insert referral
  const { data: referral, error } = await serviceClient
    .from('referrals')
    .insert({
      job_id,
      referrer_id: user.id,
      referee_name,
      referee_email,
      referee_phone: referee_phone ?? null,
      relationship_duration,
      relationship_context,
      why_referring,
    })
    .select('id')
    .single()

  if (error || !referral) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'INSERT_FAILED', message: error?.message ?? 'Failed to create referral' },
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }

  // Fetch referrer profile for emails
  const { data: referrer } = await serviceClient
    .from('referrers')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fire and forget: push to MagicHire
  pushReferralToMagicHire(referral.id).catch(console.error)

  // Fire and forget: send emails
  if (referrer) {
    sendReferralConfirmation({
      to: referrer.email,
      referrerName: referrer.full_name,
      refereeName: referee_name,
      jobTitle: job.title,
      companyName: job.company_name,
      referralFee: job.referral_fee,
      feeCurrency: job.fee_currency,
    }).catch(console.error)

    sendAdminReferralAlert({
      refereeName: referee_name,
      refereeEmail: referee_email,
      jobTitle: job.title,
      companyName: job.company_name,
      referrerName: referrer.full_name,
      referrerEmail: referrer.email,
      pushStatus: 'pending',
    }).catch(console.error)
  }

  return Response.json(
    {
      success: true,
      data: { referral_id: referral.id },
      error: null,
    },
    { status: 201 }
  )
}
