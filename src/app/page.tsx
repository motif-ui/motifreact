"use client";

import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div style={{ margin: "0 auto", padding: 20 }}>
      <h2>{t("greeting", { name: "MOTİF UI " })}</h2>
      <h4>This is the playground section to try your components...</h4>
    </div>
  );
};

export default Home;
