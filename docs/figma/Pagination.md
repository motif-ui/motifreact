# Pagination: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-17 with /figma-new-component from the migrated Pagination (batch 4).

## Nodes

| What                                                     | ID                                         |
| -------------------------------------------------------- | ------------------------------------------ |
| Page                                                     | `261:22`                                   |
| Component set `Pagination` (3 variants)                  | `261:169`                                  |
| Part `_Pagination/Item` (27 variants)                    | `261:99`                                   |
| Doc frame                                                | `261:178`                                  |
| Playground frame                                         | `261:557`                                  |
| Sections: Documentation, Playground, Component, Internal | `261:23`, `261:24`, `261:25`, `261:26`     |
| Component table labels / spec tables (groups)            | in `261:25`: `table labels`, `spec tables` |

## Properties

- `Pagination`: variant `size` (md, sm, lg; default md). Each variant holds nine `_Pagination/Item` instances named
  after their role: previous, first, separator, page, current, page, separator, last, next.
- `_Pagination/Item`: variants `size`, `type` (page, arrow, separator) and `state` (page: default, hover, focus,
  active; arrow: default, hover, focus, disabled; separator: default). `label` (text) on page items, `icon` (instance
  swap, default `Icon/arrow_back`) on arrows.
- `total`, `pageSize`, `current` and `onChange` have no property: the pages shown are item labels and states in the
  instance (Scenarios show the first page, last page and few pages cases).
- Table: rows `size` (md first), the `size` chip in the column band, like Alert.

## Decisions

- Focus is an absolute `focus ring` frame 4px outside the item with a 2px `color/focus-ring` stroke (code: outline
  2px, offset 2px).
- Spec tables: Size spec (sm · md · lg × page, current, arrow, separator) and Color spec (states × page/arrow ×
  Light · Dark). Scenarios: Current page (current=6 · 20 pages, current=1, current=20, current=2 · 4 pages).
- The doc lists only `size` under Design properties; total, pageSize, current and onChange decide which pages show and are covered by the scenarios (user, 2026-11-18).
- No Examples.
