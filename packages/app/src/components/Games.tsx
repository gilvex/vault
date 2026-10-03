import { useEffect, useState } from 'react'
import {
  Check,
  Clock3,
  Download,
  FolderOpen,
  Gamepad2,
  Heart,
  MonitorDown,
  Play,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { Badge, Button, Modal, cn } from '@vault/ui'
import { filterGames, games, toggleItem, type Game } from '@vault/core'
import { toast } from 'sonner'
import { useDemo } from '../state'
import { desktop, native, type LocalGame } from '../platform'
import { Empty, GameArt, SearchBox, SectionHeading } from './common'

export function Games({ gameId }: { gameId?: string }) {
  const { state, setState } = useDemo()
  const favorites = new Set(state.favorites)
  const installedGames = new Set(state.installed)
  const [category, setCategory] = useState('All games')
  const [genre, setGenre] = useState('All genres')
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState<Game | null>(null)
  const selected = games.find((game) => game.id === gameId)
  const visible = filterGames(query, category, genre, state)
  const toggleFavorite = (id: string) =>
    setState((prev) => ({ ...prev, favorites: toggleItem(prev.favorites, id) }))
  function demoInstall(game: Game) {
    const installed = state.installed.includes(game.id)
    setState((prev) => ({ ...prev, installed: toggleItem(prev.installed, game.id) }))
    toast.success(
      installed ? `${game.name} removed from demo library` : `${game.name} added to demo library`,
      { description: 'Simulated installation — no game files are downloaded.' },
    )
  }
  if (selected)
    return (
      <div className="game-detail-page">
        <a className="back-link" href="#/games">
          ← Back to games
        </a>
        <GameArt game={selected} className="game-detail-art" />
        <div className="game-detail-content">
          <div>
            <Badge>{selected.genre}</Badge>
            <h1>{selected.name}</h1>
            <p>{selected.description}</p>
            <div className="game-detail-stats">
              <span>
                <Clock3 />
                {selected.hours} hours played
              </span>
              <span>
                <Star />
                {selected.score}% positive
              </span>
              <span>
                <Download />
                {selected.size}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  state.installed.includes(selected.id)
                    ? setPreview(selected)
                    : demoInstall(selected)
                }
              >
                <Play />
                {state.installed.includes(selected.id)
                  ? 'Play demo session'
                  : 'Add to demo library'}
              </Button>
              <Button
                variant="secondary"
                aria-pressed={state.favorites.includes(selected.id)}
                onClick={() => toggleFavorite(selected.id)}
              >
                <Heart fill={state.favorites.includes(selected.id) ? 'currentColor' : 'none'} />
                {state.favorites.includes(selected.id) ? 'Favorited' : 'Add to favorites'}
              </Button>
              {state.installed.includes(selected.id) && (
                <Button variant="ghost" onClick={() => demoInstall(selected)}>
                  Remove from library
                </Button>
              )}
            </div>
          </div>
          <div className="panel game-detail-note">
            <Gamepad2 size={26} />
            <h3>Better with your people</h3>
            <p>Find a squad, share a moment, and make this world your own.</p>
            <Button asChild variant="secondary">
              <a href="#/topics">Explore communities</a>
            </Button>
          </div>
        </div>
        <DemoSession game={preview} onClose={() => setPreview(null)} />
      </div>
    )
  return (
    <div className="page-content standalone-page">
      <SectionHeading
        eyebrow="YOUR NEXT ADVENTURE"
        title="All your worlds. One Vault."
        description="Pick up where you left off, or find somewhere new to get lost."
        action={
          <Badge>
            <Gamepad2 size={13} />
            {games.length} GAMES
          </Badge>
        }
      />
      <div className="library-feature">
        <GameArt game={games[0]} />
        <div>
          <Badge className="border-white/20 text-white">JUMP BACK IN</Badge>
          <h2>SCP: Secret Laboratory</h2>
          <p>The Foundation is calling. Your squad is waiting.</p>
          <Button onClick={() => setPreview(games[0])}>
            <Play fill="currentColor" />
            Play demo session
          </Button>
          <span>
            <Clock3 size={12} />
            128 hours played
          </span>
        </div>
      </div>
      <div className="library-toolbar">
        <div className="segmented-tabs">
          {['All games', 'Installed', 'Favorites', ...(desktop ? ['Local games'] : [])].map(
            (tab) => (
              <button
                key={tab}
                className={cn(category === tab && 'active')}
                onClick={() => setCategory(tab)}
                aria-pressed={category === tab}
              >
                {tab}
              </button>
            ),
          )}
        </div>
        {category !== 'Local games' && (
          <div className="collection-tools">
            <SearchBox value={query} onChange={setQuery} placeholder="Search games" />
            <select
              aria-label="Filter game genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option>All genres</option>
              {['Horror', 'RPG', 'Shooter', 'Adventure', 'Action'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {category === 'Local games' ? (
        <NativeLibrary />
      ) : (
        <>
          <div className="game-grid">
            {visible.map((game) => (
              <article className="library-card" key={game.id}>
                <a href={`#/games/${game.id}`} aria-label={`View ${game.name}`}>
                  <GameArt game={game} />
                </a>
                <button
                  className={cn('favorite-button', favorites.has(game.id) && 'active')}
                  aria-label={`Favorite ${game.name}`}
                  aria-pressed={favorites.has(game.id)}
                  onClick={() => toggleFavorite(game.id)}
                >
                  <Heart size={16} fill={favorites.has(game.id) ? 'currentColor' : 'none'} />
                </button>
                <div className="library-card-info">
                  <div>
                    <Badge>{game.genre}</Badge>
                    <span className="game-score">
                      <Star size={11} fill="currentColor" />
                      {game.score}%
                    </span>
                  </div>
                  <h3>
                    <a href={`#/games/${game.id}`}>{game.name}</a>
                  </h3>
                  <div className="library-card-bottom">
                    <span>
                      <Clock3 size={12} />
                      {game.hours} hrs played
                    </span>
                    <Button
                      size="sm"
                      variant={installedGames.has(game.id) ? 'secondary' : 'ghost'}
                      onClick={() =>
                        installedGames.has(game.id) ? setPreview(game) : demoInstall(game)
                      }
                    >
                      {installedGames.has(game.id) ? <Play size={13} /> : <Plus size={13} />}
                      {installedGames.has(game.id) ? 'Demo play' : 'Add'}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <Empty icon={<Gamepad2 size={30} />} title="No games here yet">
              Try another filter, or add a game to your favorites.
            </Empty>
          )}
          <p className="section-footnote">
            Catalog, installs, and play sessions are mocked.{' '}
            {desktop
              ? 'Use Local games for real native launching.'
              : 'Get Vault for desktop to launch real games from your computer.'}
          </p>
        </>
      )}
      <DemoSession game={preview} onClose={() => setPreview(null)} />
    </div>
  )
}
function DemoSession({ game, onClose }: { game: Game | null; onClose: () => void }) {
  return (
    <Modal
      open={!!game}
      onOpenChange={(open) => !open && onClose()}
      title="Ready, player?"
      description="This is a simulated game session. The actual game is not included in the demo."
    >
      {game && (
        <>
          <GameArt game={game} className="session-art" />
          <div className="demo-session-status">
            <span className="online-pulse" />
            <strong>{game.name}</strong>
            <Badge>DEMO SESSION</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            The desktop app can launch games you already own. Register an executable in Local games
            to start a real session.
          </p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary">
              <Check />
              End demo session
            </Button>
            {!desktop && (
              <Button asChild>
                <a href="#/download" onClick={onClose}>
                  <MonitorDown />
                  Get desktop
                </a>
              </Button>
            )}
          </div>
        </>
      )}
    </Modal>
  )
}
export function NativeLibrary() {
  const [localGames, setLocalGames] = useState<LocalGame[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const refresh = () =>
    native
      .listGames()
      .then(setLocalGames)
      .catch((error) => setError(String(error)))
  useEffect(() => {
    if (!desktop) return
    let alive = true
    const update = () =>
      native
        .listGames()
        .then((data) => {
          if (alive) {
            setLocalGames(data)
            setError('')
          }
        })
        .catch((error) => {
          if (alive) setError(String(error))
        })
    void update()
    const timer = setInterval(update, 3000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [])
  async function register() {
    setBusy(true)
    try {
      const game = await native.registerGame()
      if (game) {
        await refresh()
        toast.success(`${game.name} added to your local library`)
      }
    } catch (error) {
      toast.error(String(error))
    } finally {
      setBusy(false)
    }
  }
  if (!desktop)
    return (
      <Empty icon={<FolderOpen size={30} />} title="Your local library lives on desktop">
        Install Vault to register and launch games from your computer.
      </Empty>
    )
  return (
    <div className="native-library">
      <div className="content-title">
        <div>
          <h2>On this computer</h2>
          <p>Real local executables. Native launching, powered by Rust.</p>
        </div>
        <Button onClick={register} loading={busy}>
          <FolderOpen />
          Add local game
        </Button>
      </div>
      {error && (
        <p role="alert" className="error-banner">
          {error}
        </p>
      )}
      {!localGames.length && (
        <Empty icon={<FolderOpen size={30} />} title="Bring your games home">
          Choose a game executable to add it to your library. Nothing is uploaded.
        </Empty>
      )}
      {localGames.map((game) => (
        <div className="local-game-row" key={game.id}>
          <div className="local-game-icon">
            <Gamepad2 />
          </div>
          <div>
            <h3>{game.name}</h3>
            <p title={game.path}>{game.path}</p>
            <small>
              {game.running ? 'Running · ' : 'Tracked playtime · '}
              {Math.floor(game.seconds / 60)}m {game.seconds % 60}s
            </small>
          </div>
          <Button
            size="sm"
            disabled={game.running}
            onClick={async () => {
              try {
                await native.launchGame(game.id)
                await refresh()
                toast.success(`Launched ${game.name}`)
              } catch (error) {
                toast.error(String(error))
              }
            }}
          >
            <Play />
            {game.running ? 'Running' : 'Launch'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={game.running}
            aria-label={`Remove ${game.name}`}
            onClick={async () => {
              try {
                await native.removeGame(game.id)
                await refresh()
              } catch (error) {
                toast.error(String(error))
              }
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <p className="section-footnote">
        Tracks the directly launched process while Vault is open. Launchers that hand off to another
        process may end tracking early.
      </p>
    </div>
  )
}
