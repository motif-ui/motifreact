/* global figma */
// Runs inside Figma (the MCP use_figma tool or a development plugin), not in Node. bundle.ts appends
// `return await importTokens(<payload>)`, where the payload is a part of <figma theme>.figma.json (basic) in the compact form below.
// Idempotent: collections, modes, variables and styles are matched by name, so a second run updates instead of duplicating.

const FONT_STYLES = { 100: "Thin", 200: "Extra Light", 300: "Light", 400: "Regular", 500: "Medium", 600: "Semi Bold", 700: "Bold" };

const toRgba = hex => {
  const digits = hex.replace("#", "");
  const channel = index => parseInt(digits.slice(index, index + 2), 16) / 255;
  return { r: channel(0), g: channel(2), b: channel(4), a: digits.length === 8 ? channel(6) : 1 };
};

const TYPES = { C: "COLOR", F: "FLOAT", S: "STRING" };

// Compact collection: scopes are listed once, each variable is [name, type letter, scope index, hidden, values per mode,
// description?]; an alias value is "@<variable name>"
const expandCollection = ({ name, modes, scopes, variables }) => ({
  name,
  modes,
  variables: variables.map(([variableName, type, scope, hidden, values, description]) => ({
    name: variableName,
    type: TYPES[type],
    scopes: scopes[scope] ? scopes[scope].split(",") : [],
    hiddenFromPublishing: hidden === 1,
    description,
    values: Object.fromEntries(
      modes.map((mode, index) => [
        mode,
        typeof values[index] === "string" && values[index].startsWith("@") ? { alias: values[index].slice(1) } : values[index],
      ]),
    ),
  })),
});

const cssVar = name => `var(--mtf-${name.replaceAll("/", "-")})`;

const variablesByName = async () => new Map((await figma.variables.getLocalVariablesAsync()).map(variable => [variable.name, variable]));

const upsertCollection = async ({ name, modes }) => {
  const collection =
    (await figma.variables.getLocalVariableCollectionsAsync()).find(existing => existing.name === name) ??
    figma.variables.createVariableCollection(name);
  // A new collection starts with one mode: it takes the first name, the rest are added when missing
  collection.renameMode(collection.modes[0].modeId, modes[0]);
  modes.slice(1).forEach(mode => collection.modes.some(({ name: current }) => current === mode) || collection.addMode(mode));
  return collection;
};

const importCollection = async collection => {
  const target = await upsertCollection(collection);
  const before = await variablesByName();
  // First every variable exists, then values are set: an alias may point at a variable created later in the same collection
  collection.variables.forEach(({ name, type, scopes, hiddenFromPublishing, description }) => {
    const variable = before.get(name) ?? figma.variables.createVariable(name, target, type);
    variable.scopes = scopes;
    variable.hiddenFromPublishing = hiddenFromPublishing;
    variable.description = description ?? "";
    variable.setVariableCodeSyntax("WEB", cssVar(name));
  });
  const byName = await variablesByName();
  const modeIds = Object.fromEntries(target.modes.map(({ name, modeId }) => [name, modeId]));
  const missing = collection.variables.flatMap(({ name, type, values }) =>
    Object.entries(values).flatMap(([mode, value]) => {
      const alias = typeof value === "object" ? byName.get(value.alias) : undefined;
      const resolved =
        typeof value === "object" ? alias && figma.variables.createVariableAlias(alias) : type === "COLOR" ? toRgba(value) : value;
      resolved !== undefined && byName.get(name).setValueForMode(modeIds[mode], resolved);
      return resolved === undefined ? [`${name} (${mode}): alias ${value.alias} not found`] : [];
    }),
  );
  return { collection: target.name, variables: collection.variables.length, modes: target.modes.map(({ name }) => name), missing };
};

// Follows aliases down to the literal of a single-mode variable (typography values)
const literalOf = async variable => {
  const value = Object.values(variable.valuesByMode)[0];
  return value?.type === "VARIABLE_ALIAS" ? literalOf(await figma.variables.getVariableByIdAsync(value.id)) : value;
};

const importEffectStyles = async (effectStyles, byName) => {
  const existing = await figma.getLocalEffectStylesAsync();
  return effectStyles.map(({ name, description, effects }) => {
    const style = existing.find(current => current.name === name) ?? figma.createEffectStyle();
    style.name = name;
    style.description = description ?? "";
    style.effects = effects.map(({ offset, radius, spread, color }) =>
      figma.variables.setBoundVariableForEffect(
        {
          type: "DROP_SHADOW",
          offset,
          radius,
          spread,
          color: { r: 0, g: 0, b: 0, a: 0.16 },
          blendMode: "NORMAL",
          visible: true,
          showShadowBehindNode: false,
        },
        "color",
        byName.get(color.alias),
      ),
    );
    return style.id;
  });
};

const importTextStyles = async (textStyles, byName) => {
  const existing = await figma.getLocalTextStylesAsync();
  const created = [];
  for (const { name, fontFamily, fontSize, lineHeight, fontWeight } of textStyles) {
    const [family, size, height, weight] = await Promise.all(
      [fontFamily, fontSize, lineHeight, fontWeight].map(({ alias }) => literalOf(byName.get(alias))),
    );
    const fontName = { family, style: FONT_STYLES[weight] };
    await figma.loadFontAsync(fontName);
    const style = existing.find(current => current.name === name) ?? figma.createTextStyle();
    style.name = name;
    style.fontName = fontName;
    style.fontSize = size;
    style.lineHeight = { unit: "PIXELS", value: height };
    style.setBoundVariable("fontFamily", byName.get(fontFamily.alias));
    style.setBoundVariable("fontSize", byName.get(fontSize.alias));
    style.setBoundVariable("lineHeight", byName.get(lineHeight.alias));
    style.setBoundVariable("fontWeight", byName.get(fontWeight.alias));
    created.push(style.id);
  }
  return created;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function importTokens({ collections = [], effectStyles = [], textStyles = [] }) {
  const imported = [];
  for (const collection of collections) imported.push(await importCollection(expandCollection(collection)));
  const byName = await variablesByName();
  return {
    collections: imported,
    effectStyles: (await importEffectStyles(effectStyles, byName)).length,
    textStyles: (await importTextStyles(textStyles, byName)).length,
  };
}
