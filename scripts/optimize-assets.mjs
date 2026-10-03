import sharp from 'sharp'
import { mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const source = path.join(root, 'apps/web/public/images')
const output = path.join(root, 'apps/web/public/media')
await mkdir(output, { recursive: true })
const mappings = [
  ['card-vegito.gif', 'vegito'],
  ['card-rose.gif', 'gohan'],
  ['card-broly.gif', 'broly'],
  ['card-saber.gif', 'rose'],
  ['card-gohan.gif', 'beerus'],
  ['card-beerus.gif', 'zamasu'],
]
for (const [file, name] of mappings) {
  const input = path.join(source, file)
  const target = path.join(output, `${name}.webp`)
  await sharp(input, { animated: true, limitInputPixels: false })
    .resize({ width: 360 })
    .webp({ quality: 68, effort: 4 })
    .toFile(target)
  await sharp(input)
    .resize({ width: 360 })
    .webp({ quality: 80 })
    .toFile(path.join(output, `${name}-still.webp`))
  console.log(
    `${name}: ${((await stat(input)).size / 1048576).toFixed(1)} MB → ${((await stat(target)).size / 1048576).toFixed(1)} MB`,
  )
}
await sharp(path.join(source, 'profile-banner.png'))
  .extract({ left: 0, top: 1500, width: 2240, height: 500 })
  .resize({ width: 1800 })
  .webp({ quality: 85 })
  .toFile(path.join(output, 'profile-banner.webp'))
await sharp(path.join(source, 'avatar.png'))
  .resize({ width: 256 })
  .webp({ quality: 80 })
  .toFile(path.join(output, 'avatar.webp'))
await sharp(path.join(source, 'scp-moment.png'))
  .webp({ quality: 88 })
  .toFile(path.join(output, 'scp-moment.webp'))
console.log('Optimized local artwork and reduced-motion stills are ready.')
