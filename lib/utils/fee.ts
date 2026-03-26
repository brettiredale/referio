export function formatFee(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(amount)

  return `${currency} ${formatted}`
}

// Approximate conversion rates to USD (updated periodically)
const USD_RATES: Record<string, number> = {
  USD: 1,
  AUD: 0.63,
  GBP: 1.27,
  EUR: 1.08,
  CAD: 0.74,
  NZD: 0.57,
  SGD: 0.75,
  HKD: 0.13,
  CHF: 1.13,
  JPY: 0.0067,
}

export function toUsd(amount: number, currency: string): number {
  const rate = USD_RATES[currency.toUpperCase()] ?? 1
  return Math.round(amount * rate)
}

export function formatUsd(amount: number): string {
  return '$' + new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPayoutTrigger(trigger: string): string {
  const map: Record<string, string> = {
    at_hire: 'Paid at hire',
    on_start: 'Paid on start date',
    '3_months_after_start': 'Paid 3 months after start'
  }
  return map[trigger] ?? trigger
}
