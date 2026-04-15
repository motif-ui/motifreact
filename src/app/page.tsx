"use client";

import { useTranslation } from "react-i18next";
import { Button, UploadDragger, UploadInput } from "src/lib";
import { useMotifContext } from "src/lib/motif/context/MotifProvider";
import { Locale } from "src/lib/motif/types/contextProps";

const Home = () => {
  const { t } = useTranslation();
  const { locale, setLocale } = useMotifContext();

  const toggleLocale = () => {
    setLocale(locale === "tr" ? "en" : ("tr" as Locale));
  };

  return (
    <div style={{ margin: "0 auto", padding: 20, maxWidth: 600 }}>
      <h2>{t("greeting", { name: "MOTİF UI " })}</h2>
      <h4>This is the playground section to try your components...</h4>

      <div style={{ marginBottom: 20 }}>
        <Button label={`Dil / Language: ${locale.toUpperCase()}`} onClick={toggleLocale} />
      </div>

      <h4>UploadInput</h4>
      <UploadInput uploadRequest={{ url: "/api/upload", method: "POST" }} deleteRequest={{ url: "/api/delete", method: "DELETE" }} />

      <UploadDragger
        accept={["*"]}
        maxFile={2}
        maxSize={10000}
        deleteRequest={{
          headers: [
            {
              key: "mtf",
              value: "ui",
            },
          ],
          method: "POST",
          url: "https://httpbin.org/post",
        }}
        uploadRequest={{
          headers: [
            {
              key: "mtf",
              value: "ui",
            },
          ],
          method: "POST",
          url: "https://httpbin.org/post",
        }}
      />
    </div>
  );
};

export default Home;
