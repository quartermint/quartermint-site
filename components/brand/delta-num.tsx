import * as React from 'react'

export interface DeltaNumProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number
  currency?: boolean
  showPercent?: boolean
  fractionDigits?: number
  locale?: string
  /** Force the upright/italic decision (otherwise derived from sign). */
  italic?: boolean
}

/**
 * DeltaNum — the italic-loss signature.
 *
 *   + $28,541.73   → Fraunces upright (positive)
 *   − $248,617.00  → Fraunces ITALIC  (negative — signature italic-loss move)
 *
 * Always renders with tabular-nums. Uses a true minus sign (U+2212).
 */
export function DeltaNum({
  value,
  currency = false,
  showPercent = false,
  fractionDigits,
  locale = 'en-US',
  italic,
  className,
  style,
  ...rest
}: DeltaNumProps) {
  const isNegative = value < 0
  const isItalic = italic ?? isNegative
  const abs = Math.abs(value)

  const formatter = React.useMemo(() => {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits ?? 2,
        maximumFractionDigits: fractionDigits ?? 2,
      })
    }
    if (showPercent) {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: fractionDigits ?? 2,
        maximumFractionDigits: fractionDigits ?? 2,
      })
    }
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits ?? 0,
      maximumFractionDigits: fractionDigits ?? 2,
    })
  }, [currency, showPercent, fractionDigits, locale])

  const formatted = formatter.format(
    showPercent && Math.abs(value) > 1 ? abs / 100 : abs,
  )

  const sign = isNegative ? '−' : '+'

  return (
    <span
      className={['tabular-nums', isItalic && 'italic', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        fontVariantNumeric: 'tabular-nums',
        ...(isItalic
          ? { fontFamily: 'var(--font-display), ui-serif, Georgia, serif' }
          : null),
        ...style,
      }}
      {...rest}
    >
      {sign} {formatted}
    </span>
  )
}

export default DeltaNum
