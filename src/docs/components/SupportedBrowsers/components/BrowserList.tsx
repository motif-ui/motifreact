import BrowserBox, { BrowserProps } from "./BrowserBox";
import styles from "./BrowserList.module.scss";

type Props = {
  browserType: "🖥️ Desktop" | "📱 Mobile";
  browsers: BrowserProps[];
};

const BrowserList = (props: Props) => {
  const { browserType, browsers } = props;
  return (
    <div>
      <h4 className={styles.browserType}>{browserType}</h4>
      <div className={styles.container}>
        {browsers.map(b => (
          <BrowserBox {...b} key={b.id} />
        ))}
      </div>
    </div>
  );
};

export default BrowserList;
