# Polygon redesign — approved reference contract

## Scope

Mode: Operate. Implement the updated Home, Browse Games/Groups, Profile, Group, Game, Settings, and directory overlays. Existing mock persistence, collection/activity flows, and native game launching remain available. Branding was explicitly confirmed by the user as POLYGON; binary identity remains Vault.

## Direction contract

**THESIS:** A gaming-community workspace composed of navigable news, events, chat, and server modules, reproducing the supplied Figma rather than reskinning the old feed.

**OWN-WORLD:** Near-black blue-tinted layers, Jost typography, 280px directory rail, 80px header, purple gradient selections and green Join/Play actions. Local Figma artwork carries the visual identity.

**STORY:** Home gathers community activity; Browse discovers games/groups; entity pages bring their modules together; settings changes the user's cover and preferences.

**FIRST VIEWPORT:** At 1920px, the full-width header sits above the left rail. Home uses a 2:1 news/event row and a 1:2 chat/server row. Entity pages center a 1040px main column plus 280px related-items rail. Browse centers a 1040px asymmetric gallery.

**FORM:** User-pinned Figma production screens, no random concept seed. Screenshots and Figma measurements are the approved reference. No image generation is needed; the existing Sharp toolchain optimizes source assets.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Responsive contract

1920px comparison, 1440px fluid main column, 390px drawer navigation and stacked panels. Module tabs scroll within their own strip. No page-level horizontal overflow; long names and messages wrap or truncate. Disabled Figma modules are visibly labeled as planned, not simulated working features.
