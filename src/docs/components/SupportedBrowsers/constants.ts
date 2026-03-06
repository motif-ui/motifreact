const ICON_CDN_BASE = "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1";

export const BROWSER_ICONS: Record<string, string> = {
  chrome: `${ICON_CDN_BASE}/chrome/chrome_48x48.png`,
  and_chr: `${ICON_CDN_BASE}/chrome/chrome_48x48.png`,
  firefox: `${ICON_CDN_BASE}/firefox/firefox_48x48.png`,
  and_ff: `${ICON_CDN_BASE}/firefox/firefox_48x48.png`,
  safari: `${ICON_CDN_BASE}/safari/safari_48x48.png`,
  ios_saf: `${ICON_CDN_BASE}/safari-ios/safari-ios_48x48.png`,
  edge: `${ICON_CDN_BASE}/edge/edge_48x48.png`,
  opera: `${ICON_CDN_BASE}/opera/opera_48x48.png`,
  android: `${ICON_CDN_BASE}/android-webview/android-webview_48x48.png`,
  samsung: `${ICON_CDN_BASE}/samsung-internet/samsung-internet_48x48.png`,
  placeholder: "https://placeholdit.com/48x48/eeeeee/eeeeee?text=.",
};

export const BROWSER_NAME_MAP: Record<string, string> = {
  and_chr: "Chrome (Android)",
  and_ff: "Firefox (Android)",
  android: "Android WebView",
  chrome: "Chrome",
  edge: "Edge",
  firefox: "Firefox",
  ios_saf: "Safari (iOS)",
  opera: "Opera",
  safari: "Safari",
  samsung: "Samsung Internet",
};

export const MOBILE_BROWSERS = new Set(["and_chr", "and_ff", "android", "ios_saf", "samsung"]);
