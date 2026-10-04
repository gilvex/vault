import sharp from 'sharp'
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const source = path.join(root, 'apps/web/public/images/polygon')
const output = path.join(root, 'apps/web/public/media/polygon')
await mkdir(output, { recursive: true })
const files = (await readdir(source)).filter((file) => file.endsWith('.png'))
for (const file of files) {
  const width = /avatar|thumb|scp|minecraft/.test(file) ? 320 : 1600
  const image = sharp(path.join(source, file))
  if (file === 'profile-banner.png') image.rotate(270)
  if (file === 'vault-banner.png') image.extract({ left: 0, top: 84, width: 1920, height: 388 })
  const name = file.replace('.png', '.webp')
  await image
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(path.join(output, name))
  console.log(`Optimized ${name}`)
}
await writeFile(
  path.join(output, 'provenance.json'),
  JSON.stringify(
    {
      source: 'https://www.figma.com/design/19qInd2kXJwgHZX35Wzz9F/Polygon-Dev?node-id=0-1',
      kind: 'User-supplied Figma artwork, not generated',
      originals: 'apps/web/public/images/polygon',
      files: files.map((file) => file.replace('.png', '.webp')),
    },
    null,
    2,
  ) + '\n',
)
