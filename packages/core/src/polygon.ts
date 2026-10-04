import { z } from 'zod'

export const moduleIds = ['news', 'events', 'chat', 'servers'] as const

export const polygonDefaults = () => ({
  cover: '/media/polygon/profile-banner.webp',
  avatar: '/media/polygon/profile-avatar.webp',
  showGames: true,
  showGroups: true,
  showFriends: true,
  modules: [...moduleIds],
  channels: {} as Record<string, { id: string; text: string; author: string; time: string }[]>,
  favoriteServers: [] as string[],
  connectedServer: null as string | null,
})
export const polygonStateSchema = z
  .object({
    cover: z.string().max(600000),
    avatar: z.string().max(600000),
    showGames: z.boolean(),
    showGroups: z.boolean(),
    showFriends: z.boolean(),
    modules: z.array(z.enum(['news', 'events', 'chat', 'servers'])),
    channels: z.record(
      z.string(),
      z.array(
        z.object({
          id: z.string(),
          text: z.string().max(2000),
          author: z.string(),
          time: z.string(),
        }),
      ),
    ),
    favoriteServers: z.array(z.string()),
    connectedServer: z.string().nullable(),
  })
  .default(polygonDefaults)

export type DiscoveryItem = {
  id: string
  name: string
  description: string
  image: string
  genre: string
  tags: string[]
  members?: number
  online?: number
}
export const discoveryGames: DiscoveryItem[] = [
  {
    id: 'skyrim',
    name: 'The Elder Scrolls V: Skyrim',
    description:
      'Experience the awe-inspiring world of Skyrim, where dragons roam and destiny awaits. Embrace your role as the Dragonborn, harness the power of Thu’um, and unravel the mysteries of a land brimming with adventure.',
    image: 'skyrim',
    genre: 'RPG',
    tags: ['Open world', 'RPG'],
  },
  {
    id: 'skeletal',
    name: 'Skeletal Avenger',
    description:
      'Embark on a bone-chilling quest for vengeance as a skull-hurling skeletal warrior.',
    image: 'skeletal',
    genre: 'Action',
    tags: ['Rogue like', 'Hack and Slash'],
  },
  {
    id: 'outlast',
    name: 'The Outlast Trials',
    description:
      'Red Barrels invites you to experience mind-numbing terror, this time with friends. Whether you go through the trials alone or in teams, survive together.',
    image: 'outlast',
    genre: 'Horror',
    tags: ['Survival Horror', 'Co-op'],
  },
  {
    id: 'darklight',
    name: 'Dark Light',
    description: 'Dark Light is a post-apocalyptic cyberpunk action platformer.',
    image: 'darklight',
    genre: 'Action',
    tags: ['Action', 'Souls-Like'],
  },
  {
    id: 'aliens',
    name: 'Aliens: Dark Descent',
    description:
      'Drop into the gripping journey of Aliens: Dark Descent. Lead your squad and face a new Xenomorph outbreak.',
    image: 'aliens',
    genre: 'Strategy',
    tags: ['Action', 'Strategy'],
  },
  {
    id: 'diablo',
    name: 'Diablo IV',
    description:
      'Return to Sanctuary. Explore a dark open world and stand against Lilith with your party.',
    image: 'diablo-banner',
    genre: 'RPG',
    tags: ['RPG', 'Co-op'],
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    description:
      'Build something extraordinary. Explore, create, and share a world with your friends.',
    image: 'minecraft',
    genre: 'Adventure',
    tags: ['Sandbox', 'Adventure'],
  },
]
export const discoveryGroups: DiscoveryItem[] = [
  {
    id: 'tower',
    name: 'Tower of Fantasy Guild',
    description:
      'Tower of Fantasy is getting players from all over the world making their way to its servers. Join a guild and explore everything that the world has to offer.',
    image: 'tower',
    genre: 'RPG',
    tags: ['RPG', 'Community'],
    members: 92233,
    online: 45586,
  },
  {
    id: 'guild',
    name: 'Guild Starter',
    description: 'Embark on a legendary journey! Become the ultimate guild master in good company.',
    image: 'guild',
    genre: 'Community',
    tags: ['Community'],
    members: 48516,
    online: 22533,
  },
  {
    id: 'gameon',
    name: 'Game On',
    description:
      'Prepare for the ultimate gaming experience. Get your controllers ready and join a world where skill, strategy, and thrill collide.',
    image: 'gameon',
    genre: 'Action',
    tags: ['Action'],
    members: 41728,
    online: 39425,
  },
  {
    id: 'honor',
    name: 'Descendants of Honor',
    description: 'Descendants Honor awaits you. Step into a realm where honor is earned together.',
    image: 'honor',
    genre: 'RPG',
    tags: ['RPG'],
    members: 30435,
    online: 21527,
  },
  {
    id: 'vault',
    name: 'VAULT',
    description: 'A place for your games, your friends, and your next story.',
    image: 'vault-banner',
    genre: 'Community',
    tags: ['Community'],
    members: 2400,
    online: 148,
  },
  {
    id: 'scp',
    name: 'The Foundation',
    description: 'Your original SCP community, now at home in Polygon.',
    image: 'event',
    genre: 'Horror',
    tags: ['Horror', 'Community'],
    members: 2400,
    online: 124,
  },
  {
    id: 'rpg',
    name: 'Side Quest Society',
    description: 'RPGs, open worlds, and one more side quest with your people.',
    image: 'skyrim',
    genre: 'RPG',
    tags: ['RPG', 'Open world'],
    members: 8100,
    online: 286,
  },
  {
    id: 'indie',
    name: 'Indie After Hours',
    description: 'Small games, big ideas. Discover something unexpected together.',
    image: 'skeletal',
    genre: 'Adventure',
    tags: ['Indie', 'Adventure'],
    members: 1800,
    online: 87,
  },
]
export const newsItems = [
  {
    id: 'frontier',
    title: 'Strategic Warfare: Frontier Assault',
    date: '19.06.2026',
    image: 'warfare-thumb',
    banner: 'warfare',
    author: 'VAULT',
    tags: ['Action', 'Strategy', 'Co-op'],
    body: 'Prepare to embark on an epic journey filled with strategic battles, heart-pounding action, and thrilling conquests in the highly anticipated game “Strategic Warfare: Frontier Assault.” Assemble your elite army, craft meticulous battle strategies, and lead your faction to victory in a war-torn world.',
  },
  {
    id: 'sanctuary',
    title: 'Diablo IV: A new chapter in Sanctuary',
    date: '18.06.2026',
    image: 'diablo-avatar',
    banner: 'diablo-banner',
    author: 'Diablo IV',
    tags: ['RPG', 'Update'],
    body: 'A new chapter awaits in Sanctuary. Gather your party, discover new builds, and venture into the darkness. Share your favorite moments with the community and find a group for your next dungeon.',
  },
  {
    id: 'trial',
    title: 'The trials are better with friends',
    date: '17.06.2026',
    image: 'outlast',
    banner: 'outlast',
    author: 'Game On',
    tags: ['Horror', 'Co-op'],
    body: 'It’s time to face the trials together. Join this week’s community session, meet your squad, and see how long you can survive. New players are welcome.',
  },
  {
    id: 'dragonborn',
    title: 'Legends of the Dovahkiin',
    date: '16.06.2026',
    image: 'skyrim',
    banner: 'skyrim',
    author: 'Guild Starter',
    tags: ['RPG', 'Open world'],
    body: 'There is always another path to explore. Return to Skyrim and share your adventures, favorite mods, and discoveries with fellow Dragonborn.',
  },
  {
    id: 'bones',
    title: 'A bone-chilling adventure begins',
    date: '15.06.2026',
    image: 'skeletal',
    banner: 'skeletal',
    author: 'VAULT',
    tags: ['Action', 'Rogue like'],
    body: 'Pick up your sword and join the adventure. Explore new dungeons and trade tips for your next run with the community.',
  },
]
export const communityEvents = [
  {
    id: 'containment',
    title: 'SCP: Anomaly Breakout',
    day: 'Friday',
    date: '09 October 2026',
    time: '18:45 – 20:15 UTC',
    image: 'event',
    game: 'SCP: Secret Laboratory',
    body: 'Join us in an immersive gaming event where you take on the role of a Foundation operative tasked with containing and securing dangerous SCP anomalies. Explore a simulated facility filled with mind-bending creatures, supernatural phenomena, and mysterious artifacts. Engage in intense cooperative gameplay as you work together with other players to prevent catastrophic breaches and protect humanity from the unknown. Uncover the secrets behind each anomaly, unlock new abilities, and strategize your approach to ensure the survival of the Foundation.',
  },
  {
    id: 'nightcity',
    title: 'Night City photo walk',
    day: 'Sunday',
    date: '11 October 2026',
    time: '18:00 – 19:30 UTC',
    image: 'warfare',
    game: 'Cyberpunk 2077',
    body: 'Share your favorite corners of Night City. Join a relaxed virtual photography challenge and meet fellow explorers. Bring your best captures and your favorite stories.',
  },
  {
    id: 'tarnished',
    title: 'The Tarnished gather',
    day: 'Friday',
    date: '16 October 2026',
    time: '19:00 – 21:00 UTC',
    image: 'skyrim',
    game: 'Elden Ring',
    body: 'Co-op bosses, build discussions, and a little friendly competition. Find your next party and explore the Lands Between together.',
  },
]
export const serverGames = [
  { id: 'scp', name: 'SCP: Secret Laboratory', image: 'scp', players: 24 },
  { id: 'minecraft', name: 'Minecraft', image: 'minecraft', players: 33 },
  { id: 'diablo', name: 'Diablo IV', image: 'diablo-avatar', players: 18 },
]
export const demoServers = Array.from({ length: 11 }, (_, index) => ({
  id: `server-${index + 1}`,
  name:
    ['Frontier Assault', 'The Foundation', 'After Hours', 'Community Playground'][index % 4] +
    ` #${index + 1}`,
  address: `192.0.2.${index + 10}:7777`,
  players: [24, 16, 0, 32, 8, 12, 4, 19, 28, 0, 6][index],
  slots: 100,
  region: index % 2 ? 'US East' : 'Europe',
  ping: 24 + index * 7,
}))
