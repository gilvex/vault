import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Gamepad2,
  Heart,
  Play,
  UserRound,
  Users,
} from 'lucide-react'
import {
  discoveryGames,
  discoveryGroups,
  friends,
  games,
  toggleItem,
  type DiscoveryItem,
  type Friend,
} from '@vault/core'
import { Button, cn } from '@vault/ui'
import { toast } from 'sonner'
import { useDemo } from '../../state'
import { desktop } from '../../platform'
import { GameArt, SearchBox } from '../common'
import { NativeLibrary } from '../Games'
import { PersonAvatar, Picture, Tags } from './shared'
import { polygonArt as art } from '../../assets'

const legacyGames: DiscoveryItem[] = games.map((game) => ({
  id: game.id,
  name: game.name,
  image: '',
  genre: game.genre,
  tags: [game.genre],
  description: game.description,
}))
const countFormat = new Intl.NumberFormat('en')
function filterDiscovery(
  items: DiscoveryItem[],
  query: string,
  genre: string,
  category: string,
  favorites: Set<string>,
  installed: Set<string>,
  joined: Set<string>,
) {
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      (genre === 'All genres' || item.genre === genre) &&
      (category !== 'Favorites' || favorites.has(item.id)) &&
      (category !== 'Installed' || installed.has(item.id)) &&
      (category !== 'My groups' || joined.has(item.id)),
  )
}
export function BrowsePage({
  section = 'games',
  onFriend,
}: {
  section?: string
  onFriend: (friend: Friend) => void
}) {
  const { state, setState } = useDemo()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(false)
  const [genre, setGenre] = useState('All genres')
  const [category, setCategory] = useState('All games')
  const [slide, setSlide] = useState(0)
  const groupView = section === 'groups'
  const peopleView = section === 'users'
  const items = groupView ? discoveryGroups : [...discoveryGames, ...legacyGames]
  const favorites = new Set(state.favorites)
  const installed = new Set(state.installed)
  const joined = new Set(state.joinedHubs)
  const filtered = query || genre !== 'All genres' || category !== 'All games'
  const visible = filterDiscovery(items, query, genre, category, favorites, installed, joined)
  const featured = (groupView ? discoveryGroups : discoveryGames)[
    slide % (groupView ? discoveryGroups.length : discoveryGames.length)
  ]
  const cards = !filtered ? visible.filter((item) => item.id !== featured.id) : visible
  function joinGroup(item: DiscoveryItem) {
    setState((prev) => ({ ...prev, joinedHubs: toggleItem(prev.joinedHubs, item.id) }))
    toast.success(
      joined.has(item.id) ? `Left ${item.name}` : `Joined ${item.name} · demo membership`,
    )
  }
  return (
    <div className="pg-browse-page">
      <h1 className="sr-only">Browse {section}</h1>
      <div className="pg-browse-toolbar">
        <nav className="pg-browse-segments" aria-label="Browse categories">
          {[
            { id: 'games', label: 'Games', icon: Gamepad2 },
            { id: 'groups', label: 'Groups', icon: Users },
            { id: 'users', label: 'Users', icon: UserRound },
          ].map(({ id, label, icon: Icon }) => (
            <a
              href={`#/browse/${id}`}
              key={id}
              className={cn(section === id && 'active')}
              aria-label={`Browse ${label.toLowerCase()}`}
              aria-current={section === id ? 'page' : undefined}
            >
              <Icon size={23} />
              {section === id && <span>{label}</span>}
            </a>
          ))}
        </nav>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder={`Search ${peopleView ? 'people' : groupView ? 'groups' : 'games'}`}
        />
        <Button variant="outline" aria-expanded={filters} onClick={() => setFilters(!filters)}>
          Filter <Filter size={16} />
        </Button>
      </div>
      {filters && (
        <div className="pg-browse-filters">
          <label>
            Genre
            <select
              aria-label="Filter game genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {['All genres', 'Action', 'RPG', 'Horror', 'Strategy', 'Adventure', 'Community'].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </label>
          <div className="segmented-tabs">
            {(groupView
              ? ['All games', 'My groups']
              : ['All games', 'Installed', 'Favorites', ...(desktop ? ['Local games'] : [])]
            ).map((value) => (
              <button
                key={value}
                aria-pressed={category === value}
                className={cn(category === value && 'active')}
                onClick={() => setCategory(value)}
              >
                {groupView && value === 'All games' ? 'All groups' : value}
              </button>
            ))}
          </div>
        </div>
      )}
      {category === 'Local games' && !groupView ? (
        <NativeLibrary />
      ) : peopleView ? (
        <div className="pg-people-grid">
          {friends
            .filter((friend) => friend.name.toLowerCase().includes(query.toLowerCase()))
            .map((friend) => (
              <button key={friend.id} className="pg-person-card" onClick={() => onFriend(friend)}>
                <PersonAvatar status={friend.status} size={64} />
                <strong>{friend.name}</strong>
                <span>{friend.game || friend.status}</span>
                <span className="pg-person-action">Open demo chat</span>
              </button>
            ))}
        </div>
      ) : (
        <>
          {!filtered && (
            <DiscoveryHero
              featured={featured}
              groupView={groupView}
              joined={joined.has(featured.id)}
              onJoin={() => joinGroup(featured)}
              onNext={() => setSlide((prev) => prev + 1)}
              onPrevious={() =>
                setSlide((prev) => (prev + discoveryGames.length - 1) % discoveryGames.length)
              }
            />
          )}
          <div className={cn('pg-discovery-grid', filtered && 'is-filtered')}>
            {cards.map((item, index) => (
              <DiscoveryCard
                key={item.id}
                item={item}
                groupView={groupView}
                className={
                  !filtered
                    ? ['card-wide', 'card-medium', 'card-narrow'][index] || 'card-horizontal'
                    : undefined
                }
                onJoin={() => joinGroup(item)}
              />
            ))}
          </div>
          {!visible.length && (
            <div className="pg-empty">
              <Gamepad2 size={32} />
              <h2>No matches found</h2>
              <p>Try a different search or reset your filters.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setGenre('All genres')
                  setCategory('All games')
                }}
              >
                Reset filters
              </Button>
            </div>
          )}
        </>
      )}
      <p className="pg-page-footnote">
        Demo catalog · Membership, activity, and game installs are mocked.
      </p>
    </div>
  )
}

function DiscoveryHero({
  featured,
  groupView,
  joined,
  onJoin,
  onNext,
  onPrevious,
}: {
  featured: DiscoveryItem
  groupView: boolean
  joined: boolean
  onJoin: () => void
  onNext: () => void
  onPrevious: () => void
}) {
  const title = !groupView && featured.id === 'skyrim' ? 'Legends of the Dovahkiin' : featured.name
  return (
    <section className={cn('pg-discovery-hero', groupView && 'is-group')}>
      <img
        src={art(featured.image)}
        alt={featured.name}
        width={1040}
        height={336}
        fetchPriority="high"
      />
      <div className="pg-discovery-hero-copy">
        <h2>{title}</h2>
        <p>{featured.description}</p>
        {groupView ? (
          <Button className="pg-green" onClick={onJoin}>
            {joined ? 'Joined · Leave group' : 'Join'}
          </Button>
        ) : (
          <Button asChild>
            <a href={`#/games/${featured.id}/news`}>
              <Play size={22} />
              Play
            </a>
          </Button>
        )}
      </div>
      {!groupView && (
        <>
          <button
            className="pg-carousel-prev"
            aria-label="Previous featured game"
            onClick={onPrevious}
          >
            <ChevronLeft />
          </button>
          <button className="pg-carousel-next" aria-label="Next featured game" onClick={onNext}>
            <ChevronRight />
          </button>
        </>
      )}
    </section>
  )
}

function DiscoveryCard({
  item,
  groupView,
  className,
  onJoin,
}: {
  item: DiscoveryItem
  groupView: boolean
  className?: string
  onJoin: () => void
}) {
  const { state, setState } = useDemo()
  const favorite = state.favorites.includes(item.id)
  const joined = state.joinedHubs.includes(item.id)
  const href = `#/${groupView ? 'groups' : 'games'}/${item.id}/news`
  return (
    <article className={cn('pg-discovery-card', className)}>
      <a className="pg-discovery-image" href={href} aria-label={`View ${item.name}`}>
        {item.image ? (
          <Picture name={item.image} alt={item.name} width={512} height={248} />
        ) : (
          <GameArt game={games.find((game) => game.id === item.id)!} />
        )}
      </a>
      {!groupView && (
        <button
          className={cn('pg-card-favorite', favorite && 'active')}
          aria-label={`Favorite ${item.name}`}
          aria-pressed={favorite}
          onClick={() =>
            setState((prev) => ({ ...prev, favorites: toggleItem(prev.favorites, item.id) }))
          }
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      )}
      <div className="pg-discovery-copy">
        <h2>
          <a href={href}>{item.name}</a>
        </h2>
        <p>{item.description}</p>
        {groupView ? (
          <>
            <div className="pg-member-counts">
              <span>
                <i />
                {countFormat.format(item.online || 0)} online
              </span>
              <span>
                <i />
                {countFormat.format(item.members || 0)} users
              </span>
            </div>
            <Button className="pg-green" onClick={onJoin}>
              {joined ? 'Joined · Leave group' : 'Join'}
            </Button>
          </>
        ) : (
          <>
            <div className="pg-playing-friends">
              <Picture name="profile-avatar" width={24} height={24} />
              <PersonAvatar size={24} />
              <PersonAvatar size={24} />
              <span>+5</span>
            </div>
            <Tags values={item.tags} />
          </>
        )}
      </div>
    </article>
  )
}
