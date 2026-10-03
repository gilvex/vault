# Vault

A playable, mock-backed gaming community for **web and native desktop**, built from the supplied Vault Figma designs. React 19, TypeScript, Tailwind 4, source-owned shadcn-style/Radix components adapted from Vagabond UI, and Tauri 2 + Rust.

**Web demo:** [gilvex.github.io/vault](https://gilvex.github.io/vault/) · **Repository:** [gilvex/vault](https://github.com/gilvex/vault)

## Run it

Requirements: Node 22+ and pnpm 10.10.0. Desktop development additionally requires [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and a current stable Rust toolchain.

```sh
pnpm install
pnpm dev
```

Open **http://localhost:1420**. The demo opens straight into the profile activity screen; no account or backend is needed.

```sh
pnpm desktop:dev             # native app + shared Vite dev server
pnpm build                  # production browser build → apps/web/dist
pnpm preview                # production browser preview → localhost:4173
pnpm desktop:build          # native executable and platform installers
```

On Windows, building only the NSIS installer is faster:

```sh
pnpm --filter @vault/desktop build --bundles nsis
```

Installer output: **`apps/desktop/src-tauri/target/release/bundle/nsis/Vault_0.1.0_x64-setup.exe`**.

To serve your locally built installer from the app’s **Get desktop** page:

```sh
pnpm package:installer
pnpm build
pnpm preview
```

Open **http://localhost:4173/#/download**. The packaging script copies available installers into `apps/web/public/downloads/` and writes their download manifest. Binary installers are git-ignored. Desktop builds exclude browser-distributed installers to avoid recursively embedding installers inside installers.

## What works

| Area                | Demo functionality                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| Profile             | Edit display name/bio, change presence, persistent local preferences                                            |
| Activity            | Create posts, attach the demo capture, like, comment, save/filter, copy share links                             |
| Friends             | Presence groups, search, collapsible sections, conversations with labeled automated replies                     |
| Events              | Join/leave seeded events, filter joined events                                                                  |
| Cards               | Original animated Figma artwork, search/rarity filters, detail dialogs, showcase toggles, reduced-motion stills |
| Awards & statistics | Seeded achievements, progress, playtime charts and time-range controls                                          |
| Games               | Search, genre/category filters, favorites, detail views, explicitly simulated install/play flows                |
| Hubs                | Discover communities, join/leave, filter memberships                                                            |
| Data                | Local persistence, validated JSON backup/restore, reset demo                                                    |
| Distribution        | Browser build, native installers, release-aware download page                                                   |

Community content, friendships, event counts, catalog installs, scores, XP and charts are **mock data**. There is no authentication, multiplayer server, real game download service, real messaging service, or cross-device sync. Web and desktop have separate local stores; backup/restore can transfer demo progress.

### Desktop-only functionality

Open **Games → Local games** inside the native app:

1. **Add local game** opens the OS file picker. Select an existing executable (`.exe` on Windows; an executable binary on Linux/macOS).
2. **Launch** starts the registered executable through Rust, using its own folder as the working directory. The frontend passes a registered ID, never a shell command.
3. Running state and elapsed playtime update every three seconds while this view is open. Accumulated playtime persists in the local library when a process ends or Vault exits normally.
4. Removing a library entry leaves the game files untouched.

On macOS, select the executable inside a game’s `.app/Contents/MacOS/` directory. App-bundle picking and store-launcher integration are future work. Tracking follows the directly spawned process; launchers that hand off to another process can end tracking early. Time after Vault closes, or since the last checkpoint following a crash, is not recorded.

**Settings → Export backup** uses a native save dialog on desktop. Settings also displays OS/architecture and the library data directory. The local library lives in Tauri’s app-data directory for `app.vault.demo` (`%APPDATA%\app.vault.demo` on Windows), separate from the community JSON backup. A previous library copy is retained for write recovery.

## Monorepo

```text
apps/
  web/                        Vite entrypoint, local artwork, production browser output
  desktop/
    src-tauri/                Rust commands, Tauri capabilities/config, native icons
packages/
  app/                        Shared React screens, platform adapter and persistence
  core/                       Typed mocks, validation, filtering, domain tests
  ui/                         Source-owned shadcn/Radix primitives and component config
scripts/
  optimize-assets.mjs         Figma exports → animated WebP + reduced-motion stills
  package-installer.mjs       Local installers → browser download manifest
  desktop-smoke.mjs           Real Windows WebView2 / Rust IPC smoke check
tests/                        Playwright browser flow tests
.github/workflows/            Checks, Vercel auto-deploy, cross-platform installers
docs/design/                  Exported Figma reference screenshots
```

The desktop shell loads **the exact same production web bundle**. Native features are detected through `isTauri()` and isolated in `packages/app/src/platform.ts`. No dependency on `../vagabondui` is needed to build or deploy this repository.

## Automatic GitHub Pages deployment

`.github/workflows/pages.yml` builds and deploys the web demo on every push to **`main`**, and supports manual dispatch. GitHub Pages must use **GitHub Actions** as its build source (repository **Settings → Pages → Build and deployment**).

The workflow runs the strict typecheck, domain tests, and browser flows against a production build hosted below `/vault/`. After checks pass it uploads `apps/web/dist-pages` and deploys with GitHub's Pages actions. No deployment secrets are needed. The deployed download page resolves installers from the latest published public release of this repository; installers are not committed into the website.

```sh
pnpm build:pages       # separate output at apps/web/dist-pages, base /vault/
pnpm preview:pages     # http://127.0.0.1:4174/vault/
pnpm test:pages        # all browser flows against that exact base path
```

The standard web/Tauri build continues to use `/`. Artwork and download URLs are resolved against Vite's configured base, and hash routing supports deep links without server rewrites. If hosting under a different repository path, set `VITE_BASE_PATH` when building and adjust the Pages preview/test base accordingly.

## Automatic Vercel deployment

The root `vercel.json` configures the monorepo install, Vite build, output directory and cache headers. Set the Vercel project’s **Root Directory to the repository root**, not `apps/web`.

### GitHub Actions setup

1. Put this repository on GitHub and create/link a Vercel project for it.
2. Set these repository Actions secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Set **`VITE_GITHUB_REPOSITORY=owner/repository`** in Vercel’s production environment. The download page uses it to resolve the latest public GitHub release. It is a public setting, not a secret.
4. Push to **`main`**. `.github/workflows/vercel.yml` validates TypeScript/domain tests, builds, and deploys production automatically.

Without credentials the deployment job reports a setup notice. It does not pretend to have deployed. Alternatively, Vercel’s Git integration can use the same root configuration for automatic deployments and PR previews; use a single deployment mechanism to avoid duplicate production builds.

For a manual first deploy:

```sh
pnpm dlx vercel@50 login
pnpm dlx vercel@50 link
pnpm dlx vercel@50 --prod
```

For local release-link testing, copy `.env.example` to `apps/web/.env.local` and set the public GitHub repository name. If this variable is absent, the download page uses the local manifest instead.

## Desktop releases

`.github/workflows/desktop-release.yml` runs for `v*` tags, or manually:

- Windows: x64 NSIS `.exe`
- macOS: Apple Silicon and Intel `.dmg`
- Linux: x64 `.AppImage` and `.deb`

Keep the versions in package manifests, `Cargo.toml` and `tauri.conf.json` aligned before tagging. The action creates a **draft release** and uploads the installers. Publish that draft when the builds are ready; the web download page discovers it without a redeploy. Public release assets are required for unauthenticated browser downloads.

The demo installers are unsigned. Windows may show an unknown-publisher prompt; unsigned macOS builds require **Open Anyway** in system settings. Production distribution should add platform signing/notarization credentials to the release workflow. Windows uses the WebView2 bootstrapper if the runtime is missing.

Only Windows builds can be verified on this Windows workspace; macOS/Linux builds are provided by their matching GitHub runners.

## Verification

```sh
pnpm check                    # TypeScript, 8 domain tests, web build, browser flows
pnpm desktop:check            # Rust compile check
cargo clippy --locked --manifest-path apps/desktop/src-tauri/Cargo.toml -- -D warnings
cargo test --locked --manifest-path apps/desktop/src-tauri/Cargo.toml --lib
pnpm test:desktop             # Windows: run built native app and exercise actual Rust IPC
```

Install the browser once with `pnpm exec playwright install chromium` (`--with-deps` on Linux CI). Playwright starts a production preview server automatically and captures desktop/mobile screenshots under `test-results/`. `pnpm test:desktop` uses port 9229 and an isolated WebView profile, closes its own application process afterwards, and does not launch user games.

The completed delivery passed 8 domain tests, 11 browser flows on both root and GitHub Pages subpath builds, 3 Rust tests, the native IPC smoke check, and React Doctor (100/100 on app source). See [docs/VERIFICATION.md](docs/VERIFICATION.md) for artifact paths and the exact verification scope.

## Design and assets

- [Application section — 1442:19913](https://www.figma.com/design/t7ryyKeRorQibF1rXQ9QR2/-Vault--Dev---archived?node-id=1442-19913)
- [Design system — 346:10854](https://www.figma.com/design/t7ryyKeRorQibF1rXQ9QR2/-Vault--Dev---archived?node-id=346-10854)
- [Tokens — 920:18580](https://www.figma.com/design/t7ryyKeRorQibF1rXQ9QR2/-Vault--Dev---archived?node-id=920-18580)

Implemented tokens include `#141414` background, `#191919` layer 01, `#292929` layer 02, `#8A3FFC` primary, `#EBEBEB` primary text, `#B8B8B8` secondary text, and the design’s presence colors. Fonts are self-hosted Inter and Raleway. The placeholder-heavy library is completed with local, typographic game artwork. Responsive layouts and dialogs extend the desktop Figma screens for browser use.

Raw Figma exports are kept in `apps/web/public/images/` for reprocessing and **excluded from production builds**. Optimized artwork is checked in under `apps/web/public/media/`, so CI does not need Figma access or image generation. Run `pnpm assets:optimize` after changing original exports. The original roughly 97 MB of card GIFs becomes approximately 20 MB of animated WebP. See `THIRD_PARTY_NOTICES.md` for component and asset attribution.
