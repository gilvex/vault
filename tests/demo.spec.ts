import { test, expect } from '@playwright/test'
import { createInitialState } from '../packages/core/src/index'

test('Polygon home renders the four Figma modules and local imagery', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Polygon community home' })).toBeAttached()
  for (const name of ['News', 'Events', 'Chats', 'Servers'])
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
  const thumbnail = page.locator('.pg-news-item.active img')
  await expect
    .poll(() => thumbnail.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0)
  await expect(page.getByRole('link', { name: 'Polygon home' })).toBeVisible()
  expect(errors).toEqual([])
})

test('post creation, comments, likes, and saved filters still persist', async ({ page }) => {
  await page.goto('./#/profile/activity')
  await page.getByRole('button', { name: 'Create post' }).click()
  await page.getByLabel('Title', { exact: true }).fill('A memorable game night')
  await page.getByLabel('Your story').fill('Made it out of the facility with the whole squad.')
  await page.getByRole('button', { name: 'Publish post' }).click()
  const post = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'A memorable game night' }) })
  await post.getByRole('button', { name: 'Like post: A memorable game night' }).click()
  await post.getByRole('button', { name: 'Save post', exact: true }).click()
  await post.getByRole('button', { name: /Comments/ }).click()
  await post.getByRole('textbox', { name: 'Write a comment' }).fill('Let’s do it again!')
  await post.getByRole('button', { name: 'Send comment' }).click()
  await expect(post.getByText('Let’s do it again!')).toBeVisible()
  await page.reload()
  await page.getByLabel('Filter activity').selectOption('Saved posts')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(
    page.getByRole('button', { name: 'Like post: A memorable game night' }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('browse search, favorites, filters, and simulated play work', async ({ page }) => {
  await page.goto('./#/browse/games')
  await page.getByRole('textbox', { name: 'Search games', exact: true }).fill('Hollow')
  await expect(page.locator('.pg-discovery-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Favorite Hollow Knight' }).click()
  await page.getByRole('textbox', { name: 'Search games', exact: true }).fill('')
  await page.getByRole('button', { name: 'Filter', exact: true }).click()
  await page.getByRole('button', { name: 'Favorites', exact: true }).click()
  await expect(page.locator('.pg-discovery-card')).toHaveCount(3)
  await page.getByLabel('Filter game genre').selectOption('Adventure')
  await expect(page.locator('.pg-discovery-card')).toHaveCount(1)
  await page.getByRole('link', { name: 'View Hollow Knight', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Hollow Knight', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Play demo', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('Simulated game session')
  await page.getByRole('button', { name: 'Add to demo library', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Remove from demo library' })).toBeVisible()
})

test('event RSVPs and collectible showcases survive reloads', async ({ page }) => {
  await page.goto('./#/profile/events')
  await page.getByRole('button', { name: 'Join event', exact: true }).click()
  await page.getByRole('button', { name: 'All events', exact: true }).click()
  await expect(page.locator('.pg-event-item')).toHaveCount(1)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Going · Leave event' })).toBeVisible()
  await page.getByRole('link', { name: 'Cards', exact: true }).click()
  await page.getByLabel('Card rarity').selectOption('Rare')
  await expect(page.locator('.collectible')).toHaveCount(1)
  await page.locator('.collectible').click()
  await page.getByRole('button', { name: 'Add to showcase' }).click()
  await expect(page.getByRole('button', { name: 'Remove from showcase' })).toBeVisible()
})

test('full-page profile settings, friend chat, and backup export work', async ({ page }) => {
  await page.goto('./#/profile/news')
  await page.getByRole('link', { name: 'Edit profile' }).click()
  await page.getByLabel('Display name').fill('Test explorer')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await page.getByRole('link', { name: 'Back to profile' }).click()
  await expect(page.getByRole('heading', { name: 'Test explorer', exact: true })).toBeVisible()
  await page.getByRole('button', { name: /nova.exe Cyberpunk/ }).click()
  await page.getByRole('textbox', { name: 'Message friend' }).fill('Are you playing tonight?')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(page.getByRole('log')).toContainText('Are you playing tonight?')
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.getByRole('link', { name: 'Settings', exact: true }).click()
  await page.getByRole('button', { name: 'Data & preferences' }).click()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup' }).click()
  expect((await download).suggestedFilename()).toBe('vault-demo-backup.json')
})

test('all redesigned screens navigate without overflow or runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const route of [
    'home/overview',
    'browse/groups',
    'browse/users',
    'games/diablo/news',
    'groups/vault/news',
    'profile/layout',
    'profile/servers',
    'profile/awards',
    'profile/statistics',
    'settings/sidepanel',
    'download',
    'unknown',
  ]) {
    await page.goto(`./#/${route}`)
    await expect(page.locator('main')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  expect(errors).toEqual([])
})

test('mobile navigation supports Escape and preserves access to collections', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./#/profile/news')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('button', { name: /nova.exe Cyberpunk/ })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused()
  await page.getByRole('link', { name: 'Cards', exact: true }).click()
  await expect(page.locator('.collectible')).toHaveCount(6)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('invalid backups preserve the current workspace', async ({ page }) => {
  await page.goto('./#/settings/cover')
  await page.getByRole('button', { name: 'Data & preferences' }).click()
  await page.getByLabel('Restore backup file').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":999}'),
  })
  await expect(page.getByText(/Invalid backup/)).toBeVisible()
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.getByRole('link', { name: 'Back to profile' }).click()
  await expect(page.getByRole('heading', { name: 'guiltyplayer', exact: true })).toBeVisible()
})

test('reduced motion uses local still collectible artwork', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./#/profile/cards')
  const card = page.getByRole('img', { name: 'Goku Black Rosé collectible', exact: true })
  await expect(card).toHaveAttribute(
    'src',
    new URL('media/rose-still.webp', test.info().project.use.baseURL).pathname,
  )
  await expect
    .poll(() => card.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0)
})

test('download manifest resolves portable installer links', async ({ page }) => {
  await page.route('**/downloads/manifest.local.json', (route) =>
    route.fulfill({
      json: {
        assets: [{ name: 'Vault-test.exe', platform: 'windows', url: '/downloads/Vault-test.exe' }],
      },
    }),
  )
  await page.goto('./#/download')
  await expect(page.getByRole('link', { name: 'Download for Windows' })).toHaveAttribute(
    'href',
    new URL('downloads/Vault-test.exe', test.info().project.use.baseURL).pathname,
  )
})

test('Polygon banner and artwork work below the configured hosting path', async ({
  page,
  request,
}) => {
  await page.goto('./#/profile/news')
  const bannerURL = new URL('media/polygon/profile-banner.webp', test.info().project.use.baseURL)
  await expect(page.locator('.pg-cover-banner')).toHaveAttribute('src', bannerURL.pathname)
  expect((await request.get(bannerURL.href)).status()).toBe(200)
  await expect(page.locator('.pg-brand svg')).toBeVisible()
})

test('channel messages are persistent and isolated by channel', async ({ page }) => {
  await page.goto('./#/profile/chat')
  await page
    .getByRole('textbox', { name: 'Channel message' })
    .fill('Meet at the Foundation at eight.')
  await page.getByRole('button', { name: 'Send channel message' }).click()
  await expect(page.getByRole('log')).toContainText('Meet at the Foundation at eight.')
  await page.getByRole('button', { name: 'General 11', exact: true }).click()
  await expect(page.getByRole('log')).not.toContainText('Meet at the Foundation at eight.')
  await page.reload()
  await expect(page.getByRole('log')).toContainText('Meet at the Foundation at eight.')
})

test('server selection, favorites, and connections are explicitly mocked', async ({ page }) => {
  await page.goto('./#/profile/servers')
  await page.getByRole('button', { name: 'Frontier Assault #1', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('does not contact a real game server')
  await page.getByRole('dialog').getByRole('button', { name: 'Favorite', exact: true }).click()
  await page.getByRole('button', { name: 'Join demo server', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Leave demo server' })).toBeVisible()
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.getByRole('button', { name: 'Favorites', exact: true }).click()
  await expect(page.locator('.pg-server-table tbody tr')).toHaveCount(1)
  await expect(page.locator('.pg-connected')).toHaveText('Demo joined')
})

test('group membership persists and browse links open the matching group', async ({ page }) => {
  await page.goto('./#/browse/groups')
  await page.getByRole('link', { name: 'View Guild Starter', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Guild Starter', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Join', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Joined · Leave group' })).toBeVisible()
})

test('cover selection and layout preferences persist', async ({ page }) => {
  await page.goto('./#/settings/cover')
  await page.getByRole('button', { name: 'Sanctuary', exact: true }).click()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await page.reload()
  await expect(page.locator('.pg-cover-banner')).toHaveAttribute('src', /diablo-banner.webp$/)
  await page.getByRole('link', { name: 'Showcase', exact: true }).click()
  await page.getByRole('switch', { name: 'Show news module' }).click()
  await page.getByRole('link', { name: 'View your layout' }).click()
  await expect(page.locator('.pg-showcase .pg-news')).toHaveCount(0)
  await expect(page.locator('.pg-showcase .pg-chat')).toBeVisible()
})

test('pre-redesign Vault data migrates without resetting saved content', async ({ page }) => {
  const { polygon: _polygon, ...legacy } = createInitialState()
  legacy.profile.name = 'Existing player'
  legacy.posts[0].title = 'Keep my existing adventure'
  await page.addInitScript(
    (data) => localStorage.setItem('vault.demo.v1', JSON.stringify(data)),
    legacy,
  )
  await page.goto('./#/profile/activity')
  await expect(page.getByRole('heading', { name: 'Existing player', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Keep my existing adventure' })).toBeVisible()
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('vault.demo.v1')!).polygon.modules),
  ).toEqual(['news', 'events', 'chat', 'servers'])
})

test('uploaded profile images are resized and persist after saving', async ({ page }) => {
  await page.goto('./#/settings/cover')
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 40
    canvas.height = 40
    const context = canvas.getContext('2d')!
    context.fillStyle = '#682cd3'
    context.fillRect(0, 0, 40, 40)
    return canvas.toDataURL('image/png').split(',')[1]
  })
  await page
    .getByLabel('Profile avatar file')
    .setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from(png, 'base64'),
    })
  await expect(page.locator('.pg-cover-avatar')).toHaveAttribute('src', /^data:image\/webp/)
  await page.getByRole('button', { name: 'Save changes' }).click()
  await page.reload()
  await expect(page.locator('.pg-cover-avatar')).toHaveAttribute('src', /^data:image\/webp/)
})

test('existing group memberships remain visible in My groups', async ({ page }) => {
  await page.goto('./#/browse/groups')
  await page.getByRole('button', { name: 'Filter', exact: true }).click()
  await page.getByRole('button', { name: 'My groups', exact: true }).click()
  await expect(page.locator('.pg-discovery-card')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'View The Foundation' })).toBeVisible()
})

test('compact green actions meet normal-text contrast on desktop and mobile', async ({ page }) => {
  for (const width of [1920, 390]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('./#/home/overview')
    const contrast = await page.getByRole('button', { name: 'Join event' }).evaluate(button => {
      const style = getComputedStyle(button)
      function luminance(color: string) {
        const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
          const normalized = value / 255
          return normalized <= .04045 ? normalized / 12.92 : ((normalized + .055) / 1.055) ** 2.4
        })
        return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722
      }
      const foreground = luminance(style.color), background = luminance(style.backgroundColor)
      return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05)
    })
    expect(contrast).toBeGreaterThanOrEqual(4.5)
  }
})
