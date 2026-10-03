import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight, Gamepad2, Search, Shield, Sparkles } from 'lucide-react'
import { Badge, Button, cn } from '@vault/ui'
import type { Presence, Game } from '@vault/core'
import { assetUrl } from '../assets'

export function Avatar({
  name,
  color = '#a56eff',
  initials,
  self,
  status,
  large,
}: {
  name: string
  color?: string
  initials?: string
  self?: boolean
  status?: Presence
  large?: boolean
}) {
  return (
    <span
      className={cn('avatar', large && 'avatar-large')}
      style={{ '--avatar-color': color } as CSSProperties}
    >
      {self ? (
        <img src={assetUrl('/media/avatar.webp')} alt="" />
      ) : (
        <span>{initials || name.slice(0, 2).toUpperCase()}</span>
      )}
      {status && <i className={`presence ${status}`} aria-label={status} />}
    </span>
  )
}
export function SearchBox({
  value,
  onChange,
  placeholder = 'Search',
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <label className={cn('search-box', className)}>
      <Search size={16} aria-hidden="true" />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" aria-label="Clear search" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </label>
  )
}
export function Empty({
  icon,
  title,
  children,
}: {
  icon?: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="empty-state">
      {icon || <Search size={30} />}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}
export function GameArt({ game, className }: { game: Game; className?: string }) {
  return (
    <div
      className={cn('game-art', `art-${game.art}`, className)}
      style={{ '--game-color': game.color } as CSSProperties}
    >
      {game.id === 'scp' ? (
        <img src={assetUrl('/media/scp-moment.webp')} alt="" />
      ) : (
        <div className="game-art-symbol">
          {game.id === 'elden'
            ? '◎'
            : game.id === 'hollow'
              ? '♧'
              : game.id === 'cyberpunk'
                ? '2077'
                : game.id === 'cs2'
                  ? 'Ⅱ'
                  : '☽'}
        </div>
      )}
      <div className="game-art-overlay" />
      <span className="game-art-title">{game.name}</span>
    </div>
  )
}
export function DemoNote() {
  return (
    <Badge className="demo-note">
      <span className="size-1.5 rounded-full bg-primary" /> DEMO WORKSPACE
    </Badge>
  )
}
export function DesktopPromo() {
  return (
    <div className="desktop-promo">
      <div className="promo-icon">
        <Gamepad2 size={21} />
      </div>
      <h3>Your games. One home.</h3>
      <p>Launch local games and keep your library close with Vault for desktop.</p>
      <Button asChild size="sm" variant="secondary">
        <a href="#/download">
          Get the desktop app <ArrowUpRight />
        </a>
      </Button>
      <span>
        <Shield size={11} /> Built with Tauri & Rust
      </span>
    </div>
  )
}
export function TinySparkle() {
  return <Sparkles size={15} className="text-purple-300" />
}
