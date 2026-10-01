"use client";

import { useMotifContext } from "../lib/motif/context/MotifProvider";
import OverlayDemos from "./OverlayDemos";

const Home = () => {
  const { t } = useMotifContext();

  return (
    <div style={{ margin: "0 auto", padding: 20 }}>
      <h2>{t("g.hello_x", { name: "MOTİF UI" })}</h2>
      <h4>{t("misc.playgroundDescription")}</h4>
      <OverlayDemos />
    </div>
  );
};

export default Home;
