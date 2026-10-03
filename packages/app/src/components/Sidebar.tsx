import { useState } from 'react'
import { ChevronDown, Gamepad2, Headphones, MessageCircle, Settings, Users, X } from 'lucide-react'
import { friends, games, hubs, type Friend } from '@vault/core'
import { Button, cn } from '@vault/ui'
import { useDemo } from '../state'
import { assetUrl } from '../assets'
import { Avatar, SearchBox } from './common'

export function Sidebar({
  open,
  onClose,
  onFriend,
  onSettings,
}: {
  open: boolean
  onClose: () => void
  onFriend: (friend: Friend) => void
  onSettings: () => void
}) {
  const { state } = useDemo()
  const installedGames = new Set(state.installed)
  const [tab, setTab] = useState('Friends')
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [muted, setMuted] = useState(false)
  const matching = friends.filter((friend) =>
    `${friend.name} ${friend.game || ''}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      {open && (
        <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />
      )}
      <aside className={cn('sidebar', open && 'sidebar-open')} aria-label="Community sidebar">
        <a href="#/home" className="brand" onClick={onClose}>
          <img src={assetUrl('/vault.svg')} alt="" />
          <span>VAULT</span>
          <span className="brand-beta">BETA</span>
        </a>
        <Button
          variant="ghost"
          size="icon"
          className="mobile-close"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X />
        </Button>
        <div className="sidebar-tabs">
          {[
            { name: 'Games', icon: Gamepad2 },
            { name: 'Hubs', icon: MessageCircle },
            { name: 'Friends', icon: Users },
          ].map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={cn(tab === name && 'active')}
              onClick={() => {
                setTab(name)
                setQuery('')
              }}
              aria-pressed={tab === name}
            >
              <Icon size={19} />
              <span>{name}</span>
            </button>
          ))}
        </div>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder={`Search ${tab.toLowerCase()}`}
          className="sidebar-search"
        />
        <div className="sidebar-scroll">
          {tab === 'Friends' && (
            <>
              {['playing', 'online', 'dnd', 'offline'].map((status) => {
                const group = matching.filter((friend) => friend.status === status)
                return (
                  group.length > 0 && (
                    <section className="friend-group" key={status}>
                      <button
                        className="group-title"
                        aria-expanded={!collapsed.includes(status)}
                        onClick={() =>
                          setCollapsed((prev) =>
                            prev.includes(status)
                              ? prev.filter((x) => x !== status)
                              : [...prev, status],
                          )
                        }
                      >
                        <span>
                          {status === 'dnd'
                            ? 'Do not disturb'
                            : status === 'playing'
                              ? 'In game'
                              : status[0].toUpperCase() + status.slice(1)}{' '}
                          <small>{group.length}</small>
                        </span>
                        <ChevronDown
                          size={13}
                          className={cn(collapsed.includes(status) && '-rotate-90')}
                        />
                      </button>
                      {!collapsed.includes(status) &&
                        group.map((friend) => (
                          <button
                            className="friend-row"
                            key={friend.id}
                            onClick={() => {
                              onFriend(friend)
                              onClose()
                            }}
                          >
                            <Avatar
                              name={friend.name}
                              initials={friend.initials}
                              color={friend.color}
                              status={friend.status}
                            />
                            <span>
                              <strong>{friend.name}</strong>
                              <small className={friend.status === 'playing' ? 'playing-text' : ''}>
                                {friend.game ||
                                  (friend.status === 'online'
                                    ? 'Online'
                                    : friend.status === 'dnd'
                                      ? 'Taking a break'
                                      : 'Last seen yesterday')}
                              </small>
                            </span>
                          </button>
                        ))}
                    </section>
                  )
                )
              })}
              {!matching.length && <p className="sidebar-empty">No friends found.</p>}
            </>
          )}
          {tab === 'Games' && (
            <section className="friend-group">
              <div className="group-title">
                Your library <small>{games.length}</small>
              </div>
              {games
                .filter((game) => game.name.toLowerCase().includes(query.toLowerCase()))
                .map((game) => (
                  <a
                    href={`#/games/${game.id}`}
                    key={game.id}
                    className="friend-row"
                    onClick={onClose}
                  >
                    <span className="mini-game" style={{ color: game.color }}>
                      <Gamepad2 size={19} />
                    </span>
                    <span>
                      <strong>{game.name}</strong>
                      <small>{installedGames.has(game.id) ? 'In demo library' : game.genre}</small>
                    </span>
                  </a>
                ))}
              <a className="sidebar-link" href="#/games" onClick={onClose}>
                Explore all games →
              </a>
            </section>
          )}
          {tab === 'Hubs' && (
            <section className="friend-group">
              <div className="group-title">Your communities</div>
              {hubs
                .filter((hub) => hub.name.toLowerCase().includes(query.toLowerCase()))
                .map((hub) => (
                  <a className="friend-row" key={hub.id} href="#/topics" onClick={onClose}>
                    <Avatar name={hub.name} initials={hub.initials} color={hub.color} />
                    <span>
                      <strong>{hub.name}</strong>
                      <small>{hub.members} members</small>
                    </span>
                  </a>
                ))}
            </section>
          )}
          <div className="sidebar-invite">
            <span className="online-pulse" />
            <span>A good game is better together.</span>
          </div>
        </div>
        <div className="sidebar-user">
          <a href="#/profile/activity" className="self-link" onClick={onClose}>
            <Avatar name={state.profile.name} self status={state.profile.status} />
            <span>
              <strong>{state.profile.name}</strong>
              <small>
                {state.profile.status === 'online'
                  ? 'Online'
                  : state.profile.status === 'playing'
                    ? 'In game'
                    : state.profile.status === 'dnd'
                      ? 'Do not disturb'
                      : 'Invisible'}
              </small>
            </span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            aria-label={muted ? 'Unmute demo sounds' : 'Mute demo sounds'}
            aria-pressed={muted}
            title="Demo sound preference"
            onClick={() => setMuted(!muted)}
          >
            <Headphones className={muted ? 'opacity-30' : ''} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings" onClick={onSettings}>
            <Settings />
          </Button>
        </div>
      </aside>
    </>
  )
}
