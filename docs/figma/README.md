# Figma library notes (maintained by AI, do not edit by hand)

The Figma library "Motif UI Components" mirrors the code. The `/figma-sync` and `/figma-new-component` skills keep it
in sync; developers only write code. The rules are in [docs/review/figma.md](../review/figma.md). This folder holds
what the rules do not: node IDs, per-component decisions and Plugin API pitfalls. One file per component.

## File

- File key `tc4bv51WElCIfZD6WjHqWL` ("Motif UI Components"). This is the only Figma file the skills may write to. The
  old active library is strictly read-only and is never opened. The clone "MotifUI2" (`SEMxbktRVMRSO6OtTqmYC6`) is
  read-only reference.
- Pages: Cover `0:1`, Getting Started `7:2`, Colors `7:4`, Typography `7:5`, Spacing & Sizing `7:6`, Radius `7:7`,
  Elevation `7:8`, ProgressCircle `7:10`, Select `7:11`, Button `129:22`, AlertModal `137:22`, Divider `169:22`, Skeleton `171:22`, Link `171:958`, Breadcrumb `174:22`,
  ProgressBar `176:810`, `_Doc` `7:13`, `_Icons` `7:14`
  (40 `Icon/<name>` components).
- Doc blocks on `_Doc`: Header `11:2`, SectionTitle `11:14`, PropRow `11:29`, Note `11:30`, Label `11:33`,
  Footer `11:35`, Logo `24:24`, Swatch `25:42`.
- Hidden "Docs" variable collection `VariableCollectionId:23:2`: template colors only (`docs/*`), never product tokens.
- Product tokens come only from the generator: `npm run figma:mtf-tokens`, then run the bundled scripts.

## Plugin API pitfalls

- A variable-bound paint needs the variable's resolved color as its base color (`variable.resolveForConsumer(node)`),
  otherwise instances and sections render black in exports.
- Figma picks a set's default variant row by row: a variant must sit clearly above the others to win, otherwise the
  left-most of the top row wins. Keep the code default in the left-most column.
- Changing a nested instance's property refreshes its siblings' IDs: query nested instances again after each
  `setProperties`.
- A text style's weight beats a `fontWeight` binding on the node; for weight samples, remove the style and bind
  family, size, line height and weight directly.
- Auto-layout frames clip content by default: set `clipsContent = false` on frames that hold shadows or open dropdowns.
- New sections get a 10% stroke; clear `strokes` and `fills`.
- `get_screenshot` of a section omits grouped labels; screenshot the page.
- Component descriptions store `&` and quotes HTML-escaped; avoid them.
- Motion: `setTimelineDuration` must be called on a child node, not on a component set. There is no loop setting,
  so the timeline length must equal the animation (ProgressCircle spin: 1.5s).
- Motion: a `WIDTH` keyframe track is accepted but does not render in `export_video`; animate `SCALE_X` and compensate
  with `TRANSLATION_X` (scale is around the center). No ffmpeg here: measure exported frames by seeking the MP4 in
  Chrome via Playwright (`channel: "chrome"`, H.264).
- Motion loops: every top-level frame or group that holds an animated instance (doc frame, spec tables group) has its
  own timeline, 2s by default. Set each one to the animation length, or the loop waits. For a full turn, make the
  timeline one frame (1/60s) shorter than the animation: its last frame would equal the first and show as a stop
  (ProgressCircle: 1.4833s).
- Motion: fill and stroke color keyframes take fixed colors, not variables, so they ignore the mode. Prefer an opacity
  track when the two tokens differ only in alpha (Skeleton's pulse).
- `setFileThumbnailNodeAsync` is not supported; the user sets the thumbnail in Design mode.
- The MCP connection drops on large calls: keep calls small and re-read state after a failure. Building ~100
  variants per call works (Button: one call per shape).
- A hugging auto-layout wrapper reports its old size right after its child's width is bound to a variable: measure
  the child (plus padding) when laying out table columns, or the columns come out too wide.
- `instance.resize(w, h)` fixes the instance's height too: an instance whose content grows later (a text turned on
  with a boolean) then overflows. Set `layoutSizingVertical = "HUG"` after resizing an auto-layout instance's width.
- An empty auto-layout frame does not hug to its strokes, and a line's stroke does not count in auto-layout: a stroke
  weight and a frame size are always two bindings (why Divider's size is a variant).
- An inside stroke still counts in auto-layout size unless `strokesIncludedInLayout = false`.
- `_Doc/PropRow` is a component set (`kind`: header/body): instance it from its default variant.
