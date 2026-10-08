import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Named imports from these modules are components: `import { Button } from "@motif-ui/react"` (src/blocks), `from "../lib"`
const COMPONENTS_ENTRY = /^@motif-ui\/react$|(^|\/)lib(\/index)?$/;
// Default imports from these paths are components: `import Button from "@/components/Button"`, `from "../components/Button/Button"`
const COMPONENT_PATH = /components\/([A-Z]\w*)(?:\/[A-Z]\w*)?$/;

const COMPONENTS_DIR = fileURLToPath(new URL("../../src/lib/components", import.meta.url));

/**
 * Reports a JSX attribute whose value equals the component's default value, e.g. `<Button size="md" />`.
 * The default values are read from the components source (see extractDefaults below).
 *
 * @param {() => Record<string, Record<string, unknown>>} getDefaults Returns the defaults map: { [component]: { [prop]: value } }
 * @returns {import("eslint").Rule.RuleModule}
 */
export const createNoRedundantDefaultProps = getDefaults => ({
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description: "Disallow passing a prop with the same value as the component's default value",
    },
    messages: {
      redundant: '"{{prop}}" of <{{component}}> is already {{value}} by default. Remove the redundant prop.',
    },
    schema: [],
  },

  create(context) {
    const defaults = getDefaults();

    // local identifier -> component name ("Button"), or "*" for namespace imports
    const localComponents = new Map();

    const resolveComponentName = nameNode => {
      if (nameNode.type === "JSXIdentifier") {
        const component = localComponents.get(nameNode.name);
        return component === "*" ? undefined : component;
      }
      if (nameNode.type === "JSXMemberExpression") {
        // <M.Grid.Row> -> ["M", "Grid", "Row"]
        const [rootName, ...parts] = getMemberNameParts(nameNode) ?? [];
        const root = rootName && localComponents.get(rootName);
        if (!root) return undefined;
        return root === "*" ? parts.join(".") : [root, ...parts].join(".");
      }
      return undefined;
    };

    return {
      ImportDeclaration(node) {
        if (node.importKind === "type") return;
        const source = node.source.value;
        const isEntry = COMPONENTS_ENTRY.test(source);
        const pathMatch = !isEntry && COMPONENT_PATH.exec(source);
        if (!isEntry && !pathMatch) return;

        for (const specifier of node.specifiers) {
          if (specifier.importKind === "type") continue;
          if (specifier.type === "ImportSpecifier" && isEntry) {
            const imported = specifier.imported.type === "Identifier" ? specifier.imported.name : specifier.imported.value;
            localComponents.set(specifier.local.name, imported);
          } else if (specifier.type === "ImportNamespaceSpecifier" && isEntry) {
            localComponents.set(specifier.local.name, "*");
          } else if (specifier.type === "ImportDefaultSpecifier" && pathMatch) {
            localComponents.set(specifier.local.name, pathMatch[1]);
          }
        }
      },

      JSXOpeningElement(node) {
        const component = resolveComponentName(node.name);
        const componentDefaultValues = component && defaults[component];
        if (!componentDefaultValues) return;

        node.attributes.forEach((attribute, index) => {
          if (attribute.type !== "JSXAttribute" || attribute.name.type !== "JSXIdentifier") return;
          const prop = attribute.name.name;
          if (!Object.hasOwn(componentDefaultValues, prop)) return;

          const value = readAttributeValue(attribute.value);
          if (!value.known || value.value !== componentDefaultValues[prop]) return;

          // A spread before the attribute may set another value which this attribute overrides. Removing it would change the behaviour.
          const hasSpreadBefore = node.attributes.slice(0, index).some(a => a.type === "JSXSpreadAttribute");

          context.report({
            node: attribute,
            messageId: "redundant",
            data: { prop, component, value: JSON.stringify(componentDefaultValues[prop]) },
            fix: hasSpreadBefore
              ? null
              : fixer => {
                  const tokenBefore = context.sourceCode.getTokenBefore(attribute);
                  return fixer.removeRange([tokenBefore.range[1], attribute.range[1]]);
                },
          });
        });
      },
    };
  },
});

const getMemberNameParts = node => {
  if (node.type === "JSXIdentifier") return [node.name];
  if (node.type !== "JSXMemberExpression") return undefined;
  const objectParts = getMemberNameParts(node.object);
  return objectParts && [...objectParts, node.property.name];
};

/** Returns the static value of a JSX attribute, `{ known: false }` when it cannot be determined statically. */
const readAttributeValue = valueNode => {
  // <Button pill />
  if (valueNode === null) return { known: true, value: true };
  if (valueNode.type === "Literal") return { known: true, value: valueNode.value };
  if (valueNode.type !== "JSXExpressionContainer") return { known: false };
  return readExpressionValue(valueNode.expression);
};

const readExpressionValue = expression => {
  switch (expression.type) {
    case "Literal":
      return typeof expression.value === "object" ? { known: false } : { known: true, value: expression.value }; // skip regex/bigint
    case "TemplateLiteral":
      return expression.expressions.length === 0 ? { known: true, value: expression.quasis[0].value.cooked } : { known: false };
    case "UnaryExpression":
      if (expression.operator === "-" && expression.argument.type === "Literal" && typeof expression.argument.value === "number") {
        return { known: true, value: -expression.argument.value };
      }
      return { known: false };
    case "TSAsExpression":
    case "TSSatisfiesExpression":
      return readExpressionValue(expression.expression);
    default:
      return { known: false };
  }
};

/**
 * Statically extracts the default prop values of every component under `componentsDir`
 * by reading the destructuring defaults in the component source, e.g.
 *   const { size = "md" } = usePropsWithThemeDefaults("Button", props);
 *
 * Compound components created with Object.assign (Tab.Panel, Grid.Row, ...) are keyed as "Parent.Child".
 * Only primitive (string, number, boolean) defaults are collected.
 *
 * @param {string} componentsDir Absolute path of the components directory (each sub directory must have an index.ts)
 * @returns {Record<string, Record<string, string | number | boolean>>}
 */
export const extractDefaults = componentsDir => {
  const entries = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => ({ name: dirent.name, file: path.join(componentsDir, dirent.name, "index.ts") }))
    .filter(({ file }) => fs.existsSync(file));

  // The project's tsconfig is used so that path aliases (e.g. "@/components/*") resolve.
  const configPath = ts.findConfigFile(componentsDir, ts.sys.fileExists);
  const { options } = configPath
    ? ts.parseJsonConfigFileContent(ts.readConfigFile(configPath, ts.sys.readFile).config, ts.sys, path.dirname(configPath))
    : { options: { jsx: ts.JsxEmit.ReactJSX } };
  const program = ts.createProgram(
    entries.map(({ file }) => file),
    { ...options, noEmit: true, incremental: false, plugins: [] },
  );
  const checker = program.getTypeChecker();
  const result = {};

  for (const { name, file } of entries) {
    const sourceFile = program.getSourceFile(file);
    const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
    const defaultExport = moduleSymbol && checker.getExportsOfModule(moduleSymbol).find(s => s.escapedName === "default");
    if (defaultExport) {
      collectComponent(checker, resolveDeclarationExpression(checker, defaultExport), name, result, new Set());
    }
  }

  return result;
};

const isWrapper = node =>
  ts.isParenthesizedExpression(node) ||
  ts.isAsExpression(node) ||
  ts.isSatisfiesExpression(node) ||
  ts.isTypeAssertionExpression(node) ||
  ts.isNonNullExpression(node);

/** Strips `(x)`, `x as T`, `x satisfies T`, `<T>x` and `x!` wrappers. */
const unwrap = node => (node && isWrapper(node) ? unwrap(node.expression) : node);

const resolveSymbol = (checker, symbol) => (symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol);

/** Returns the expression (function, Object.assign call, ...) a symbol refers to. */
const resolveDeclarationExpression = (checker, symbol) => {
  const declaration = resolveSymbol(checker, symbol).valueDeclaration;
  if (!declaration) return undefined;
  if (ts.isFunctionDeclaration(declaration)) return declaration;
  if (ts.isVariableDeclaration(declaration)) return unwrap(declaration.initializer);
  if (ts.isExportAssignment(declaration)) return unwrap(declaration.expression);
  return undefined;
};

const resolveExpression = (checker, expression) => {
  const node = unwrap(expression);
  if (node && ts.isIdentifier(node)) {
    const symbol = checker.getSymbolAtLocation(node);
    return symbol && resolveDeclarationExpression(checker, symbol);
  }
  return node;
};

const isCall = (node, name) => {
  if (!ts.isCallExpression(node)) return false;
  const callee = node.expression;
  return (
    (ts.isIdentifier(callee) && callee.text === name) || (ts.isPropertyAccessExpression(callee) && callee.name.text === name) // Object.assign, React.memo, ...
  );
};

const collectComponent = (checker, expression, key, result, visited) => {
  const node = resolveExpression(checker, expression);
  if (!node || visited.has(node)) return;
  visited.add(node);

  if (isCall(node, "assign")) {
    const [target, ...sources] = node.arguments;
    collectComponent(checker, target, key, result, visited);
    for (const source of sources) {
      const object = unwrap(source);
      if (!object || !ts.isObjectLiteralExpression(object)) continue;
      for (const property of object.properties) {
        const propertyName = property.name && ts.isIdentifier(property.name) ? property.name.text : undefined;
        if (!propertyName || !/^[A-Z]/.test(propertyName)) continue;
        if (ts.isPropertyAssignment(property)) {
          collectComponent(checker, property.initializer, `${key}.${propertyName}`, result, visited);
        } else if (ts.isShorthandPropertyAssignment(property)) {
          const symbol = checker.getShorthandAssignmentValueSymbol(property);
          symbol && collectComponent(checker, resolveDeclarationExpression(checker, symbol), `${key}.${propertyName}`, result, visited);
        }
      }
    }
    return;
  }

  if (isCall(node, "memo") || isCall(node, "forwardRef")) {
    collectComponent(checker, node.arguments[0], key, result, visited);
    return;
  }

  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionDeclaration(node)) {
    const defaults = collectFunctionDefaults(checker, node);
    if (Object.keys(defaults).length) {
      result[key] = { ...result[key], ...defaults };
    }
  }
};

/** Collects defaults from `(props) => { const {a = 1} = props }`, `({ a = 1 }) => ...` and `usePropsWithThemeDefaults(name, props)`. */
const collectFunctionDefaults = (checker, fn) => {
  const [propsParam] = fn.parameters;
  if (!propsParam) return {};
  if (ts.isObjectBindingPattern(propsParam.name)) return readBindingDefaults(checker, propsParam.name);
  if (!ts.isIdentifier(propsParam.name) || !fn.body) return {};

  // Identifiers that hold the props: the parameter itself, `const props = usePropsWithThemeDefaults("X", p)`
  // and rest elements such as `const { a, ...props } = p`.
  const propsNames = new Set([propsParam.name.text]);
  const isPropsSource = initializer => {
    const node = unwrap(initializer);
    if (!node) return false;
    if (ts.isIdentifier(node)) return propsNames.has(node.text);
    return (
      isCall(node, "usePropsWithThemeDefaults") &&
      node.arguments.some(arg => {
        const argument = unwrap(arg);
        return ts.isIdentifier(argument) && propsNames.has(argument.text);
      })
    );
  };

  const defaults = {};
  const visit = node => {
    // Nested functions have their own scope; their destructurings are not the component's props.
    if (node !== fn.body && ts.isFunctionLike(node)) return;
    if (ts.isVariableDeclaration(node) && isPropsSource(node.initializer)) {
      if (ts.isIdentifier(node.name)) {
        propsNames.add(node.name.text);
      } else if (ts.isObjectBindingPattern(node.name)) {
        Object.assign(defaults, readBindingDefaults(checker, node.name));
        const rest = node.name.elements.find(element => element.dotDotDotToken && ts.isIdentifier(element.name));
        rest && propsNames.add(rest.name.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(fn.body);
  return defaults;
};

const readBindingDefaults = (checker, pattern) => {
  const defaults = {};
  for (const element of pattern.elements) {
    if (element.dotDotDotToken || !element.initializer) continue;
    const nameNode = element.propertyName ?? element.name;
    if (!ts.isIdentifier(nameNode)) continue;
    const value = readPrimitive(checker, element.initializer);
    if (value !== undefined) defaults[nameNode.text] = value;
  }
  return defaults;
};

const readPrimitive = (checker, expression) => {
  const node = unwrap(expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) {
    return -Number(node.operand.text);
  }
  // Constants such as `size = DEFAULT_SIZE` resolve to their literal type.
  const type = checker.getTypeAtLocation(node);
  if (type.isStringLiteral() || type.isNumberLiteral()) return type.value;
  if (type.flags & ts.TypeFlags.BooleanLiteral) return checker.typeToString(type) === "true";
  return undefined;
};

// Extracted once per ESLint process, on the first use of the rule
const cache = {};
export default createNoRedundantDefaultProps(() => (cache.defaults ??= extractDefaults(COMPONENTS_DIR)));
