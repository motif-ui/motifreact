"use client";

import { useMotifContext } from "../lib/motif/context/MotifProvider";
import UploadDragger from "@/components/Upload/UploadDragger";
import { MOCK } from "@/components/Upload/mock";

const Home = () => {
  const { t, locale, setLocale } = useMotifContext();

  return (
    <div style={{ margin: "0 auto", padding: 20 }}>
      <button onClick={() => setLocale(locale === "tr" ? "en" : "tr")} style={{ marginBottom: 16 }}>
        {locale === "tr" ? "Switch to English" : "Türkçe'ye geç"}
      </button>
      <h2>{t("greeting", { name: "MOTİF UI" })}</h2>
      <h4>This is the playground section to try your components...</h4>
      <UploadDragger uploadRequest={MOCK.uploadRequest} deleteRequest={MOCK.deleteRequest} />
    </div>
  );
};

export default Home;
