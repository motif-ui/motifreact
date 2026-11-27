# FormField: Figma notes (maintained by AI, do not edit by hand)

Built 2026-11-24 with /figma-sync from the migrated code (Form and Grid token migration, batch 8).

## Nodes

| What                                           | ID                           |
| ---------------------------------------------- | ---------------------------- |
| Page                                           | `432:22`                     |
| Component set `FormField` (40 variants)        | `432:506`                    |
| Doc frame / Playground frame                   | `435:182` / `435:253`        |
| Sections: Documentation, Playground, Component | `432:23`, `432:24`, `432:25` |

## Properties

- Variants: `size` × `labelOrientation` × `error` / `success` / `disabled` / `readOnly`. size and labelOrientation are
  the Form's props, repeated so a field can be placed alone.
- `label`, `helperText` (text), `helper` (shows the helper), `required` (the `*` mark: after a vertical label, before a
  horizontal one).
- The input is an exposed InputText instance of the same size and state: swap it (Select, Textarea…).
- disabled and readOnly share one look on purpose: label, `*` and helper `color/text/disabled` show that the field
  cannot be edited (user, 2026-11-24).
- A horizontal label is `sizing/128` wide (vertical Form); in a horizontal Form it hugs its text (instance override).
- Horizontal label: top padding = the input's vertical padding (`space-4 · 6 · 8 · 10`), so the label is level with
  the input's text. The input's border is drawn inside since the control heights change (#249), so no 1px is added
  (it was 5 · 7 · 9 · 11 before). In Figma the labelBox top padding is bound to `sizing/space/4 · 6 · 8 · 10`, also in
  FormFieldGroup (2026-11-26). The doc Variants show the vertical label only.
