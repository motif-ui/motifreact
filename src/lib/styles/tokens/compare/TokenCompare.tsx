import { ComponentType, CSSProperties, Fragment, useEffect, useRef } from "react";
import styles from "./TokenCompare.module.scss";

export type CompareRow<P> = {
  label: string;
  props: P;
  // Clicks the first collapsed trigger after mount, so dropdowns are visible without interaction
  open?: boolean;
  // Paints the second list option (group labels skipped) with the component's own hover color; there is no way to force :hover
  hover?: boolean;
};

export type CompareSection<P> = { title: string; rows: CompareRow<P>[]; note?: string };

const HOVERED_OPTION = '[data-compare-hover] [role="listbox"] li:nth-child(2 of [role="option"])';

const PREVIEW_CSS = [
  `${HOVERED_OPTION} { background-color: var(--theme-color-surface-light-default); }`,
  `[data-compare-next]${HOVERED_OPTION} { background-color: var(--mtf-color-neutral-soft); }`,
].join("\n");

// current: the component before migration (baseline/, frozen from git) · light/dark: the live component
const COLUMNS = [
  { key: "current", title: "Bugün" },
  { key: "light", title: "Yeni · Light" },
  { key: "dark", title: "Yeni · Dark" },
] as const;

type Column = (typeof COLUMNS)[number]["key"];

type CellProps<P> = { column: Column; row: CompareRow<P>; current: ComponentType<P>; next: ComponentType<P>; style: CSSProperties };

const Cell = <P extends object>({ column, row: { props, open, hover }, current: Current, next: Next, style }: CellProps<P>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isNext = column !== "current";

  useEffect(() => {
    open && ref.current?.querySelector<HTMLElement>('[aria-expanded="false"]')?.click();
  }, [open]);

  return (
    <div
      ref={ref}
      style={style}
      className={`${styles.cell} ${open ? styles.tall : ""}`}
      data-mtf-mode={column === "dark" ? "dark" : undefined}
      data-compare-next={isNext ? "" : undefined}
      data-compare-hover={hover ? "" : undefined}
    >
      {isNext ? <Next {...props} /> : <Current {...props} />}
    </div>
  );
};

type TokenCompareProps<P> = { sections: CompareSection<P>[]; current: ComponentType<P>; next: ComponentType<P> };

type Line<P> = { kind: "title" | "note"; text: string } | { kind: "row"; row: CompareRow<P> };

const toLines = <P,>(sections: CompareSection<P>[]): Line<P>[] =>
  sections.flatMap(({ title, rows, note }) => [
    { kind: "title" as const, text: title },
    ...(note ? [{ kind: "note" as const, text: note }] : []),
    ...rows.map(row => ({ kind: "row" as const, row })),
  ]);

// One grid for the whole screen, every item placed on an explicit row: each column is a single panel spanning all rows,
// and the cells sit on top of it transparently
const placeAt = (line: number, column = 1, span = 1): CSSProperties => ({ gridRow: line + 2, gridColumn: `${column} / span ${span}` });

/** Renders every row three times: the pre-migration baseline, then the live component in light and dark mode. */
export const TokenCompare = <P extends object>({ sections, current, next }: TokenCompareProps<P>) => {
  const lines = toLines(sections);

  return (
    <div className={styles.root}>
      <style>{PREVIEW_CSS}</style>
      {COLUMNS.map(({ key }, index) => (
        <div
          key={key}
          className={`${styles.panel} ${styles[key]}`}
          data-mtf-mode={key === "dark" ? "dark" : undefined}
          style={{ gridRow: `2 / span ${lines.length}`, gridColumn: index + 2 }}
        />
      ))}
      <span className={styles.header} style={{ gridRow: 1, gridColumn: 1 }} />
      {COLUMNS.map(({ key, title }, index) => (
        <span key={key} className={styles.header} style={{ gridRow: 1, gridColumn: index + 2 }}>
          {title}
        </span>
      ))}
      {lines.map((line, index) =>
        line.kind === "row" ? (
          <Fragment key={`row-${index}`}>
            <span className={styles.label} style={placeAt(index)}>
              {line.row.label}
            </span>
            {COLUMNS.map(({ key }, column) => (
              <Cell key={key} column={key} row={line.row} current={current} next={next} style={placeAt(index, column + 2)} />
            ))}
          </Fragment>
        ) : (
          <span key={`${line.kind}-${index}`} className={styles[line.kind]} style={placeAt(index)}>
            {line.text}
          </span>
        ),
      )}
    </div>
  );
};
