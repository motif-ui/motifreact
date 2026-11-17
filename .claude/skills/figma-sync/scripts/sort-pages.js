/* global figma */
// use_figma script: sorts the pages alphabetically inside each group of the page list. A group is the pages after a
// divider page (a name starting with "—"), or before the first divider. Dividers keep their place. Run it after
// adding or renaming a page (docs/review/figma.md, Pages).

const isDivider = page => /^—+/.test(page.name);
const groups = figma.root.children.reduce(
  (acc, page) => (isDivider(page) ? [...acc, { divider: page, pages: [] }] : (acc.at(-1).pages.push(page), acc)),
  [{ divider: null, pages: [] }],
);
const byName = (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });
const order = groups.flatMap(group => [...(group.divider ? [group.divider] : []), ...[...group.pages].sort(byName)]);
order.forEach((page, index) => figma.root.insertChild(index, page));
return figma.root.children.map(page => page.name);
