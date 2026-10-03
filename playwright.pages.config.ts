import { defineConfig } from '@playwright/test'
import config from './playwright.config'

export default defineConfig({
  ...config,
  use: { ...config.use, baseURL: 'http://127.0.0.1:4174/vault/' },
  webServer: {
    command: 'pnpm preview:pages',
    url: 'http://127.0.0.1:4174/vault/',
    reuseExistingServer: false,
    timeout: 30000,
  },
})
