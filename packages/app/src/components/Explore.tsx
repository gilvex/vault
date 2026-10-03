import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  FolderOpen,
  Gamepad2,
  Globe,
  HardDrive,
  Monitor,
  Shield,
  Users,
  Zap,
} from 'lucide-react'
import { Badge, Button, cn } from '@vault/ui'
import { hubs, toggleItem } from '@vault/core'
import { toast } from 'sonner'
import { useDemo } from '../state'
import { desktop } from '../platform'
import { assetUrl } from '../assets'
import { Feed } from './Feed'
import { Empty, SectionHeading } from './common'

export function Home() {
  const { state } = useDemo()
  return (
    <div className="page-content standalone-page">
      <div className="home-welcome">
        <div>
          <Badge className="text-purple-300 border-purple-400/20">THE GOOD PART OF GAMING</Badge>
          <h1>Welcome back, {state.profile.name}.</h1>
          <p>Your games. Your people. A few more stories to tell.</p>
          <Button asChild>
            <a href="#/games">
              Find your next adventure <ArrowRight />
            </a>
          </Button>
        </div>
        <div className="home-orbit" aria-hidden="true">
          <img src={assetUrl('/vault.svg')} alt="" />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="content-title">
        <div>
          <h2>Around your world</h2>
          <p>A little of everything from your corner of Vault.</p>
        </div>
      </div>
      <Feed home />
    </div>
  )
}

export function Topics() {
  const { state, setState } = useDemo()
  const [filter, setFilter] = useState('Discover')
  const joinedHubs = new Set(state.joinedHubs)
  const visible = hubs.filter((hub) => filter === 'Discover' || joinedHubs.has(hub.id))
  return (
    <div className="page-content standalone-page">
      <SectionHeading
        eyebrow="FIND YOUR PEOPLE"
        title="There’s a place for your kind of play."
        description="Game nights, shared discoveries, and people who get it. Welcome to Hubs."
      />
      <div className="segmented-tabs mb-6">
        {['Discover', 'My hubs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(filter === tab && 'active')}
            aria-pressed={filter === tab}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="hub-grid">
        {visible.map((hub) => {
          const joined = joinedHubs.has(hub.id)
          return (
            <article className="hub-card" key={hub.id}>
              <div className="hub-cover" style={{ color: hub.color }}>
                <span>{hub.initials}</span>
                <Users size={64} strokeWidth={0.6} />
              </div>
              <div className="hub-info">
                <Badge>{hub.topic}</Badge>
                <h2>{hub.name}</h2>
                <p>A home for the curious, the dedicated, and the just-one-more-game crowd.</p>
                <span className="hub-members">
                  <Users size={14} />
                  {hub.members} members <i />
                  Active community
                </span>
                <Button
                  variant={joined ? 'secondary' : 'default'}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      joinedHubs: toggleItem(prev.joinedHubs, hub.id),
                    }))
                    toast.success(joined ? `You left ${hub.name}` : `Welcome to ${hub.name}!`)
                  }}
                >
                  {joined ? <Check /> : <Users />}
                  {joined ? 'Joined · Leave hub' : 'Join the hub'}
                </Button>
              </div>
            </article>
          )
        })}
      </div>
      {!visible.length && (
        <Empty icon={<Users size={30} />} title="Your people are out there">
          Explore a hub and join the conversation.
        </Empty>
      )}
      <div className="community-callout">
        <div>
          <h3>Less scrolling. More playing.</h3>
          <p>Meet up at the next community game night.</p>
        </div>
        <Button asChild variant="outline">
          <a href="#/profile/events">
            Explore events <ArrowRight />
          </a>
        </Button>
      </div>
    </div>
  )
}

type ReleaseAsset = {
  name: string
  url: string
  platform: 'windows' | 'macos' | 'linux'
  size?: number
}

async function loadReleaseAssets(signal: AbortSignal): Promise<ReleaseAsset[]> {
  const repository = (import.meta as ImportMeta & { env: Record<string, string> }).env
    .VITE_GITHUB_REPOSITORY
  if (repository && /^[\w.-]+\/[\w.-]+$/.test(repository)) {
    const response = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, {
      signal,
    })
    if (!response.ok) throw new Error('No published release')
    const release = (await response.json()) as {
      assets: { name: string; browser_download_url: string; size: number }[]
    }
    return release.assets.flatMap((asset) => {
      const platform = /\.exe$/.test(asset.name)
        ? 'windows'
        : /\.dmg$/.test(asset.name)
          ? 'macos'
          : /\.AppImage$/.test(asset.name)
            ? 'linux'
            : null
      return platform
        ? [
            {
              name: asset.name,
              url: asset.browser_download_url,
              platform,
              size: asset.size,
            } as ReleaseAsset,
          ]
        : []
    })
  }
  let response = await fetch(assetUrl('/downloads/manifest.local.json'), { signal })
  if (!response.ok) response = await fetch(assetUrl('/downloads/manifest.json'), { signal })
  if (!response.ok) throw new Error('No local installer')
  const manifest = (await response.json()) as { assets: ReleaseAsset[] }
  return manifest.assets
}

export function DownloadPage() {
  const {
    data: assets = [],
    isFetching: loading,
    isError: failed,
    refetch,
  } = useQuery({
    queryKey: ['release-assets'],
    queryFn: async ({ signal }) => {
      const timeout = new AbortController()
      const cancel = () => timeout.abort()
      signal.addEventListener('abort', cancel)
      const timer = setTimeout(cancel, 12000)
      try {
        return await loadReleaseAssets(timeout.signal)
      } finally {
        clearTimeout(timer)
        signal.removeEventListener('abort', cancel)
      }
    },
    staleTime: 60000,
    retry: false,
  })
  const available = (platform: string) => assets.filter((asset) => asset.platform === platform)
  return (
    <div className="page-content standalone-page download-page">
      <div className="download-hero">
        <div className="desktop-app-mark">
          <img src={assetUrl('/vault.svg')} alt="Vault" />
        </div>
        <Badge className="text-purple-300 border-purple-400/25">TAKE YOUR WORLD WITH YOU</Badge>
        <h1>A home on your desktop.</h1>
        <p>
          Everything you love about Vault. Closer to your games.
          <br />A lightweight native app, built with Tauri and Rust.
        </p>
        {desktop && (
          <Badge className="text-green-400">
            <Check size={13} />
            You’re already using Vault for desktop
          </Badge>
        )}
      </div>
      <div className="download-platforms">
        {[
          { id: 'windows', title: 'Windows', subtitle: 'Windows 10 / 11 · x64', icon: Monitor },
          {
            id: 'macos',
            title: 'macOS',
            subtitle: 'macOS 10.15+ · Apple Silicon / Intel',
            icon: Monitor,
          },
          { id: 'linux', title: 'Linux', subtitle: 'Ubuntu 22.04+ · x64', icon: HardDrive },
        ].map(({ id, title, subtitle, icon: Icon }) => (
          <article className="download-card" key={id}>
            <Icon size={28} />
            <h2>{title}</h2>
            <p>{subtitle}</p>
            {available(id).length ? (
              available(id).map((asset) => (
                <Button key={asset.name} asChild>
                  <a href={assetUrl(asset.url)} download>
                    <Download />
                    {id === 'macos'
                      ? asset.name.includes('aarch64')
                        ? 'Apple Silicon'
                        : 'Intel Mac'
                      : `Download for ${title}`}
                  </a>
                </Button>
              ))
            ) : (
              <Button variant="secondary" disabled>
                <ArrowDownToLine />
                {loading ? 'Checking releases…' : 'Build from source'}
              </Button>
            )}
            <small>
              {available(id).length
                ? 'Demo v0.1.0 · unsigned installer'
                : 'Installers publish through the release workflow'}
            </small>
          </article>
        ))}
      </div>
      {!loading && !assets.length && (
        <div className="release-note">
          <Shield size={20} />
          <div>
            <strong>
              {failed
                ? 'No published installers found yet.'
                : 'Your first release is one build away.'}
            </strong>
            <p>
              Run <code>pnpm desktop:build</code> to create an installer, then{' '}
              <code>pnpm package:installer</code> to make it downloadable here. Tagged GitHub
              releases build all platforms automatically.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Check again
          </Button>
        </div>
      )}
      <div className="content-title">
        <div>
          <h2>More than a browser tab.</h2>
          <p>Native capabilities that make the desktop app your gaming companion.</p>
        </div>
      </div>
      <div className="desktop-features">
        {[
          {
            icon: FolderOpen,
            title: 'Your real game library',
            description: 'Register local game executables using your system’s native file picker.',
          },
          {
            icon: Gamepad2,
            title: 'Launch from one place',
            description: 'Start your registered games directly through the Rust backend.',
          },
          {
            icon: Zap,
            title: 'Native session tracking',
            description: 'Track directly launched processes and save their playtime to disk.',
          },
          {
            icon: HardDrive,
            title: 'Your data stays yours',
            description: 'Keep a persistent local library and save backups using native dialogs.',
          },
        ].map(({ icon: Icon, title, description }) => (
          <div key={title}>
            <Icon size={23} />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <div className="community-callout">
        <div>
          <h3>Just looking around?</h3>
          <p>The complete mock community experience works in your browser.</p>
        </div>
        <Button asChild variant="secondary">
          <a href="#/profile/activity">
            <Globe />
            Explore web demo <ExternalLink />
          </a>
        </Button>
      </div>
    </div>
  )
}
