"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";

type Result = { text: string; value?: string };

const CITIES = ["Ankara", "İstanbul", "Antalya", "İzmir", "Konya", "Trabzon", "Manisa", "Hatay", "Van"];

/**
 * Manual test page for the NavBarSearch `onClear` prop.
 *
 * Reviewer scenario: results are fed by the consumer AFTER a trigger (press enter / search button).
 * Clearing the input must NOT decide what happens to the results/dropdown on its own — it should only
 * reset the query and fire `onClear`, letting the consumer decide.
 */
const Home = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const [clearShouldWipeResults, setClearShouldWipeResults] = useState(true);
  const [clearCount, setClearCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (line: string) => setLog(prev => [`${new Date().toLocaleTimeString()} — ${line}`, ...prev].slice(0, 12));

  // Simulates "consumer feeds results after a trigger" (press enter / search button).
  const doSearch = (query: string) => {
    addLog(`search triggered with "${query}"`);
    setSearching(true);
    setTimeout(() => {
      setResults(query ? CITIES.map(c => ({ text: `${c} ${query}`, value: c })) : []);
      setSearching(false);
    }, 600);
  };

  const handleClear = () => {
    setClearCount(c => c + 1);
    if (clearShouldWipeResults) {
      setResults([]);
      addLog("onClear fired → consumer wiped results (dropdown should close)");
    } else {
      addLog("onClear fired → consumer kept results (dropdown should STAY open)");
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "Inter, sans-serif", maxWidth: 1000 }}>
      <h1 style={{ marginTop: 0 }}>NavBar Search — onClear testi</h1>

      <ol style={{ lineHeight: 1.6, color: "#333" }}>
        <li>
          Arama kutusuna bir şey yaz ve <b>Enter</b>&apos;a bas ya da <b>arama (🔍) butonuna</b> tıkla → sonuçlar gelir.
        </li>
        <li>
          Input&apos;taki <b>temizle (✕) butonuna</b> tıkla.
        </li>
        <li>
          Gözlemle: query sıfırlanır ve <code>onClear</code> tetiklenir. Sonuçların/dropdown&apos;ın ne olacağına{" "}
          <b>bileşen değil, tüketici karar verir</b> (aşağıdaki anahtar).
        </li>
      </ol>

      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, margin: "8px 0 20px", cursor: "pointer" }}>
        <input type="checkbox" checked={clearShouldWipeResults} onChange={e => setClearShouldWipeResults(e.target.checked)} />
        <span>
          <b>onClear</b> sonuçları temizlesin (dropdown kapansın)
          {clearShouldWipeResults ? " — AÇIK" : " — KAPALI (sonuçlar açık kalmalı → yeni davranışın kanıtı)"}
        </span>
      </label>

      <div style={{ height: 150, border: "1px dashed #bbb", borderRadius: 8 }}>
        <NavBar
          logo={{ href: "#", imgPath: "https://motif-ui.com/logo.svg", alt: "logo" }}
          search={{
            placeholder: "Şehir ara...",
            onPressEnter: doSearch,
            onButtonClick: doSearch,
            onClear: handleClear,
            onResultClick: value => addLog(`result clicked: ${value}`),
            results,
            searching,
          }}
          button={{ label: "Login", icon: "person" }}
        />
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
        <div style={{ minWidth: 220 }}>
          <h3 style={{ margin: "0 0 8px" }}>Durum</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>
              Sonuç sayısı: <b>{results.length}</b>
            </li>
            <li>
              Aranıyor: <b>{String(searching)}</b>
            </li>
            <li>
              onClear tetiklenme: <b>{clearCount}</b>
            </li>
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ margin: "0 0 8px" }}>Olay günlüğü</h3>
          <pre
            style={{
              margin: 0,
              padding: 12,
              background: "#f5f5f5",
              borderRadius: 8,
              minHeight: 120,
              maxHeight: 220,
              overflow: "auto",
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            {log.length ? log.join("\n") : "(henüz olay yok)"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Home;
