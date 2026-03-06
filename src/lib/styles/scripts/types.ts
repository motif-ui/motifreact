import type { LoaderContext } from "webpack";

/** Signature for css-loader's getLocalIdent function (custom class name generator) */
export type GetLocalIdentFn = (context: LoaderContext<unknown>, localIdentName: string, localName: string) => string;

/** Shape of css-loader's "modules" configuration object */
export type CSSModulesObject = {
  localIdentName?: string; // pattern for generated names (e.g. [name]__[local])
  getLocalIdent?: GetLocalIdentFn; // custom identifier generator
  auto?: boolean;
  [key: string]: unknown;
};

/** Shape of css-loader "options" object */
export type CSSLoaderOptions = {
  modules?: boolean | CSSModulesObject;
  [key: string]: unknown;
};

/** Object form of a Webpack RuleSetUseItem entry */
export type UseItemObject = {
  loader?: string;
  options?: CSSLoaderOptions; // specifically typed to avoid untyped casts later
  [key: string]: unknown;
};
