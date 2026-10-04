import { useState } from 'react'
import { CalendarDays, Check } from 'lucide-react'
import { communityEvents, toggleItem } from '@vault/core'
import { Button, cn } from '@vault/ui'
import { toast } from 'sonner'
import { useDemo } from '../../state'
import { MockLabel, Panel, Picture } from './shared'

export function EventsPanel({
  compact = false,
  expand = '#/home/events',
}: {
  compact?: boolean
  expand?: string
}) {
  const { state, setState } = useDemo()
  const [selectedId, setSelectedId] = useState('containment')
  const [joinedOnly, setJoinedOnly] = useState(false)
  const joinedEvents = new Set(state.joinedEvents)
  const items = communityEvents.filter((item) => !joinedOnly || joinedEvents.has(item.id))
  const selected = items.find((item) => item.id === selectedId) || items[0]
  const joined = selected && joinedEvents.has(selected.id)
  function join() {
    if (!selected) return
    setState((prev) => ({ ...prev, joinedEvents: toggleItem(prev.joinedEvents, selected.id) }))
    toast.success(joined ? 'You left the demo event' : 'You’re on the demo guest list')
  }
  return (
    <Panel
      title="Events"
      icon={CalendarDays}
      className={cn('pg-events', compact && 'pg-compact')}
      expand={expand}
      action={<MockLabel />}
    >
      <div className="pg-event-body">
        <div className="pg-event-list">
          <button
            className="pg-list-filter"
            aria-pressed={joinedOnly}
            onClick={() => setJoinedOnly(!joinedOnly)}
          >
            {joinedOnly ? 'My events' : 'All events'}
          </button>
          {items.map((item) => (
            <button
              className={cn('pg-event-item', selected?.id === item.id && 'active')}
              key={item.id}
              aria-pressed={selected?.id === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="pg-list-meta">
                <span>{item.day}</span>
                <span>{item.time}</span>
              </span>
              <span className="pg-list-story">
                <Picture name={item.image} width={64} height={64} />
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.date}
                    {joinedEvents.has(item.id) && ' · Going'}
                  </small>
                </span>
              </span>
            </button>
          ))}
        </div>
        {selected ? (
          <article className="pg-event-detail">
            <div className="pg-event-top">
              <Picture name={selected.image} alt={selected.title} width={128} height={128} />
              <div>
                <div className="pg-event-datetime">
                  <span>{selected.day}</span>
                  <strong>{selected.time}</strong>
                </div>
                <div className="pg-event-game">
                  <Picture name="scp" width={44} height={44} />
                  <strong>{selected.game}</strong>
                  <Button className={cn('pg-green', joined && 'is-joined')} onClick={join}>
                    {joined && <Check size={16} />}
                    {joined ? 'Going · Leave event' : 'Join event'}
                  </Button>
                </div>
                <h3>{selected.title}</h3>
              </div>
            </div>
            <p>{selected.body}</p>
            <Picture name={selected.image} width={672} height={256} className="pg-event-image" />
            <small className="pg-event-disclaimer">
              {selected.date} · All times UTC · Community event mock
            </small>
          </article>
        ) : (
          <div className="pg-empty">
            <CalendarDays />
            <h3>No joined events yet</h3>
            <p>Choose All events and join a community night.</p>
          </div>
        )}
      </div>
    </Panel>
  )
}
