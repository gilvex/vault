import { Component, useState, type ErrorInfo, type ReactNode } from 'react'
import { Bell, ChevronRight, Download, Menu, Monitor, Search, X } from 'lucide-react'
import { Button, Modal, cn } from '@vault/ui'
import { friends, games, type Friend } from '@vault/core'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DemoProvider, useDemo, useRoute } from './state'
import { desktop } from './platform'
import { assetUrl } from './assets'
import { DemoNote, SearchBox } from './components/common'
import { Sidebar } from './components/Sidebar'
import { Profile } from './components/Profile'
import { Games } from './components/Games'
import { DownloadPage, Home, Topics } from './components/Explore'
import { FriendDialog, NotificationsDialog, SettingsDialog } from './components/Dialogs'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() {
    return { error: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Vault rendering error', error, info)
  }
  render() {
    return this.state.error ? (
      <div className="fatal-error">
        <img src={assetUrl('/vault.svg')} alt="Vault" />
        <h1>Let’s try that again.</h1>
        <p>Vault couldn’t display this page. Your saved demo data is still on this device.</p>
        <Button onClick={() => location.reload()}>Reload Vault</Button>
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
  const page = ['home', 'topics', 'games', 'profile', 'download'].includes(path[0])
    ? path[0]
    : 'profile'
  const tab = ['activity', 'events', 'cards', 'awards', 'statistics'].includes(path[1])
    ? path[1]
    : 'activity'
  const [sidebar, setSidebar] = useState(false)
  const [friend, setFriend] = useState<Friend | null>(null)
  const [settings, setSettings] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [search, setSearch] = useState(false)
  const { state } = useDemo()
  const [banner, setBanner] = useState(true)
  return (
    <div className="app-shell">
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
      <Sidebar
        open={sidebar}
        onClose={() => setSidebar(false)}
        onFriend={setFriend}
        onSettings={() => setSettings(true)}
      />
      <div className="workspace">
        <header className="topbar">
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setSidebar(true)}
          >
            <Menu />
          </Button>
          <nav aria-label="Main navigation">
            {['Home', 'Topics', 'Games', 'Profile'].map((label) => (
              <a
                key={label}
                href={`#/${label.toLowerCase()}${label === 'Profile' ? '/activity' : ''}`}
                className={cn(page === label.toLowerCase() && 'active')}
                aria-current={page === label.toLowerCase() ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="topbar-actions">
            <DemoNote />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search Vault"
              onClick={() => setSearch(true)}
            >
              <Search />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="notification-button"
              aria-label="Notifications"
              onClick={() => setNotifications(true)}
            >
              <Bell />
              {state.settings.notifications && <span />}
            </Button>
            <span className="topbar-divider" />
            <Button variant="ghost" size="sm" asChild>
              <a href="#/download">
                {desktop ? <Monitor /> : <Download />}
                <span className="desktop-label">{desktop ? 'Desktop app' : 'Get desktop'}</span>
              </a>
            </Button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} key={page} className="main-content">
          <PageContent page={page} tab={tab} gameId={path[1]} />
        </main>
        {banner && (
          <div className="demo-statusbar">
            <span>
              <span className="tiny-dot" />
              {desktop ? 'VAULT DESKTOP' : 'VAULT WEB'}
              <i />
              Demo workspace · All community activity is mocked. Your changes stay on this device.
            </span>
            <button aria-label="Dismiss demo notice" onClick={() => setBanner(false)}>
              <X size={12} />
            </button>
          </div>
        )}
      </div>
      <FriendDialog key={friend?.id || 'closed'} friend={friend} onClose={() => setFriend(null)} />
      <SettingsDialog open={settings} onClose={() => setSettings(false)} />
      <NotificationsDialog open={notifications} onClose={() => setNotifications(false)} />
      <GlobalSearch open={search} onOpenChange={setSearch} onFriend={setFriend} />
    </div>
  )
}

function PageContent({ page, tab, gameId }: { page: string; tab: string; gameId?: string }) {
  switch (page) {
    case 'profile':
      return <Profile tab={tab} />
    case 'games':
      return <Games gameId={gameId} />
    case 'topics':
      return <Topics />
    case 'download':
      return <DownloadPage />
    default:
      return <Home />
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
  const matchingGames = games.filter((game) =>
    game.name.toLowerCase().includes(query.toLowerCase()),
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
      title="Find your next thing"
      description="Search games, friends, and places in your Vault."
    >
      <SearchBox value={query} onChange={setQuery} placeholder="Search all of Vault" />
      <div className="global-search-results">
        {matchingGames.map((game) => (
          <a key={game.id} href={`#/games/${game.id}`} onClick={close}>
            <span>
              {game.name}
              <small>Game · {game.genre}</small>
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
        {!matchingGames.length && !matchingFriends.length && (
          <p className="py-8 text-center text-muted-foreground">
            No results. Try a game title or a friend’s name.
          </p>
        )}
      </div>
    </Modal>
  )
}
