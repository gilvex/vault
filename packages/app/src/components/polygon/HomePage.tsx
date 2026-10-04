import { useDemo } from '../../state'
import { ModuleTabs } from './shared'
import { NewsPanel } from './NewsPanel'
import { EventsPanel } from './EventsPanel'
import { ChatPanel } from './ChatPanel'
import { ServersPanel } from './ServersPanel'

export function ModuleView({
  tab,
  scope,
  game = false,
}: {
  tab: string
  scope: string
  game?: boolean
}) {
  switch (tab) {
    case 'events':
      return <EventsPanel expand={`${scope}/events`} />
    case 'chat':
      return <ChatPanel expand={`${scope}/chat`} scope={scope} />
    case 'servers':
      return <ServersPanel expand={`${scope}/servers`} />
    case 'layout':
      return <Showcase scope={scope} />
    default:
      return <NewsPanel expand={`${scope}/news`} game={game} />
  }
}
export function Showcase({ scope }: { scope: string }) {
  const { state } = useDemo()
  const enabled = new Set(state.polygon.modules)
  return (
    <div className="pg-showcase">
      {enabled.has('news') && <NewsPanel compact expand={`${scope}/news`} />}
      {enabled.has('events') && <EventsPanel compact expand={`${scope}/events`} />}
      {enabled.has('chat') && <ChatPanel compact expand={`${scope}/chat`} scope={scope} />}
      {enabled.has('servers') && <ServersPanel compact expand={`${scope}/servers`} />}
      {!enabled.size && (
        <div className="pg-empty">
          <h2>Your layout is empty</h2>
          <p>
            Add modules in <a href="#/settings/showcase">Showcase settings</a>.
          </p>
        </div>
      )}
    </div>
  )
}
export function HomePage({ tab = 'overview' }: { tab?: string }) {
  return (
    <div className="pg-home-page">
      <h1 className="sr-only">Polygon community home</h1>
      <ModuleTabs base="#/home" active={tab} home />
      {tab === 'overview' ? (
        <div className="pg-dashboard">
          <NewsPanel />
          <EventsPanel compact />
          <ChatPanel scope="community" />
          <ServersPanel />
        </div>
      ) : (
        <div className="pg-home-module">
          <ModuleView tab={tab} scope="#/home" />
        </div>
      )}
    </div>
  )
}
