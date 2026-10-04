import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const directory = fileURLToPath(new URL('../.impeccable/review/', import.meta.url))
await mkdir(directory, { recursive: true })
const browser = await chromium.launch()
const reports = []
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const cases = [
    ['home-1920', '/home/overview', 1920, 1080],
    ['profile-1920', '/profile/news', 1920, 1080],
    ['browse-games-1920', '/browse/games', 1920, 1080],
    ['browse-groups-1920', '/browse/groups', 1920, 1080],
    ['game-1920', '/games/diablo/news', 1920, 1080],
    ['group-1920', '/groups/vault/news', 1920, 1080],
    ['events-1920', '/profile/events', 1920, 1080],
    ['chat-1920', '/profile/chat', 1920, 1080],
    ['servers-1920', '/profile/servers', 1920, 1080],
    ['layout-1920', '/profile/layout', 1920, 1080],
    ['settings-1920', '/settings/cover', 1920, 1080],
    ['desktop', '/home/overview', 1440, 1080],
    ['profile-1440', '/profile/news', 1440, 1080],
    ['browse-1440', '/browse/games', 1440, 1080],
    ['mobile', '/home/overview', 390, 844],
    ['profile-mobile', '/profile/news', 390, 844],
    ['browse-mobile', '/browse/games', 390, 844],
    ['settings-mobile', '/settings/cover', 390, 844],
  ]
  for (const [name, route, width, height] of cases) {
    await page.setViewportSize({ width, height })
    await page.goto(`http://localhost:4173/#${route}`)
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(async () => {
      const visibleImages = [...document.images].filter((image) => {
        const box = image.getBoundingClientRect()
        return (
          box.width > 0 &&
          box.height > 0 &&
          box.top < innerHeight &&
          box.bottom > 0 &&
          box.left < innerWidth
        )
      })
      await Promise.race([
        Promise.all(visibleImages.map((image) => image.decode().catch(() => {}))),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ])
    })
    await page.screenshot({ path: `${directory}${name}.png`, fullPage: width === 390 })
    reports.push({
      name,
      route,
      width,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      errors: [...errors],
    })
  }
  await writeFile(`${directory}summary.json`, JSON.stringify(reports, null, 2))
  console.log(JSON.stringify(reports, null, 2))
} finally {
  await browser.close()
}
