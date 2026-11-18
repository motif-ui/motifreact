# Timeline: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-17 with /figma-new-component from the `TimelineV2` clone (batch 4).

## Nodes

| What                                                     | ID                                                    |
| -------------------------------------------------------- | ----------------------------------------------------- |
| Page                                                     | `272:22`                                              |
| Component set `Timeline` (54 variants)                   | `273:3381`                                            |
| Part `_Timeline/Item` (216 variants)                     | `273:1904`                                            |
| Part `_Timeline/Marker` (96 variants)                    | `272:135`                                             |
| Doc frame                                                | `291:2085`                                            |
| Playground frame                                         | `291:2568`                                            |
| Sections: Documentation, Playground, Component, Internal | `272:23`, `272:24`, `272:25`, `272:26`                |
| Component table labels / spec tables (groups)            | in `272:25`: `table labels`, `spec tables` `290:3194` |

## Properties

- `Timeline`: variants `orientation` (vertical, horizontal), `contentPosition` (after, before, alternate),
  `textAlign` (start, center, end) and `markerType` (dot, number, icon); default vertical, after, start, dot. Each
  holds three exposed `_Timeline/Item` instances (`item 1` to `item 3`, line first, middle, last).
- `_Timeline/Item`: the same four axes plus `odd` (the 1st, 3rd, … item, which sits on the before side in the
  alternate layout) and `line` (first, middle, last: decides the connection lines and the spacing). Text properties
  `title` and `content` with `showTitle` and `showContent`; the marker is an exposed `_Timeline/Marker`.
- `_Timeline/Marker`: variants `markerType`, `appearance` (filled, outlined), `variant` (8, default primary) and
  `disabled` (one look for every variant; every variant has it so a developer can pick it). `number` (text) and `icon` (instance
  swap, default `Icon/motif_ui`).
- The Timeline `variant` and an item's own variant, appearance and disabled are all set on the markers.
- Table: column `markerType` (dot first); blocks `orientation` × `contentPosition`; rows `textAlign`.

## Decisions

- `light` is now `neutral`; info and accent are new (user decision 1 of batch 4). A filled neutral marker is
  `color/neutral/soft` over `color/surface/default` with `color/neutral/text` (user, 2026-11-17: the solid neutral
  was too dark).
- Disabled is one look for every variant (filled `color/surface/disabled`, outlined `color/border/disabled`, both
  `color/text/disabled`).
- The alternate layouts give both sides of the marker an equal growing area, so the markers line up like the code's
  grid (vertical) and subgrid (horizontal).
- The marker column hugs the marker and its minimum line (24px, two 12px halves when centered), like the code's
  smallest item, so an item without title and content is as small as in code. The rest of the line is an absolute
  `lineExtension` to the item's edge (behind the marker; STRETCH for start and end, SCALE halves for center; across
  MIN, MAX or CENTER by contentPosition), and the items clip it. Vertical dot items fill the dot's 6px (start) or 4px
  (end) offset with a `lineGap` (user, 2026-11-18: the gaps without title and content were wrong).
- Vertical start and end move the section in code (dot -6px / -4px, icon +8px); Figma pads the marker column (dot)
  or the section (icon) instead, which lines the title up the same way.
- `Icon/motif_ui` (`7:18`) had a hard-coded fill on its vector region, so instances could not recolor it; the region
  fill was removed (the code icon is a one-color font glyph). It was only used by the Timeline markers.
- Spec tables (user, 2026-11-18, after the old Motif Timeline sheet): Marker spec per appearance (filled, outlined),
  rows the variants in Light and Dark, columns icon · number · dot and the same with disabled=true; Item content
  (orientation vertical · horizontal × title and content, title only, content only, neither). No Size spec: Timeline
  has no sizes. Scenarios: Item overrides (markerType number · icon × Timeline variant, item variant, outlined items,
  disabled, outlined and disabled).
- No Examples.
