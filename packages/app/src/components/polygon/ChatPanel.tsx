import { useRef, useState } from 'react'
import {
  Box,
  ChevronUp,
  Hash,
  MessageSquare,
  Paperclip,
  Pin,
  Send,
  Smile,
  Users,
  VolumeX,
} from 'lucide-react'
import { cn } from '@vault/ui'
import { toast } from 'sonner'
import { useDemo } from '../../state'
import { MockLabel, Panel, PersonAvatar } from './shared'

const channels = ['General', 'Off Topic', 'Flood', 'Looking for group']
const timeFormat = new Intl.DateTimeFormat('en', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
const seedMessages = [
  {
    id: 'first',
    author: 'Fyzzluna',
    time: '11:47',
    text: 'Hey, everyone! How about a few rounds of Call of Duty tonight?',
  },
  {
    id: 'second',
    author: 'Fyzzluna',
    time: '12:05',
    text: 'Actually, I have a better suggestion. How about trying out a cooperative game like Overcooked?',
  },
  {
    id: 'third',
    author: 'me',
    time: '12:18',
    text: 'I’m up for a challenge! Cooking might not be my strong suit, but I’m always ready to try something new.',
  },
  { id: 'fourth', author: 'Fyzzluna', time: '12:46', text: 'Count me in as well.' },
]
export function ChatPanel({
  compact = false,
  expand = '#/home/chat',
  scope = 'community',
}: {
  compact?: boolean
  expand?: string
  scope?: string
}) {
  const { state, setState } = useDemo()
  const [channel, setChannel] = useState('Off Topic')
  const [draft, setDraft] = useState('')
  const [muted, setMuted] = useState(false)
  const [pinned, setPinned] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const key = `${scope}:${channel}`
  const messages = [
    ...(channel === 'Off Topic'
      ? seedMessages
      : [
          {
            id: 'welcome',
            author: 'Fyzzluna',
            time: '10:00',
            text: `Welcome to ${channel}. What are we playing today?`,
          },
        ]),
    ...(state.polygon.channels[key] || []),
  ]
  function send(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) {
      input.current?.focus()
      return
    }
    const message = {
      id: crypto.randomUUID(),
      author: 'me',
      text: draft.trim(),
      time: timeFormat.format(new Date()),
    }
    setState((prev) => ({
      ...prev,
      polygon: {
        ...prev.polygon,
        channels: {
          ...prev.polygon.channels,
          [key]: [...(prev.polygon.channels[key] || []), message],
        },
      },
    }))
    setDraft('')
    requestAnimationFrame(() => messagesEnd.current?.scrollIntoView({ block: 'nearest' }))
  }
  return (
    <Panel
      title="Chats"
      icon={MessageSquare}
      className={cn('pg-chat', compact && 'pg-compact')}
      expand={expand}
      action={<MockLabel />}
    >
      <div className="pg-chat-body">
        <nav className="pg-channel-list" aria-label="Chat channels">
          <h3>
            <ChevronUp size={15} />
            Chatting
          </h3>
          {channels.slice(0, 3).map((name, i) => (
            <button
              className={cn(channel === name && 'active')}
              key={name}
              onClick={() => setChannel(name)}
              aria-pressed={channel === name}
            >
              <Hash size={18} />
              <span>{name}</span>
              {i !== 1 && <small>11</small>}
            </button>
          ))}
          <h3>
            <Box size={15} />
            Interactions
          </h3>
          <button
            onClick={() => setChannel(channels[3])}
            className={cn(channel === channels[3] && 'active')}
          >
            <Hash size={18} />
            Looking for group
          </button>
          <h3>
            <Box size={15} />
            Community
          </h3>
          <a href="#/profile/activity">
            <Hash size={18} />
            Your activity
          </a>
          <a href="#/browse/groups">
            <Hash size={18} />
            Find a group
          </a>
        </nav>
        <div className="pg-chat-conversation">
          <header>
            <span>
              <Hash size={18} />
              {channel}
            </span>
            <button
              aria-label="Pin channel"
              aria-pressed={pinned}
              onClick={() => setPinned(!pinned)}
              className={cn(pinned && 'active')}
            >
              <Pin size={16} />
            </button>
            <button
              aria-label="Mute channel"
              aria-pressed={muted}
              onClick={() => setMuted(!muted)}
              className={cn(muted && 'active')}
            >
              <VolumeX size={16} />
            </button>
            <button
              aria-label="View community members"
              onClick={() =>
                toast('Demo channel · 4 participants: you, Fyzzluna, nova.exe, and ghost')
              }
            >
              <Users size={16} />
            </button>
          </header>
          {pinned && (
            <div className="pg-pinned">
              <Pin size={12} />
              Pinned to your demo workspace
            </div>
          )}
          <div className="pg-chat-messages" role="log" aria-label={`${channel} messages`}>
            <span className="pg-chat-day">Today</span>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('pg-channel-message', message.author === 'me' && 'is-mine')}
              >
                <PersonAvatar size={44} />
                <div>
                  <span className="pg-message-author">
                    <strong>{message.author === 'me' ? state.profile.name : message.author}</strong>
                    <time>{message.time}</time>
                  </span>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>
          <form className="pg-chat-compose" onSubmit={send}>
            <div>
              <button
                type="button"
                aria-label="Attach demo capture"
                onClick={() =>
                  setDraft(
                    (prev) => `${prev}${prev ? ' ' : ''}[Demo capture: SCP containment breach]`,
                  )
                }
              >
                <Paperclip size={18} />
              </button>
              <input
                ref={input}
                name="message"
                autoComplete="off"
                value={draft}
                maxLength={2000}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type something…"
                aria-label="Channel message"
              />
              <button
                type="button"
                aria-label="Add smile"
                onClick={() => setDraft((prev) => `${prev} :)`)}
              >
                <Smile size={18} />
              </button>
            </div>
            <button type="submit" aria-label="Send channel message">
              <Send size={23} />
            </button>
          </form>
        </div>
      </div>
    </Panel>
  )
}
