"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Button, InputDateRange, InputText, Modal, Popover } from "../lib";
import { usePopover } from "../lib/hooks";
import { OverlayCloseReason, OverlayPosition } from "../lib/types";

const placements: OverlayPosition[] = ["topLeft", "top", "topRight", "left", "right", "bottomLeft", "bottom", "bottomRight"];

const sectionStyle: CSSProperties = { display: "grid", gap: 12, padding: "24px 0", borderTop: "1px solid #ddd" };
const rowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" };
const boxStyle: CSSProperties = { border: "1px dashed #999", borderRadius: 8, padding: 16 };
const content = <div style={{ padding: 12, maxWidth: 240 }}>Popover content</div>;

type Log = (source: string) => (reason: OverlayCloseReason) => void;

const Section = ({ title, hint, children }: { title: string; hint: ReactNode; children: ReactNode }) => (
  <section style={sectionStyle}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <p style={{ margin: 0, color: "#555" }}>{hint}</p>
    {children}
  </section>
);

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => (
  <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    {label}
  </label>
);

const ControlledPopover = ({ log }: { log: Log }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [closeOnOutsideClick, setCloseOnOutsideClick] = useState(false);
  const [closeOnEscape, setCloseOnEscape] = useState(false);
  const [closeOnRequest, setCloseOnRequest] = useState(true);

  const onClose = useCallback(
    (reason: OverlayCloseReason) => {
      log("Controlled")(reason);
      closeOnRequest && setOpen(false);
    },
    [closeOnRequest, log],
  );

  return (
    <Section
      title="Popover · controlled"
      hint="The open prop decides. Outside click and Escape only request a close through onClose; the parent closes it if it wants to."
    >
      <div style={rowStyle}>
        <Toggle label="closeOnOutsideClick" checked={closeOnOutsideClick} onChange={setCloseOnOutsideClick} />
        <Toggle label="closeOnEscape" checked={closeOnEscape} onChange={setCloseOnEscape} />
        <Toggle label="parent closes it on onClose" checked={closeOnRequest} onChange={setCloseOnRequest} />
      </div>
      <div style={rowStyle}>
        <Button label={open ? "Close" : "Open"} ref={anchorRef} onClick={() => setOpen(!open)} />
        <Popover
          anchorRef={anchorRef}
          open={open}
          onClose={onClose}
          closeOnOutsideClick={closeOnOutsideClick}
          closeOnEscape={closeOnEscape}
          elevated
        >
          {content}
        </Popover>
      </div>
    </Section>
  );
};

const UncontrolledPopover = ({ log }: { log: Log }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const defaultOpenAnchorRef = useRef<HTMLButtonElement>(null);
  const hookAnchorRef = useRef<HTMLButtonElement>(null);
  const { ref, open, toggle } = usePopover(hookAnchorRef);

  return (
    <Section
      title="Popover · uncontrolled"
      hint="Without the open prop, clicking the anchor toggles it; outside click and Escape close it."
    >
      <div style={rowStyle}>
        <Button label="Uncontrolled" ref={anchorRef} />
        <Popover anchorRef={anchorRef} onClose={log("Uncontrolled")} elevated>
          {content}
        </Popover>
        <Button label="defaultOpen" ref={defaultOpenAnchorRef} />
        <Popover anchorRef={defaultOpenAnchorRef} defaultOpen onClose={log("defaultOpen")} elevated>
          {content}
        </Popover>
        <Button label="usePopover" ref={hookAnchorRef} onClick={toggle} />
        <Popover anchorRef={hookAnchorRef} open={open} ref={ref} onClose={log("usePopover")} elevated>
          {content}
        </Popover>
      </div>
    </Section>
  );
};

const PlacementPopover = ({ placement, log }: { placement: OverlayPosition; log: Log }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button label={placement} ref={anchorRef} size="sm" />
      <Popover anchorRef={anchorRef} placeOn={placement} onClose={log(placement)} variant="dark">
        {content}
      </Popover>
    </>
  );
};

const Placements = ({ log }: { log: Log }) => (
  <Section
    title="Popover · placements and flip"
    hint="Buttons are at the left and right edges. Open them, or scroll the page so they are near the top or bottom of the screen, and open them again: the popover flips to the other side or alignment when there is no room."
  >
    <div style={{ ...rowStyle, justifyContent: "space-between" }}>
      {placements.slice(0, 4).map(placement => (
        <PlacementPopover key={placement} placement={placement} log={log} />
      ))}
    </div>
    <div style={{ ...rowStyle, justifyContent: "space-between" }}>
      {placements.slice(4).map(placement => (
        <PlacementPopover key={placement} placement={placement} log={log} />
      ))}
    </div>
  </Section>
);

const FilterHeader = ({
  column,
  keepInView,
  closeOnScroll,
  log,
}: {
  column: string;
  keepInView: boolean;
  closeOnScroll: boolean;
  log: Log;
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <th style={{ position: "sticky", top: 0, background: "#f3f4f6", padding: 8, textAlign: "left" }}>
      <span style={{ marginRight: 8 }}>{column}</span>
      <Button label="Filter" ref={anchorRef} size="xs" shape="outline" />
      <Popover
        anchorRef={anchorRef}
        placeOn="bottomLeft"
        keepInView={keepInView}
        closeOnScroll={closeOnScroll}
        onClose={log(`Filter ${column}`)}
        elevated
      >
        <div style={{ padding: 12, display: "grid", gap: 8, width: 220 }}>
          <InputText placeholder={`Filter by ${column}`} size="sm" />
          <InputDateRange size="sm" />
        </div>
      </Popover>
    </th>
  );
};

const TableFilter = ({ log }: { log: Log }) => {
  const [keepInView, setKeepInView] = useState(false);
  const [closeOnScroll, setCloseOnScroll] = useState(false);
  const columns = ["Name", "Department", "Start date", "City", "Phone", "Email"];

  return (
    <Section
      title="Popover · filter form in a scrolling table"
      hint="Open a filter and scroll the table horizontally, or scroll the page. By default the form moves with its header, even out of the screen. keepInView keeps it in the screen, closeOnScroll closes it."
    >
      <div style={rowStyle}>
        <Toggle label="keepInView" checked={keepInView} onChange={setKeepInView} />
        <Toggle label="closeOnScroll" checked={closeOnScroll} onChange={setCloseOnScroll} />
      </div>
      <div style={{ overflow: "auto", maxHeight: 240, border: "1px solid #ddd", borderRadius: 8 }}>
        <table style={{ borderCollapse: "collapse", minWidth: 1400 }}>
          <thead>
            <tr>
              {columns.map(column => (
                <FilterHeader key={column} column={column} keepInView={keepInView} closeOnScroll={closeOnScroll} log={log} />
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }, (_, row) => (
              <tr key={row}>
                {columns.map(column => (
                  <td key={column} style={{ padding: 8, borderTop: "1px solid #eee", whiteSpace: "nowrap" }}>
                    {column} {row + 1}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
};

const InputDateRangeCases = () => (
  <Section
    title="InputDateRange"
    hint="Clipping containers, scrolling containers and keyboard navigation. Tab from the input goes into the picker, Tab from its last button goes to the next field."
  >
    <div style={{ ...rowStyle, alignItems: "flex-start" }}>
      <div style={{ ...boxStyle, overflow: "hidden", height: 90, width: 320 }}>
        <p style={{ margin: "0 0 8px" }}>overflow: hidden, 90px high</p>
        <InputDateRange />
      </div>
      <div style={{ ...boxStyle, overflow: "auto", height: 120, width: 320 }}>
        <p style={{ margin: "0 0 8px" }}>Scroll container, open and scroll it</p>
        <InputDateRange />
        <div style={{ height: 300 }} />
      </div>
      <div style={{ ...boxStyle, display: "grid", gap: 8, width: 320 }}>
        <InputText placeholder="Field before" size="sm" />
        <InputDateRange size="sm" />
        <InputText placeholder="Field after" size="sm" />
      </div>
    </div>
  </Section>
);

const InModal = ({ log }: { log: Log }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <Section
      title="In a modal"
      hint="Popover and the date picker are rendered above the modal. The modal is not closable here, because its outside click handler does not know about portals yet."
    >
      <div>
        <Button label="Open modal" onClick={() => setOpen(true)} />
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Overlays in a modal"
        actionButton={{ text: "Close", onClick: () => setOpen(false) }}
      >
        <div style={{ display: "grid", gap: 16, paddingBlock: 8 }}>
          <div>
            <Button label="Popover" ref={anchorRef} />
            <Popover anchorRef={anchorRef} onClose={log("Modal popover")} elevated>
              {content}
            </Popover>
          </div>
          <InputDateRange />
        </div>
      </Modal>
    </Section>
  );
};

const PageBottom = () => (
  <Section title="At the bottom of the page" hint="There is no room below, so the picker opens above the input.">
    <div style={{ height: 120 }} />
    <div>
      <InputDateRange />
    </div>
  </Section>
);

const OverlayDemos = () => {
  const [entries, setEntries] = useState<string[]>([]);
  const log: Log = useCallback(
    source => reason => setEntries(prev => [`${new Date().toLocaleTimeString()}  ${source}: ${reason}`, ...prev].slice(0, 8)),
    [],
  );

  return (
    <div style={{ display: "grid", paddingBottom: 40 }}>
      <aside
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 300,
          padding: 12,
          background: "#111827",
          color: "#f9fafb",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 12,
          zIndex: 2000,
        }}
      >
        <strong>onClose log</strong>
        {entries.length ? entries.map((entry, i) => <div key={i}>{entry}</div>) : <div>Nothing closed yet</div>}
      </aside>
      <h2 style={{ marginBottom: 0 }}>Overlay demos</h2>
      <p>Resize the window while a popover or picker is open: they stay open and follow their anchor.</p>
      <ControlledPopover log={log} />
      <UncontrolledPopover log={log} />
      <Placements log={log} />
      <TableFilter log={log} />
      <InputDateRangeCases />
      <InModal log={log} />
      <PageBottom />
    </div>
  );
};

export default OverlayDemos;
