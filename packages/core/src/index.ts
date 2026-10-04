import { z } from 'zod'
import { polygonDefaults, polygonStateSchema } from './polygon'
export * from './polygon'

export type Presence = 'playing' | 'online' | 'dnd' | 'offline'
export type Friend = {
  id: string
  name: string
  status: Presence
  game?: string
  color: string
  initials: string
}
export const friends: Friend[] = [
  {
    id: 'nova',
    name: 'nova.exe',
    status: 'playing',
    game: 'Cyberpunk 2077',
    color: '#ae74cf',
    initials: 'NV',
  },
  {
    id: 'ghost',
    name: 'ghost',
    status: 'playing',
    game: 'SCP: Secret Laboratory',
    color: '#789a95',
    initials: 'GH',
  },
  {
    id: 'yuki',
    name: 'yuki',
    status: 'playing',
    game: 'Elden Ring',
    color: '#a288cc',
    initials: 'YK',
  },
  {
    id: 'alex',
    name: 'Alex',
    status: 'playing',
    game: 'Counter-Strike 2',
    color: '#ca9970',
    initials: 'AX',
  },
  { id: 'luna', name: 'luna', status: 'online', color: '#b77e9f', initials: 'LN' },
  { id: 'pixel', name: 'pixel', status: 'online', color: '#82a1c7', initials: 'PX' },
  { id: 'kai', name: 'kai', status: 'online', color: '#aea080', initials: 'KI' },
  { id: 'raven', name: 'raven', status: 'dnd', color: '#8975b6', initials: 'RV' },
  { id: 'ember', name: 'ember', status: 'offline', color: '#b1826a', initials: 'EM' },
  { id: 'zero', name: 'zero', status: 'offline', color: '#6d819b', initials: 'ZR' },
]

export const games = [
  {
    id: 'scp',
    name: 'SCP: Secret Laboratory',
    genre: 'Horror',
    hours: 128,
    size: '8.4 GB',
    score: 92,
    color: '#66877a',
    art: 'scp',
    description:
      'Deep within the SCP Foundation, a containment breach turns an ordinary night into a fight for survival. Trust no one. Escape together.',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    genre: 'RPG',
    hours: 86,
    size: '72 GB',
    score: 94,
    color: '#d9ce4e',
    art: 'cyberpunk',
    description:
      'Become an urban mercenary in Night City, a sprawling metropolis obsessed with power, glamour and body modification.',
  },
  {
    id: 'elden',
    name: 'Elden Ring',
    genre: 'RPG',
    hours: 214,
    size: '60 GB',
    score: 96,
    color: '#c4ae77',
    art: 'elden',
    description:
      'Rise, Tarnished. Explore the Lands Between, discover its secrets, and find your own path to become an Elden Lord.',
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    genre: 'Shooter',
    hours: 342,
    size: '39 GB',
    score: 88,
    color: '#d69856',
    art: 'cs2',
    description:
      'One team. One objective. The next chapter of the legendary competitive tactical shooter.',
  },
  {
    id: 'hollow',
    name: 'Hollow Knight',
    genre: 'Adventure',
    hours: 47,
    size: '9 GB',
    score: 97,
    color: '#a5bdd7',
    art: 'hollow',
    description:
      'Descend into the haunting, beautiful world of Hallownest. Forge your own path through a vast, ruined kingdom.',
  },
  {
    id: 'hades',
    name: 'Hades II',
    genre: 'Action',
    hours: 32,
    size: '10 GB',
    score: 95,
    color: '#b96c78',
    art: 'hades',
    description:
      'Battle beyond the Underworld as the immortal Princess of the Underworld in a bewitching rogue-like adventure.',
  },
]
export type Game = (typeof games)[number]

export const cards = [
  {
    id: 'vegito',
    name: 'Vegito Blue',
    universe: 'Dragon Ball Super',
    rarity: 'Legendary',
    color: '#33b1ff',
    image: '/media/vegito.webp',
    number: '001',
  },
  {
    id: 'rose',
    name: 'Goku Black Rosé',
    universe: 'Dragon Ball Super',
    rarity: 'Epic',
    color: '#ec74c4',
    image: '/media/rose.webp',
    number: '024',
  },
  {
    id: 'broly',
    name: 'Broly',
    universe: 'Dragon Ball Super',
    rarity: 'Legendary',
    color: '#6fdc8c',
    image: '/media/broly.webp',
    number: '008',
  },
  {
    id: 'zamasu',
    name: 'Fused Zamasu',
    universe: 'Dragon Ball Super',
    rarity: 'Rare',
    color: '#f1c21b',
    image: '/media/zamasu.webp',
    number: '042',
  },
  {
    id: 'gohan',
    name: 'Son Gohan',
    universe: 'Dragon Ball Z',
    rarity: 'Epic',
    color: '#be95ff',
    image: '/media/gohan.webp',
    number: '016',
  },
  {
    id: 'beerus',
    name: 'Beerus',
    universe: 'Dragon Ball Super',
    rarity: 'Legendary',
    color: '#ae7cff',
    image: '/media/beerus.webp',
    number: '003',
  },
]
export type Collectible = (typeof cards)[number]
export const events = [
  {
    id: 'containment',
    title: 'Containment breach',
    game: 'SCP: Secret Laboratory',
    date: 'OCT 09',
    time: 'Friday · 20:00 UTC',
    attendees: 24,
    color: '#7daa91',
    description:
      'A community game night. Bring your squad, keep your eyes open, and try to make it out alive.',
  },
  {
    id: 'nightcity',
    title: 'Night City photo walk',
    game: 'Cyberpunk 2077',
    date: 'OCT 11',
    time: 'Sunday · 18:00 UTC',
    attendees: 68,
    color: '#d9ce4e',
    description:
      'Share your favorite corners of Night City. A relaxed virtual photography challenge for everyone.',
  },
  {
    id: 'tarnished',
    title: 'The Tarnished gather',
    game: 'Elden Ring',
    date: 'OCT 16',
    time: 'Friday · 19:00 UTC',
    attendees: 42,
    color: '#c4ae77',
    description:
      'Co-op bosses, build discussions, and a little friendly competition in the Lands Between.',
  },
]
export const hubs = [
  {
    id: 'scp',
    name: 'The Foundation',
    topic: 'SCP: Secret Laboratory',
    members: '2.4k',
    initials: 'SCP',
    color: '#7daa91',
  },
  {
    id: 'rpg',
    name: 'Side Quest Society',
    topic: 'RPGs & open worlds',
    members: '8.1k',
    initials: 'SQ',
    color: '#be95ff',
  },
  {
    id: 'indie',
    name: 'Indie After Hours',
    topic: 'Small games, big ideas',
    members: '1.8k',
    initials: 'IA',
    color: '#82cfff',
  },
]

const postSchema = z.object({
  id: z.string(),
  author: z.string(),
  title: z.string().min(1).max(140),
  body: z.string().max(3000),
  image: z.string().optional(),
  tag: z.string(),
  time: z.string(),
  likes: z.number(),
  comments: z.array(z.object({ id: z.string(), author: z.string(), text: z.string().max(1000) })),
})
export type Post = z.infer<typeof postSchema>
export const stateSchema = z.object({
  version: z.literal(1),
  profile: z.object({
    name: z.string().min(1).max(30),
    bio: z.string().max(160),
    status: z.enum(['playing', 'online', 'dnd', 'offline']),
  }),
  posts: z.array(postSchema),
  liked: z.array(z.string()),
  saved: z.array(z.string()),
  favorites: z.array(z.string()),
  installed: z.array(z.string()),
  joinedEvents: z.array(z.string()),
  joinedHubs: z.array(z.string()),
  showcased: z.array(z.string()),
  messages: z.record(
    z.string(),
    z.array(z.object({ id: z.string(), from: z.enum(['me', 'friend']), text: z.string() })),
  ),
  settings: z.object({ notifications: z.boolean(), reducedMotion: z.boolean() }),
  polygon: polygonStateSchema,
})
export type DemoState = z.infer<typeof stateSchema>
export function createInitialState(): DemoState {
  return {
    version: 1,
    profile: { name: 'guiltyplayer', bio: 'One more game. One more story.', status: 'online' },
    posts: [
      {
        id: 'first',
        author: 'guiltyplayer',
        title: 'Okay, that was the scariest thing I’ve ever played.',
        body: 'Last night’s containment breach was something else. Turned a corner, met this guy, and immediately forgot every survival tip I knew. Same time next Friday?',
        image: '/media/scp-moment.webp',
        tag: 'SCP: Secret Laboratory',
        time: '2 hours ago',
        likes: 452,
        comments: [
          {
            id: 'c1',
            author: 'ghost',
            text: 'The way we all went silent at the exact same time 💀',
          },
          { id: 'c2', author: 'nova.exe', text: 'Already counting down to the next one.' },
        ],
      },
      {
        id: 'second',
        author: 'nova.exe',
        title: 'There’s no place quite like Night City.',
        body: '86 hours in and I’m still finding new corners of this city. What’s your favorite place to just stop and take it all in?',
        tag: 'Cyberpunk 2077',
        time: '5 hours ago',
        likes: 128,
        comments: [],
      },
    ],
    liked: [],
    saved: [],
    favorites: ['scp', 'elden'],
    installed: ['scp', 'cyberpunk', 'elden'],
    joinedEvents: [],
    joinedHubs: ['scp'],
    showcased: ['vegito'],
    messages: {},
    settings: { notifications: true, reducedMotion: false },
    polygon: polygonDefaults(),
  }
}
export function parseState(raw: string | null): DemoState {
  if (!raw) return createInitialState()
  try {
    return stateSchema.parse(JSON.parse(raw))
  } catch {
    return createInitialState()
  }
}
export function toggleItem(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
}
export function filterGames(
  query: string,
  category: string,
  genre: string,
  state: Pick<DemoState, 'favorites' | 'installed'>,
): Game[] {
  return games.filter(
    (game) =>
      game.name.toLowerCase().includes(query.toLowerCase()) &&
      (genre === 'All genres' || game.genre === genre) &&
      (category !== 'Favorites' || state.favorites.includes(game.id)) &&
      (category !== 'Installed' || state.installed.includes(game.id)),
  )
}
