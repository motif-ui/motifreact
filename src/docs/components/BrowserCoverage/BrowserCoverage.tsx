import browserslist from "browserslist";
import { useEffect, useState } from "react";
import styles from "./BrowserCoverage.module.scss";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import browserslistrc from "../../../../.browserslistrc?raw";

const BrowserCoverage = () => {
  const [coverage, setCoverage] = useState<number>(0);

  useEffect(() => {
    const query = (browserslistrc as string).split("\n").filter(line => !line.trim().startsWith("#"));
    const coverageData = browserslist.coverage(browserslist(query));

    setCoverage(Number(coverageData.toFixed(1)));
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.progressTitle}>Overall Browser Coverage Globally</span>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${Math.min(coverage, 100)}%` }} />
        </div>
      </div>
      <span className={styles.coverage}>{coverage}%</span>
    </div>
  );
};

export default BrowserCoverage;
