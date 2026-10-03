import { describe, expect, it } from 'vitest'
import { createInitialState, filterGames, parseState, stateSchema, toggleItem } from './index'

describe('versioned demo persistence', () => {
  it('preserves edited content, joins, and preferences across a JSON roundtrip', () => {
    const state = createInitialState()
    state.profile.name = 'New explorer'
    state.joinedEvents = ['containment']
    state.posts[0].comments.push({
      id: 'my-comment',
      author: 'New explorer',
      text: 'See you there!',
    })
    state.settings.reducedMotion = true
    expect(parseState(JSON.stringify(state))).toEqual(state)
  })
  it.each([null, '{broken', '{"version":999}', '{"version":1,"profile":null}'])(
    'recovers invalid storage %s',
    (raw) => {
      expect(parseState(raw)).toEqual(createInitialState())
    },
  )
  it('rejects incompatible backups and invalid display names', () => {
    expect(stateSchema.safeParse({ ...createInitialState(), version: 2 }).success).toBe(false)
    const state = createInitialState()
    state.profile.name = ''
    expect(stateSchema.safeParse(state).success).toBe(false)
  })
})
describe('library filtering', () => {
  it('combines query, genre, and favorite filters without altering the library', () => {
    const state = createInitialState()
    expect(filterGames('ELDEN', 'Favorites', 'RPG', state).map((game) => game.id)).toEqual([
      'elden',
    ])
    expect(filterGames('SCP', 'Favorites', 'RPG', state)).toEqual([])
    expect(filterGames('', 'Installed', 'All genres', state)).toHaveLength(3)
  })
  it('toggles membership without duplicates or mutating existing state', () => {
    const initial = ['scp']
    expect(toggleItem(initial, 'elden')).toEqual(['scp', 'elden'])
    expect(toggleItem(initial, 'scp')).toEqual([])
    expect(initial).toEqual(['scp'])
  })
})
