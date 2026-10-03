import { isTauri, invoke } from '@tauri-apps/api/core'

export const desktop = isTauri()
export type LocalGame = {
  id: string
  name: string
  path: string
  running: boolean
  seconds: number
}
export const native = {
  listGames: () => invoke<LocalGame[]>('list_local_games'),
  registerGame: () => invoke<LocalGame | null>('register_local_game'),
  launchGame: (id: string) => invoke<void>('launch_local_game', { id }),
  removeGame: (id: string) => invoke<void>('remove_local_game', { id }),
  exportBackup: (contents: string) => invoke<string | null>('export_backup', { contents }),
  systemInfo: () =>
    invoke<{ os: string; arch: string; version: string; dataDir: string }>('system_info'),
}
export function downloadJson(contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'vault-demo-backup.json'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
