// lib/currency.ts
// Sierra Leone currency system:
// - New Leone (SLE) is the current official currency
// - Old Leone (SLL) = SLE / 1000 (1 New Leone = 1000 Old Leones)
// - 1 USD = 23.50 SLE

export const USD_TO_SLE = 23.5
export const SLE_TO_SLL = 1000

export type CurrencyCode = 'SLE' | 'SLL' | 'USD'

/**
 * Convert a value in New Leones (SLE) to the target currency.
 */
export function convertFromSLE(value: number, to: CurrencyCode): number {
  switch (to) {
    case 'SLE':
      return value
    case 'SLL':
      return value * SLE_TO_SLL
    case 'USD':
      return value / USD_TO_SLE
  }
}

/**
 * Get the currency symbol/prefix for display.
 */
export function currencyPrefix(code: CurrencyCode): string {
  switch (code) {
    case 'SLE':
      return 'SLE '
    case 'SLL':
      return 'Le '
    case 'USD':
      return '$'
  }
}

/**
 * Format a value (already in the target currency) with proper number formatting.
 * No false "M" suffix - uses real magnitude formatting.
 */
export function formatAmount(value: number, currency: CurrencyCode): string {
  const prefix = currencyPrefix(currency)
  const abs = Math.abs(value)

  if (currency === 'USD') {
    if (abs >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${prefix}${(value / 1_000).toFixed(1)}K`
    return `${prefix}${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  if (currency === 'SLL') {
    // Old Leones - values are large (multiply SLE by 1000)
    if (abs >= 1_000_000_000) return `${prefix}${(value / 1_000_000_000).toFixed(1)}B`
    if (abs >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}K`
    return `${prefix}${value.toLocaleString()}`
  }

  // SLE (New Leones)
  if (abs >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${prefix}${(value / 1_000).toFixed(1)}K`
  return `${prefix}${value.toLocaleString()}`
}

/**
 * Format a value that's stored in SLE, converting and formatting for display.
 */
export function formatSLE(value: number, displayCurrency: CurrencyCode = 'SLE'): string {
  const converted = convertFromSLE(value, displayCurrency)
  return formatAmount(converted, displayCurrency)
}

/**
 * Get a secondary currency hint (e.g. "~$850 USD")
 */
export function usdHint(sleValue: number): string {
  const usd = sleValue / USD_TO_SLE
  if (usd >= 1_000_000) return `~$${(usd / 1_000_000).toFixed(1)}M USD`
  if (usd >= 1_000) return `~$${(usd / 1_000).toFixed(1)}K USD`
  return `~$${Math.round(usd).toLocaleString()} USD`
}
