import * as React from 'react'

export type EntityType = 'campaign' | 'coalition-pac' | 'jfc' | '501c'

export type EntityMarkTone = 'primary' | 'accent' | 'muted' | 'inherit'

export interface EntityMarkProps extends React.SVGAttributes<SVGSVGElement> {
  type: EntityType
  size?: number
  tone?: EntityMarkTone
  title?: string
}

const TONE_COLOR: Record<EntityMarkTone, string> = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  muted: 'var(--color-text-muted)',
  inherit: 'currentColor',
}

const TYPE_LABEL: Record<EntityType, string> = {
  campaign: 'Campaign',
  'coalition-pac': 'Coalition PAC',
  jfc: 'Joint Fundraising Committee',
  '501c': '501(c)',
}

/**
 * EntityMark — the brand-signature geometric mark for an entity type.
 *
 *   ●  Campaign            (filled circle)
 *   ◉  Coalition PAC       (concentric circles)
 *   ▲  JFC                 (filled triangle)
 *   ■  501(c)(3) / (c)(4)  (filled square)
 *
 * Rendered as an SVG (not a unicode glyph) so weight, alignment, and
 * optical size stay consistent across fonts and platforms.
 */
export function EntityMark({
  type,
  size = 16,
  tone = 'primary',
  title,
  className,
  style,
  ...rest
}: EntityMarkProps) {
  const a11yTitle = title ?? TYPE_LABEL[type]
  const color = TONE_COLOR[tone]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      role="img"
      aria-label={a11yTitle}
      className={['inline-block shrink-0 align-[-0.125em]', className]
        .filter(Boolean)
        .join(' ')}
      style={{ color, ...style }}
      {...rest}
    >
      <title>{a11yTitle}</title>
      {type === 'campaign' && (
        <circle cx="8" cy="8" r="5.5" fill="currentColor" />
      )}
      {type === 'coalition-pac' && (
        <>
          <circle
            cx="8"
            cy="8"
            r="6.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="8" cy="8" r="2.75" fill="currentColor" />
        </>
      )}
      {type === 'jfc' && (
        <polygon points="8,1.75 14.25,13 1.75,13" fill="currentColor" />
      )}
      {type === '501c' && (
        <rect x="2" y="2" width="12" height="12" fill="currentColor" />
      )}
    </svg>
  )
}

export default EntityMark
