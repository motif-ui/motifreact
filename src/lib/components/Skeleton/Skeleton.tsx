import styles from "./Skeleton.module.scss";
import { PropsWithRef } from "../../types";

type Props = {
  type?: "table";
  animation?: "wave" | "pulse";
  tone?: "light" | "dark";
};

const Skeleton = (props: PropsWithRef<Props, HTMLDivElement>) => {
  const { type = "table", animation = "pulse", ref } = props;
  return (
    <div ref={ref} className={`${styles.skeleton} ${styles[type]} ${styles[animation]}`} data-testid="Skeleton">
      <div />
      <div />
      <div />
    </div>
  );
};

Skeleton.displayName = "Skeleton";
export default Skeleton;
