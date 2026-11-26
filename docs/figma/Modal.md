# Modal: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                                      |
| ---------------------------------------------- | --------------------------------------- |
| Page                                           | `465:2182`                              |
| Component `Modal`                              | `465:3118`                              |
| Doc frame                                      | `465:2184`                              |
| Playground frame                               | `465:2249`                              |
| Sections: Documentation, Playground, Component | `465:2183`, `465:2248`, `465:2255`      |
| Spec tables (group)                            | in `465:2255`: `spec tables` `465:3556` |

## Properties

- One component, no variants: Modal has no color variants and `size` only changes the width, so the instance width
  binds to `sizing/320 · 480 · 720 · 960` (md 480 default).
- `title` and `subtitle` (text) with `showHeader` and `showSubtitle`; `children` (text, the content); `closable`
  (the close IconButton xxl neutral, 16px from the top right); `showActions`, `showAction`, `showAlternate` (Button md
  pill: action primary solid, alternate neutral outline).
- `noContentPadding` and custom `buttons` are instance overrides; `maximizable` is the instance size (the screen minus
  `sizing/64`).

## Decisions

- Like AlertModal: `color/surface/raised`, radius `sizing/radius/lg`, `elevation/4`, backdrop `color/backdrop`.
- Header: padding and gap `sizing/space/16`, a 1px `color/border/soft` bottom border; title `heading-h4`
  `color/text/strong`, subtitle `body-lg` `color/text/soft`. Content: padding `sizing/space/16`, min height
  `sizing/64`, `color/text/default`. Actions: padding and gap `sizing/space/16`, right-aligned, a 1px
  `color/border/soft` top border.
- Spec tables: Size spec (sm · md · lg · xl; size only changes the width). Every cell keeps 48px around the modal, so
  the `elevation/4` shadows never overlap. Scenarios: Content (title · subtitle · actions,
  closable, title only, no header, no actions, actionButton only) and Backdrop (Light · Dark). No Color spec: Modal has
  no color variants; Light and Dark are on the doc page.
- No Examples.
