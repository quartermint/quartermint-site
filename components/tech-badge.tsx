interface TechBadgeProps {
  badge: string
}

export function TechBadge({ badge }: TechBadgeProps) {
  return (
    <span className="font-body text-[14px] font-semibold text-text-faint uppercase tracking-[1px]">
      {badge}
    </span>
  )
}
