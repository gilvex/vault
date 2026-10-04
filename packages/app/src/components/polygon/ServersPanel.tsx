import { useState } from 'react'
import { Check, Copy, Server, Star } from 'lucide-react'
import { demoServers, serverGames, toggleItem } from '@vault/core'
import { Button, Modal, cn } from '@vault/ui'
import { toast } from 'sonner'
import { useDemo } from '../../state'
import { MockLabel, Panel, Picture } from './shared'

export function ServersPanel({
  compact = false,
  expand = '#/home/servers',
}: {
  compact?: boolean
  expand?: string
}) {
  const { state, setState } = useDemo()
  const [gameId, setGameId] = useState('scp')
  const [selected, setSelected] = useState<(typeof demoServers)[number] | null>(null)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const favorites = new Set(state.polygon.favoriteServers)
  const rows = demoServers.filter(
    (server) => !onlyFavorites || favorites.has(`${gameId}:${server.id}`),
  )
  const connected = selected && state.polygon.connectedServer === `${gameId}:${selected.id}`
  return (
    <>
      <Panel
        title="Servers"
        icon={Server}
        className={cn('pg-servers', compact && 'pg-compact')}
        expand={expand}
        action={<MockLabel />}
      >
        <div className="pg-server-body">
          <div className="pg-server-games">
            <span className="pg-table-label">Games</span>
            {serverGames.map((game) => (
              <button
                key={game.id}
                className={cn(gameId === game.id && 'active')}
                aria-pressed={gameId === game.id}
                onClick={() => setGameId(game.id)}
              >
                <Picture name={game.image} width={60} height={60} />
                <span>
                  <strong>{game.name}</strong>
                  <small>
                    11 servers <span>{game.players} players</span>
                  </small>
                </span>
              </button>
            ))}
            <button
              className="pg-server-favorites"
              aria-pressed={onlyFavorites}
              onClick={() => setOnlyFavorites(!onlyFavorites)}
            >
              <Star size={15} />
              {onlyFavorites ? 'Show all servers' : 'Favorites'}
            </button>
          </div>
          <div className="pg-server-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>IP Address</th>
                  <th>Players</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((server) => (
                  <tr key={server.id}>
                    <td>
                      <button onClick={() => setSelected(server)}>
                        {server.name}
                        {state.polygon.connectedServer === `${gameId}:${server.id}` && (
                          <span className="pg-connected">Demo joined</span>
                        )}
                      </button>
                    </td>
                    <td>{server.address}</td>
                    <td>
                      {server.players} / {server.slots}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <div className="pg-empty">
                <Star />
                <p>No favorite servers for this game yet.</p>
              </div>
            )}
          </div>
        </div>
      </Panel>
      <Modal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected?.name || 'Server'}
        description="Mock server connection. This demo does not contact a real game server."
      >
        {selected && (
          <div className="pg-server-modal">
            <div>
              <span>Game</span>
              <strong>{serverGames.find((game) => game.id === gameId)?.name}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{selected.address}</strong>
            </div>
            <div>
              <span>Region / latency</span>
              <strong>
                {selected.region} · {selected.ping} ms (mock)
              </strong>
            </div>
            <div className="pg-server-modal-actions">
              <Button
                className="pg-green"
                onClick={() => {
                  setState((prev) => ({
                    ...prev,
                    polygon: {
                      ...prev.polygon,
                      connectedServer: connected ? null : `${gameId}:${selected.id}`,
                    },
                  }))
                  toast.success(
                    connected
                      ? 'Left the demo server'
                      : 'Demo connection joined — no network connection made',
                  )
                }}
              >
                {connected ? <Check /> : <Server />}
                {connected ? 'Leave demo server' : 'Join demo server'}
              </Button>
              <Button
                variant="secondary"
                aria-pressed={favorites.has(`${gameId}:${selected.id}`)}
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    polygon: {
                      ...prev.polygon,
                      favoriteServers: toggleItem(
                        prev.polygon.favoriteServers,
                        `${gameId}:${selected.id}`,
                      ),
                    },
                  }))
                }
              >
                <Star />
                Favorite
              </Button>
              <Button
                variant="ghost"
                aria-label="Copy server address"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(selected.address)
                    toast.success('Demo address copied')
                  } catch {
                    toast.error('Clipboard unavailable')
                  }
                }}
              >
                <Copy />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
