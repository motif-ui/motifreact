"use client";

import { useState } from "react";
import { type ChainNode, type TokenMap, buildChain, contrastOf, recipeIdOf, recipeOf, resolveToken, schemeOf, varRefs } from "./inspect";
import { STATES, type StateKey } from "./recipes";
import { isColorToken } from "./theme";
import styles from "./tokens.module.scss";

export type InspectorTab = "inspect" | "tokens" | "css";

type Props = {
  target: HTMLElement | null;
  pinned: boolean;
  root: HTMLElement | null;
  tokens: TokenMap;
  tab: InspectorTab;
  onTab: (tab: InspectorTab) => void;
  selectedToken: string | null;
  onSelectToken: (name: string) => void;
  onHighlight: (name: string | null) => void;
  themeCss: string;
};

const STATE_LABEL: Record<StateKey, string> = {
  base: "Varsayılan",
  hover: "Hover",
  active: "Active / basılı",
  focus: "Focus",
  placeholder: "Placeholder",
  disabled: "Disabled",
};

const LAYER_LABEL = { seed: "seed", palette: "palette", semantic: "semantic" } as const;

const Swatch = ({ value }: { value: string }) => <span className={styles.chainSwatch} style={{ background: value }} />;

const Chain = ({ node, consumer }: { node: ChainNode; consumer: HTMLElement }) => {
  const { name, source, token, expr, activeBranch, children } = node;
  const value = resolveToken(name, consumer);
  const isColor = isColorToken(name);
  return (
    <li className={styles.chainNode}>
      <div className={styles.chainRow}>
        {isColor && <Swatch value={value} />}
        <span className={styles.chainName}>{name}</span>
        {token && <span className={`${styles.layerBadge} ${styles[`layer_${token.layer}`]}`}>{LAYER_LABEL[token.layer]}</span>}
        {source !== "theme" && <span className={styles.overrideBadge}>{source} ezer</span>}
        {activeBranch && <span className={styles.branchBadge}>{activeBranch}</span>}
      </div>
      <div className={styles.chainExpr}>{expr}</div>
      {!children.length && <div className={styles.chainValue}>= {value}</div>}
      {token?.note && <div className={styles.chainNote}>{token.note}</div>}
      {children.length > 0 && (
        <ul className={styles.chain}>
          {children.map(child => (
            <Chain key={child.name} node={child} consumer={consumer} />
          ))}
        </ul>
      )}
    </li>
  );
};

const contextTrail = (el: HTMLElement, root: HTMLElement): HTMLElement[] =>
  el === root || !el.parentElement
    ? [root]
    : [...contextTrail(el.parentElement, root), ...(el.dataset.surface || el.dataset.recipe?.startsWith("table/row") ? [el] : [])];

const TokenDetail = ({ name, consumer, root, tokens }: { name: string; consumer: HTMLElement; root: HTMLElement; tokens: TokenMap }) => (
  <div className={styles.inspectBlock}>
    <div className={styles.inspectTitle}>
      <strong>Token</strong>
      <span data-recipe="help">üzerine geldiğin token ve bağımlılıkları</span>
    </div>
    <ul className={styles.chain}>
      <Chain node={buildChain(name, consumer, root, tokens, schemeOf(consumer))} consumer={consumer} />
    </ul>
  </div>
);

const RecipeDetail = ({ target, root, tokens }: { target: HTMLElement; root: HTMLElement; tokens: TokenMap }) => {
  const recipe = recipeOf(target);
  const scheme = schemeOf(target);
  const ratio = contrastOf(target);
  const trail = contextTrail(target, root).filter(node => node !== target);
  return recipe ? (
    <div className={styles.inspectBlock}>
      <div className={styles.inspectTitle}>
        <strong>{recipe.label}</strong>
        <span className={styles.chainName}>
          &lt;{target.tagName.toLowerCase()}&gt; · {recipe.id}
        </span>
      </div>
      <div className={styles.meta}>
        <span>
          Bağlam:{" "}
          {trail.map((node, index) => (
            <span key={index} className={styles.trailItem}>
              {recipeIdOf(node)} ({schemeOf(node)})
            </span>
          ))}
          <span className={styles.trailItem}>bu eleman ({scheme})</span>
        </span>
        <span>
          Kontrast (yazı/zemin): <b>{ratio.toFixed(2)}:1</b>{" "}
          <span className={ratio >= 4.5 ? styles.pass : ratio >= 3 ? styles.warn : styles.fail}>
            {ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA büyük" : "yetersiz"}
          </span>
        </span>
      </div>
      {recipe.note && <p className={styles.chainNote}>{recipe.note}</p>}
      {STATES.filter(state => recipe.states[state]).map(state => {
        const entries = Object.entries(recipe.states[state] ?? {}).filter(([, value]) => varRefs(value).length > 0);
        const colorEntries = entries.filter(([, value]) => varRefs(value).some(isColorToken));
        const otherEntries = entries.filter(([, value]) => !varRefs(value).some(isColorToken));
        return entries.length ? (
          <div key={state} className={styles.stateBlock}>
            <div className={styles.stateTitle}>{STATE_LABEL[state]}</div>
            {colorEntries.map(([prop, value]) => (
              <details key={prop} open className={styles.decl}>
                <summary>
                  <span className={styles.prop}>{prop}</span>
                  <span className={styles.chainExpr}>{value}</span>
                </summary>
                <ul className={styles.chain}>
                  {varRefs(value).map(ref => (
                    <Chain key={ref} node={buildChain(ref, target, root, tokens, scheme)} consumer={target} />
                  ))}
                </ul>
              </details>
            ))}
            {otherEntries.length > 0 && (
              <details className={styles.decl}>
                <summary>
                  <span className={styles.prop}>ölçü & tipografi ({otherEntries.length})</span>
                </summary>
                {otherEntries.map(([prop, value]) => (
                  <div key={prop} className={styles.plainDecl}>
                    <span className={styles.prop}>{prop}</span>
                    <span className={styles.chainExpr}>
                      {value} ={" "}
                      {varRefs(value)
                        .map(ref => resolveToken(ref, target))
                        .join(" ")}
                    </span>
                  </div>
                ))}
              </details>
            )}
          </div>
        ) : null;
      })}
    </div>
  ) : null;
};

const TokenList = ({ tokens, onHighlight, onSelectToken }: Pick<Props, "tokens" | "onHighlight" | "onSelectToken">) => {
  const groups = [...tokens.values()].reduce<Map<string, string[]>>(
    (acc, { group, name }) => acc.set(group, [...(acc.get(group) ?? []), name]),
    new Map(),
  );
  const ordered = [...groups.entries()].sort(
    ([a], [b]) => Number(a.startsWith("Seed") || a.startsWith("Palette")) - Number(b.startsWith("Seed") || b.startsWith("Palette")),
  );
  return (
    <div className={styles.tokenList} onMouseLeave={() => onHighlight(null)}>
      <p data-recipe="help">Üzerine gel: kullanan elemanlar sayfada işaretlenir (dolaylı kullananlar dahil). Tıkla: zinciri gör.</p>
      {ordered.map(([group, names]) => (
        <details key={group} open={!group.startsWith("Palette") && !group.startsWith("Seed")} className={styles.tokenGroup}>
          <summary>
            {group} <span data-recipe="help">({names.length})</span>
          </summary>
          {names.map(name => (
            <button
              key={name}
              type="button"
              className={styles.tokenRow}
              onMouseEnter={() => onHighlight(name)}
              onClick={() => onSelectToken(name)}
            >
              {isColorToken(name) ? <Swatch value={`var(${name})`} /> : <span className={styles.chainSwatchEmpty} />}
              <span className={styles.chainName}>{name}</span>
            </button>
          ))}
        </details>
      ))}
    </div>
  );
};

const CssExport = ({ css }: { css: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard.writeText(css).then(() => setCopied(true));
  return (
    <div className={styles.cssExport}>
      <div className={styles.rowBetween}>
        <span data-recipe="help">Mevcut seed&apos;lerle üretilmiş tema (:root kapsamlı)</span>
        <button type="button" data-recipe="btn/soft/primary" data-size="sm" onClick={() => void copy()}>
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
      <pre className={styles.pre}>{css}</pre>
    </div>
  );
};

export const Inspector = ({ target, pinned, root, tokens, tab, onTab, selectedToken, onSelectToken, onHighlight, themeCss }: Props) => {
  const tokenName = target ? target.dataset.token : selectedToken;
  const consumer = target ?? root;
  return (
    <div className={styles.inspectorInner}>
      <div className={styles.tabs}>
        {(
          [
            ["inspect", "İnceleyici"],
            ["tokens", "Tokenlar"],
            ["css", "CSS"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            data-recipe={key === tab ? "btn/soft/primary" : "btn/ghost/neutral"}
            data-size="sm"
            onClick={() => onTab(key)}
          >
            {label}
          </button>
        ))}
        {pinned && <span className={styles.pinBadge}>sabit · Esc</span>}
      </div>
      <div className={styles.inspectorBody}>
        {tab === "inspect" && !consumer && <p data-recipe="help">Yükleniyor…</p>}
        {tab === "inspect" && consumer && root && !target && !tokenName && (
          <div className={styles.empty}>
            <strong>Bir elemanın üzerine gel</strong>
            <p data-recipe="text/muted">
              Hangi parçasının (zemin, yazı, border, hover…) hangi tokenı kullandığını ve zincirin seed&apos;e kadar inişini burada
              görürsün. Tıklayınca sabitlenir.
            </p>
          </div>
        )}
        {tab === "inspect" && consumer && root && tokenName && (
          <TokenDetail name={tokenName} consumer={consumer} root={root} tokens={tokens} />
        )}
        {tab === "inspect" && target && root && !target.dataset.token && <RecipeDetail target={target} root={root} tokens={tokens} />}
        {tab === "tokens" && <TokenList tokens={tokens} onHighlight={onHighlight} onSelectToken={onSelectToken} />}
        {tab === "css" && <CssExport css={themeCss} />}
      </div>
    </div>
  );
};
