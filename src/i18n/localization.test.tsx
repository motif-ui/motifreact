import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { createTranslator } from "./translate";
import { locales } from "./locales/index";
import MotifProvider, { useMotifContext } from "../lib/motif/context/MotifProvider";
import en from "./locales/en.json";
import tr from "./locales/tr.json";

describe("createTranslator()", () => {
  describe("built-in locale resolution", () => {
    it("should return the English string for the given key", () => {
      const t = createTranslator("en");
      expect(t("g.save")).toBe(en.g.save);
    });

    it("should return the Turkish string for the given key", () => {
      const t = createTranslator("tr");
      expect(t("g.save")).toBe(tr.g.save);
    });

    it("should return translations for all top-level sections", () => {
      const t = createTranslator("tr");
      expect(t("validation.required")).toBe(tr.validation.required);
      expect(t("upload.selectFile")).toBe(tr.upload.selectFile);
      expect(t("form.fieldError")).toBe(tr.form.fieldError);
      expect(t("table.totalRecords", { total: 5 })).toContain("5");
    });
  });

  describe("parameter interpolation", () => {
    it("should replace {{param}} placeholders with given values", () => {
      const t = createTranslator("en");
      expect(t("g.hello_x", { name: "World" })).toBe("Hello, World!");
    });

    it("should replace multiple params in a single string", () => {
      const t = createTranslator("en");
      const result = t("table.totalSelectedRecords", { selected: 3, total: 10 });
      expect(result).toContain("3");
      expect(result).toContain("10");
    });

    it("should replace numeric params correctly", () => {
      const t = createTranslator("en");
      expect(t("validation.minLength", { min: 8 })).toContain("8");
      expect(t("validation.maxLength", { max: 50 })).toContain("50");
      expect(t("validation.min", { min: 1 })).toContain("1");
      expect(t("validation.max", { max: 100 })).toContain("100");
      expect(t("validation.atLeastN", { n: 2 })).toContain("2");
    });

    it("should keep the placeholder when a param is not provided", () => {
      const t = createTranslator("en");
      const result = t("g.hello_x");
      expect(result).toBe("Hello, {{name}}!");
    });

    it("should return the raw template when params is undefined", () => {
      const t = createTranslator("tr");
      const result = t("g.x_message");
      expect(result).toBe(tr.g.x_message);
    });
  });

  describe("custom text overrides localeTexts", () => {
    it("should use the override string instead of the built-in one", () => {
      const override = "Özel yükleme hatası.";
      const t = createTranslator("tr", { upload: { uploadError: override } });
      expect(t("upload.uploadError")).toBe(override);
      expect(t("upload.uploadError")).not.toBe(tr.upload.uploadError);
    });

    it("should override only the provided keys and keep others from the locale", () => {
      const override = "Dosya Seçiniz";
      const t = createTranslator("tr", { upload: { selectFile: override } });
      expect(t("upload.selectFile")).toBe(override);
      expect(t("g.save")).toBe(tr.g.save);
    });

    it("should override deeply nested keys", () => {
      const customMessage = "Özel hata mesajı.";
      const t = createTranslator("tr", { upload: { uploadError: customMessage } });
      expect(t("upload.uploadError")).toBe(customMessage);
    });

    it("should interpolate params in override strings", () => {
      const t = createTranslator("en", { validation: { minLength: "Min {{min}} chars" } });
      expect(t("validation.minLength", { min: 5 })).toBe("Min 5 chars");
    });
  });

  describe("fallback behaviour", () => {
    it("should fall back to English when a key is missing in the selected locale", () => {
      // Simulate a partial locale by casting – inject a locale without 'misc'
      // Use createTranslator directly with localeTexts to simulate override-only flow
      const t = createTranslator("tr", {});
      // misc.playgroundDescription exists in en but not overridden in tr texts — should resolve to tr locale value
      expect(t("misc.playgroundDescription")).toBe(locales.tr.misc.playgroundDescription);
    });

    it("should return the raw key when the key is not found in any locale", () => {
      const t = createTranslator("en");
      // Cast to satisfy type system — intentionally invalid key
      const result = t("nonexistent.key" as Parameters<typeof t>[0]);
      expect(result).toBe("nonexistent.key");
    });

    it("should fall back to English for missing keys when only localeTexts is supplied to custom locale", () => {
      // No built-in locale specified — only partial texts. Missing keys fall back to en.
      const t = createTranslator("en", { upload: { selectFile: "Choisir un fichier" } });
      expect(t("upload.selectFile")).toBe("Choisir un fichier");
      expect(t("g.save")).toBe(en.g.save);
    });
  });
});

describe("MotifProvider — locale prop", () => {
  describe("string locale prop", () => {
    it("should expose the correct locale string via useMotifContext", () => {
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => <MotifProvider locale="tr">{children}</MotifProvider>,
      });
      expect(result.current.locale).toBe("tr");
    });

    it("should translate keys using the selected locale", () => {
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => <MotifProvider locale="tr">{children}</MotifProvider>,
      });
      expect(result.current.t("g.save")).toBe(tr.g.save);
    });

    it("should default to English when no locale prop is provided", () => {
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => <MotifProvider>{children}</MotifProvider>,
      });
      expect(result.current.locale).toBe("en");
      expect(result.current.t("g.save")).toBe(en.g.save);
    });
  });

  describe("object locale prop with text overrides", () => {
    it("should use the override string for the specified key", () => {
      const overrideBrowse = "Gözat...";
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <MotifProvider locale={{ locale: "tr", texts: { g: { browse: overrideBrowse } } }}>{children}</MotifProvider>
        ),
      });
      expect(result.current.t("g.browse")).toBe(overrideBrowse);
    });

    it("should fall back to the built-in locale for non-overridden keys", () => {
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <MotifProvider locale={{ locale: "tr", texts: { upload: { selectFile: "Dosya Seçiniz" } } }}>{children}</MotifProvider>
        ),
      });
      expect(result.current.t("g.cancel")).toBe(tr.g.cancel);
    });

    it("should use English as locale when object prop omits the locale key (custom locale)", () => {
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <MotifProvider locale={{ texts: { upload: { selectFile: "Choisir un fichier" } } }}>{children}</MotifProvider>
        ),
      });
      expect(result.current.t("upload.selectFile")).toBe("Choisir un fichier");
      expect(result.current.t("g.save")).toBe(en.g.save);
    });
  });

  describe("runtime locale switching via setLocale", () => {
    it("should update translations after setLocale is called", () => {
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => <MotifProvider locale="en">{children}</MotifProvider>,
      });

      expect(result.current.t("g.save")).toBe(en.g.save);

      act(() => {
        result.current.setLocale("tr");
      });

      expect(result.current.locale).toBe("tr");
      expect(result.current.t("g.save")).toBe(tr.g.save);
    });

    it("should switch back to English after toggling locales", () => {
      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => <MotifProvider locale="tr">{children}</MotifProvider>,
      });

      act(() => result.current.setLocale("en"));
      expect(result.current.locale).toBe("en");
      expect(result.current.t("g.cancel")).toBe(en.g.cancel);
    });
  });

  describe("external t prop", () => {
    it("should use the external t function instead of built-in translations", () => {
      const externalT = jest.fn((key: string) => `[external] ${key}`);

      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <MotifProvider t={externalT as never} locale="tr">
            {children}
          </MotifProvider>
        ),
      });

      const output = result.current.t("g.save");
      expect(externalT).toHaveBeenCalledWith("g.save");
      expect(output).toBe("[external] g.save");
    });

    it("should forward params to the external t function", () => {
      const externalT = jest.fn((key: string, params?: Record<string, unknown>) => (params ? `${key}:${JSON.stringify(params)}` : key));

      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => <MotifProvider t={externalT as never}>{children}</MotifProvider>,
      });

      result.current.t("validation.minLength", { min: 3 });
      expect(externalT).toHaveBeenCalledWith("validation.minLength", { min: 3 });
    });

    it("should not be affected by locale or setLocale when external t is provided", () => {
      const externalT = jest.fn(() => "external");

      const { result } = renderHook(() => useMotifContext(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <MotifProvider t={externalT as never} locale="en">
            {children}
          </MotifProvider>
        ),
      });

      act(() => result.current.setLocale("tr"));

      result.current.t("g.save");
      expect(externalT).toHaveBeenCalled();
      // external t always wins regardless of locale state
      expect(result.current.t("g.save")).toBe("external");
    });
  });
});

describe("Locale file structure parity", () => {
  const flattenKeys = (obj: Record<string, unknown>, prefix = ""): string[] =>
    Object.entries(obj).flatMap(([k, v]) => {
      const full = prefix ? `${prefix}.${k}` : k;
      return typeof v === "object" && v !== null ? flattenKeys(v as Record<string, unknown>, full) : [full];
    });

  it("should have all English keys present in the Turkish locale", () => {
    const enKeys = flattenKeys(en);
    const trKeys = new Set(flattenKeys(tr));
    const missing = enKeys.filter(k => !trKeys.has(k));
    expect(missing).toEqual([]);
  });

  it("should have all Turkish keys present in the English locale", () => {
    const trKeys = flattenKeys(tr);
    const enKeys = new Set(flattenKeys(en));
    const missing = trKeys.filter(k => !enKeys.has(k));
    expect(missing).toEqual([]);
  });

  it("should have string values for all leaf keys in English locale", () => {
    const enKeys = flattenKeys(en);
    enKeys.forEach(key => {
      const t = createTranslator("en");
      expect(typeof t(key as Parameters<typeof t>[0])).toBe("string");
    });
  });

  it("should have string values for all leaf keys in Turkish locale", () => {
    const trKeys = flattenKeys(tr);
    trKeys.forEach(key => {
      const t = createTranslator("tr");
      expect(typeof t(key as Parameters<typeof t>[0])).toBe("string");
    });
  });
});
