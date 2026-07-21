import { addons, types } from "storybook/manager-api";
import motifTheme from "./motifTheme";
import ExternalLinksToolbar from "./toolbar/CustomButtons";
import Breadcrumbs from "./toolbar/Breadcrumbs";
import VersionBadge from "./toolbar/VersionBadge";

addons.add("motif/breadcrumbs", {
  type: types.TOOL,
  title: "Breadcrumbs",
  match: () => true,
  render: Breadcrumbs,
});

addons.add("motif/version-badge", {
  type: types.TOOLEXTRA,
  title: "Version",
  render: VersionBadge,
});

addons.add("external-links/toolbar", {
  type: types.TOOLEXTRA,
  title: "GitHub & NPM",
  render: ExternalLinksToolbar,
});

addons.setConfig({
  theme: motifTheme,
  sidebar: {
    showRoots: false,
    collapsedRoots: ["Integrations", "Customization", "Design", "Blocks", "Components", "Icons", "Form", "Hooks", "Utility", "Support"],
  },
});

/**
 * Storybook renders the sidebar as a flat list of `.sidebar-item` elements, exposing tree shape only via
 * `data-nodetype` / `data-parent-id`, not css classes. The tree is re-derived here, we classify each
 * item once and let the CSS just switch on plain classes:
 *
 *   .sidebar-level-1  — component / top-level doc rows
 *   .sidebar-level-2  — story rows, a component's own "Docs" row when it's
 *                       immediately followed by its "Primary" story, and
 *                       nested-component group headers (repositioned; they
 *                       keep Level 1's text styling too — see manager-head.html)
 *   .nested-component        — a component group nested under another
 *                              component (e.g. Grid's Row/Col)
 *   .nested-component-child  — that nested component's own Docs/Primary rows
 *
 * Each classifier below is a direct port of the CSS predicate it replaces —
 * not a new "depth" model — so it stays faithful to the original selectors'
 * semantics instead of re-guessing them.
 */
const classifySidebarItems = () => {
  document
    .querySelectorAll(".nested-component, .nested-component-child, .sidebar-level-1, .sidebar-level-2")
    .forEach(el => el.classList.remove("nested-component", "nested-component-child", "sidebar-level-1", "sidebar-level-2"));

  const items = Array.from(document.querySelectorAll<HTMLElement>(".sidebar-item[data-nodetype]"));

  // Pass 1: nested-component / nested-component-child (an item's own class
  // membership must exist before pass 2 can read it back off other items).
  const nestedComponentIds = new Set<string>();
  items.forEach(item => {
    if (item.dataset.nodetype === "component" && item.dataset.parentId && item.dataset.parentId !== "components") {
      item.classList.add("nested-component");
      nestedComponentIds.add(item.dataset.itemId!);
    }
  });
  items.forEach(item => {
    if (item.dataset.parentId && nestedComponentIds.has(item.dataset.parentId)) {
      item.classList.add("nested-component-child");
    }
  });

  // Pass 2: tree levels.
  items.forEach((item, index) => {
    const { nodetype, parentId } = item.dataset;
    const isNestedChild = item.classList.contains("nested-component-child");

    const isLevel1 = (Boolean(parentId) && !isNestedChild) || nodetype === "component" || (nodetype === "document" && !parentId);
    item.classList.toggle("sidebar-level-1", isLevel1);

    const nextIsStory = items[index + 1]?.dataset.nodetype === "story";
    const isComponentDocBeforeStory = nodetype === "document" && Boolean(parentId) && !isNestedChild && nextIsStory;
    const isLevel2 = nodetype === "story" || isComponentDocBeforeStory || item.classList.contains("nested-component");
    item.classList.toggle("sidebar-level-2", isLevel2);
  });
};

// Replaces the folder icon for component groups with the component icon.
const replaceComponentGroupIcons = () => {
  document
    .querySelectorAll(".sidebar-item[data-nodetype='component'] ~ .sidebar-item[data-nodetype='group'][data-parent-id] svg use")
    .forEach(use => use.setAttribute("xlink:href", "#icon--component"));
  document.querySelector("button#components svg[type='group'] use")?.setAttribute("xlink:href", "#icon--component");
};

const updateSidebar = () => {
  replaceComponentGroupIcons();
  classifySidebarItems();
};

/**
 * The manager UI is a React SPA: this module executes before React has * rendered anything, and the sidebar tree
 * itself only appears once the story index has loaded asynchronously — well after `window.load` fires So this can't
 * wait for `.sidebar-container` to exist before observing — it has to observe from the start and let the first real
 * mutation trigger classification. `document.body` always exists by the time any script runs, so it's the earliest
 * stable observation root.
 */
updateSidebar();

let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    updateSidebar();
  });
}).observe(document.body, {
  childList: true,
  subtree: true,
});
