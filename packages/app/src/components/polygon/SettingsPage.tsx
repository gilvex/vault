import { useEffect, useId, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { ArrowLeft, ChevronUp, ImagePlus, Plus, Settings } from 'lucide-react'
import { moduleIds } from '@vault/core'
import { Button, Switch, cn } from '@vault/ui'
import { toast } from 'sonner'
import { useDemo } from '../../state'
import { assetUrl } from '../../assets'
import { Cover } from './EntityPage'
import { SettingsDialog } from '../Dialogs'

type ProfileDraft = { name: string; bio: string; avatar: string; cover: string }

async function readImage(file: File): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type))
    throw new Error('Choose a PNG, JPEG, or WebP image.')
  if (file.size > 5_000_000) throw new Error('Choose an image smaller than 5 MB.')
  const bitmap = await createImageBitmap(file)
  try {
    const canvas = document.createElement('canvas')
    const ratio = Math.min(1, 1400 / bitmap.width, 1000 / bitmap.height)
    canvas.width = Math.round(bitmap.width * ratio)
    canvas.height = Math.round(bitmap.height * ratio)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image processing is unavailable in this browser.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const result = canvas.toDataURL('image/webp', 0.75)
    if (result.length > 600000)
      throw new Error('This image is too detailed. Choose a smaller image.')
    return result
  } finally {
    bitmap.close()
  }
}

export function SettingsPage({ tab = 'cover' }: { tab?: string }) {
  const { state, setState } = useDemo()
  const [draft, setDraft] = useState<ProfileDraft>(() => ({
    name: state.profile.name,
    bio: state.profile.bio,
    avatar: state.polygon.avatar,
    cover: state.polygon.cover,
  }))
  const [error, setError] = useState('')
  const [dataOpen, setDataOpen] = useState(false)
  const dirty =
    draft.name !== state.profile.name ||
    draft.bio !== state.profile.bio ||
    draft.avatar !== state.polygon.avatar ||
    draft.cover !== state.polygon.cover
  useEffect(() => {
    if (!dirty) return
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', unload)
    return () => window.removeEventListener('beforeunload', unload)
  }, [dirty])
  function save(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.name.trim()) {
      setError('Enter a display name before saving.')
      return
    }
    const cleaned = { ...draft, name: draft.name.trim(), bio: draft.bio.trim() }
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, name: cleaned.name, bio: cleaned.bio },
      posts: prev.posts.map((post) =>
        post.author === prev.profile.name ? { ...post, author: cleaned.name } : post,
      ),
      polygon: { ...prev.polygon, cover: cleaned.cover, avatar: cleaned.avatar },
    }))
    setDraft(cleaned)
    toast.success('Profile updated')
    setError('')
  }
  function leave(e: React.MouseEvent<HTMLAnchorElement>) {
    if (dirty && !window.confirm('Leave without saving your profile changes?')) e.preventDefault()
  }
  return (
    <div className="pg-settings-page">
      <header className="pg-settings-header">
        <a href="#/profile/news" onClick={leave} aria-label="Back to profile">
          <ArrowLeft size={23} />
        </a>
        <h1>Settings</h1>
        <span>Polygon · local demo</span>
      </header>
      <aside className="pg-settings-nav">
        <h2>
          <ChevronUp size={16} />
          Profile
        </h2>
        {['cover', 'showcase', 'sidepanel', 'privacy'].map((id) => (
          <a
            key={id}
            href={`#/settings/${id}`}
            className={cn(tab === id && 'active')}
            aria-current={tab === id ? 'page' : undefined}
          >
            {id === 'sidepanel' ? 'Side panel' : id[0].toUpperCase() + id.slice(1)}
          </a>
        ))}
        <button onClick={() => setDataOpen(true)}>
          <Settings size={16} />
          Data & preferences
        </button>
        <a href="#/download" onClick={leave}>
          Desktop app
        </a>
      </aside>
      <main id="main-content" tabIndex={-1} className="pg-settings-main">
        <div className="pg-settings-preview">
          <Cover
            name={draft.name || state.profile.name}
            bio={draft.bio}
            banner={draft.cover}
            avatar={draft.avatar}
          />
        </div>
        <div className="pg-settings-content">
          {tab === 'cover' ? (
            <CoverEditor
              draft={draft}
              setDraft={setDraft}
              onSave={save}
              error={error}
              onError={setError}
              dirty={dirty}
            />
          ) : (
            <ProfilePreferences tab={tab} leave={leave} onData={() => setDataOpen(true)} />
          )}
        </div>
      </main>
      <SettingsDialog open={dataOpen} onClose={() => setDataOpen(false)} />
    </div>
  )
}

function ImageUpload({
  label,
  value,
  onChange,
  onError,
}: {
  label: 'avatar' | 'banner'
  value: string
  onChange: (value: string) => void
  onError: (message: string) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  return (
    <div className="pg-upload-field">
      <label htmlFor={id}>{label === 'avatar' ? 'Avatar' : 'Banner'}</label>
      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label={`Choose profile ${label}`}
      >
        <img
          src={assetUrl(value)}
          alt={`Current profile ${label}`}
          width={label === 'avatar' ? 160 : 792}
          height={160}
        />
        <ImagePlus aria-hidden="true" />
        <span>
          <Plus size={15} />
        </span>
      </button>
      <input
        id={id}
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        aria-label={`Profile ${label} file`}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          try {
            onChange(await readImage(file))
            onError('')
          } catch (error) {
            onError(error instanceof Error ? error.message : String(error))
          }
        }}
      />
    </div>
  )
}

function CoverEditor({
  draft,
  setDraft,
  onSave,
  error,
  onError,
  dirty,
}: {
  draft: ProfileDraft
  setDraft: Dispatch<SetStateAction<ProfileDraft>>
  onSave: (event: React.FormEvent) => void
  error: string
  onError: (message: string) => void
  dirty: boolean
}) {
  return (
    <form onSubmit={onSave} className="pg-cover-form">
      <h2>Cover</h2>
      <div className="pg-upload-fields">
        <ImageUpload
          label="avatar"
          value={draft.avatar}
          onChange={(avatar) => setDraft((prev) => ({ ...prev, avatar }))}
          onError={onError}
        />
        <ImageUpload
          label="banner"
          value={draft.cover}
          onChange={(cover) => setDraft((prev) => ({ ...prev, cover }))}
          onError={onError}
        />
      </div>
      <div className="pg-cover-presets" aria-label="Banner presets">
        {[
          { name: 'Starlit sea', file: 'profile-banner' },
          { name: 'VAULT', file: 'vault-banner' },
          { name: 'Sanctuary', file: 'diablo-banner' },
        ].map((preset) => (
          <button
            type="button"
            key={preset.file}
            aria-pressed={draft.cover.includes(preset.file)}
            onClick={() =>
              setDraft((prev) => ({ ...prev, cover: `/media/polygon/${preset.file}.webp` }))
            }
          >
            {preset.name}
          </button>
        ))}
      </div>
      <div className="pg-form-columns">
        <label>
          User name
          <input name="username" value="vault-explorer" readOnly aria-label="User name" />
        </label>
        <label>
          Display name
          <input
            name="displayName"
            autoComplete="nickname"
            spellCheck={false}
            value={draft.name}
            onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
            maxLength={30}
            required
          />
        </label>
      </div>
      <label>
        About
        <textarea
          name="bio"
          value={draft.bio}
          onChange={(e) => setDraft((prev) => ({ ...prev, bio: e.target.value }))}
          rows={3}
          maxLength={160}
        />
      </label>
      {error && (
        <p className="pg-form-error" role="alert">
          {error}
        </p>
      )}
      <div className="pg-settings-save">
        <Button type="submit">Save changes</Button>
        <span>{dirty ? 'Unsaved changes' : 'All changes saved on this device'}</span>
      </div>
    </form>
  )
}

function ProfilePreferences({
  tab,
  leave,
  onData,
}: {
  tab: string
  leave: (event: React.MouseEvent<HTMLAnchorElement>) => void
  onData: () => void
}) {
  const { state, setState } = useDemo()
  const enabledModules = new Set(state.polygon.modules)
  if (tab === 'showcase')
    return (
      <div className="pg-preference-list">
        <h2>Showcase</h2>
        <p>Choose the modules in your profile’s Layout view.</p>
        {moduleIds.map((module) => (
          <label key={module}>
            <span>{module[0].toUpperCase() + module.slice(1)}</span>
            <Switch
              label={`Show ${module} module`}
              checked={enabledModules.has(module)}
              onCheckedChange={(checked) =>
                setState((prev) => ({
                  ...prev,
                  polygon: {
                    ...prev.polygon,
                    modules: checked
                      ? [...new Set([...prev.polygon.modules, module])]
                      : prev.polygon.modules.filter((value) => value !== module),
                  },
                }))
              }
            />
          </label>
        ))}
        <Button asChild variant="secondary">
          <a href="#/profile/layout" onClick={leave}>
            View your layout
          </a>
        </Button>
      </div>
    )
  if (tab === 'sidepanel')
    return (
      <div className="pg-preference-list">
        <h2>Side panel</h2>
        <p>Choose which lists appear beside your profile.</p>
        {(
          [
            { key: 'showGames', title: 'Games' },
            { key: 'showGroups', title: 'Groups' },
            { key: 'showFriends', title: 'Friends' },
          ] as const
        ).map((item) => (
          <label key={item.key}>
            <span>{item.title}</span>
            <Switch
              label={`Show ${item.title.toLowerCase()}`}
              checked={state.polygon[item.key]}
              onCheckedChange={(checked) =>
                setState((prev) => ({ ...prev, polygon: { ...prev.polygon, [item.key]: checked } }))
              }
            />
          </label>
        ))}
      </div>
    )
  return (
    <div className="pg-preference-list">
      <h2>Privacy</h2>
      <p>Your demo content stays on this device. No profile or messages are uploaded.</p>
      <label>
        <span>Presence</span>
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
          <option value="playing">Playing</option>
          <option value="dnd">Do not disturb</option>
          <option value="offline">Invisible</option>
        </select>
      </label>
      <label>
        <span>Reduce motion</span>
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
      </label>
      <Button variant="secondary" onClick={onData}>
        Manage demo data
      </Button>
    </div>
  )
}
