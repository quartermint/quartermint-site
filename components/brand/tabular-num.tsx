import * as React from 'react'

export interface TabularNumProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number
  currency?: boolean
  italic?: boolean
  fractionDigits?: number
  locale?: string
}

/**
 * TabularNum — render a number with `font-variant-numeric: tabular-nums`.
 * Optionally formats as currency. Optionally italicizes (e.g. negative deltas).
 */
export function TabularNum({
  value,
  currency = false,
  italic = false,
  fractionDigits,
  locale = 'en-US',
  className,
  style,
  ...rest
}: TabularNumProps) {
  const formatter = React.useMemo(() => {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits ?? 2,
        maximumFractionDigits: fractionDigits ?? 2,
      })
    }
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits ?? 0,
      maximumFractionDigits: fractionDigits ?? 2,
    })
  }, [currency, fractionDigits, locale])

  return (
    <span
      className={['tabular-nums', italic && 'italic', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        fontVariantNumeric: 'tabular-nums',
        ...(italic
          ? { fontFamily: 'var(--font-display), ui-serif, Georgia, serif' }
          : null),
        ...style,
      }}
      {...rest}
    >
      {formatter.format(value)}
    </span>
  )
}

export default TabularNum
