import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import translations from "./src/i18n/locales/tr/common.json";

export const mockT = (key, options) => {
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, obj);
  };

  const translatedText = getNestedValue(translations, key) || key;
  if (!options || typeof options !== "object" || typeof translatedText !== "string") {
    return translatedText;
  }

  return Object.keys(options).reduce((acc, k) => {
    return acc.replace(new RegExp(`{{${k}}}`, "g"), String(options[k]));
  }, translatedText);
};

globalThis.mockT = mockT;

jest.mock("react-i18next", () => {
  return {
    useTranslation: () => ({
      t: mockT,
      i18n: {
        changeLanguage: jest.fn(() => Promise.resolve()),
        language: "tr",
      },
    }),
    initReactI18next: {
      type: "3rdParty",
      init: () => {},
    },
  };
});
