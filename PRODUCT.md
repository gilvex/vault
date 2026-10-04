# Polygon, the Vault demo

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, TypeScript, Tailwind 4, source-owned shadcn-style Radix components, pnpm monorepo, Tauri 2/Rust desktop wrapper. The native wrapper shares the web design language.

## Users and purpose

A mock-backed gaming-community MVP for discovering games and groups, following news and events, chatting with friends, collecting cards, and exploring game-server lists. Desktop users can register and launch their actual local games.

## Capabilities and constraints

Community data is seeded and interactions persist on the current device. There is no real authentication, billing, multiplayer hosting, chat backend, or cloud sync. Native executable selection, launch, process tracking, and backup dialogs are real existing functionality. Preserve stored data, backup compatibility, deep links, and the `/vault/` Pages hosting path.

## Brand commitments

The user approved **POLYGON** as the visible name from the updated Figma, while retaining the Vault repository, installed-app identity, and existing saved data. The approved design is Polygon Dev `19qInd2kXJwgHZX35Wzz9F`, canvas `0:1`. Its production page sections—not the older Reference section—are the visual authority.

## Evidence

Figma-exported desktop references are in `docs/design/polygon`. Original artwork is exported locally and optimized for shipping. Existing app behavior and tests are the product baseline. Placeholder labels/counts in Figma are completed with clearly fictional demo records.

## Product principles

- Match the approved screens' structure and visual identity.
- Keep every implemented interaction keyboard accessible and useful on mobile.
- Distinguish mocked activity from native capabilities.
- Preserve access to existing collections, profile activity, and downloadable installers.
