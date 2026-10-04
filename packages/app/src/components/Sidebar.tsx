import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { ChevronDown, Gamepad2, Maximize2, Search, UserRound, Users, X } from 'lucide-react'
import { friends, discoveryGroups, serverGames, type Friend } from '@vault/core'
import { Button, Modal, cn } from '@vault/ui'
import { useDemo, useRoute } from '../state'
import { SearchBox } from './common'
import { PersonAvatar, Picture } from './polygon/shared'

const directoryTabs = [
  { name: 'Games', icon: Gamepad2 },
  { name: 'Groups', icon: Users },
  { name: 'Friends', icon: UserRound },
]
export function Sidebar({
  open,
  onClose,
  onFriend,
}: {
  open: boolean
  onClose: () => void
  onFriend: (friend: Friend) => void
}) {
  const { state } = useDemo()
  const route = useRoute()
  const [chosenTab, setChosenTab] = useState<string | null>(null)
  const tab = chosenTab || (route.startsWith('/home') ? 'Games' : 'Friends')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [directory, setDirectory] = useState(false)
  const drawer = useRef<HTMLElement>(null)
  const closeDrawer = useEffectEvent(() => onClose())
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    drawer.current?.querySelector<HTMLElement>('button')?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
      if (event.key !== 'Tab') return
      const elements = [
        ...(drawer.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input',
        ) || []),
      ].filter((element) => element.getClientRects().length)
      const first = elements[0],
        last = elements.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', keyboard)
    return () => {
      document.removeEventListener('keydown', keyboard)
      previous?.focus()
    }
  }, [open])
  const matching = friends.filter((friend) =>
    `${friend.name} ${friend.game || ''}`.toLowerCase().includes(query.toLowerCase()),
  )
  const statuses = [
    { id: 'playing', name: 'Playing' },
    { id: 'online', name: 'Online' },
    { id: 'dnd', name: 'Do not disturb' },
    { id: 'offline', name: 'Offline' },
  ]
  return (
    <>
      {open && (
        <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />
      )}
      <aside
        ref={drawer}
        className={cn('pg-sidebar', open && 'sidebar-open')}
        aria-label="Community sidebar"
        role={open ? 'dialog' : undefined}
        aria-modal={open || undefined}
      >
        <Button
          variant="ghost"
          size="icon"
          className="pg-mobile-close"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X />
        </Button>
        <div className="pg-directory-tabs">
          {directoryTabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={cn(tab === name && 'active')}
              aria-pressed={tab === name}
              onClick={() => {
                setChosenTab(name)
                setQuery('')
              }}
            >
              <Icon size={24} aria-hidden="true" />
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div className="pg-directory-tools">
          <button
            aria-label={`Search ${tab.toLowerCase()}`}
            onClick={() => setSearching(!searching)}
          >
            <Search size={15} />
          </button>
          <button
            aria-label={`Open ${tab.toLowerCase()} directory`}
            onClick={() => setDirectory(true)}
          >
            <Maximize2 size={14} />
          </button>
        </div>
        {searching && (
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder={`Search ${tab.toLowerCase()}`}
          />
        )}
        <div className="pg-directory-scroll">
          {tab === 'Friends'
            ? statuses.map(({ id, name }) => {
                const group = matching.filter((friend) => friend.status === id)
                return group.length ? (
                  <section key={id} className="pg-friend-group">
                    <button
                      className="pg-status-heading"
                      aria-expanded={!collapsed.includes(id)}
                      onClick={() =>
                        setCollapsed((prev) =>
                          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
                        )
                      }
                    >
                      <i className={`pg-status ${id}`} />
                      {name}
                      <ChevronDown size={13} />
                    </button>
                    {!collapsed.includes(id) &&
                      group.map((friend) => (
                        <button
                          className="pg-directory-row"
                          key={friend.id}
                          onClick={() => {
                            onFriend(friend)
                            onClose()
                          }}
                        >
                          <PersonAvatar status={friend.status} />
                          <span>
                            <strong>{friend.name}</strong>
                            <small>{friend.game || name}</small>
                          </span>
                        </button>
                      ))}
                  </section>
                ) : null
              })
            : tab === 'Games'
              ? serverGames
                  .filter((game) => game.name.toLowerCase().includes(query.toLowerCase()))
                  .map((game) => (
                    <a
                      className="pg-directory-row"
                      href={`#/games/${game.id}/news`}
                      key={game.id}
                      onClick={onClose}
                    >
                      <Picture name={game.image} width={48} height={48} />
                      <strong>{game.name}</strong>
                    </a>
                  ))
              : discoveryGroups
                  .filter((group) => group.name.toLowerCase().includes(query.toLowerCase()))
                  .map((group) => (
                    <a
                      className="pg-directory-row"
                      href={`#/groups/${group.id}/news`}
                      key={group.id}
                      onClick={onClose}
                    >
                      <Picture
                        name={group.id === 'vault' ? 'vault-avatar' : group.image}
                        width={48}
                        height={48}
                      />
                      <strong>{group.name}</strong>
                    </a>
                  ))}
          {tab === 'Friends' && !matching.length && (
            <p className="pg-directory-empty">No friends match your search.</p>
          )}
        </div>
        <a href="#/profile/news" onClick={onClose} className="pg-self-profile">
          <PersonAvatar self size={64} status={state.profile.status} />
          <span>
            <strong>{state.profile.name}</strong>
            <small>{state.profile.bio}</small>
          </span>
        </a>
      </aside>
      <DirectoryOverlay
        open={directory}
        onClose={() => setDirectory(false)}
        tab={tab}
        onFriend={(friend) => {
          setDirectory(false)
          onFriend(friend)
        }}
      />
    </>
  )
}

function DirectoryOverlay({
  open,
  onClose,
  tab,
  onFriend,
}: {
  open: boolean
  onClose: () => void
  tab: string
  onFriend: (friend: Friend) => void
}) {
  const [query, setQuery] = useState('')
  return (
    <Modal
      open={open}
      onOpenChange={(value) => !value && onClose()}
      title={`${tab} directory`}
      description="Your Polygon community · Seeded demo directory"
      className="pg-directory-modal"
    >
      <SearchBox value={query} onChange={setQuery} placeholder={`Find ${tab.toLowerCase()}…`} />
      <div className="pg-directory-grid">
        {tab === 'Friends'
          ? friends
              .filter((friend) => friend.name.toLowerCase().includes(query.toLowerCase()))
              .map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => onFriend(friend)}
                  className="pg-directory-row"
                >
                  <PersonAvatar status={friend.status} />
                  <span>
                    <strong>{friend.name}</strong>
                    <small>{friend.game || friend.status}</small>
                  </span>
                  <span className="pg-directory-cta">Message</span>
                </button>
              ))
          : (tab === 'Games' ? serverGames : discoveryGroups)
              .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
              .map((item) => (
                <a
                  className="pg-directory-row"
                  key={item.id}
                  onClick={onClose}
                  href={`#/${tab === 'Games' ? 'games' : 'groups'}/${item.id}/news`}
                >
                  <Picture name={item.image} width={48} height={48} />
                  <strong>{item.name}</strong>
                  <span className="pg-directory-cta">Open</span>
                </a>
              ))}
      </div>
    </Modal>
  )
}
