# Alert: Figma notes (maintained by AI, do not edit by hand)

## Nodes

| What                                           | ID                                                   |
| ---------------------------------------------- | ---------------------------------------------------- |
| Page                                           | `242:22`                                             |
| Component set `Alert` (8 variants)             | `242:90`                                             |
| Doc frame                                      | `242:104`                                            |
| Playground frame                               | `242:461`                                            |
| Sections: Documentation, Playground, Component | `242:23`, `242:24`, `242:25`                         |
| Component table labels / spec tables (groups)  | in `242:25`: `table labels`, `spec tables` `242:675` |

## Properties

- Variants: `variant` (8, default neutral). The icon follows the variant like the code (danger `Icon/error`, warning
  `Icon/warning`, success `Icon/check_circle`, the rest `Icon/info`), so it is not a swap property.
- `title` and `message` (text) with `showTitle` and `showMessage` (booleans); `showIcon` (boolean, the inverse of the
  code's `hideIcon`); `closable` (boolean) on the `close` icon (`Icon/close`).
- The alert is 400px wide in the set; the code fills its container, so resize the instance.
- Table: no column property (one value per row); rows `variant`, neutral first.

## Decisions

- Default variant is neutral.
- Colors: background `{variant}/soft`, the 4px left edge and the icon `{variant}/solid`, the title `{variant}/text`
  (user, 2026-11-16: the edge takes the solid tone, so warning's edge is bright yellow; the warning title stays on
  `warning/text` for contrast), the message `color/text/strong`.
- The close button is the `Icon/close` icon colored `color/neutral/text`; in code it is an IconButton.
- Spec tables: Color spec with the variants as rows and Light · Dark as columns (Alert is wide; a variants-as-columns
  table would be about 3,600px wide). Scenarios: Content (title + message · message only · title only · hideIcon ·
  closable). No Size spec: Alert has no sizes.
- No Examples.
- The title's line is 28px (text-lg), the icon and the close button 24px. Both sit in a slot (`iconSlot`,
  `closeSlot`) whose 2px `titleOffset` spacer shows with `showTitle`, so they center on the title line, and on the
  message line without a title (code: a 2px margin on `.Root:has(.title)`). The slots carry the `showIcon` / `closable`
  visibility.
