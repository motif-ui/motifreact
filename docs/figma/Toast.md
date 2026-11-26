# Toast: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                                                    |
| ---------------------------------------------- | ----------------------------------------------------- |
| Page                                           | `465:468`                                             |
| Component set `Toast` (8 variants)             | `465:538`                                             |
| Doc frame                                      | `465:470`                                             |
| Playground frame                               | `465:531`                                             |
| Sections: Documentation, Playground, Component | `465:469`, `465:530`, `465:537`                       |
| Component table labels / spec tables (groups)  | in `465:537`: `table labels`, `spec tables` `465:632` |

## Properties

- Variants: `variant` (8, default neutral).
- `title` (text) + `showTitle`; `content` (text, always shown: the code requires it); `showIcon` + `icon` (instance swap,
  default `Icon/info`); `closable` (default true, like `useToast`); `showProgress` (default true: `useToast` gives a
  3000 ms duration) shows the countdown bar, a ProgressBar `size=sm` of the same variant, absolute along the bottom.
- The toast is 256px wide (`sizing/256`); the code makes it 100vw - 72px below the sm breakpoint.
- Table: no column property; rows `variant`, neutral first.

## Decisions

- Fill `{variant}/soft` layered over `color/surface/raised` (the soft tones are translucent and a toast floats over the
  page), radius `sizing/radius/md` on every corner, no edge; the icon `{variant}/solid`, the title `{variant}/text`
  (`label-xl` Semi Bold), the content `color/text/strong` (`body-md`); `elevation/3`; padding `sizing/space/10`
  `sizing/space/16`, gap `sizing/space/10`.
- Toasts in the set, the doc and the spec tables sit 40px apart (cells 32px around the toast), so the `elevation/3`
  shadows never overlap.
- The icon and the close button are 24px and sit on the title's line through Alert's `iconSlot` / `closeSlot` with the
  2px `titleOffset`.
- Spec tables: Color spec with the variants as rows and Light · Dark as columns. Scenarios: Content (title · content,
  content only, icon unset, closable=false, duration unset). No Size spec: Toast has no sizes.
- The six positions, the slide animations and the pause on hover are on the doc page's "Not shown in Figma" note.
- No Examples.
