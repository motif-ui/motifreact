"use client";

import { Card, Form, Grid, InputDateRange } from "src/lib";
import { useMotifContext } from "../lib/motif/context/MotifProvider";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginTop: 48 }}>
    <h3
      style={{
        marginBottom: 16,
        fontSize: 13,
        fontWeight: 600,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

const Home = () => {
  const { t } = useMotifContext();

  return (
    <div style={{ margin: "0 auto", padding: 20 }}>
      <h2>{t("g.hello_x", { name: "MOTİF UI" })}</h2>
      <h4 style={{ marginBottom: 0 }}>{t("misc.playgroundDescription")}</h4>

      {/* ── 1. CARD içinde ────────────────────────────────────────── */}
      <Section title="1 — Card içinde (sol / sağ)">
        <Grid fluid>
          <Grid.Row>
            {/* Sol card — picker normal açılmalı */}
            <Grid.Col md={6}>
              <Card title="Rezervasyon" subtitle="Başlangıç ve bitiş tarihi seçin" elevated>
                <InputDateRange />
              </Card>
            </Grid.Col>

            {/* Sağ card — picker taşmamalı, sağa hizalanmalı */}
            <Grid.Col md={6}>
              <Card title="Rezervasyon (Sağ)" subtitle="Picker sola kaymalı açılmalı" elevated>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <InputDateRange />
                </div>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Section>

      {/* ── 2. FORM içinde — tam genişlik ─────────────────────────── */}
      <Section title="2 — Form içinde, 2 sütunlu Grid">
        <Form title="Tarih Aralığı Formu" onSubmit={() => {}}>
          <Grid fluid>
            <Grid.Row>
              <Grid.Col md={6}>
                <Form.Field name="checkIn" label="Giriş Tarihi">
                  <InputDateRange />
                </Form.Field>
              </Grid.Col>

              <Grid.Col md={6}>
                <Form.Field name="checkOut" label="Çıkış Tarihi">
                  <InputDateRange />
                </Form.Field>
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col md={4}>
                <Form.Field name="period1" label="Dönem 1">
                  <InputDateRange />
                </Form.Field>
              </Grid.Col>

              <Grid.Col md={4}>
                <Form.Field name="period2" label="Dönem 2">
                  <InputDateRange />
                </Form.Field>
              </Grid.Col>

              {/* Sağ sütun — taşma kritik bölge */}
              <Grid.Col md={4}>
                <Form.Field name="period3" label="Dönem 3 (sağ köşe)">
                  <InputDateRange />
                </Form.Field>
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Form>
      </Section>

      {/* ── 3. Card + Form birlikte ────────────────────────────────── */}
      <Section title="3 — Card içinde Form (4 sütunlu grid)">
        <Card title="Kampanya Ayarları" subtitle="Tüm tarih alanları" elevated outlined>
          <Form onSubmit={() => {}}>
            <Grid fluid>
              <Grid.Row>
                <Grid.Col md={3}>
                  <Form.Field name="f1" label="Alan 1 (sol)">
                    <InputDateRange size="sm" />
                  </Form.Field>
                </Grid.Col>

                <Grid.Col md={3}>
                  <Form.Field name="f2" label="Alan 2">
                    <InputDateRange size="sm" />
                  </Form.Field>
                </Grid.Col>

                <Grid.Col md={3}>
                  <Form.Field name="f3" label="Alan 3">
                    <InputDateRange size="sm" />
                  </Form.Field>
                </Grid.Col>

                {/* En sağ sütun — kritik taşma testi */}
                <Grid.Col md={3}>
                  <Form.Field name="f4" label="Alan 4 (sağ köşe)">
                    <InputDateRange size="sm" />
                  </Form.Field>
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </Form>
        </Card>
      </Section>

      {/* ── 4. Temel overflow kontrolü ────────────────────────────── */}
      <Section title="4 — Temel overflow kontrolü (flex, sol / sağ)">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <InputDateRange />
          <span style={{ flex: 1 }} />
          <InputDateRange />
        </div>
      </Section>

      {/* ── 5. overflow:hidden sarmalayıcı ────────────────────────── */}
      <Section title="5 — overflow:hidden sarmalayıcı, Popover API testi">
        <div
          style={{
            overflow: "hidden",
            border: "1px dashed #ccc",
            borderRadius: 8,
            padding: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <InputDateRange />
        </div>
      </Section>

      {/* ── 6. Boyut varyantları — sol vs sağ ──────────────────────*/}
      <Section title="6 — Boyut varyantları (xs → lg): sol vs sağ overflow karşılaştırması">
        <Grid fluid>
          {(["xs", "sm", "md", "lg"] as const).map(size => (
            <Grid.Row key={size} style={{ marginBottom: 8 }}>
              <Grid.Col md={6}>
                <InputDateRange size={size} />
              </Grid.Col>
              <Grid.Col md={6}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <InputDateRange size={size} />
                </div>
              </Grid.Col>
            </Grid.Row>
          ))}
        </Grid>
      </Section>

      <div style={{ height: 400 }} />
    </div>
  );
};

export default Home;
