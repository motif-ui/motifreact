// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React, { useEffect, useRef } from "react";
import { addons, types, useGlobals, useStorybookApi } from "storybook/manager-api";
import { IconButton, WithTooltip, TooltipLinkList } from "storybook/internal/components";
import type { API_FilterFunction, API_LeafEntry } from "storybook/internal/types";
import motifTheme from "./motifTheme";
import ExternalLinksToolbar from "./toolbar/CustomButtons";

const getInitialLocale = (): string => {
  try {
    const m = location.search.match(/locale:([a-z]+)/);
    return m?.[1] ?? "en";
  } catch {
    return "en";
  }
};

let sbLocale = getInitialLocale();

// ─── Sidebar filter ───────────────────────────────────────────────────────────
// Reads sbLocale at call time so a single stable reference works for both the
// addons.setConfig initial registration and experimental_setFilter rebuilds.

const localeFilter: API_FilterFunction = item => {
  // Only manual MDX docs need locale filtering — they carry the 'unattached-mdx' tag.
  // Component autodocs have 'autodocs' but NOT 'unattached-mdx' → always visible.
  // Stories have neither → always visible.
  const tags = item.tags ?? [];
  if (!tags.includes("unattached-mdx")) return true;
  // TR manual docs: ID contains '-tr--' (e.g. "getting-started-overview-tr--docs")
  // EN manual docs: ID does not contain '-tr--'
  return item.id.includes("-tr--") ? sbLocale === "tr" : sbLocale !== "tr";
};

const SIDEBAR_TR: Record<string, string> = {
  "Getting Started": "Başlarken",
  Overview: "Genel Bakış",
  Installation: "Kurulum",
  "Element Access": "Öğe Erişimi",
  MotifProvider: "MotifProvider",
  Localization: "Yerelleştirme",
  Accessibility: "Erişilebilirlik",
  "Browser Support": "Tarayıcı Desteği",
  Integrations: "Entegrasyonlar",
  Customization: "Özelleştirme",
  Guide: "Rehber",
  "CSS Modules": "CSS Modülleri",
  Fonts: "Yazı Tipleri",
  "Style Dictionary": "Stil Sözlüğü",
  Theming: "Tema Oluşturma",
  Units: "Birimler",
  Design: "Tasarım",
  Themes: "Temalar",
  Figma: "Figma",
  "Design Tokens": "Tasarım Token'ları",
  "Color Palette": "Renk Paleti",
  Blocks: "Bloklar",
  Components: "Bileşenler",
  Icons: "İkonlar",
  Form: "Form",
  Hooks: "Hook'lar",
  Info: "Bilgi",
  Utility: "Yardımcılar",
  "Utility Functions": "Yardımcı Fonksiyonlar",
  Support: "Destek",
};

// ─── LocaleNavigator (invisible — handles filter, CSS, and page navigation) ───

const LocaleNavigator = () => {
  const api = useStorybookApi();
  const [globals] = useGlobals();
  const locale = (globals.locale ?? "en") as string;
  const prevRef = useRef<string | null>(null);

  useEffect(() => {
    sbLocale = locale;
    // Trigger setIndex rebuild so localeFilter (which reads sbLocale) re-runs.
    // addons.setConfig seeds the filter in the store initial state for first load;
    // this call handles every subsequent locale change.
    void api.experimental_setFilter("locale-filter", localeFilter);

    // Navigate to the TR/EN counterpart on locale switch
    if (prevRef.current === locale) return;
    prevRef.current = locale;

    const storyData = api.getCurrentStoryData() as API_LeafEntry | undefined;
    if (!storyData) return;

    const storyId = storyData.id;
    // TR doc IDs: "x-y-tr--docs"  EN doc IDs: "x-y--docs"
    const isTrId = storyId.includes("-tr--");

    if (locale === "tr" && !isTrId) {
      const trStoryId = storyId.replace("--", "-tr--");
      const trEntry = api.getData(trStoryId) as API_LeafEntry | undefined;
      if (trEntry) api.selectStory(trStoryId);
    } else if (locale === "en" && isTrId) {
      const enStoryId = storyId.replace("-tr--", "--");
      const enEntry = api.getData(enStoryId) as API_LeafEntry | undefined;
      if (enEntry) api.selectStory(enStoryId);
    }
  }, [locale, api]);

  return null;
};

const FlagGB = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 40"
    width={size}
    height={size * (2 / 3)}
    style={{ borderRadius: 2, display: "block" }}
  >
    <clipPath id="gb-clip">
      <path d="M0,0 v40 h60 v-40 z" />
    </clipPath>
    <path d="M0,0 v40 h60 v-40 z" fill="#012169" />
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" clipPath="url(#gb-clip)" />
    <path d="M30,0 v40 M0,20 h60" stroke="#fff" strokeWidth="14" />
    <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="8" />
  </svg>
);

const FlagTR = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 20"
    width={size}
    height={size * 0.667}
    style={{ borderRadius: 2, display: "block" }}
  >
    <rect width="30" height="20" fill="#E30A17" />
    <circle cx="11.5" cy="10" r="5.5" fill="#fff" />
    <circle cx="13.5" cy="10" r="4.4" fill="#E30A17" />
    <polygon
      fill="#fff"
      points="20,10 18.1,10.6 18.7,12.5 17.2,11.3 15.7,12.5 16.3,10.6 14.4,10 16.3,9.4 15.7,7.5 17.2,8.7 18.7,7.5 18.1,9.4"
    />
  </svg>
);

const LOCALE_ITEMS = [
  { id: "en", title: "English", Flag: FlagGB },
  { id: "tr", title: "Türkçe", Flag: FlagTR },
];

const LocaleToggle = () => {
  const [globals, updateGlobals] = useGlobals();
  const locale = (globals.locale ?? "en") as string;
  const ActiveFlag = locale === "tr" ? FlagTR : FlagGB;

  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      closeOnOutsideClick
      tooltip={({ onHide }) => (
        <TooltipLinkList
          links={LOCALE_ITEMS.map(({ id, title, Flag }) => ({
            id,
            title,
            right: <Flag size={22} />,
            active: locale === id,
            onClick: () => {
              sbLocale = id; // update before re-render so filter reads correct value
              updateGlobals({ locale: id });
              onHide();
            },
          }))}
        />
      )}
    >
      <IconButton title="Language">
        <ActiveFlag size={20} />
      </IconButton>
    </WithTooltip>
  );
};

// ─── Addon registrations ──────────────────────────────────────────────────────

addons.add("locale-navigator", {
  type: types.TOOLEXTRA,
  title: "",
  render: LocaleNavigator,
});

addons.add("external-links/toolbar", {
  type: types.TOOLEXTRA,
  title: "GitHub & NPM",
  render: ExternalLinksToolbar,
});

addons.add("locale-toggle", {
  type: types.TOOLEXTRA,
  title: "",
  render: LocaleToggle,
});

// ─── Storybook config ─────────────────────────────────────────────────────────

addons.setConfig({
  theme: motifTheme,
  sidebar: {
    showRoots: false,
    collapsedRoots: ["Integrations", "Customization", "Design", "Blocks", "Components", "Icons", "Form", "Hooks", "Utility", "Support"],

    // Registered here so the filter is in the store's initial state when the
    // story index first loads (before any React component mounts).
    filters: {
      "locale-filter": localeFilter,
    },

    renderLabel: item => {
      if (sbLocale !== "tr") return item.name;
      const base = item.name.endsWith(" (TR)") ? item.name.slice(0, -5) : item.name;
      return SIDEBAR_TR[base] ?? base;
    },
  },
});
