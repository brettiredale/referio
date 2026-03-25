import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM = 'Referio <hello@referio.io>'
const ADMIN_EMAIL = 'brett@referio.io'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export async function sendReferralConfirmation({
  to,
  referrerName,
  refereeName,
  jobTitle,
  companyName,
  referralFee,
  feeCurrency
}: {
  to: string
  referrerName: string
  refereeName: string
  jobTitle: string
  companyName: string
  referralFee: number
  feeCurrency: string
}) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Your referral for ${refereeName} has been submitted`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #111;">Referral submitted</h2>
        <p>Hi ${referrerName},</p>
        <p>Your referral for <strong>${refereeName}</strong> has been submitted
           for the <strong>${jobTitle}</strong> role at <strong>${companyName}</strong>.</p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Referral fee</p>
          <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700; color: #111;">
            ${feeCurrency} ${referralFee.toLocaleString()}
          </p>
        </div>
        <p>We'll keep you updated on their progress.</p>
        <a href="${SITE_URL}/dashboard"
           style="display: inline-block; background: #2563eb; color: white;
                  padding: 12px 24px; border-radius: 6px; text-decoration: none;
                  font-weight: 600; margin-top: 8px;">
          View my referrals
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">Referio - referio.io</p>
      </div>
    `
  })
}

export async function sendAdminReferralAlert({
  refereeName,
  refereeEmail,
  jobTitle,
  companyName,
  referrerName,
  referrerEmail,
  pushStatus
}: {
  refereeName: string
  refereeEmail: string
  jobTitle: string
  companyName: string
  referrerName: string
  referrerEmail: string
  pushStatus: string
}) {
  await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[New Referral] ${refereeName} for ${jobTitle} at ${companyName}`,
    text: [
      `New referral submitted on Referio`,
      ``,
      `Referee: ${refereeName} (${refereeEmail})`,
      `Role: ${jobTitle} at ${companyName}`,
      `Referred by: ${referrerName} (${referrerEmail})`,
      `MagicHire push status: ${pushStatus}`,
      ``,
      `View in admin: ${SITE_URL}/admin`
    ].join('\n')
  })
}
