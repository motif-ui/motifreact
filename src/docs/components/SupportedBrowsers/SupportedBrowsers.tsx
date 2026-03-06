import browserslist from "browserslist";
import { useMemo } from "react";
import BrowserList from "./components/BrowserList";
import styles from "./SupportedBrowsers.module.scss";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import browserslistrc from "../../../../.browserslistrc?raw";
import { BrowserProps } from "./components/BrowserBox";
import { BROWSER_ICONS, MOBILE_BROWSERS, BROWSER_NAME_MAP } from "./constants";

type BrowserWithVersionInfo = {
  id: string;
  versions: string[];
  entries: string[];
};

const SupportedBrowsers = () => {
  const browsers = useMemo<BrowserProps[]>(() => {
    const query = (browserslistrc as string).split("\n").filter(line => !line.trim().startsWith("#"));
    const supported = browserslist(query);

    const grouped = supported.reduce<Record<string, BrowserWithVersionInfo>>((acc, curr) => {
      const [id] = curr.split(" ");
      acc[id] ??= { id, versions: [], entries: [] };
      acc[id].versions.push(curr);
      acc[id].entries.push(curr);
      return acc;
    }, {});

    return Object.values(grouped)
      .map(({ id, versions, entries }) => {
        const versionNums = versions
          .map(v => parseFloat(v.split(" ")[1]))
          .filter(n => !isNaN(n))
          .sort((a, b) => a - b);

        const browserCoverage = browserslist.coverage(entries);

        return {
          id,
          displayName: BROWSER_NAME_MAP[id] || id,
          icon: BROWSER_ICONS[id] || BROWSER_ICONS.placeholder,
          minVersion: versionNums[0],
          usage: browserCoverage.toFixed(2),
        };
      })
      .sort((a, b) => parseFloat(b.usage) - parseFloat(a.usage));
  }, []);

  const groupedBrowsers = browsers.reduce<{ desktop: BrowserProps[]; mobile: BrowserProps[] }>(
    (acc, curr) => ({
      ...acc,
      ...(MOBILE_BROWSERS.has(curr.id) ? { mobile: [...acc.mobile, curr] } : { desktop: [...acc.desktop, curr] }),
    }),
    { desktop: [], mobile: [] },
  );

  return (
    <div className={styles.container}>
      <BrowserList browserType="🖥️ Desktop" browsers={groupedBrowsers.desktop} />
      <BrowserList browserType="📱 Mobile" browsers={groupedBrowsers.mobile} />
    </div>
  );
};

export default SupportedBrowsers;
