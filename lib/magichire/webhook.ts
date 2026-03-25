import { createHmac } from 'crypto'

export async function verifyMagicHireWebhook(
  request: Request,
  webhookSecret: string
): Promise<{ valid: boolean; body: string }> {
  const signature = request.headers.get('x-magichire-signature')
  const timestamp = request.headers.get('x-magichire-timestamp')
  const body = await request.text()

  if (!signature || !timestamp) return { valid: false, body }

  const expected = 'sha256=' + createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${body}`)
    .digest('hex')

  return { valid: signature === expected, body }
}
