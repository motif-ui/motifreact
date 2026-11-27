# Panel: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                                           | ID                                     |
| -------------------------------------------------------------- | -------------------------------------- |
| Page                                                           | `372:22`                               |
| Component set `Panel` (3 variants)                             | `372:65`                               |
| Part `_Panel/Title` (titleSize sm / md / lg)                   | `372:46`                               |
| Doc frame / Playground frame                                   | `373:28` / `373:101`                   |
| Sections: Documentation, Playground, Component, Internal parts | `372:23`, `372:24`, `372:25`, `372:26` |

## Properties

- Variant: `type` (default, solid, elevated). Booleans: `bordered` (the `border` layer), `showTitle`. Text: `content`.
- The title is an exposed `_Panel/Title` instance: `titleSize`, `showIcon` (+ the Icon's glyph swap), `title` text.
- `lean` is an instance override (padding 0), not a variant.
- The panel gives its content `color/text/default` (code: the Root sets it, since the panel paints its surface).
