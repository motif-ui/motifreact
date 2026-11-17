import { ComponentType, CSSProperties, Fragment, useEffect, useRef } from "react";
import styles from "./TokenCompare.module.scss";

export type CompareRow<P> = {
  label: string;
  props: P;
  // Clicks the first collapsed trigger once the cell is on screen, so dropdowns are visible without interaction
  open?: boolean;
  // Paints the second list option (group labels skipped) with the component's own hover color; there is no way to force :hover
  hover?: boolean;
};

export type CompareSection<P> = { title: string; rows: CompareRow<P>[]; note?: string };

// The list is inside the cell, or a portal on document.body that carries the cell's attributes (see openInCell)
const listIn = (attributes: string) => `:is(${attributes} [role="listbox"], [role="listbox"]${attributes})`;
const HOVERED_OPTION = 'li:nth-child(2 of [role="option"])';

const PREVIEW_CSS = [
  `${listIn("[data-compare-hover]")} ${HOVERED_OPTION} { background-color: var(--theme-color-surface-light-default); }`,
  `${listIn("[data-compare-next][data-compare-hover]")} ${HOVERED_OPTION} { background-color: var(--mtf-color-neutral-soft); }`,
].join("\n");

// An overlay rendered in a portal on document.body leaves its cell, so it gets the cell's mode and preview attributes
const PORTAL_ATTRIBUTES = ["data-mtf-mode", "data-compare-next", "data-compare-hover"];
const opening = { queue: Promise.resolve() };
const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

// Opens one cell at a time, so the portal its overlay adds to document.body can be told apart from the others
const openInCell = (cell: HTMLElement) => {
  opening.queue = opening.queue.then(async () => {
    const trigger = cell.querySelector<HTMLElement>('[aria-expanded="false"]');
    const before = new Set(document.body.children);
    trigger?.click();
    await nextFrame();
    await nextFrame();
    const portals = [...document.body.children].filter(element => !before.has(element));
    portals.forEach(portal =>
      PORTAL_ATTRIBUTES.forEach(name => {
        const value = cell.getAttribute(name);
        value !== null && portal.setAttribute(name, value);
      }),
    );
  });
};

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
    const cell = ref.current;
    if (!open || !cell) return;
    // An overlay chooses its placement from where its anchor is on screen when it opens, so the cell opens once it is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        openInCell(cell);
      },
      { threshold: 1 },
    );
    observer.observe(cell);
    return () => observer.disconnect();
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
