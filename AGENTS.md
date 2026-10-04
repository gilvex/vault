# Vault / Polygon development

Use pnpm. The shared React application in `packages/app` runs in the browser and Tauri shell. Keep base-path-aware URLs, persistent demo data, and native Rust commands compatible.

## Skills

The 14 skills in `.agents/skills` were installed from the user-specified `../demo-pterodactyl-alternative` project. OpenCode loads that directory through `opencode.json`; the Impeccable files are the OpenCode adapter. Do not adopt the other project's product requirements.

- Use **impeccable** as the visual lead. The supplied Polygon Figma is the approved visual authority; reproduce it rather than inventing competing concepts.
- Apply **vercel-react-best-practices** to React implementation and **web-design-guidelines** to changed UI.
- Use **playwright-cli** guidance for browser interactions, plus this project's Playwright tests and screenshots at 1920, 1440, and 390 pixels.
- Other installed design skills are available for their specialist tasks; do not combine competing visual recipes.
- Read `PRODUCT.md`, `DESIGN.md` when present, and `docs/design/polygon/implementation-brief.md` before substantial visual changes.

Preserve actual existing user data. Clearly label community activity, server connections, game installs, and chats as mocks. A running native game is determined by the Rust process tracker, not by mock state. Keep unsigned installers and public releases separate from web deployments.

Run `pnpm typecheck`, domain tests, production browser tests, and Pages-subpath tests for UI changes. Run React Doctor on app source, not generated bundles. Inspect target and implementation screenshots together and batch fixes.
