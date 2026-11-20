"use client";

import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import { BUTTON_VARIANTS } from "./recipes";
import { CHROMATIC, COLOR_SEEDS, INTENTS, INTENT_STEP_LIST, type Intent, NEUTRAL_STEP_LIST } from "./theme";
import styles from "./tokens.module.scss";

/* ---------------------- Düz HTML + data-recipe kısayolları ---------------------- */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: (typeof BUTTON_VARIANTS)[number];
  intent?: Intent;
  size?: "sm" | "icon";
  force?: string;
};

const Btn = ({ variant = "solid", intent = "primary", size, force, ...props }: BtnProps) => (
  <button type="button" data-recipe={`btn/${variant}/${intent}`} data-size={size} data-force={force} {...props} />
);

const Code = ({ children }: { children: ReactNode }) => <code data-recipe="code">{children}</code>;

const Section = ({ title, lead, children }: { title: string; lead: ReactNode; children: ReactNode }) => (
  <section className={styles.section}>
    <div className={styles.sectionHead}>
      <h2 data-recipe="heading">{title}</h2>
      <p data-recipe="text/muted">{lead}</p>
    </div>
    {children}
  </section>
);

/* ------------------------------- 1. Hiyerarşi ------------------------------- */

const LAYERS = [
  {
    name: "1 · Seed",
    tokens: "--theme-color-seed-primary",
    desc: "Kullanıcının verdiği 3–6 renk + radius, space, font-size. Tema = bu değerler.",
  },
  {
    name: "2 · Palette",
    tokens: "--theme-color-palette-primary-700",
    desc: "Seed'den oklch ile otomatik üretilen skala. Private: componentler asla doğrudan kullanmaz.",
  },
  {
    name: "3 · Semantic",
    tokens: "--theme-color-primary-text",
    desc: "Role göre isim: surface / text / border / intent × emphasis / state. Light-dark tek tanımda.",
  },
  {
    name: "Element",
    tokens: "outline button → color",
    desc: "Sadece semantic token tüketir. --button-* gibi component token yok.",
  },
];

const Ramp = ({ seed }: { seed: string }) => {
  const steps = seed === "neutral" ? NEUTRAL_STEP_LIST : INTENT_STEP_LIST;
  return (
    <div className={styles.ramp}>
      <span data-recipe="text/muted" className={styles.rampLabel}>
        {seed}
      </span>
      <span
        data-token={`--theme-color-seed-${seed}`}
        className={styles.seedSwatch}
        style={{ background: `var(--theme-color-seed-${seed})` }}
        title="seed"
      />
      {steps.map(step => (
        <span
          key={step}
          data-token={`--theme-color-palette-${seed}-${step}`}
          className={styles.swatch}
          style={{ background: `var(--theme-color-palette-${seed}-${step})` }}
          title={`${seed}-${step}`}
        />
      ))}
    </div>
  );
};

export const Hierarchy = () => (
  <Section
    title="Token hiyerarşisi"
    lead={
      <>
        Seed → Palette → Semantic → Element. Sağdaki <b>Tokenlar</b> sekmesinde bir token&apos;ın üzerine gel: onu kullanan her eleman
        işaretlenir. Palette karelerinin üzerine gelince zincirin geri kalanını görürsün.
      </>
    }
  >
    <div className={styles.layers}>
      {LAYERS.map(({ name, tokens, desc }) => (
        <div key={name} data-surface="default" className={styles.layer}>
          <strong>{name}</strong>
          <Code>{tokens}</Code>
          <p data-recipe="text/muted">{desc}</p>
        </div>
      ))}
    </div>
    <div data-surface="default" className={styles.ramps}>
      {COLOR_SEEDS.map(seed => (
        <Ramp key={seed} seed={seed} />
      ))}
      <p data-recipe="help">
        İlk kare seed&apos;in kendisi, sonrası üretilen skala. Lightness sabit adımlarda, hue/chroma seed&apos;den gelir — hangi rengi
        verirsen ver aynı ritimde bir skala çıkar. Neutral seed&apos;in sadece tonu (hafif mavimsi, sıcak vs.) kullanılır.
      </p>
    </div>
  </Section>
);

/* ------------------------------ 2. Zemin basamakları ------------------------------ */

const SURFACES = [
  { name: "canvas", desc: "Sayfa zemini" },
  { name: "default", desc: "Card, panel" },
  { name: "raised", desc: "Popover, modal" },
  { name: "sunken", desc: "Well, iç alan" },
  { name: "inverse", desc: "Ters scheme" },
  { name: "brand", desc: "Marka zemini" },
];

const SurfaceSample = () => (
  <>
    <p data-recipe="text/default">text-default</p>
    <p data-recipe="text/muted">text-muted</p>
    <p data-recipe="text/subtle">text-subtle</p>
    <p data-recipe="text/disabled">text-disabled</p>
    <div className={styles.borderSamples}>
      {(["subtle", "default", "strong"] as const).map(level => (
        <span key={level} style={{ borderColor: `var(--theme-color-border-${level})` }} data-recipe="help">
          {level}
        </span>
      ))}
    </div>
    <input data-recipe="field" placeholder="Input" />
    <div className={styles.row}>
      <Btn size="sm">Solid</Btn>
      <Btn size="sm" variant="outline" intent="neutral">
        Outline
      </Btn>
      <Btn size="sm" variant="ghost">
        Ghost
      </Btn>
    </div>
    <div className={styles.row}>
      <span data-recipe="badge/soft/primary">primary</span>
      <span data-recipe="badge/soft/success">success</span>
      <span data-recipe="badge/soft/danger">danger</span>
    </div>
  </>
);

export const SurfaceLadder = () => (
  <Section
    title="Zemin basamakları & renksiz renkler"
    lead={
      <>
        Aynı içerik, farklı zeminler. Border, disabled, soft ve hover tokenları opak gri değil, <Code>text-default</Code>&apos;un alfalı
        hali olduğu için her zeminde kendiliğinden doğru görünür. <Code>inverse</Code> sadece <Code>color-scheme</Code>&apos;ı çevirir;{" "}
        <Code>brand</Code> text-default&apos;u kontrast rengine çevirip nötrleri yeniden türetir.
      </>
    }
  >
    <div className={styles.surfaces}>
      {SURFACES.map(({ name, desc }) => (
        <div key={name} data-surface={name} className={`${styles.surfaceTile} ${name === "canvas" ? styles.canvasTile : ""}`}>
          <div className={styles.tileHead}>
            <strong>{name}</strong>
            <span data-recipe="help">{desc}</span>
          </div>
          <SurfaceSample />
        </div>
      ))}
    </div>
  </Section>
);

/* ------------------------------- 3. Buton matrisi ------------------------------- */

const MATRIX_CONTEXTS = [
  { key: "canvas", label: "canvas", attrs: {} },
  { key: "default", label: "default", attrs: { "data-surface": "default" } },
  { key: "sunken", label: "sunken", attrs: { "data-surface": "sunken" } },
  { key: "inverse", label: "inverse", attrs: { "data-surface": "inverse" } },
  { key: "brand", label: "brand", attrs: { "data-surface": "brand" } },
  { key: "striped", label: "zebra satır", attrs: { "data-recipe": "table/row-striped" } },
  { key: "selected", label: "seçili satır", attrs: { "data-recipe": "table/row-selected" } },
] as const;

const MATRIX_STATES = ["default", "hover", "active", "focus", "disabled"] as const;

export const ButtonMatrix = () => {
  const [contextKey, setContextKey] = useState<(typeof MATRIX_CONTEXTS)[number]["key"]>("canvas");
  const { attrs } = MATRIX_CONTEXTS.find(({ key }) => key === contextKey) ?? MATRIX_CONTEXTS[0];
  return (
    <Section
      title="Buton: intent × emphasis × durum"
      lead={
        <>
          6 intent, 4 emphasis, 5 durum. Outline/ghost hover&apos;ı <Code>state-hover</Code> = <Code>currentColor %8</Code> olduğundan
          zemine bakmaz; zebra ya da seçili tablo satırında da çalışır. Zemini değiştir:
        </>
      }
    >
      <div className={styles.segmented} data-tk-chrome>
        {MATRIX_CONTEXTS.map(({ key, label }) => (
          <Btn key={key} size="sm" variant={key === contextKey ? "solid" : "ghost"} intent="neutral" onClick={() => setContextKey(key)}>
            {label}
          </Btn>
        ))}
      </div>
      <div {...attrs} className={styles.matrixHost}>
        {BUTTON_VARIANTS.map(variant => (
          <div key={variant} className={styles.matrix}>
            <span data-recipe="label">{variant}</span>
            {MATRIX_STATES.map(state => (
              <span key={state} data-recipe="help" className={styles.matrixHead}>
                {state}
              </span>
            ))}
            {INTENTS.map(intent => (
              <div key={intent} className={styles.matrixRow}>
                <span data-recipe="help">{intent}</span>
                {MATRIX_STATES.map(state => (
                  <span key={state}>
                    <Btn
                      variant={variant}
                      intent={intent}
                      size="sm"
                      force={state === "disabled" ? undefined : state}
                      disabled={state === "disabled"}
                    >
                      Button
                    </Btn>
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ------------------------------- 4. Örnek ekran ------------------------------- */

const NAV = ["Genel bakış", "Başvurular", "Raporlar", "Kullanıcılar", "Ayarlar"];

const ROWS = [
  { id: "BŞV-1042", name: "Ayşe Yılmaz", status: ["success", "Onaylandı"], amount: "₺12.400" },
  { id: "BŞV-1043", name: "Mert Demir", status: ["warning", "İnceleniyor"], amount: "₺3.150" },
  { id: "BŞV-1044", name: "Zeynep Kaya", status: ["danger", "Reddedildi"], amount: "₺8.900" },
  { id: "BŞV-1045", name: "Can Öztürk", status: ["primary", "Yeni"], amount: "₺1.275" },
  { id: "BŞV-1046", name: "Elif Arslan", status: ["neutral", "Taslak"], amount: "₺640" },
] as const;

const DataTable = ({ selectedIndex }: { selectedIndex: number }) => (
  <div className={styles.tableWrap}>
    <table data-recipe="table">
      <thead>
        <tr>
          <th data-recipe="table/head-cell">
            <input type="checkbox" data-recipe="check" aria-label="Tümünü seç" />
          </th>
          {["No", "Başvuran", "Durum", "Tutar", ""].map(head => (
            <th key={head} data-recipe="table/head-cell">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map(({ id, name, status: [intent, label], amount }, index) => (
          <tr key={id} data-recipe={index === selectedIndex ? "table/row-selected" : index % 2 ? "table/row-striped" : "table/row"}>
            <td data-recipe="table/cell">
              <input type="checkbox" data-recipe="check" defaultChecked={index === selectedIndex} aria-label={`${id} seç`} />
            </td>
            <td data-recipe="table/cell">
              <span data-recipe="text/muted">{id}</span>
            </td>
            <td data-recipe="table/cell">{name}</td>
            <td data-recipe="table/cell">
              <span data-recipe={`badge/soft/${intent}`}>{label}</span>
            </td>
            <td data-recipe="table/cell">{amount}</td>
            <td data-recipe="table/cell">
              <div className={styles.rowActions}>
                <Btn size="sm" variant="ghost" intent="neutral">
                  Detay
                </Btn>
                <Btn size="sm" variant="outline" intent="primary">
                  Düzenle
                </Btn>
                <Btn size="sm" variant="ghost" intent="danger">
                  Sil
                </Btn>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FormCard = () => (
  <div data-surface="default" className={styles.card}>
    <h3 data-recipe="heading">Başvuru formu</h3>
    <label className={styles.field}>
      <span data-recipe="label">Ad soyad</span>
      <input data-recipe="field" placeholder="Örn. Ayşe Yılmaz" />
    </label>
    <label className={styles.field}>
      <span data-recipe="label">E-posta</span>
      <input data-recipe="field/invalid" defaultValue="ayse@" aria-invalid="true" />
      <span data-recipe="help/danger">Geçerli bir e-posta girin.</span>
    </label>
    <div className={styles.fieldRow}>
      <label className={styles.field}>
        <span data-recipe="label">Şehir</span>
        <select data-recipe="field" defaultValue="Ankara">
          <option>Ankara</option>
          <option>İstanbul</option>
          <option>İzmir</option>
        </select>
      </label>
      <label className={styles.field}>
        <span data-recipe="label">T.C. No (kilitli)</span>
        <input data-recipe="field" defaultValue="•••••••••12" disabled />
      </label>
    </div>
    <label className={styles.field}>
      <span data-recipe="label">Açıklama</span>
      <textarea data-recipe="field" placeholder="Kısa bir açıklama..." />
      <span data-recipe="help">En fazla 500 karakter.</span>
    </label>
    <div className={styles.row}>
      <label className={styles.inline}>
        <input type="checkbox" data-recipe="check" defaultChecked /> <span data-recipe="text/default">KVKK metnini okudum</span>
      </label>
      <label className={styles.inline}>
        <input type="radio" name="kind" data-recipe="check" defaultChecked /> <span data-recipe="text/default">Bireysel</span>
      </label>
      <label className={styles.inline}>
        <input type="radio" name="kind" data-recipe="check" /> <span data-recipe="text/default">Kurumsal</span>
      </label>
    </div>
    <hr data-recipe="divider" />
    <div className={styles.rowEnd}>
      <Btn variant="ghost" intent="neutral">
        Vazgeç
      </Btn>
      <Btn variant="outline" intent="neutral" disabled>
        Taslak
      </Btn>
      <Btn>Gönder</Btn>
    </div>
  </div>
);

const SideCard = () => (
  <div className={styles.stack}>
    {(["primary", "success", "warning", "danger"] as const).map(intent => (
      <div key={intent} data-recipe={`alert/${intent}`}>
        <span data-recipe={`alert-title/${intent}`}>
          {{ primary: "Bilgi", success: "Kaydedildi", warning: "Dikkat", danger: "Hata" }[intent]}
        </span>
        <span data-recipe="text/muted">Zemin intent-soft, başlık intent-text, gövde text-muted.</span>
      </div>
    ))}
    <div data-surface="raised" className={styles.card}>
      <div className={styles.rowBetween}>
        <strong>Ekip</strong>
        <span data-surface="inverse" className={styles.tooltip}>
          Tooltip = inverse
        </span>
      </div>
      <div className={styles.avatars}>
        {CHROMATIC.map((intent, index) => (
          <span key={intent} data-recipe={`avatar/${intent}`}>
            {["AY", "MD", "ZK", "CÖ", "EA"][index]}
          </span>
        ))}
      </div>
      <span data-recipe="help">Avatar halkası surface-current: raised zeminin rengini alır.</span>
      <div data-recipe="progress/track">
        <div data-recipe="progress/bar" style={{ width: "64%" }} />
      </div>
      <span data-recipe="help">%64 tamamlandı</span>
    </div>
  </div>
);

export const Scenario = () => (
  <Section
    title="Gerçek ekran"
    lead="Inverse sidebar, brand banner, card içinde form, zebra/seçili satırlı tablo ve satır içi butonlar. Hepsi aynı semantic tokenlarla, ek tanım olmadan."
  >
    <div className={styles.shell}>
      <aside data-surface="inverse" className={styles.sidebar}>
        <strong className={styles.logo}>e-Başvuru</strong>
        {NAV.map((item, index) => (
          <button key={item} type="button" data-recipe={index === 1 ? "nav-item/selected" : "nav-item"}>
            {item}
          </button>
        ))}
        <div className={styles.sidebarFoot}>
          <span data-recipe="avatar/accent">MA</span>
          <Btn size="sm" variant="ghost" intent="neutral">
            Çıkış
          </Btn>
        </div>
      </aside>
      <div className={styles.shellMain}>
        <div data-surface="brand" className={styles.banner}>
          <div className={styles.stackTight}>
            <h3 data-recipe="heading">Hoş geldin</h3>
            <p data-recipe="text/muted">3 başvuru onayını bekliyor. Banner&apos;da primary tersine dönüyor.</p>
          </div>
          <div className={styles.row}>
            <input data-recipe="field" placeholder="Başvuru ara..." />
            <Btn>Yeni başvuru</Btn>
            <Btn variant="outline">Dışa aktar</Btn>
            <Btn variant="ghost" intent="neutral">
              Yardım
            </Btn>
          </div>
        </div>
        <div data-surface="default" className={styles.card}>
          <div className={styles.rowBetween}>
            <h3 data-recipe="heading">Son başvurular</h3>
            <div className={styles.row}>
              <span data-recipe="badge/outline/neutral">5 kayıt</span>
              <Btn size="sm" variant="soft">
                Filtrele
              </Btn>
            </div>
          </div>
          <DataTable selectedIndex={1} />
          <p data-recipe="text/subtle">
            Daha fazlası için{" "}
            <a href="#" data-recipe="link" onClick={event => event.preventDefault()}>
              tüm başvurular
            </a>
            .
          </p>
        </div>
        <div data-surface="sunken" className={styles.card}>
          <div className={styles.rowBetween}>
            <h3 data-recipe="heading">Zeminli alan içinde tablo</h3>
            <span data-recipe="help">sunken zemin; satır/başlık alfalı olduğu için uyumlu</span>
          </div>
          <DataTable selectedIndex={3} />
        </div>
        <div className={styles.split}>
          <FormCard />
          <SideCard />
        </div>
      </div>
    </div>
  </Section>
);
