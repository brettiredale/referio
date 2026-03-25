import { createServiceClient } from '@/lib/supabase/server'

const MAGICHIRE_API_URL = process.env.MAGICHIRE_API_URL!
const MAGICHIRE_API_KEY = process.env.MAGICHIRE_API_KEY!

export async function pushReferralToMagicHire(referralId: string): Promise<void> {
  const supabase = createServiceClient()

  const { data: referral } = await supabase
    .from('referrals')
    .select('*, jobs(*), referrers(*)')
    .eq('id', referralId)
    .single()

  if (!referral) {
    console.error(`[MagicHire Push] Referral not found: ${referralId}`)
    return
  }

  const job = referral.jobs
  const referrer = referral.referrers

  // Step 1: Create candidate
  try {
    const candidateRes = await fetch(`${MAGICHIRE_API_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAGICHIRE_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `referio-cand-${referralId}`
      },
      body: JSON.stringify({
        name: referral.referee_name,
        email: referral.referee_email,
        phone: referral.referee_phone ?? undefined
      })
    })

    const candidateData = await candidateRes.json()

    if (!candidateRes.ok || !candidateData.success) {
      throw new Error(candidateData.error?.message ?? 'Candidate creation failed')
    }

    await supabase
      .from('referrals')
      .update({
        magichire_candidate_id: candidateData.data.id,
        magichire_push_status: 'candidate_created'
      })
      .eq('id', referralId)

    // Step 2: Submit application
    const coverNote = [
      `Referred by ${referrer.full_name} (${referrer.email}).`,
      `Known for: ${referral.relationship_duration}.`,
      `Context: ${referral.relationship_context}.`,
      `Why this role: ${referral.why_referring}`
    ].join(' ')

    const appRes = await fetch(`${MAGICHIRE_API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAGICHIRE_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `referio-app-${referralId}`
      },
      body: JSON.stringify({
        job_id: job.magichire_job_id,
        candidate_id: candidateData.data.id,
        source: 'referio',
        cover_note: coverNote
      })
    })

    const appData = await appRes.json()

    if (!appRes.ok || !appData.success) {
      throw new Error(appData.error?.message ?? 'Application submission failed')
    }

    await supabase
      .from('referrals')
      .update({
        magichire_application_id: appData.data.resource_id,
        magichire_task_id: appData.data.task_id,
        magichire_push_status: 'application_submitted'
      })
      .eq('id', referralId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    const currentReferral = await supabase
      .from('referrals')
      .select('magichire_push_status')
      .eq('id', referralId)
      .single()

    const failedStatus = currentReferral.data?.magichire_push_status === 'candidate_created'
      ? 'failed_application'
      : 'failed_candidate'

    await supabase
      .from('referrals')
      .update({
        magichire_push_status: failedStatus,
        magichire_push_error: message
      })
      .eq('id', referralId)

    console.error(`[MagicHire Push] Failed for referral ${referralId}:`, message)
  }
}
