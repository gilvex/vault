import type { CSSProperties, ReactNode } from 'react'
import {
  CalendarDays,
  Gamepad2,
  Image,
  LayoutPanelLeft,
  Maximize2,
  Megaphone,
  MessageSquare,
  Server,
  Volume2,
  PanelsTopLeft,
  UserRound,
  Vote,
  Clock3,
  Newspaper,
  Award,
  BarChart3,
  Star,
} from 'lucide-react'
import { cn } from '@vault/ui'
import { assetUrl, polygonArt as art } from '../../assets'
import { useDemo } from '../../state'

export function PolygonMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M13 5H4l14 26L32 5h-9" stroke="currentColor" strokeWidth="4" />
      <path d="M13 5h5" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}
export function Picture({
  name,
  alt = '',
  className,
  width = 64,
  height = 64,
}: {
  name: string
  alt?: string
  className?: string
  width?: number
  height?: number
}) {
  return (
    <img
      src={art(name)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  )
}
export function PersonAvatar({
  self,
  name,
  status = 'online',
  image,
  size = 48,
}: {
  self?: boolean
  name?: string
  status?: string
  image?: string
  size?: number
}) {
  const { state } = useDemo()
  return (
    <span className="pg-avatar" style={{ '--size': `${size}px` } as CSSProperties}>
      {self || image ? (
        <img
          src={self ? assetUrl(state.polygon.avatar) : art(image!)}
          alt=""
          width={size}
          height={size}
        />
      ) : (
        <UserRound aria-hidden="true" size={Math.round(size * 0.55)} />
      )}
      {name && <span className="sr-only">{name}</span>}
      <i className={`pg-status ${status}`} />
    </span>
  )
}
const modules = [
  { id: 'news', label: 'News', icon: Megaphone },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'servers', label: 'Servers', icon: Server },
  { id: 'layout', label: 'Layout', icon: LayoutPanelLeft },
  { id: 'voice', label: 'Voice', icon: Volume2, disabled: true },
  { id: 'gallery', label: 'Gallery', icon: Image, disabled: true },
  { id: 'forums', label: 'Forums', icon: PanelsTopLeft, disabled: true },
  { id: 'poll', label: 'Poll', icon: Vote, disabled: true },
  { id: 'schedule', label: 'Schedule', icon: Clock3, disabled: true },
]
export function ModuleTabs({
  base,
  active,
  home = false,
}: {
  base: string
  active: string
  home?: boolean
}) {
  const tabs = home
    ? [
        { id: 'overview', label: 'What’s new', icon: LayoutPanelLeft },
        ...modules.filter((item) => item.id !== 'layout'),
      ]
    : modules
  return (
    <nav className="pg-module-tabs" aria-label="Community modules">
      {tabs.map(({ id, label, icon: Icon, ...item }) =>
        'disabled' in item && item.disabled ? (
          <button key={id} disabled title={`${label} is planned for a future version`}>
            <Icon size={23} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ) : (
          <a
            key={id}
            href={`${base}/${id}`}
            className={cn(active === id && 'active')}
            aria-current={active === id ? 'page' : undefined}
          >
            <Icon size={23} aria-hidden="true" />
            <span>
              {home && id === 'news'
                ? 'Top News'
                : home && id === 'events'
                  ? 'Hot Events'
                  : home && id === 'chat'
                    ? 'My chats'
                    : label}
            </span>
          </a>
        ),
      )}
    </nav>
  )
}
export function Panel({
  title,
  icon: Icon,
  children,
  className,
  expand,
  action,
}: {
  title: string
  icon: typeof Gamepad2
  children: ReactNode
  className?: string
  expand?: string
  action?: ReactNode
}) {
  return (
    <section className={cn('pg-panel', className)}>
      <header className="pg-panel-title">
        <h2>
          <Icon size={22} aria-hidden="true" />
          {title}
        </h2>
        {action}
        <span className="pg-panel-spacer" />
        {expand && (
          <a href={expand} aria-label={`Expand ${title}`}>
            <Maximize2 size={15} />
          </a>
        )}
      </header>
      {children}
    </section>
  )
}
export function LegacyLinks({ active }: { active?: string }) {
  return (
    <nav className="pg-legacy-links" aria-label="Your collection">
      {[
        { id: 'activity', label: 'Activity', icon: Newspaper },
        { id: 'cards', label: 'Cards', icon: Star },
        { id: 'awards', label: 'Awards', icon: Award },
        { id: 'statistics', label: 'Statistics', icon: BarChart3 },
      ].map(({ id, label, icon: Icon }) => (
        <a key={id} className={cn(active === id && 'active')} href={`#/profile/${id}`}>
          <Icon size={15} />
          {label}
        </a>
      ))}
    </nav>
  )
}
export function Tags({ values }: { values: string[] }) {
  return (
    <span className="pg-tags">
      {values.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </span>
  )
}
export function MockLabel() {
  return <span className="pg-mock-label">Demo · local only</span>
}
