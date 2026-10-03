# Delivery verification

Verified in the Windows development workspace on 2026-10-03.

## Passing checks

| Check | Result |
| --- | --- |
| TypeScript strict typecheck | Passed |
| Domain tests | 8 passed |
| Playwright production-browser flows | 11 passed |
| Playwright GitHub Pages `/vault/` flows | 11 passed |
| Rust compile check | Passed |
| Rust Clippy with warnings denied | Passed |
| Rust unit tests | 3 passed |
| React Doctor | 100/100; no issues |
| Windows Tauri production build | Passed |
| Windows NSIS installer generation | Passed |
| Real WebView2/Rust IPC smoke check | Passed |
| Production web and installer HTTP checks | Both returned 200 |

Browser flows cover post/comment persistence, likes/saved filters, game filtering/favorites, simulated play, event RSVPs, collectible showcases, profile editing, demo chat, JSON export, invalid backup handling, reduced-motion images, download manifests, and mobile navigation/overflow.

The native smoke check launches the compiled application, verifies `system_info` and `list_local_games`, opens the native library screen, and confirms an unregistered executable ID is rejected. It does not automate OS file dialogs or launch user-owned games. Native executable selection, launch, and backup-save happy paths remain manual checks. The generated installer has not been interactively installed on this workstation.

## Local delivery artifacts

- Installer: `apps/desktop/src-tauri/target/release/bundle/nsis/Vault_0.1.0_x64-setup.exe`
- Downloadable copy: `apps/web/public/downloads/Vault_0.1.0_x64-setup.exe`
- Installer size: **23,115,613 bytes** (22.04 MiB)
- Native executable: `apps/desktop/src-tauri/target/release/vault-desktop.exe`
- Production browser build: `apps/web/dist/`
- Reference and implementation screenshots: `docs/design/` and `test-results/`

The local production preview was started at `http://localhost:4173`. Its download page is `http://localhost:4173/#/download`. Restart it with `pnpm preview` if the preview process is stopped.

## Publishing status

The monorepo is configured for `https://github.com/gilvex/vault`. GitHub Pages is enabled with GitHub Actions as its build source, and `.github/workflows/pages.yml` deploys every push to `main` at `https://gilvex.github.io/vault/`. The workflow checks the production `/vault/` build before deployment. Consult the repository's Actions tab for the latest deployment status.

Vercel and cross-platform desktop release workflows remain available. No Vercel deployment was made; it requires the credentials described in the root README. Desktop download links on the public site resolve from the latest published GitHub release.

Only the Windows installer was built locally. macOS and Linux installers require their corresponding workflow runners. Installers are unsigned demo builds.
