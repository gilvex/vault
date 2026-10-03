import { test, expect } from '@playwright/test'

test('profile feed loads local design assets without runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'guiltyplayer', exact: true })).toBeVisible()
  await expect(page.getByRole('img', { name: /unexpected encounter/ })).toBeVisible()
  expect(
    await page
      .getByRole('img', { name: /unexpected encounter/ })
      .evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0)
  await page.screenshot({ path: 'test-results/vault-desktop.png', fullPage: true })
  expect(errors).toEqual([])
})

test('post creation, likes, comments, and saved filters persist across reloads', async ({
  page,
}) => {
  await page.goto('./')
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

test('library search and favorites combine correctly', async ({ page }) => {
  await page.goto('./#/games')
  await page.getByRole('textbox', { name: 'Search games', exact: true }).fill('Hollow')
  await expect(page.locator('.library-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Favorite Hollow Knight' }).click()
  await page.getByRole('textbox', { name: 'Search games', exact: true }).fill('')
  await page.getByRole('button', { name: 'Favorites', exact: true }).click()
  await expect(page.locator('.library-card')).toHaveCount(3)
  await page.getByLabel('Filter game genre').selectOption('Adventure')
  await expect(page.locator('.library-card')).toHaveCount(1)
  await page.getByRole('link', { name: 'View Hollow Knight', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Hollow Knight', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Add to demo library', exact: true }).click()
  await page.getByRole('button', { name: 'Play demo session', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('simulated game session')
})

test('event RSVPs and collectible showcases are interactive', async ({ page }) => {
  await page.goto('./#/profile/events')
  await page.getByRole('button', { name: 'Join event', exact: true }).first().click()
  await page.getByRole('button', { name: 'All events', exact: true }).click()
  await expect(page.locator('.event-card')).toHaveCount(1)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Going · Leave event' })).toHaveCount(1)
  await page.getByRole('link', { name: 'Cards', exact: false }).click()
  await page.getByLabel('Card rarity').selectOption('Rare')
  await expect(page.locator('.collectible')).toHaveCount(1)
  await page.locator('.collectible').click()
  await page.getByRole('button', { name: 'Add to showcase' }).click()
  await expect(page.getByRole('button', { name: 'Remove from showcase' })).toBeVisible()
})

test('edit profile, demo chat, and data export work', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Edit profile' }).click()
  await page.getByLabel('Display name').fill('Test explorer')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('heading', { name: 'Test explorer' })).toBeVisible()
  await page.getByRole('button', { name: /nova.exe Cyberpunk/ }).click()
  await page.getByRole('textbox', { name: 'Message friend' }).fill('Are you playing tonight?')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('log')).toContainText('Are you playing tonight?')
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup' }).click()
  expect((await download).suggestedFilename()).toBe('vault-demo-backup.json')
})

test('all sections navigate and unknown routes recover', async ({ page }) => {
  for (const route of [
    'home',
    'topics',
    'profile/awards',
    'profile/statistics',
    'download',
    'unknown',
  ]) {
    await page.goto(`./#/${route}`)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.getByText('Let’s try that again.')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('mobile navigation and profile stay within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('button', { name: /nova.exe Cyberpunk/ })).toBeVisible()
  await page.getByRole('button', { name: 'Close sidebar', exact: true }).click()
  await page.getByRole('link', { name: 'Cards', exact: false }).click()
  await expect(page.locator('.collectible')).toHaveCount(6)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/vault-mobile.png', fullPage: true })
})

test('invalid backups show an error and preserve the current workspace', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await page.getByLabel('Restore backup file').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":999}'),
  })
  await expect(page.getByText(/Invalid backup/)).toBeVisible()
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await expect(page.getByRole('heading', { name: 'guiltyplayer', exact: true })).toBeVisible()
})

test('reduced motion uses local still artwork with correct collectible names', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./#/profile/cards')
  const card = page.getByRole('img', { name: 'Goku Black Rosé collectible', exact: true })
  await expect(card).toHaveAttribute(
    'src',
    new URL('media/rose-still.webp', test.info().project.use.baseURL).pathname,
  )
  await expect(card).toBeVisible()
  await expect
    .poll(() => card.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0)
})

test('download page resolves a release manifest to a real download link', async ({ page }) => {
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
  await expect(page.getByRole('link', { name: 'Download for Windows' })).toHaveAttribute(
    'download',
    '',
  )
})

test('banner and branding resolve below the configured hosting path', async ({ page, request }) => {
  await page.goto('./')
  const baseURL = test.info().project.use.baseURL!
  const bannerURL = new URL('media/profile-banner.webp', baseURL)
  const logoURL = new URL('vault.svg', baseURL)
  await expect(page.locator('.profile-banner')).toHaveCSS(
    'background-image',
    `url("${bannerURL.href}")`,
  )
  expect((await request.get(bannerURL.href)).status()).toBe(200)
  await expect(page.locator('.brand img')).toHaveAttribute('src', logoURL.pathname)
  expect((await request.get(logoURL.href)).status()).toBe(200)
})
