import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import trCommon from "./locales/tr/common.json";
import enCommon from "./locales/en/common.json";

void i18n.use(initReactI18next).init({
  resources: {
    tr: { common: trCommon },
    en: { common: enCommon },
  },
  defaultNS: "common",
  fallbackLng: "tr",
  supportedLngs: ["tr", "en"],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
