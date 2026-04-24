"use client";

import { useState } from "react";

type Result = { category: string; area: string; total: number; counts: Record<string, number> };

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<{ totalVoters: number; totals: Result[]; raw: unknown[]; storageMode: string } | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const response = await fetch(`/api/admin/results?token=${encodeURIComponent(token)}`);
    const json = await response.json();
    if (!response.ok) return setError(json.message || "Acesso negado.");
    setData(json);
  }

  function download() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eletroawards-2026-resultados.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-shell">
      <section className="admin-card">
        <p className="eyebrow">EletroAwards 2026</p>
        <h1>Painel de apuração</h1>
        <div className="admin-actions">
          <input placeholder="ADMIN_TOKEN" value={token} onChange={(event) => setToken(event.target.value)} />
          <button onClick={load}>Carregar</button>
          {data && <button onClick={download}>Exportar JSON</button>}
        </div>
        {error && <p className="error">{error}</p>}
        {data && (
          <div className="results">
            <div className="kpi"><strong>{data.totalVoters}</strong><span>votantes registrados</span><small>Storage: {data.storageMode}</small></div>
            {data.totals.map((result) => (
              <article key={result.category}>
                <h2>{result.category}</h2>
                <p>{result.area} • {result.total} votos válidos</p>
                {Object.entries(result.counts).map(([name, count]) => (
                  <div className="bar" key={name}>
                    <span>{name}</span>
                    <i><b style={{ width: `${result.total ? (count / result.total) * 100 : 0}%` }} /></i>
                    <em>{count}</em>
                  </div>
                ))}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
