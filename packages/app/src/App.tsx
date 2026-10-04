import { Component, useState, type ErrorInfo, type ReactNode } from 'react'
import { Bell, ChevronRight, Download, Menu, Monitor, Search, Settings, X } from 'lucide-react'
import { Button, Modal, cn } from '@vault/ui'
import { discoveryGames, discoveryGroups, friends, games, type Friend } from '@vault/core'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DemoProvider, useDemo, useRoute } from './state'
import { desktop } from './platform'
import { SearchBox } from './components/common'
import { Sidebar } from './components/Sidebar'
import { DownloadPage } from './components/Explore'
import { FriendDialog, NotificationsDialog } from './components/Dialogs'
import { HomePage } from './components/polygon/HomePage'
import { BrowsePage } from './components/polygon/BrowsePage'
import { EntityPage } from './components/polygon/EntityPage'
import { SettingsPage } from './components/polygon/SettingsPage'
import { PolygonMark } from './components/polygon/shared'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Polygon rendering error', error, info)
  }
  render() {
    return this.state.error ? (
      <div className="fatal-error">
        <PolygonMark />
        <h1>Let’s try that again.</h1>
        <p>Polygon couldn’t display this page. Your saved demo data is still on this device.</p>
        <Button onClick={() => location.reload()}>Reload Polygon</Button>
      </div>
    ) : (
      this.props.children
    )
  }
}
const queryClient = new QueryClient()
export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DemoProvider>
          <Workspace />
          <Toaster theme="dark" position="bottom-right" richColors closeButton />
        </DemoProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

function Workspace() {
  const route = useRoute()
  const path = route.split('?')[0].split('/').filter(Boolean)
  const page = path[0] || 'home'
  const [sidebar, setSidebar] = useState(false)
  const [friend, setFriend] = useState<Friend | null>(null)
  const [notifications, setNotifications] = useState(false)
  const [search, setSearch] = useState(false)
  const [banner, setBanner] = useState(true)
  if (page === 'settings') return <SettingsPage tab={path[1] || 'cover'} />
  return (
    <div className="app-shell pg-shell">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main-content')?.focus()
        }}
      >
        Skip to content
      </a>
      <WorkspaceHeader
        page={page}
        onMenu={() => setSidebar(true)}
        onSearch={() => setSearch(true)}
        onNotifications={() => setNotifications(true)}
      />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onFriend={setFriend} />
      <div className="pg-workspace">
        <main id="main-content" tabIndex={-1} key={page} className="pg-main">
          <PageContent page={page} path={path} onFriend={setFriend} />
        </main>
        {banner && (
          <div className="pg-demo-bar">
            <span>
              <i />
              {desktop ? 'Desktop' : 'Web'} demo · Community activity, chat, installs, and server
              connections are mocked.
            </span>
            <button aria-label="Dismiss demo notice" onClick={() => setBanner(false)}>
              <X size={13} />
            </button>
          </div>
        )}
      </div>
      <FriendDialog key={friend?.id || 'closed'} friend={friend} onClose={() => setFriend(null)} />
      <NotificationsDialog open={notifications} onClose={() => setNotifications(false)} />
      <GlobalSearch open={search} onOpenChange={setSearch} onFriend={setFriend} />
    </div>
  )
}

function WorkspaceHeader({
  page,
  onMenu,
  onSearch,
  onNotifications,
}: {
  page: string
  onMenu: () => void
  onSearch: () => void
  onNotifications: () => void
}) {
  const { state } = useDemo()
  const active = ['browse', 'games', 'groups', 'topics'].includes(page)
    ? 'browse'
    : page === 'profile'
      ? 'profile'
      : 'home'
  return (
    <header className="pg-header">
      <div className="pg-brand-area">
        <Button
          variant="ghost"
          size="icon"
          className="pg-mobile-menu"
          aria-label="Open navigation"
          onClick={onMenu}
        >
          <Menu />
        </Button>
        <a className="pg-brand" href="#/home/overview" aria-label="Polygon home">
          <PolygonMark />
          <span>POLYGON</span>
        </a>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="pg-bell"
          onClick={onNotifications}
        >
          <Bell size={23} />
          {state.settings.notifications && <i />}
        </Button>
      </div>
      <nav className="pg-primary-nav" aria-label="Main navigation">
        {[
          { id: 'home', label: 'Home', route: '#/home/overview' },
          { id: 'browse', label: 'Browse', route: '#/browse/games' },
          { id: 'profile', label: 'Profile', route: '#/profile/news' },
        ].map((item) => (
          <a
            key={item.id}
            href={item.route}
            className={cn(active === item.id && 'active')}
            aria-current={active === item.id ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <button className="pg-global-search" onClick={onSearch} aria-label="Search Polygon">
        <span>Search</span>
        <Search size={17} />
      </button>
      <div className="pg-header-actions">
        <Button
          variant="ghost"
          size="icon"
          className="pg-mobile-search"
          aria-label="Search Polygon"
          onClick={onSearch}
        >
          <Search />
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a
            href="#/download"
            aria-label="Get desktop"
            title={desktop ? 'Desktop downloads' : 'Get the desktop app'}
          >
            {desktop ? <Monitor size={20} /> : <Download size={20} />}
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href="#/settings/cover" aria-label="Settings">
            <Settings size={24} />
          </a>
        </Button>
      </div>
    </header>
  )
}

function PageContent({
  page,
  path,
  onFriend,
}: {
  page: string
  path: string[]
  onFriend: (friend: Friend) => void
}) {
  switch (page) {
    case 'profile':
      return <EntityPage kind="profile" tab={path[1] || 'news'} onFriend={onFriend} />
    case 'games':
      return path[1] ? (
        <EntityPage kind="game" id={path[1]} tab={path[2] || 'news'} onFriend={onFriend} />
      ) : (
        <BrowsePage onFriend={onFriend} />
      )
    case 'groups':
      return path[1] ? (
        <EntityPage kind="group" id={path[1]} tab={path[2] || 'news'} onFriend={onFriend} />
      ) : (
        <BrowsePage section="groups" onFriend={onFriend} />
      )
    case 'browse':
      return <BrowsePage key={path[1]} section={path[1] || 'games'} onFriend={onFriend} />
    case 'topics':
      return <BrowsePage section="groups" onFriend={onFriend} />
    case 'download':
      return <DownloadPage />
    default:
      return <HomePage tab={path[1] || 'overview'} />
  }
}

function GlobalSearch({
  open,
  onOpenChange,
  onFriend,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFriend: (friend: Friend) => void
}) {
  const [query, setQuery] = useState('')
  const matchingGames = [...discoveryGames, ...games].filter((game) =>
    game.name.toLowerCase().includes(query.toLowerCase()),
  )
  const matchingGroups = discoveryGroups.filter((group) =>
    group.name.toLowerCase().includes(query.toLowerCase()),
  )
  const matchingFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(query.toLowerCase()),
  )
  const close = () => {
    onOpenChange(false)
    setQuery('')
  }
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Search Polygon"
      description="Find games, groups, and friends in your demo workspace."
    >
      <SearchBox value={query} onChange={setQuery} placeholder="Search Polygon…" />
      <div className="global-search-results">
        {matchingGames.map((game) => (
          <a key={game.id} href={`#/games/${game.id}/news`} onClick={close}>
            <span>
              {game.name}
              <small>Game · {game.genre}</small>
            </span>
            <ChevronRight size={16} />
          </a>
        ))}
        {matchingGroups.map((group) => (
          <a key={group.id} href={`#/groups/${group.id}/news`} onClick={close}>
            <span>
              {group.name}
              <small>Group · {group.genre}</small>
            </span>
            <ChevronRight size={16} />
          </a>
        ))}
        {matchingFriends.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              close()
              onFriend(item)
            }}
          >
            <span>
              {item.name}
              <small>Friend · {item.game || item.status}</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
        {!matchingGames.length && !matchingGroups.length && !matchingFriends.length && (
          <p className="py-8 text-center text-muted-foreground">
            No results. Try a game, group, or friend’s name.
          </p>
        )}
      </div>
    </Modal>
  )
}
