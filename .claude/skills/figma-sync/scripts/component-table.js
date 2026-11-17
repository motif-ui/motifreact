/* global figma */
// use_figma script: lays out a component set as a labelled table inside its Component section.
// Edit SPEC (and PAGE_ID / SECTION_ID / SET_ID) for the component, then run it as one use_figma call.
// It rebuilds the "table labels" group, keeps the "scenario tables" group under the set, and fits the section.
// Design rules: docs/review/figma.md (Components). Example SPEC below is Select's.

const PAGE_ID = "7:11";
const SECTION_ID = "57:1863";
const SET_ID = "18:110";

const MODS = ["error", "success", "disabled", "readOnly", "loading"];
const plain = p => MODS.every(k => p[k] === "false");
const combo = (m, f) => p => p.multiple === m && p.filterable === f;
const SPEC = {
  // the column property; its first value must be the code default (Figma's default variant is top-left)
  column: { prop: "size", values: ["md", "xs", "sm", "lg"] },
  // CENTER for compact components, TOP when variants open downwards (row labels align to the closed field)
  align: "TOP",
  anchorLayer: "input",
  blocks: [
    ...[
      ["false", "false"],
      ["true", "false"],
      ["false", "true"],
      ["true", "true"],
    ].map(([m, f]) => ({
      lines: [`multiple=${m}`, `filterable=${f}`],
      rows: ["default", "focus", "open"].map(s => ({ label: s, match: p => combo(m, f)(p) && p.state === s && plain(p) })),
    })),
    {
      lines: ["multiple=false", "filterable=false"],
      rows: MODS.map(k => ({ label: k, match: p => combo("false", "false")(p) && p[k] === "true" })),
    },
    {
      lines: ["multiple=true", "filterable=true"],
      rows: [{ label: "disabled", match: p => combo("true", "true")(p) && p.disabled === "true" }],
    },
  ],
};

// ---------------------------------------------------------------------------------------------------------------
const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const section = await figma.getNodeByIdAsync(SECTION_ID);
const set = await figma.getNodeByIdAsync(SET_ID);
section.children.filter(n => n.name === "table labels").forEach(n => n.remove());
const scenarios = section.children.find(n => n.name === "scenario tables");
const scenariosOffset = scenarios ? Math.min(...scenarios.children.map(c => c.y)) - (set.y + set.height) : 0;

const all = await figma.variables.getLocalVariablesAsync();
const styles = await figma.getLocalTextStylesAsync();
await Promise.all([...new Set(styles.map(s => JSON.stringify(s.fontName)))].map(f => figma.loadFontAsync(JSON.parse(f))));
const paint = (name, node) => {
  const v = all.find(x => x.name === name);
  const { value } = v.resolveForConsumer(node);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: value.r, g: value.g, b: value.b } }, "color", v);
};
const text = async (chars, style, color) => {
  const t = figma.createText();
  section.appendChild(t);
  await t.setTextStyleIdAsync(styles.find(s => s.name === `typography/${style}`).id);
  t.characters = chars;
  t.fills = [paint(color, t)];
  return t;
};
const rect = (name, x, y, w, h, fill, stroke, radius) => {
  const r = figma.createRectangle();
  section.appendChild(r);
  Object.assign(r, { name, x, y });
  r.resize(w, h);
  r.fills = [paint(fill, r)];
  stroke && (r.strokes = [paint(stroke, r)]);
  r.cornerRadius = radius;
  return r;
};

const { column, align, anchorLayer, blocks } = SPEC;
const DEFAULT = set.defaultVariant.variantProperties[column.prop];
const TOP = 72,
  GAP = 12,
  HEADER_H = 36,
  PAD = 24,
  CELL_PAD = 32,
  ROW_GAP = 24,
  BLOCK_GAP = 32;
const CHIP_PX = 8,
  CHIP_PY = 4,
  HEAD_GAP = 12,
  RAIL_PAD = 16,
  CHIP_INSET = 8,
  CHIP_CLEAR = 8;

// column labels (values only) and the column property chip
const colTexts = await Promise.all(column.values.map(v => text(v === DEFAULT ? `${v} (default)` : v, "label-sm", "docs/text-strong")));
const colChipText = await text(column.prop, "label-sm", "docs/brand-strong");
const colChipW = colChipText.width + 2 * CHIP_PX;
const colW = column.values.map(
  (v, i) => Math.max(colTexts[i].width, ...set.children.filter(c => c.variantProperties[column.prop] === v).map(c => c.width)) + CELL_PAD,
);
// the first column starts after the chip, so its label never touches it
const firstLabelLeft = PAD + (colW[0] - colTexts[0].width) / 2;
const leftPad = PAD + Math.max(0, CHIP_INSET + colChipW + CHIP_CLEAR - firstLabelLeft);
const colX = column.values.map((_, i) => leftPad + colW.slice(0, i).reduce((a, b) => a + b, 0));

// rows and blocks
const chipTexts = await Promise.all(blocks.map(b => text(b.lines.join("\n"), "label-sm", "docs/brand-strong")));
const rowTexts = await Promise.all(blocks.map(b => Promise.all(b.rows.map(r => text(r.label, "label-sm", "docs/text-strong")))));
const layout = [];
const bottom = blocks.reduce((y0, block, bi) => {
  const top = y0 + (bi === 0 ? 0 : BLOCK_GAP);
  const chipH = chipTexts[bi].height + 2 * CHIP_PY;
  const rows = [];
  const end = block.rows.reduce(
    (y, row) => {
      const members = column.values.map(v =>
        set.children.find(c => c.variantProperties[column.prop] === v && row.match(c.variantProperties)),
      );
      const present = members.filter(Boolean);
      const h = Math.max(...present.map(m => m.height));
      const anchorH = align === "CENTER" ? h : Math.max(...present.map(m => m.findOne(n => n.name === anchorLayer)?.height ?? m.height));
      members.forEach((m, i) => m && ((m.x = colX[i] + (colW[i] - m.width) / 2), (m.y = align === "CENTER" ? y + (h - m.height) / 2 : y)));
      rows.push({ y, anchorH });
      return y + h + ROW_GAP;
    },
    top + chipH + HEAD_GAP,
  );
  layout.push({ top, chipH, rows });
  return end;
}, PAD);
set.resizeWithoutConstraints(colX.at(-1) + colW.at(-1) + PAD, bottom - ROW_GAP + PAD);

// place the set, the rail and the band
const RAIL_W = Math.max(...chipTexts.map(t => t.width + 2 * CHIP_PX), ...rowTexts.flat().map(t => t.width)) + 2 * RAIL_PAD;
set.x = RAIL_W + GAP;
set.y = TOP + HEADER_H + GAP;
const shapes = [
  rect("row rail", 0, set.y, RAIL_W, set.height, "docs/background", "docs/border", 8),
  rect("column band", set.x, TOP, set.width, HEADER_H, "docs/background", "docs/border", 8),
];
const labels = [];
colTexts.forEach((t, i) => {
  t.textAlignHorizontal = "CENTER";
  t.resize(colW[i], t.height);
  t.textAutoResize = "HEIGHT";
  t.x = set.x + colX[i];
  t.y = TOP + (HEADER_H - t.height) / 2;
  labels.push(t);
});
const colChip = rect(
  "column chip",
  set.x + CHIP_INSET,
  TOP + (HEADER_H - colChipText.height - 2 * CHIP_PY) / 2,
  colChipW,
  colChipText.height + 2 * CHIP_PY,
  "docs/brand-soft",
  null,
  6,
);
shapes.push(colChip);
colChipText.name = "column chip label";
colChipText.x = colChip.x + CHIP_PX;
colChipText.y = colChip.y + CHIP_PY;
labels.push(colChipText);
layout.forEach((b, bi) => {
  const chip = rect("block chip", 0, set.y + b.top, chipTexts[bi].width + 2 * CHIP_PX, b.chipH, "docs/brand-soft", null, 6);
  chip.x = (RAIL_W - chip.width) / 2;
  shapes.push(chip);
  chipTexts[bi].x = chip.x + CHIP_PX;
  chipTexts[bi].y = chip.y + CHIP_PY;
  labels.push(chipTexts[bi]);
  b.rows.forEach((r, ri) => {
    const t = rowTexts[bi][ri];
    t.x = RAIL_W - RAIL_PAD - t.width;
    t.y = set.y + r.y + (r.anchorH - t.height) / 2;
    labels.push(t);
  });
  bi > 0 && shapes.push(rect("divider", 0, set.y + b.top - BLOCK_GAP / 2, set.x + set.width, 1, "docs/border", null, 0));
});
const group = figma.group([...shapes, ...labels], section);
group.name = "table labels";
[...shapes].reverse().forEach(n => group.insertChild(0, n));

// keep the Scenarios tables under the set, then fit the section to its content
scenarios && (scenarios.y += set.y + set.height + scenariosOffset - Math.min(...scenarios.children.map(c => c.y)));
const right = Math.max(...section.children.map(c => c.x + c.width));
const lowest = Math.max(...section.children.map(c => c.y + c.height));
section.resizeWithoutConstraints(right, lowest);
return { set: [set.width, set.height], rail: RAIL_W, section: [section.width, section.height], default: set.defaultVariant.name };
