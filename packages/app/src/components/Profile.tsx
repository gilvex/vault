import { useState, type CSSProperties } from 'react'
import {
  Award,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Crown,
  Flame,
  Gamepad2,
  Medal,
  Pencil,
  Search,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { Badge, Button, Modal, cn } from '@vault/ui'
import { cards, events, games, toggleItem, type Collectible } from '@vault/core'
import { toast } from 'sonner'
import { useDemo, useReducedMotion } from '../state'
import { assetUrl } from '../assets'
import { Avatar, Empty, SearchBox } from './common'
import { Feed } from './Feed'

const profileTabs = [
  { name: 'Activity', icon: Sparkles },
  { name: 'Events', icon: CalendarDays },
  { name: 'Cards', icon: Star },
  { name: 'Awards', icon: Trophy },
  { name: 'Statistics', icon: ChartIcon },
]
function ChartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M5 20V12M12 20V4M19 20V8" strokeLinecap="round" />
    </svg>
  )
}
export function Profile({ tab }: { tab: string }) {
  const { state, setState } = useDemo()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(state.profile.name)
  const [bio, setBio] = useState(state.profile.bio)
  return (
    <>
      <section className="profile-hero">
        <div className="profile-banner">
          <div className="banner-shade" />
          <span className="banner-caption">YOUR WORLD. YOUR VAULT.</span>
          <Badge className="banner-level">
            <Crown size={12} />
            LEVEL 24
          </Badge>
        </div>
        <div className="profile-info">
          <Avatar name={state.profile.name} self large status={state.profile.status} />
          <div className="profile-name">
            <div>
              <h1>{state.profile.name}</h1>
              <Badge className="founder-badge">
                <Shield size={11} />
                EARLY EXPLORER
              </Badge>
            </div>
            <p>{state.profile.bio}</p>
            <div className="profile-meta">
              <span>
                <span className="online-pulse" />
                {
                  {
                    online: 'Online',
                    playing: 'In game',
                    dnd: 'Do not disturb',
                    offline: 'Invisible',
                  }[state.profile.status]
                }
              </span>
              <span>Joined October 2024</span>
            </div>
          </div>
          <div className="profile-summary">
            <span>
              <strong>849</strong>Hours played
            </span>
            <span>
              <strong>{games.length}</strong>Games
            </span>
            <span>
              <strong>{cards.length}</strong>Cards
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setName(state.profile.name)
              setBio(state.profile.bio)
              setEdit(true)
            }}
          >
            <Pencil />
            Edit profile
          </Button>
        </div>
      </section>
      <nav className="profile-tabs" aria-label="Profile sections">
        {profileTabs.map(({ name: label, icon: Icon }) => (
          <a
            href={`#/profile/${label.toLowerCase()}`}
            key={label}
            className={cn(tab === label.toLowerCase() && 'active')}
            aria-current={tab === label.toLowerCase() ? 'page' : undefined}
          >
            <Icon size={16} />
            {label}
            {label === 'Cards' && <span>6</span>}
          </a>
        ))}
      </nav>
      <div className="page-content">
        <ProfileContent tab={tab} />
      </div>
      <Modal
        open={edit}
        onOpenChange={setEdit}
        title="Make yourself at home"
        description="Your profile is your little corner of Vault."
      >
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            setState((prev) => ({
              ...prev,
              profile: { ...prev.profile, name: name.trim(), bio: bio.trim() },
              posts: prev.posts.map((post) =>
                post.author === prev.profile.name ? { ...post, author: name.trim() } : post,
              ),
            }))
            setEdit(false)
            toast.success('Profile updated')
          }}
        >
          <label>
            Display name
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} required />
          </label>
          <label>
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
            />
          </label>
          <div className="modal-footer">
            <span>{bio.length}/160 characters</span>
            <Button type="submit" disabled={!name.trim()}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

function ProfileContent({ tab }: { tab: string }) {
  switch (tab) {
    case 'events':
      return <Events />
    case 'cards':
      return <Cards />
    case 'awards':
      return <Awards />
    case 'statistics':
      return <Statistics />
    default:
      return <Feed />
  }
}

export function Events() {
  const { state, setState } = useDemo()
  const [joinedOnly, setJoinedOnly] = useState(false)
  const joinedEvents = new Set(state.joinedEvents)
  const visible = events.filter((event) => !joinedOnly || joinedEvents.has(event.id))
  return (
    <>
      <div className="content-title">
        <div>
          <h2>Good times ahead</h2>
          <p>Find your next game night. Your people are already here.</p>
        </div>
        <Button
          variant={joinedOnly ? 'secondary' : 'ghost'}
          size="sm"
          aria-pressed={joinedOnly}
          onClick={() => setJoinedOnly(!joinedOnly)}
        >
          <CalendarDays />
          {joinedOnly ? 'My events' : 'All events'}
        </Button>
      </div>
      <div className="event-grid">
        {visible.map((event) => {
          const joined = joinedEvents.has(event.id)
          return (
            <article className="event-card" key={event.id}>
              <div
                className="event-cover"
                style={{ '--event-color': event.color } as CSSProperties}
              >
                <CalendarDays size={75} strokeWidth={0.7} />
                <span>
                  {event.date.split(' ')[0]}
                  <strong>{event.date.split(' ')[1]}</strong>
                </span>
                <Badge>COMMUNITY EVENT</Badge>
              </div>
              <div className="event-body">
                <span className="eyebrow">{event.game}</span>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-detail">
                  <Clock3 size={14} />
                  {event.time}
                </div>
                <div className="event-detail">
                  <Users size={14} />
                  {event.attendees + Number(joined)} people going
                </div>
                <Button
                  variant={joined ? 'secondary' : 'default'}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      joinedEvents: toggleItem(prev.joinedEvents, event.id),
                    }))
                    toast.success(
                      joined ? 'You left the event' : 'You’re on the list. See you there!',
                    )
                  }}
                >
                  {joined ? <Check /> : <CalendarDays />}
                  {joined ? 'Going · Leave event' : 'Join event'}
                </Button>
              </div>
            </article>
          )
        })}
      </div>
      {!visible.length && (
        <Empty icon={<CalendarDays size={30} />} title="Your next adventure is waiting">
          Join a community event to see it here.
        </Empty>
      )}
      <p className="section-footnote">
        Demo schedule · All times shown in UTC · RSVPs are saved on this device.
      </p>
    </>
  )
}

function Cards() {
  const { state, setState } = useDemo()
  const reducedMotion = useReducedMotion()
  const showcased = new Set(state.showcased)
  const cardSource = (card: Collectible) =>
    assetUrl(reducedMotion ? card.image.replace('.webp', '-still.webp') : card.image)
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('All rarities')
  const [selected, setSelected] = useState<Collectible | null>(null)
  const visible = cards.filter(
    (card) =>
      `${card.name} ${card.universe}`.toLowerCase().includes(query.toLowerCase()) &&
      (rarity === 'All rarities' || card.rarity === rarity),
  )
  return (
    <>
      <div className="content-title">
        <div>
          <h2>
            A collection with character <span className="count-pill">6</span>
          </h2>
          <p>Little trophies from the worlds you love.</p>
        </div>
        <div className="collection-tools">
          <SearchBox value={query} onChange={setQuery} placeholder="Search cards" />
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            aria-label="Card rarity"
          >
            <option>All rarities</option>
            <option>Legendary</option>
            <option>Epic</option>
            <option>Rare</option>
          </select>
        </div>
      </div>
      <div className="cards-grid">
        {visible.map((card) => (
          <button
            key={card.id}
            className="collectible"
            style={{ '--card-color': card.color } as CSSProperties}
            onClick={() => setSelected(card)}
          >
            <div className="collectible-art">
              <img src={cardSource(card)} alt={`${card.name} collectible`} loading="lazy" />
              {showcased.has(card.id) && (
                <span className="showcased">
                  <Star size={11} fill="currentColor" />
                  SHOWCASED
                </span>
              )}
            </div>
            <div className="collectible-info">
              <span className="rarity">
                {card.rarity}
                <span>#{card.number}</span>
              </span>
              <h3>{card.name}</h3>
              <p>{card.universe}</p>
            </div>
          </button>
        ))}
      </div>
      {!visible.length && (
        <Empty icon={<Search size={30} />} title="No cards found">
          Try a different name or rarity.
        </Empty>
      )}
      <Modal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected?.name || 'Collectible'}
        description={`${selected?.rarity} collectible · ${selected?.universe}`}
        className="card-modal"
      >
        {selected && (
          <>
            <img className="card-detail-image" src={cardSource(selected)} alt={selected.name} />
            <div className="card-provenance">
              <span>
                COLLECTION NUMBER<strong>#{selected.number} / 100</strong>
              </span>
              <span>
                OBTAINED<strong>Community reward</strong>
              </span>
            </div>
            <Button
              className="w-full"
              variant={state.showcased.includes(selected.id) ? 'secondary' : 'default'}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  showcased: toggleItem(prev.showcased, selected.id),
                }))
              }
            >
              <Star />
              {state.showcased.includes(selected.id) ? 'Remove from showcase' : 'Add to showcase'}
            </Button>
          </>
        )}
      </Modal>
    </>
  )
}

const achievements = [
  {
    title: 'Early explorer',
    description: 'Here from the very beginning.',
    icon: Shield,
    color: '#be95ff',
    unlocked: true,
    progress: 100,
  },
  {
    title: 'Night owl',
    description: 'Play 20 sessions after midnight.',
    icon: Flame,
    color: '#82cfff',
    unlocked: true,
    progress: 100,
  },
  {
    title: 'People person',
    description: 'Make 10 friends in Vault.',
    icon: Users,
    color: '#6fdc8c',
    unlocked: true,
    progress: 100,
  },
  {
    title: 'Storyteller',
    description: 'Share 10 moments with your people.',
    icon: Sparkles,
    color: '#f1c21b',
    unlocked: false,
    progress: 60,
  },
  {
    title: 'Completionist',
    description: 'Collect every card in a series.',
    icon: Crown,
    color: '#ffb784',
    unlocked: false,
    progress: 45,
  },
  {
    title: 'A thousand worlds',
    description: 'Reach 1,000 hours of playtime.',
    icon: Trophy,
    color: '#be95ff',
    unlocked: false,
    progress: 85,
  },
]
function Awards() {
  return (
    <>
      <div className="content-title">
        <div>
          <h2>Every adventure leaves a mark</h2>
          <p>Your milestones, big and small.</p>
        </div>
        <Badge>
          <Trophy size={13} />3 / 6 unlocked
        </Badge>
      </div>
      <div className="awards-banner">
        <div className="award-emblem">
          <Medal size={42} />
        </div>
        <div>
          <span className="eyebrow">EXPLORER LEVEL 24</span>
          <h3>You’re building quite a story.</h3>
          <p>2,450 / 3,000 XP to the next level</p>
          <div className="progress-track">
            <span style={{ width: '82%' }} />
          </div>
        </div>
        <strong>
          24<span>LEVEL</span>
        </strong>
      </div>
      <div className="awards-grid">
        {achievements.map(({ title, description, icon: Icon, color, unlocked, progress }) => (
          <article
            key={title}
            className={cn('award-card', !unlocked && 'award-locked')}
            style={{ '--award-color': color } as CSSProperties}
          >
            <div className="award-icon">
              <Icon size={32} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            {unlocked ? (
              <span className="award-earned">
                <Check size={12} />
                Unlocked
              </span>
            ) : (
              <div className="award-progress">
                <div className="progress-track">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <small>{progress}%</small>
              </div>
            )}
          </article>
        ))}
      </div>
      <p className="section-footnote">Achievement progress and XP are seeded demo data.</p>
    </>
  )
}

function Statistics() {
  const [range, setRange] = useState('This week')
  const multiplier = range === 'This month' ? 4 : range === 'All time' ? 34 : 1
  const values = [32, 55, 43, 82, 60, 96, 28]
  return (
    <>
      <div className="content-title">
        <div>
          <h2>Your time, well played</h2>
          <p>A closer look at the worlds you’ve been exploring.</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          aria-label="Statistics time range"
        >
          <option>This week</option>
          <option>This month</option>
          <option>All time</option>
        </select>
      </div>
      <div className="stats-grid">
        {[
          {
            title: 'Hours played',
            value: range === 'All time' ? '849' : (24.8 * multiplier).toFixed(1),
            icon: Clock3,
            caption: 'Across all your games',
          },
          {
            title: 'Games explored',
            value: range === 'This week' ? '4' : '6',
            icon: Gamepad2,
            caption: 'Always another adventure',
          },
          {
            title: 'Achievements',
            value: String(3 * (multiplier > 1 ? 2 : 1)),
            icon: Award,
            caption: 'Moments worth keeping',
          },
          {
            title: 'Longest streak',
            value: '12 days',
            icon: Zap,
            caption: 'One more game, every day',
          },
        ].map(({ title, value, icon: Icon, caption }) => (
          <div className="stat-card" key={title}>
            <span>
              {title}
              <Icon size={17} />
            </span>
            <strong>{value}</strong>
            <small>{caption}</small>
          </div>
        ))}
      </div>
      <div className="statistics-layout">
        <div className="panel">
          <div className="panel-heading">
            <h3>Playtime overview</h3>
            <Badge>HOURS</Badge>
          </div>
          <div className="big-chart">
            {values.map((value, i) => (
              <div key={['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i]}>
                <span className="chart-value">{((value / 20) * multiplier).toFixed(1)}h</span>
                <div style={{ height: `${value}%` }} />
                <small>
                  {range === 'This week'
                    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
                    : range === 'This month'
                      ? `Oct ${1 + i * 4}`
                      : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                </small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <h3>Most played</h3>
            <Trophy size={16} />
          </div>
          {[...games]
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 4)
            .map((game, i) => (
              <a href={`#/games/${game.id}`} key={game.id} className="most-played">
                <span>0{i + 1}</span>
                <div>
                  <strong>{game.name}</strong>
                  <small>{game.hours} hours total</small>
                </div>
                <ChevronRight size={14} />
              </a>
            ))}
        </div>
      </div>
      <p className="section-footnote">
        These charts use mock playtime. Native session tracking is available in the desktop library.
      </p>
    </>
  )
}
