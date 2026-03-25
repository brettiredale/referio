export interface Employer {
  id: string
  company_name: string
  logo_url: string | null
  magichire_client_id: string
  magichire_account_id: string | null
  api_key: string
  webhook_secret: string | null
  created_at: string
}

export interface Job {
  id: string
  employer_id: string
  magichire_job_id: string
  magichire_job_ad_id: string | null
  title: string
  url_slug: string
  company_name: string
  company_logo_url: string | null
  location: string | null
  description: string | null
  referral_fee: number
  fee_currency: string
  payout_trigger: 'at_hire' | 'on_start' | '3_months_after_start'
  status: 'active' | 'paused' | 'filled' | 'removed'
  created_at: string
  updated_at: string
}

export interface Referrer {
  id: string
  email: string
  full_name: string
  phone: string
  current_employer: string
  is_admin: boolean
  created_at: string
}

export interface Referral {
  id: string
  job_id: string
  referrer_id: string
  referee_name: string
  referee_email: string
  referee_phone: string | null
  relationship_duration: string
  relationship_context: string
  why_referring: string
  status: 'submitted' | 'reviewing' | 'interviewing' | 'hired' | 'rejected'
  magichire_candidate_id: string | null
  magichire_application_id: string | null
  magichire_task_id: string | null
  magichire_push_status: 'pending' | 'candidate_created' | 'application_submitted' | 'failed_candidate' | 'failed_application'
  magichire_push_error: string | null
  is_flagged: boolean
  created_at: string
}

export type PayoutTrigger = Job['payout_trigger']
export type JobStatus = Job['status']
export type ReferralStatus = Referral['status']
export type PushStatus = Referral['magichire_push_status']

export interface ApiSuccess<T> {
  success: true
  data: T
  error: null
}

export interface ApiError {
  success: false
  data: null
  error: {
    code: string
    message: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
