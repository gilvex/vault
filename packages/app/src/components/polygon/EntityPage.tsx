import { useState } from 'react'
import { Download, Gamepad2, Heart, Pencil, Play, Users, UserRound, Box, Check } from 'lucide-react'
import {
  discoveryGames,
  discoveryGroups,
  friends,
  games,
  serverGames,
  toggleItem,
  type Friend,
  type DemoState,
} from '@vault/core'
import { Button, Modal } from '@vault/ui'
import { toast } from 'sonner'
import { useDemo } from '../../state'
import { assetUrl } from '../../assets'
import { Feed } from '../Feed'
import { Cards, Awards, Statistics } from '../Profile'
import { LegacyLinks, ModuleTabs, Panel, PersonAvatar, Picture } from './shared'
import { ModuleView } from './HomePage'

export function Cover({
  name,
  bio,
  banner,
  avatar,
  action,
  className = '',
}: {
  name: string
  bio: string
  banner: string
  avatar: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`pg-cover ${className}`}>
      <img
        className="pg-cover-banner"
        src={assetUrl(banner)}
        alt=""
        width={1040}
        height={210}
        fetchPriority="high"
      />
      <div className="pg-cover-info">
        <img className="pg-cover-avatar" src={assetUrl(avatar)} alt="" width={128} height={128} />
        <div>
          <h1>{name}</h1>
          <p>{bio}</p>
        </div>
        {action}
      </div>
    </div>
  )
}

function RelatedRail({
  profile,
  onFriend,
  kind,
  title,
}: {
  profile: boolean
  onFriend: (friend: Friend) => void
  kind: string
  title: string
}) {
  const { state } = useDemo()
  return (
    <aside className="pg-related" aria-label="Related community">
      {!profile && (
        <Panel title="About" icon={Box} className="pg-about">
          <dl>
            <div>
              <dt>Community</dt>
              <dd>{title}</dd>
            </div>
            <div>
              <dt>Members</dt>
              <dd>2,400 · demo</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>June 2026</dd>
            </div>
          </dl>
          <Button
            className="pg-donate"
            onClick={() =>
              toast('Demo only — no payment is taken', {
                description: 'Community support payments are not available in this MVP.',
              })
            }
          >
            Donate
          </Button>
        </Panel>
      )}
      {state.polygon.showGames && kind !== 'game' && (
        <Panel
          title={profile ? `${state.profile.name}’s Games` : 'Community Games'}
          icon={Gamepad2}
          expand="#/browse/games"
        >
          {serverGames.map((game) => (
            <a className="pg-related-row" key={game.id} href={`#/games/${game.id}/news`}>
              <Picture name={game.image} width={44} height={44} />
              <strong>{game.name}</strong>
            </a>
          ))}
        </Panel>
      )}
      {state.polygon.showGroups && kind !== 'group' && (
        <Panel
          title={profile ? `${state.profile.name}’s Groups` : 'Related Groups'}
          icon={Users}
          expand="#/browse/groups"
        >
          {[
            { id: 'vault', name: 'VAULT' },
            { id: 'guild', name: 'Guild Starter' },
            { id: 'gameon', name: 'Game On' },
          ].map((group) => (
            <a className="pg-related-row" href={`#/groups/${group.id}/news`} key={group.id}>
              <Picture name="vault-avatar" width={44} height={44} />
              <strong>{group.name}</strong>
            </a>
          ))}
        </Panel>
      )}
      {state.polygon.showFriends && (
        <Panel
          title={profile ? `${state.profile.name}’s Friends` : 'Community Friends'}
          icon={UserRound}
          expand="#/browse/users"
        >
          {friends.slice(0, 3).map((friend) => (
            <button className="pg-related-row" key={friend.id} onClick={() => onFriend(friend)}>
              <PersonAvatar status={friend.status} size={44} />
              <strong>{friend.name}</strong>
            </button>
          ))}
        </Panel>
      )}
      {profile && <LegacyLinks />}
    </aside>
  )
}

function describeEntity(kind: string, id: string | undefined, state: DemoState) {
  if (kind === 'profile')
    return {
      title: state.profile.name,
      bio: state.profile.bio,
      banner: state.polygon.cover,
      avatar: state.polygon.avatar,
      scope: '#/profile',
    }
  if (kind === 'group') {
    const group =
      discoveryGroups.find((group) => group.id === id) ||
      discoveryGroups.find((group) => group.id === 'vault')!
    return {
      title: group.name,
      bio: group.description,
      banner: `/media/polygon/${group.image}.webp`,
      avatar: '/media/polygon/vault-avatar.webp',
      scope: `#/groups/${id}`,
    }
  }
  const game = discoveryGames.find((game) => game.id === id) || games.find((game) => game.id === id)
  const banner = game && 'image' in game ? game.image : 'warfare'
  const avatar = id === 'diablo' ? 'diablo-avatar' : id === 'minecraft' ? 'minecraft' : 'scp'
  return {
    title: game?.name || 'SCP: Secret Laboratory',
    bio: 'Your next adventure starts here.',
    banner: `/media/polygon/${banner}.webp`,
    avatar: `/media/polygon/${avatar}.webp`,
    scope: `#/games/${id}`,
  }
}

function CollectionContent({ tab }: { tab: string }) {
  if (tab === 'activity') return <Feed />
  if (tab === 'cards') return <Cards />
  if (tab === 'awards') return <Awards />
  return <Statistics />
}

export function EntityPage({
  kind,
  id,
  tab = 'news',
  onFriend,
}: {
  kind: 'profile' | 'game' | 'group'
  id?: string
  tab?: string
  onFriend: (friend: Friend) => void
}) {
  const { state } = useDemo()
  const profile = kind === 'profile'
  const { title, bio, banner, avatar, scope } = describeEntity(kind, id, state)
  const [session, setSession] = useState(false)
  const legacy = ['activity', 'cards', 'awards', 'statistics'].includes(tab)
  return (
    <div
      className={`pg-entity-page pg-entity-${kind}`}
      style={{ '--cover-art': `url(${assetUrl(banner)})` } as React.CSSProperties}
    >
      <div className="pg-entity-layout">
        <div className="pg-entity-main">
          <Cover
            name={title}
            bio={bio}
            banner={banner}
            avatar={avatar}
            action={
              <CoverAction
                kind={kind}
                title={title}
                id={id || 'vault'}
                onPlay={() => setSession(true)}
              />
            }
          />
          <ModuleTabs base={scope} active={legacy ? 'news' : tab} />
          {legacy ? (
            <div className="pg-legacy-content">
              <LegacyLinks active={tab} />
              <CollectionContent tab={tab} />
            </div>
          ) : (
            <ModuleView tab={tab} scope={scope} game={kind === 'game' && id === 'diablo'} />
          )}
        </div>
        <RelatedRail profile={profile} onFriend={onFriend} kind={kind} title={title} />
      </div>
      <GameSession
        open={session}
        onOpenChange={setSession}
        title={title}
        banner={banner}
        id={id || 'scp'}
      />
    </div>
  )
}

function CoverAction({
  kind,
  title,
  id,
  onPlay,
}: {
  kind: string
  title: string
  id: string
  onPlay: () => void
}) {
  const { state, setState } = useDemo()
  if (kind === 'profile')
    return (
      <Button asChild variant="ghost" aria-label="Edit profile">
        <a href="#/settings/cover">
          Edit <Pencil size={16} />
        </a>
      </Button>
    )
  if (kind === 'game')
    return (
      <Button className="pg-green" onClick={onPlay}>
        <Play size={17} />
        Play demo
      </Button>
    )
  const joined = state.joinedHubs.includes(id)
  return (
    <Button
      className="pg-green"
      onClick={() => {
        setState((prev) => ({ ...prev, joinedHubs: toggleItem(prev.joinedHubs, id) }))
        toast.success(joined ? `Left ${title}` : `Joined ${title} · demo membership`)
      }}
    >
      {joined ? <Check size={16} /> : null}
      {joined ? 'Joined · Leave group' : 'Join'}
    </Button>
  )
}

function GameSession({
  open,
  onOpenChange,
  title,
  banner,
  id,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  banner: string
  id: string
}) {
  const { state, setState } = useDemo()
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Simulated game session. No game executable has been started."
    >
      <img
        className="pg-session-cover"
        src={assetUrl(banner)}
        alt={title}
        width={480}
        height={200}
      />
      <p className="pg-session-copy">
        Install the desktop app and add a local executable to launch a game you own. Catalog
        installs and play sessions here are mocks.
      </p>
      <div className="pg-session-actions">
        <Button
          variant="secondary"
          onClick={() => {
            setState((prev) => ({ ...prev, installed: toggleItem(prev.installed, id) }))
            toast.success('Demo library updated — no game files downloaded')
          }}
        >
          <Download />
          {state.installed.includes(id) ? 'Remove from demo library' : 'Add to demo library'}
        </Button>
        <Button
          variant="outline"
          aria-label={`Favorite ${title}`}
          aria-pressed={state.favorites.includes(id)}
          onClick={() =>
            setState((prev) => ({ ...prev, favorites: toggleItem(prev.favorites, id) }))
          }
        >
          <Heart />
          Favorite
        </Button>
        <Button onClick={() => onOpenChange(false)}>End demo session</Button>
      </div>
    </Modal>
  )
}
