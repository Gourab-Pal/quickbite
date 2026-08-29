import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  PiArrowRight,
  PiForkKnife,
  PiMagnifyingGlass,
  PiStarFill,
} from 'react-icons/pi'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`qb-logo ${compact ? 'qb-logo--compact' : ''}`}>
      <img src="/assets/brand/quickbite-mark.svg" alt="" aria-hidden="true" />
      {!compact && <span>Quick<span>Bite</span></span>}
    </span>
  )
}

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="page-intro">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-intro__actions">{actions}</div>}
    </header>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <section className="empty-state">
      <span className="empty-state__icon"><PiForkKnife /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="search-field">
      <PiMagnifyingGlass aria-hidden="true" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  )
}

export function Rating({ value, count }: { value: number; count?: string | number }) {
  return (
    <span className="rating"><PiStarFill /> {value.toFixed(1)}{count !== undefined && <small> ({count})</small>}</span>
  )
}

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }) {
  return <span className={`status-badge status-badge--${tone}`}>{children}</span>
}

export function MetricCard({ label, value, change, icon }: { label: string; value: string; change?: string; icon?: ReactNode }) {
  return (
    <article className="metric-card">
      {icon && <span className="metric-card__icon">{icon}</span>}
      <div><span>{label}</span><strong>{value}</strong>{change && <small>{change}</small>}</div>
    </article>
  )
}

export function SectionHeading({ title, link, to = '#' }: { title: string; link?: string; to?: string }) {
  return (
    <div className="section-heading-row">
      <h2>{title}</h2>
      {link && <Link to={to}>{link} <PiArrowRight /></Link>}
    </div>
  )
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return <div className="skeleton" aria-label="Loading">{Array.from({ length: lines }, (_, index) => <i key={index} />)}</div>
}