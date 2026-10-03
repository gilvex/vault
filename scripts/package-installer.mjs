import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const bundle = path.join(root, 'apps/desktop/src-tauri/target/release/bundle')
const destination = path.join(root, 'apps/web/public/downloads')
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    ),
  )
  return nested.flat()
}
try {
  const files = await walk(bundle)
  const installers = files.filter((file) => /\.(exe|dmg|AppImage|deb)$/.test(file))
  if (!installers.length) throw new Error('No installer found. Run pnpm desktop:build first.')
  await mkdir(destination, { recursive: true })
  const assets = []
  for (const file of installers) {
    const name = path.basename(file)
    await copyFile(file, path.join(destination, name))
    assets.push({
      name,
      url: `/downloads/${encodeURIComponent(name)}`,
      platform: name.endsWith('.exe') ? 'windows' : name.endsWith('.dmg') ? 'macos' : 'linux',
    })
    console.log(`Packaged ${name}`)
  }
  await writeFile(
    path.join(destination, 'manifest.local.json'),
    JSON.stringify({ version: '0.1.0', assets }, null, 2) + '\n',
  )
  console.log('Downloads are ready. Run pnpm build to include them in the web output.')
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
