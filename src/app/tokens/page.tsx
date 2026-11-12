"use client";

import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { Inspector, type InspectorTab } from "./Inspector";
import { dependentsOf, findInspectable, recipeOf, recipeTokenRefs } from "./inspect";
import { buildRecipeCss } from "./recipes";
import { ButtonMatrix, Hierarchy, Scenario, SurfaceLadder } from "./sections";
import { COLOR_SEEDS, DEFAULT_SEEDS, PRESETS, type Seeds, buildThemeCss, buildTokens, seedVars } from "./theme";
import styles from "./tokens.module.scss";

type Mode = "light" | "dark";

/** Seed değerleri root'a inline basıldığı için CSS'in kendisi statik: seed değişince yeniden üretilmez. */
const STATIC_CSS = `${buildThemeCss(DEFAULT_SEEDS)}\n${buildRecipeCss()}`;

const RANGES = [
  { key: "radius", label: "Radius", min: 0, max: 20, step: 1, unit: "px" },
  { key: "space", label: "Space birimi", min: 3, max: 6, step: 0.5, unit: "px" },
  { key: "fontSize", label: "Font boyutu", min: 12, max: 17, step: 1, unit: "px" },
] as const;

const ThemePanel = ({ seeds, onChange }: { seeds: Seeds; onChange: (patch: Partial<Seeds>) => void }) => (
  <div className={styles.panelStack}>
    <div className={styles.panelGroup}>
      <span data-recipe="label">Hazır temalar</span>
      <div className={styles.presets}>
        {PRESETS.map(({ name, seeds: preset }) => (
          <button key={name} type="button" data-recipe="btn/outline/neutral" data-size="sm" onClick={() => onChange(preset)}>
            <span className={styles.presetDot} style={{ background: preset.primary }} />
            {name}
          </button>
        ))}
      </div>
    </div>
    <div className={styles.panelGroup}>
      <span data-recipe="label">Renk seed&apos;leri</span>
      <span data-recipe="help">Temanın tamamı bu 6 renkten türüyor. Asıl 3&apos;ü: primary, accent, neutral.</span>
      {COLOR_SEEDS.map(key => (
        <label key={key} className={styles.seedRow}>
          <input
            type="color"
            className={styles.colorInput}
            value={seeds[key]}
            onChange={event => onChange({ [key]: event.target.value })}
          />
          <span data-recipe="text/default">{key}</span>
          <code data-recipe="code">{seeds[key]}</code>
        </label>
      ))}
    </div>
    <div className={styles.panelGroup}>
      <span data-recipe="label">Ölçü seed&apos;leri</span>
      {RANGES.map(({ key, label, min, max, step, unit }) => (
        <label key={key} className={styles.rangeRow}>
          <span className={styles.rowBetween}>
            <span data-recipe="text/default">{label}</span>
            <code data-recipe="code">
              {seeds[key]}
              {unit}
            </code>
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={seeds[key]}
            onChange={event => onChange({ [key]: Number(event.target.value) })}
            data-recipe="check"
            style={{ width: "100%" }}
          />
        </label>
      ))}
    </div>
    <button type="button" data-recipe="btn/ghost/neutral" data-size="sm" onClick={() => onChange(DEFAULT_SEEDS)}>
      Varsayılana dön
    </button>
  </div>
);

const Overlay = ({ el, className }: { el: HTMLElement; className: string }) => {
  const { top, left, width, height } = el.getBoundingClientRect();
  return <div className={className} style={{ top, left, width, height }} />;
};

const TokenLab = () => {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [main, setMain] = useState<HTMLElement | null>(null);
  const [seeds, setSeeds] = useState<Seeds>(DEFAULT_SEEDS);
  const [mode, setMode] = useState<Mode>("light");
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [pinned, setPinned] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState<InspectorTab>("inspect");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // DOM'dan okunan değerler (renk, rect) commit'ten sonra güncellensin diye bir frame sonra yeniden çiz.
  const refresh = () => requestAnimationFrame(() => setTick(tick => tick + 1));

  const tokens = useMemo(() => new Map(buildTokens(seeds).map(token => [token.name, token])), [seeds]);
  const themeCss = useMemo(() => buildThemeCss(seeds, ":root"), [seeds]);
  const dependents = useMemo(() => (highlight ? dependentsOf(highlight, tokens) : null), [highlight, tokens]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setPinned(null);
    const onScroll = () => setTick(tick => tick + 1);
    window.addEventListener("keydown", onKey);
    root?.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("keydown", onKey);
      root?.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [root]);

  const updateSeeds = (patch: Partial<Seeds>) => {
    setSeeds(current => ({ ...current, ...patch }));
    refresh();
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    refresh();
  };

  const onMainClick = (event: MouseEvent) => {
    const el = findInspectable(event.target);
    el && setPinned(current => (current === el ? null : el));
    el && setTab("inspect");
  };

  const selectToken = (name: string) => {
    setSelectedToken(name);
    setPinned(null);
    setHovered(null);
    setTab("inspect");
  };

  const target = pinned ?? hovered;
  const highlighted =
    dependents && main
      ? [...main.querySelectorAll<HTMLElement>("[data-recipe], [data-surface], [data-token]")].filter(el => {
          const recipe = recipeOf(el);
          const refs = recipe ? [...recipeTokenRefs(recipe)] : [el.dataset.token ?? ""];
          return refs.some(ref => dependents.has(ref));
        })
      : [];

  return (
    <div ref={setRoot} data-tk-root="" data-mode={mode} className={styles.root} style={seedVars(seeds)}>
      <style dangerouslySetInnerHTML={{ __html: STATIC_CSS }} />
      <header data-tk-chrome="" data-surface="default" className={styles.header}>
        <div className={styles.stackTight}>
          <h1 data-recipe="heading" className={styles.headerTitle}>
            Motif Token Lab
          </h1>
          <span data-recipe="text/muted">Seed → Palette → Semantic. Component token yok; elemanlar sadece semantic token tüketir.</span>
        </div>
        <div className={styles.row}>
          {(["light", "dark"] as const).map(option => (
            <button
              key={option}
              type="button"
              data-recipe={option === mode ? "btn/solid/neutral" : "btn/ghost/neutral"}
              data-size="sm"
              onClick={() => switchMode(option)}
            >
              {option === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
      </header>
      <div className={styles.layout}>
        <aside data-tk-chrome="" data-surface="default" className={styles.themePanel}>
          <ThemePanel seeds={seeds} onChange={updateSeeds} />
        </aside>
        <main
          ref={setMain}
          className={styles.main}
          onMouseOver={event => setHovered(findInspectable(event.target))}
          onMouseLeave={() => setHovered(null)}
          onClick={onMainClick}
        >
          <Hierarchy />
          <SurfaceLadder />
          <ButtonMatrix />
          <Scenario />
        </main>
        <aside data-tk-chrome="" data-surface="default" className={styles.inspector}>
          <Inspector
            target={target}
            pinned={Boolean(pinned)}
            root={root}
            tokens={tokens}
            tab={tab}
            onTab={setTab}
            selectedToken={selectedToken}
            onSelectToken={selectToken}
            onHighlight={setHighlight}
            themeCss={themeCss}
          />
        </aside>
      </div>
      {highlighted.map((el, index) => (
        <Overlay key={index} el={el} className={styles.overlayHighlight} />
      ))}
      {target && <Overlay el={target} className={pinned ? styles.overlayPinned : styles.overlay} />}
    </div>
  );
};

export default TokenLab;
