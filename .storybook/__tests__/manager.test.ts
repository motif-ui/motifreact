jest.mock("storybook/manager-api", () => ({
  addons: { add: jest.fn(), setConfig: jest.fn() },
  types: { TOOL: "tool", TOOLEXTRA: "toolextra" },
}));
// motifTheme.ts imports storybook/theming/create, which ships ESM-only and
// isn't in jest's transformIgnorePatterns exceptions; its actual values are
// irrelevant to sidebar classification.
jest.mock("../motifTheme", () => ({ default: {} }));
// The toolbar components pull in storybook/internal/components and
// @storybook/icons, same ESM problem; irrelevant to this test too.
jest.mock("../toolbar/Breadcrumbs", () => ({ default: () => null }));
jest.mock("../toolbar/VersionBadge", () => ({ default: () => null }));
jest.mock("../toolbar/CustomButtons", () => ({ default: () => null }));

/**
 * manager.tsx has no exports — it's a Storybook manager entry file, run for
 * its side effects (registering addons, classifying the sidebar) the same
 * way Storybook itself loads it. These tests exercise it the same way: seed
 * document.body with a fixture shaped like Storybook's real sidebar DOM,
 * `require` a fresh module instance, and read back the classes it applied.
 *
 * Fixtures mirror DOM actually captured from a running Storybook instance
 * (via Playwright) while verifying the redesign, not a re-derivation of the
 * predicates from reading the source — the whole point is to catch this
 * logic drifting from what the DOM really looks like.
 */
const loadManagerModule = () => {
  jest.resetModules();
  // jest.resetModules() + require() is the standard way to get a fresh,
  // re-executed module instance per test; dynamic import() doesn't
  // interoperate with resetModules() the same way.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../manager");
};

/**
 * Each loadManagerModule() call creates a fresh MutationObserver watching
 * document.body, which manager.tsx never disconnects (it's not meant to —
 * in production the manager page never tears down). Without disconnecting
 * these between tests, observers from earlier tests keep firing against
 * document.body mutations made by later tests, and can queue a
 * requestAnimationFrame callback that fires after jsdom's window is torn
 * down at suite end, crashing the process. Wrapping the global constructor
 * to track every instance created lets every test clean up after itself
 * without needing manager.tsx to expose anything for this.
 */
const OriginalMutationObserver = global.MutationObserver;
let observers: MutationObserver[] = [];

beforeAll(() => {
  global.MutationObserver = class extends OriginalMutationObserver {
    constructor(callback: MutationCallback) {
      super(callback);
      observers.push(this);
    }
  };
});

afterAll(() => {
  global.MutationObserver = OriginalMutationObserver;
});

afterEach(() => {
  observers.forEach(observer => observer.disconnect());
  observers = [];
});

const classesOf = (itemId: string): string[] => [...document.querySelector(`[data-item-id="${itemId}"]`)!.classList];

describe("manager.tsx sidebar classification", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("marks a plain top-level component as level 1 only", () => {
    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="component" data-parent-id="components" data-item-id="components-table"></div>
    `;
    loadManagerModule();

    expect(classesOf("components-table")).toEqual(expect.arrayContaining(["sidebar-level-1"]));
    expect(classesOf("components-table")).not.toEqual(
      expect.arrayContaining(["sidebar-level-2", "nested-component", "nested-component-child"]),
    );
  });

  it("marks a component's Docs row (right before its Primary story) as level 1 AND level 2", () => {
    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="document" data-parent-id="components-table" data-item-id="components-table--docs"></div>
      <div class="sidebar-item" data-nodetype="story" data-parent-id="components-table" data-item-id="components-table--primary"></div>
    `;
    loadManagerModule();

    expect(classesOf("components-table--docs")).toEqual(expect.arrayContaining(["sidebar-level-1", "sidebar-level-2"]));
    expect(classesOf("components-table--primary")).toEqual(expect.arrayContaining(["sidebar-level-1", "sidebar-level-2"]));
  });

  it("does NOT treat a component's Docs row as level 2 when it isn't immediately followed by its story (e.g. two docs rows in a row)", () => {
    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="document" data-parent-id="components-table" data-item-id="components-table--docs"></div>
      <div class="sidebar-item" data-nodetype="document" data-parent-id="components-table" data-item-id="components-table--usage"></div>
    `;
    loadManagerModule();

    expect(classesOf("components-table--docs")).toEqual(["sidebar-item", "sidebar-level-1"]);
  });

  it("marks a component nested under another component (e.g. Grid.Row under Grid) as nested-component, level 1, AND level 2", () => {
    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="component" data-parent-id="components-grid" data-item-id="components-grid-grid-col"></div>
      <div class="sidebar-item" data-nodetype="component" data-parent-id="components-grid" data-item-id="components-grid-grid-row"></div>
    `;
    loadManagerModule();

    for (const itemId of ["components-grid-grid-col", "components-grid-grid-row"]) {
      expect(classesOf(itemId)).toEqual(expect.arrayContaining(["nested-component", "sidebar-level-1", "sidebar-level-2"]));
    }
  });

  it("marks a nested component's OWN Docs/Primary rows as nested-component-child, distinct from its own Docs/Primary handling at the top level", () => {
    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="component" data-parent-id="components-grid" data-item-id="components-grid-grid-row"></div>
      <div class="sidebar-item" data-nodetype="document" data-parent-id="components-grid-grid-row" data-item-id="components-grid-grid-row--docs"></div>
      <div class="sidebar-item" data-nodetype="story" data-parent-id="components-grid-grid-row" data-item-id="components-grid-grid-row--primary"></div>
    `;
    loadManagerModule();

    // The nested component itself: same as any nested component.
    expect(classesOf("components-grid-grid-row")).toEqual(
      expect.arrayContaining(["nested-component", "sidebar-level-1", "sidebar-level-2"]),
    );
    // Its own Docs row: nested-component-child, but NOT level 1/2 — a plain
    // top-level component's Docs row (tested above) DOES get level 1+2, so
    // this is the one place nesting actually changes the outcome, not just
    // adds a class on top of the non-nested case.
    expect(classesOf("components-grid-grid-row--docs")).toEqual(["sidebar-item", "nested-component-child"]);
    // Its own Primary story: nested-component-child AND level 2 (stories are
    // always level 2, nested or not) but not level 1.
    expect(classesOf("components-grid-grid-row--primary")).toEqual(expect.arrayContaining(["nested-component-child", "sidebar-level-2"]));
    expect(classesOf("components-grid-grid-row--primary")).not.toEqual(expect.arrayContaining(["sidebar-level-1"]));
  });

  it("re-classifies when the sidebar renders asynchronously after the module has already loaded", async () => {
    // Regression test for the bug fixed in this file: classification used to
    // run once inside a `window.load` handler, which called updateSidebar()
    // unconditionally as its first line, then bailed out of attaching a
    // MutationObserver if `.sidebar-container` didn't exist yet. Storybook's
    // sidebar is a React SPA render that completes well after `load` fires
    // (measured live: load fires with 0 .sidebar-item elements present), so
    // that one-shot pass always ran too early, and no observer was ever
    // attached to catch the sidebar rendering later.
    //
    // jsdom fires its own `load` automatically, once, shortly after this
    // describe block's test body starts running (confirmed empirically: it
    // resolves by the next microtask, regardless of when a listener is
    // added). The fixture DOM below must not exist yet when that happens —
    // otherwise the buggy code's one-shot updateSidebar() call would find it
    // and classify it correctly for the wrong reason (a same-tick coincidence,
    // not the MutationObserver actually re-observing), which is exactly the
    // false-pass this ordering exists to rule out. A version of this test
    // that added the fixture immediately (no tick in between) was verified
    // to pass even against the reverted, buggy code, for precisely that
    // reason — this ordering was added after catching that.
    loadManagerModule();
    expect(document.querySelector(".sidebar-item")).toBeNull();
    // Let jsdom's load event (and, under the buggy code, its one-shot
    // updateSidebar() + the doomed `.sidebar-container` existence check)
    // resolve against the still-empty body before the fixture appears.
    await new Promise(resolve => setTimeout(resolve, 0));

    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="component" data-parent-id="components" data-item-id="components-table"></div>
    `;

    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));

    expect(classesOf("components-table")).toEqual(expect.arrayContaining(["sidebar-level-1"]));
  });
});

describe("manager.tsx component-group icon replacement", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("swaps a component group's folder icon for the component icon", () => {
    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="component" data-parent-id="components-grid" data-item-id="components-grid-grid-row"></div>
      <div class="sidebar-item" data-nodetype="group" data-parent-id="components-grid-grid-row" data-item-id="components-grid-grid-row-group">
        <svg><use xlink:href="#icon--folder"></use></svg>
      </div>
    `;
    loadManagerModule();

    const use = document.querySelector('[data-item-id="components-grid-grid-row-group"] use')!;
    expect(use.getAttribute("xlink:href")).toBe("#icon--component");
  });

  it("leaves a group's icon alone when it is not preceded by a component sibling", () => {
    document.body.innerHTML = `
      <div class="sidebar-item" data-nodetype="group" data-parent-id="components" data-item-id="components-unrelated-group">
        <svg><use xlink:href="#icon--folder"></use></svg>
      </div>
    `;
    loadManagerModule();

    const use = document.querySelector('[data-item-id="components-unrelated-group"] use')!;
    expect(use.getAttribute("xlink:href")).toBe("#icon--folder");
  });
});
