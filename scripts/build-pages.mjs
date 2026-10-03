import { spawnSync } from 'node:child_process'

// Use the invoking pnpm CLI so this works on Windows without shell quoting and on CI.
const result = spawnSync(
  process.execPath,
  [
    process.env.npm_execpath,
    '--filter',
    '@vault/web',
    'exec',
    'vite',
    'build',
    '--outDir',
    'dist-pages',
  ],
  {
    stdio: 'inherit',
    env: { ...process.env, VITE_BASE_PATH: process.env.VITE_BASE_PATH || '/vault/' },
  },
)
if (result.error) throw result.error
process.exitCode = result.status ?? 1
