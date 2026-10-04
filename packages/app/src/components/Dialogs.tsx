import { useEffect, useRef, useState } from 'react'
import { Bell, Check, Download, Gamepad2, Monitor, RotateCcw, Send, Upload } from 'lucide-react'
import { Badge, Button, Modal, Switch } from '@vault/ui'
import { createInitialState, stateSchema, type Friend } from '@vault/core'
import { toast } from 'sonner'
import { useDemo } from '../state'
import { desktop, downloadJson, native } from '../platform'
import { Avatar } from './common'

export function FriendDialog({ friend, onClose }: { friend: Friend | null; onClose: () => void }) {
  const { state, setState } = useDemo()
  const [message, setMessage] = useState('')
  const messages = friend ? state.messages[friend.id] || [] : []
  return (
    <Modal
      open={!!friend}
      onOpenChange={(open) => !open && onClose()}
      title={friend?.name || 'Friend'}
      description="Demo conversation · Messages stay on this device."
    >
      {friend && (
        <>
          <div className="friend-dialog-info">
            <Avatar
              name={friend.name}
              color={friend.color}
              initials={friend.initials}
              status={friend.status}
              large
            />
            <div>
              <strong>{friend.game || 'Hanging out in Vault'}</strong>
              <p>
                {friend.status === 'playing'
                  ? 'Currently playing'
                  : friend.status === 'offline'
                    ? 'Offline'
                    : 'Available for a chat'}
              </p>
            </div>
            <Badge>FRIEND</Badge>
          </div>
          <div className="chat-messages" role="log" aria-label="Conversation">
            <div className="chat-bubble">
              Hey! Up for a game later?<small>Seeded demo message</small>
            </div>
            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat-bubble ${item.from === 'me' ? 'my-message' : ''}`}
              >
                {item.text}
                {item.from === 'friend' && <small>Automated demo reply</small>}
              </div>
            ))}
          </div>
          <form
            className="comment-form"
            onSubmit={(e) => {
              e.preventDefault()
              if (!message.trim()) return
              const text = message.trim()
              setState((prev) => ({
                ...prev,
                messages: {
                  ...prev.messages,
                  [friend.id]: [
                    ...(prev.messages[friend.id] || []),
                    { id: crypto.randomUUID(), from: 'me', text },
                    {
                      id: crypto.randomUUID(),
                      from: 'friend',
                      text: 'Sounds good! Meet you in the next community game night.',
                    },
                  ],
                },
              }))
              setMessage('')
            }}
          >
            <input
              value={message}
              maxLength={1000}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${friend.name}…`}
              aria-label="Message friend"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!message.trim()}>
              <Send />
            </Button>
          </form>
        </>
      )}
    </Modal>
  )
}

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, setState } = useDemo()
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [system, setSystem] = useState<{
    os: string
    arch: string
    version: string
    dataDir: string
  } | null>(null)
  useEffect(() => {
    if (open && desktop)
      void native
        .systemInfo()
        .then(setSystem)
        .catch((error) => toast.error(String(error)))
  }, [open])
  async function exportBackup() {
    const contents = JSON.stringify(state, null, 2)
    try {
      if (desktop) {
        const path = await native.exportBackup(contents)
        if (path) toast.success('Backup saved', { description: path })
      } else {
        downloadJson(contents)
        toast.success('Backup downloaded')
      }
    } catch (error) {
      toast.error(String(error))
    }
  }
  return (
    <Modal
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose()
          setConfirmReset(false)
        }
      }}
      title="Your Polygon, your way"
      description="Preferences and demo data are stored locally on this device."
    >
      <div className="settings-stack">
        <label className="settings-row">
          <div>
            <strong>Online status</strong>
            <p>How you appear in your demo profile.</p>
          </div>
          <select
            aria-label="Online status"
            value={state.profile.status}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                profile: { ...prev.profile, status: e.target.value as typeof prev.profile.status },
              }))
            }
          >
            <option value="online">Online</option>
            <option value="playing">In game</option>
            <option value="dnd">Do not disturb</option>
            <option value="offline">Invisible</option>
          </select>
        </label>
        <div className="settings-row">
          <div>
            <strong>Demo notifications</strong>
            <p>Show community updates in the inbox.</p>
          </div>
          <Switch
            label="Demo notifications"
            checked={state.settings.notifications}
            onCheckedChange={(checked) =>
              setState((prev) => ({
                ...prev,
                settings: { ...prev.settings, notifications: checked },
              }))
            }
          />
        </div>
        <div className="settings-row">
          <div>
            <strong>Reduce motion</strong>
            <p>Minimize transitions and use still card artwork.</p>
          </div>
          <Switch
            label="Reduce motion"
            checked={state.settings.reducedMotion}
            onCheckedChange={(checked) =>
              setState((prev) => ({
                ...prev,
                settings: { ...prev.settings, reducedMotion: checked },
              }))
            }
          />
        </div>
        <div className="settings-section">
          <h3>Keep your progress</h3>
          <p>Export a backup or restore one to move your demo between devices.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={exportBackup}>
              <Download />
              Export backup
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload />
              Restore backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              aria-label="Restore backup file"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  if (file.size > 2_000_000) throw new Error('Backup must be smaller than 2 MB')
                  const restored = stateSchema.parse(JSON.parse(await file.text()))
                  setState(restored)
                  toast.success('Demo backup restored')
                } catch {
                  toast.error('Invalid backup. Choose a valid Vault v1 JSON backup under 2 MB.')
                } finally {
                  if (fileRef.current) fileRef.current.value = ''
                }
              }}
            />
          </div>
        </div>
        <div className="settings-section">
          <h3>
            <Monitor size={15} />
            {desktop ? 'Polygon for desktop' : 'Polygon for the web'}
          </h3>
          <p>
            {system
              ? `${system.os} · ${system.arch} · v${system.version}`
              : 'Demo v0.1.0 · React + Tauri + Rust'}
          </p>
          {system && (
            <small className="break-all text-muted-foreground">
              Local library: {system.dataDir}
            </small>
          )}
        </div>
        <div className="settings-row reset-row">
          <div>
            <strong>Start fresh</strong>
            <p>
              {confirmReset
                ? 'This clears posts, preferences, and all demo progress.'
                : 'Restore the original demo workspace.'}
            </p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (!confirmReset) {
                setConfirmReset(true)
                return
              }
              setState(createInitialState())
              setConfirmReset(false)
              toast.success('Demo reset to its original state')
            }}
          >
            <RotateCcw />
            {confirmReset ? 'Confirm reset' : 'Reset demo'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function NotificationsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useDemo()
  const [read, setRead] = useState(false)
  return (
    <Modal
      open={open}
      onOpenChange={(value) => !value && onClose()}
      title="A little heads-up"
      description="Your community updates. These notifications are part of the demo."
    >
      {state.settings.notifications ? (
        <>
          <div className="notification-item">
            <span className="notification-icon">
              <Gamepad2 size={19} />
            </span>
            <div>
              <strong>Game night is on the calendar</strong>
              <p>Join ghost and 23 others for Containment breach.</p>
              <a href="#/profile/events" onClick={onClose}>
                View event →
              </a>
            </div>
            {!read && <i />}
          </div>
          <div className="notification-item">
            <span className="notification-icon">
              <StarIcon />
            </span>
            <div>
              <strong>A new card for your collection</strong>
              <p>Vegito Blue is waiting in your Vault.</p>
              <a href="#/profile/cards" onClick={onClose}>
                See collection →
              </a>
            </div>
            {!read && <i />}
          </div>
          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={() => setRead(true)}
            disabled={read}
          >
            <Check />
            {read ? 'All caught up' : 'Mark all as read'}
          </Button>
        </>
      ) : (
        <div className="empty-state">
          <Bell />
          <h3>Peace and quiet</h3>
          <p>Demo notifications are turned off in settings.</p>
        </div>
      )}
    </Modal>
  )
}
function StarIcon() {
  return <span aria-hidden="true">✦</span>
}
