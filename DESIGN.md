---
name: POLYGON — the Vault demo
description: The built Figma-led gaming-community workspace shared by the browser and Vault desktop shell.
colors:
  primary: "#682cd3"
  primary-hover: "#5e28be"
  selection-start: "#9326cf"
  selection-end: "#531fac"
  action-green: "#359a11"
  action-green-small: "#2d8410"
  action-green-hover: "#28780d"
  background: "#07070d"
  workspace: "#0f0f12"
  surface: "#151519"
  raised: "#1f1f26"
  hover: "#28282f"
  foreground: "#f0f0f5"
  body-text: "#d1d1d6"
  muted-foreground: "#98989e"
  border: "#3a3a43"
  white: "#ffffff"
  danger: "#fa4d56"
typography:
  headline:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: "32px"
  title:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "24px"
  body:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  article:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
  action:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "1.25rem"
  action-small:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "1.25rem"
  caption:
    fontFamily: "Jost Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  discovery-display:
    fontFamily: "Raleway Variable, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "36px"
rounded:
  avatar-image: "3px"
  tag: "4px"
  control: "5px"
  base: "6px"
  panel: "8px"
  discovery-card: "12px"
  discovery-hero: "16px"
  shared-button: "0.375rem"
spacing:
  micro: "4px"
  tight: "8px"
  compact: "12px"
  module-gap: "16px"
  content: "24px"
  page: "32px"
  home-horizontal: "36px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.shared-button}"
    height: "2.5rem"
    padding: "0 1rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.shared-button}"
    height: "2.5rem"
    padding: "0 1rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.shared-button}"
    height: "2.5rem"
    padding: "0 1rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.shared-button}"
    height: "2.5rem"
    padding: "0 1rem"
  button-destructive:
    backgroundColor: "color-mix(in oklab, #fa4d56 10%, transparent)"
    textColor: "{colors.danger}"
    rounded: "{rounded.shared-button}"
    height: "2.5rem"
    padding: "0 1rem"
  button-green:
    backgroundColor: "{colors.action-green}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    height: "40px"
    padding: "0 1rem"
  button-green-small:
    backgroundColor: "{colors.action-green-small}"
    textColor: "{colors.white}"
    typography: "{typography.action-small}"
    rounded: "{rounded.control}"
    height: "34px"
    padding: "0 1rem"
  button-green-hover:
    backgroundColor: "{colors.action-green-hover}"
  cover-input:
    backgroundColor: "#19191f"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.panel}"
    height: "40px"
    padding: "8px"
  module-tab:
    backgroundColor: "#19191f"
    textColor: "#9898a5"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "56px"
    padding: "4px 12px"
  tag:
    backgroundColor: "#484852"
    textColor: "{colors.body-text}"
    rounded: "{rounded.tag}"
    padding: "0 8px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
  header:
    backgroundColor: "{colors.background}"
    height: "80px"
  directory-rail:
    backgroundColor: "{colors.background}"
    width: "280px"
    padding: "16px 16px 0"
---

# Design System: POLYGON — the Vault demo

## Overview

**Creative North Star: "The Polygon Community Workspace"**

The approved Polygon Figma defines a dense gaming-community workspace: near-black blue-tinted layers, Jost typography, navigable news, events, chat and server panels, purple selections, and green Join/Play actions. Local Figma artwork supplies the identity; restrained corners, thin borders and compact controls organize the content around it. This name describes the approved direction rather than introducing a new visual concept.

POLYGON is the user-approved visible brand. Vault remains the repository and native installed-app identity, with existing saved data and backup compatibility preserved. The browser and Tauri shell share this visual system; fictional community activity remains visibly distinct from real native game launching.

**Key Characteristics:**
- Fixed desktop header and directory rail framing a fluid workspace.
- Centered entity composition, asymmetric discovery gallery and bounded module panels.
- Jost-led typography with compact metadata and a limited Raleway display exception.
- Purple navigation and selection, green participation actions, locally exported artwork.
- Persistent local demo interactions with explicit mock and planned-feature states.

### Authority and evidence

- Approved authority: Polygon Dev `19qInd2kXJwgHZX35Wzz9F`, canvas `0:1`, production page sections. The older Reference section does not supersede them. Production frame IDs recorded in the built stylesheet include `324:7356`, `431:3857`, `712:12626` and `621:12067`.
- Direction: `PRODUCT.md` and `docs/design/polygon/implementation-brief.md`. Desktop target exports: `docs/design/polygon/polygon-*.png`. Existing implementation captures and capture metadata: `.impeccable/review/` at 1920, 1440 and 390 pixels.
- Built sources: `packages/app/src/polygon.css`, `packages/app/src/styles.css`, `packages/app/src/components/polygon/*`, `packages/ui/src/index.tsx`; routing, asset and persistence conventions come from `packages/app/src/state.tsx` and `packages/app/src/assets.ts`.
- The user-supplied finish review found structure, material, type and ground consistent with Figma or justified responsive/mock-data adaptations; its small-green-label contrast request is now reflected in the source. This documentation records that outcome, not pixel-exactness, certification or deployment. No app tests or new screenshot captures were run for this documentation pass.
- Frontmatter is the normative extracted token layer. Descriptive names for hard-coded values are documentation keys, not new CSS variables. The schema-version-2 sidecar contains extensions and isolated component previews. Its synthesized tonal ramps are panel visualization aids, not additional shipped palette tokens.

## Colors

Blue-tinted near-black grounds carry cool gray text, saturated purple selections and purposeful green actions.

### Primary

- **Polygon purple** (`primary`, `primary-hover`): shared primary buttons, settings actions and accent details.
- **Selection violet to deep purple** (`selection-start`, `selection-end`): the directory and module tabs use radial gradients from the lower-left; Browse segments and promotional links use linear variants. Keep these distinct from the solid shared primary button.

### Secondary

- **Action green** (`action-green`): white, large bold Join/Play labels at 20px/700.
- **Small-label action green** (`action-green-small`): the darker background for smaller white labels, including compact events, discovery cards, server dialogs and responsive reductions. The fix changes the button ground, not the white text.
- **Action hover** (`action-green-hover`): shared green hover ground. Joined event actions may use the built subdued green ground and pale-green text; state must also be expressed in the label.

### Tertiary

- **Danger** (`danger`): destructive shared controls, distinct from participation and selection.
- The existing Donate control uses a warm orange/gold gradient and opens a demo-only explanation. It is a local component exception, not a payment capability or replacement primary palette.

### Neutral

- **Background** (`background`): header, directory rail, cover base and outer document ground.
- **Workspace** (`workspace`): the main Polygon canvas, intentionally lighter than the chrome.
- **Surface / raised / hover**: module bodies and shared controls. Panel title strips use a slightly lifted local tone.
- **Foreground / body text / muted foreground**: primary labels, reading copy and secondary information respectively. **White** is used for selected controls, strong headings and action labels.
- **Border**: panel outlines and shared component dividers. Component-specific quieter borders remain in the source and sidecar snippets.

**The Green Label Rule.** Keep the large bold action green for 20px/700 labels; use the darker small-label green wherever the built action typography is reduced.

## Typography

**Display and body font:** locally bundled `Jost Variable`, with `sans-serif` fallback. Polygon headings override the older global heading family. The root font size is 14px; the Polygon shell and settings surface explicitly use 16px/1.5. Shared Tailwind controls still use rem-based sizes, so a utility height is not automatically the equivalent Polygon pixel height.

**Character:** geometric, compact and readable at community-dashboard density. Weights differentiate navigation, article titles and body text without an oversized marketing hierarchy.

### Hierarchy

- `headline`: article headlines; maximum reading width 65ch. Event headlines use their own 30px line height at desktop.
- `title`: entity identity headings. Related names use 18px/600; primary navigation uses 20px/650; panel titles use 16px/650.
- `body`: chat and ordinary interface copy. `article`: larger news/event reading copy, with news paragraphs capped at 75ch.
- `label`: module labels. `caption`: directory secondary lines. Smaller timestamps and demo disclosures are component-specific, not a default body-text scale.
- `action` and `action-small`: large and compact participation labels. Responsive event labels step to 17px, then 14px; discovery actions reach 12px on narrow screens, with the darker ground retained.
- `discovery-display`: Raleway for the game Browse promotional hero. Group hero headings revert to Jost. Portaled shared modal titles and some retained collection surfaces also retain Raleway; Inter remains in the legacy count-pill treatment. These are existing exceptions, not a new font pairing to spread across Polygon pages.

Use ordinary case for navigation and reading content; uppercase is confined to the visible wordmark and discovery card/group-hero names. Truncate compact directory names and wrap messages or long entity headings. Server numbers use tabular numerals.

## Layout

### Desktop composition

- The fixed header is 80px high. The fixed directory rail begins below it, is 280px wide and has an independently scrolling body plus a bottom self-profile. The workspace offsets both; the header's brand area is 320px on the widest layout, not the rail width.
- Entity pages center a maximum 1336px composition: 1040px main column + 16px gutter + 280px related rail. The main column is `minmax(0, ...)` so content can shrink. Page padding is 32px across the top and sides, with bottom clearance for the demo bar.
- Covers use a 210px banner, a minimum 62px identity strip and an overlapping 128px avatar. Module tabs sit 16px below the cover and above a typical 512px-tall module panel.
- Home uses three equal grid tracks with a 16px gap: a 2:1 news/events row (336px) and a 1:2 chat/servers row (512px). Home has 32px top and 36px horizontal padding.
- Browse centers a 1040px gallery. Its six-track desktop grid combines cards spanning three, two or one track; primary card heights are 336px with 160px horizontal variants. This asymmetric arrangement is intentional.
- Settings uses the same desktop header/rail dimensions, a centered 1040px cover preview and content region. Entity Layout is a preset showcase arrangement of enabled modules, not a drag-and-drop editor.
- The recurring spacing rhythm is 4/8/12/16/24/32px, with local 10/20px adjustments. Avoid imposing a strict scale that erases observed component geometry.

### Responsive behavior

All listed queries are inclusive `max-width` breakpoints from `polygon.css`; they are not generic framework breakpoints.

| Width | Built adaptation |
| --- | --- |
| 1650px | Entity related rail becomes 240px and main column fluid; horizontal page padding becomes 24px. News/events lists become 260px; full chat list becomes 230px. Header search moves right and narrows. Home first row becomes 360px. Reduced event action labels use the darker green. |
| 1250px | Directory/settings rails and workspace offsets become 240px; entity related rail becomes 210px. Home becomes a two-column, three-row arrangement. Browse becomes two equal columns and normalizes card shapes. Server map column is hidden. |
| 1000px | Entity related content moves below the main column in two columns; main panel height becomes 560px. Global search becomes an icon trigger. Browse toolbar wraps. |
| 780px | Header becomes 64px; workspace loses the rail offset. Navigation becomes a 280px off-canvas drawer. Page gutters become 16px, module tabs become 104px minimum width by 54px height. Related content temporarily uses three compact columns. Settings navigation becomes a wrapping in-flow strip. Cover actions use the darker green as labels shrink. |
| 540px | Home and showcase panels stack; related panels stack. News/events lists and chat/server selectors become local horizontal strips. Cover banner/avatar become 138px/76px. Settings form columns stack. Browse retains two compact card columns, not one; cards are 300px tall with 125px imagery. All green actions use the darker background. |

The comparison widths are 1920px, 1440px and 390px. At 1440px the 1650px adaptation applies; at 390px all narrower adaptations apply. Preserve locally scrollable module tabs and bounded panel content, wrapped messages and truncated compact labels. The intended constraint is no page-level horizontal overflow, not removal of purposeful internal scrolling. Fixed demo-bar clearance remains part of the layout.

## Elevation & Depth

The system is layered and mostly flat: dark tonal steps, thin outlines, photographic artwork and purple state illumination carry hierarchy. Shadows are selective, not absent. Directory selection uses `0 4px 26px #682cd360`; the active top-navigation tab uses `0 4px 8px #682cd31f` plus a top indicator glow of `0 1px 14px 4px #8e41fa80`. Browse segments use `0 3px 25px #682cd35c`.

Entity pages diffuse their own cover artwork behind the upper composition with 0.2 opacity and 65px blur. This is a contextual backdrop, not a glass treatment for every panel. Shared Radix modals use a dark translucent blurred overlay and elevated content; ordinary module panels remain bordered surfaces without universal card shadows.

**The Selective Depth Rule.** Use tonal panels for structure and reserve purple glow for the built navigation and selection treatments; preserve the cover-art atmosphere on entity pages.

Motion is brief and functional: button color transitions take 0.15s, the mobile drawer uses a 0.2s ease-out transform, and modal entry takes 0.18s ease-out. Respect both system reduced motion and the saved reduced-motion preference; existing global rules disable transitions and animations for either.

## Shapes

The form language is compact rounded rectangles: small avatar-image corners, slightly softened tags and controls, and broader panel/media corners. Discovery cards and heroes are the larger-radius exceptions. Presence dots are circular, but content cards and avatars remain rectangular. The frontmatter records observed radii rather than forcing every component through the root `--radius` value.

Use thin borders, clipped artwork and `object-fit: cover` for banners, thumbnails and gallery images. Keep the overlapping entity avatar silhouette and angular Polygon mark. Use the existing inline SVG/Lucide icon vocabulary rather than text glyph stand-ins.

## Components

### Buttons and participation

Shared `Button` exposes default, secondary, outline, ghost and destructive variants, plus small/default/large/icon sizes. Default height/padding are 2.5rem and 1rem horizontally; Polygon action contexts explicitly override these where needed. Disabled shared buttons block pointer events and use 0.4 opacity; loading also disables the control and exposes `aria-busy`.

Green Join/Play controls override the shared fill, typography and corners. Large cover actions are 280px by 40px at the widest entity layout. Compact event/discovery actions typically use 34px height before further mobile changes. Hover darkens green; event membership can use the subdued joined style. Labels must distinguish Join, Leave and Play demo rather than implying a real native process.

### Inputs, focus and settings

Settings fields use dark filled grounds, quiet borders, 8px corners and 8px internal padding; inputs are 40px high. Textareas resize vertically. Read-only values are muted and form errors use the existing pale-red treatment. Search fields and chat composers have wrapper-level `:focus-within` border changes; their internal inputs intentionally omit a duplicate outline.

The global keyboard focus treatment is a 2px solid lavender outline with 3px offset. Retain semantic labels, accessible icon-button names and the skip link. Settings uploads preview local images; preferences and module visibility persist locally. Shared Radix switches use the primary fill when checked.

### Navigation and planned modules

The top-level Home/Browse/Profile navigation uses a luminous top indicator for the active route. The directory's Games/Groups/Friends selection uses the purple radial gradient. Module links combine an icon above a label in a bounded horizontal strip and expose `aria-current` for the active route.

News, Events, Chat, Servers and entity Layout are implemented demo surfaces. Voice, Gallery, Forums, Poll and Schedule are disabled buttons with planned-version title text. Keep them visibly disabled; the current implementation does not put a separate always-visible “Planned” badge on each tab. Donation opens a demo-only message and takes no payment. Authentication, billing, multiplayer hosting, live voice/chat backends and cloud sync remain outside the implemented demo.

### Panels, lists, chips and discovery

The shared Polygon panel has an 8px corner, thin outline, clipped body and 40px title strip with icon, title and optional expand action. News/events use a selectable list beside a scrollable reading region; selected stories have a directional purple-to-black fill and purple border. Chat combines a channel list, bounded messages and composer. Server lists are tabular with local overflow and a dialog that explicitly identifies mock connections.

Tags are neutral filled rectangles, 14px text on a 24px line with 8px horizontal padding; on selected news items their fill becomes translucent white. They are informational spans, not universally interactive filter buttons. Browse combines artwork-led asymmetric cards, favorites and demo membership actions. Keep the existing empty states when filters or showcase preferences remove all content.

### Product truth, assets and retained surfaces

“Demo · local only”, the persistent demo bar, modal descriptions and contextual notices identify fictional records. Screenshot names, counts, article dates and seeded activity are visual fixtures or saved local state, not live telemetry. Compact showcase headers hide individual mock labels; the global/contextual disclosure remains important. Preserve actual profile edits, collections, membership choices and messages rather than resetting them to match Figma placeholders.

The Rust process tracker determines whether a native game is running. Native executable selection, launch, process tracking and backup dialogs are real desktop capabilities; catalog installs, Play demo sessions, community presence, chat and server joins are mocks. A screenshot or persisted mock flag cannot establish native running state. Keep Activity, Cards, Awards, Statistics and desktop installer access reachable through the retained links and routes.

Use hash routes such as `#/profile/news` and `#/browse/games`. Resolve local assets through `assetUrl`/`polygonArt`, which respect `import.meta.env.BASE_URL`, already-prefixed paths and absolute/data URLs. Preserve root hosting, `/vault/` Pages hosting and Tauri compatibility. Ship the locally exported, optimized artwork with its existing provenance rather than replacing it with a competing concept.

Demo state uses `vault.demo.v1` and the existing `parseState` compatibility path. Preserve that key, saved data, backup format and native Vault identity. Storage failures are surfaced to the user as session-only changes. Public releases and unsigned native installers remain separate from web deployments.

## Do's and Don'ts

### Do:

- Do reproduce the pinned Polygon production frames using the existing local artwork and component vocabulary.
- Do keep Jost, dark tonal layers, purple selections and size-appropriate green action backgrounds.
- Do preserve the desktop geometry and the observed 1650/1250/1000/780/540px responsive adaptations.
- Do keep keyboard focus, internal scrolling, readable content wrapping and explicit mock/planned states.
- Do preserve Vault identity, saved data, backup compatibility, hash deep links and base-path-aware assets.

### Don't:

- Don't replace the approved Figma direction with a new visual concept or promote legacy shell dimensions into the Polygon layout.
- Don't use the large-label green behind reduced-size white action labels.
- Don't describe disabled modules, demo membership, chats, server joins or catalog installs as live services.
- Don't infer a running native game from screenshots, community presence or persisted demo state; use the Rust process tracker.
- Don't reset actual saved data to reproduce fixture text, or treat a web deployment as a native installer release.
