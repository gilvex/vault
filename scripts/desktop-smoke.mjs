import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import assert from 'node:assert/strict'

// Windows WebView2 smoke test against the actual compiled Rust application.
// Uses an isolated WebView profile, and never opens dialogs or launches user games.
if (process.platform !== 'win32') throw new Error('This smoke test requires Windows WebView2.')
const root = fileURLToPath(new URL('..', import.meta.url))
const temporary = await mkdtemp(path.join(os.tmpdir(), 'vault-webview-smoke-'))
const app = spawn(path.join(root, 'apps/desktop/src-tauri/target/release/vault-desktop.exe'), [], {
  env: {
    ...process.env,
    WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: '--remote-debugging-port=9229',
    WEBVIEW2_USER_DATA_FOLDER: temporary,
  },
  stdio: 'ignore',
})
let browser
try {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      browser = await chromium.connectOverCDP('http://127.0.0.1:9229')
      break
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  assert.ok(browser, 'Could not connect to the running Tauri WebView')
  const context = browser.contexts()[0]
  const page = context.pages()[0] || (await context.waitForEvent('page'))
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.getByRole('link', { name: 'Profile', exact: true }).click()
  await page.getByRole('heading', { name: 'guiltyplayer', exact: true }).waitFor()
  const info = await page.evaluate(() => window.__TAURI_INTERNALS__.invoke('system_info'))
  assert.equal(info.os, 'windows')
  assert.equal(info.version, '0.1.0')
  console.log('Native Rust system_info:', JSON.stringify(info))
  const library = await page.evaluate(() => window.__TAURI_INTERNALS__.invoke('list_local_games'))
  assert.ok(Array.isArray(library))
  console.log('Native persistent library loaded:', library.length, 'registered games')
  const rejection = await page.evaluate(async () => {
    try {
      await window.__TAURI_INTERNALS__.invoke('launch_local_game', {
        id: 'unregistered-smoke-test-id',
      })
      return null
    } catch (error) {
      return String(error)
    }
  })
  assert.equal(rejection, 'This game is not registered.')
  await page.getByRole('link', { name: 'Browse', exact: true }).click()
  await page.getByRole('button', { name: 'Filter', exact: true }).click()
  await page.getByRole('button', { name: 'Local games', exact: true }).click()
  await page.getByRole('button', { name: 'Add local game' }).waitFor()
  await mkdir(path.join(root, 'test-results'), { recursive: true })
  await page.screenshot({ path: path.join(root, 'test-results/vault-native.png') })
  assert.deepEqual(errors, [])
  console.log(
    'PASS: real Tauri window, Rust IPC, local library UI, and unknown executable rejection.',
  )
} finally {
  if (browser) await browser.close()
  if (app.pid)
    await new Promise((resolve) => {
      const stop = spawn('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' })
      stop.on('close', resolve)
    })
  await new Promise((resolve) => setTimeout(resolve, 500))
  await rm(temporary, { recursive: true, force: true, maxRetries: 4, retryDelay: 400 })
}
