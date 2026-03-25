export function formatFee(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(amount)

  return `${currency} ${formatted}`
}

export function formatPayoutTrigger(trigger: string): string {
  const map: Record<string, string> = {
    at_hire: 'Paid at hire',
    on_start: 'Paid on start date',
    '3_months_after_start': 'Paid 3 months after start'
  }
  return map[trigger] ?? trigger
}
