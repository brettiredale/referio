import { verifyMagicHireWebhook } from '@/lib/magichire/webhook'
import { createServiceClient } from '@/lib/supabase/server'
import type { ApiResponse } from '@/types'

export async function POST(request: Request) {
  const webhookSecret = process.env.MAGICHIRE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'CONFIG_ERROR', message: 'Webhook secret not configured' },
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }

  const { valid, body } = await verifyMagicHireWebhook(request, webhookSecret)

  if (!valid) {
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed' },
      } satisfies ApiResponse<never>,
      { status: 401 }
    )
  }

  // Return 200 immediately, process async
  const response = Response.json({ success: true, data: null, error: null })

  // Fire and forget processing
  processWebhookEvent(body).catch((err) =>
    console.error('[Webhook] Processing failed:', err)
  )

  return response
}

async function processWebhookEvent(rawBody: string) {
  const event = JSON.parse(rawBody)
  const supabase = createServiceClient()
  const eventType: string = event.type
  const eventData = event.data

  if (eventType === 'job.updated' || eventType === 'job.created') {
    const { data: job } = await supabase
      .from('jobs')
      .select('id')
      .eq('magichire_job_id', eventData.id)
      .single()

    if (job) {
      const updates: Record<string, string> = {}
      if (eventData.title) updates.title = eventData.title
      if (eventData.description) updates.description = eventData.description
      if (eventData.location) updates.location = eventData.location
      if (eventData.status) updates.status = eventData.status

      if (Object.keys(updates).length > 0) {
        await supabase.from('jobs').update(updates).eq('id', job.id)
      }
    }
  } else if (eventType === 'job.closed') {
    await supabase
      .from('jobs')
      .update({ status: 'filled' })
      .eq('magichire_job_id', eventData.id)
  } else if (eventType === 'application.status_changed') {
    const statusMap: Record<string, string> = {
      longlisted: 'reviewing',
      shortlisted: 'reviewing',
      phone_screen: 'interviewing',
      interviewing: 'interviewing',
      hired: 'hired',
      rejected: 'rejected',
    }

    const mappedStatus = statusMap[eventData.status]
    if (mappedStatus) {
      await supabase
        .from('referrals')
        .update({ status: mappedStatus })
        .eq('magichire_application_id', eventData.id)
    }
  }
}
