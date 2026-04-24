"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, LockKeyhole, Sparkles, Trophy, Vote, ShieldCheck } from "lucide-react";
import { AWARD_CATEGORIES, ASSETS } from "@/lib/awards";

type Screen = "loading" | "login" | "vote" | "success" | "already";
type SessionResponse = { authenticated: boolean; name?: string; voted?: boolean; storageMode?: string };

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function firstName(name?: string) {
  return (name || "").split(" ")[0] || "";
}

function cpfMask(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [votes, setVotes] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(AWARD_CATEGORIES.map((category) => [category.id, category.nominees.length ? "" : null]))
  );

  const logo = ASSETS.find((asset) => asset.includes("LOGO-1")) || ASSETS.find((asset) => asset.includes("LOGO"));
  const theme = ASSETS.find((asset) => asset.includes("Tema-1")) || ASSETS.find((asset) => asset.includes("Tema"));
  const mote = ASSETS.find((asset) => asset.includes("Mote-2")) || ASSETS.find((asset) => asset.includes("Mote"));
  const grafismos = ASSETS.filter((asset) => asset.includes("Grafismos")).slice(0, 8);

  const completed = useMemo(() => {
    const required = AWARD_CATEGORIES.filter((category) => category.nominees.length > 0).length;
    const done = AWARD_CATEGORIES.filter((category) => category.nominees.length === 0 || votes[category.id]).length;
    return { required, done, percent: Math.round((done / AWARD_CATEGORIES.length) * 100) };
  }, [votes]);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data: SessionResponse) => {
        if (!data.authenticated) return setScreen("login");
        setName(data.name || "");
        setScreen(data.voted ? "already" : "vote");
      })
      .catch(() => setScreen("login"));
  }, []);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Não foi possível acessar a votação.");
      return;
    }
    setName(data.name);
    setScreen(data.voted ? "already" : "vote");
  }

  async function submitVotes() {
    setError("");
    const missing = AWARD_CATEGORIES.find((category) => category.nominees.length > 0 && !votes[category.id]);
    if (missing) {
      setError(`Antes de finalizar, selecione uma opção em “${missing.title}”.`);
      document.getElementById(missing.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes })
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (response.status === 409 || data.alreadyVoted) return setScreen("already");
    if (!response.ok) {
      setError(data.message || "Não foi possível computar os votos.");
      return;
    }
    setScreen("success");
  }

  return (
    <main className="shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      {grafismos.map((asset, index) => (
        <img key={asset} className={`floating-mark mark-${index + 1}`} src={`/assets/eletro/${asset}`} alt="" aria-hidden="true" />
      ))}
      <section className="stage">
        <AnimatePresence mode="wait">
          {screen === "loading" && (
            <motion.div key="loading" className="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span />
            </motion.div>
          )}

          {screen === "login" && (
            <motion.div key="login" className="login-card" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <div className="brand-stack">
                {logo && <img className="brand-logo" src={`/assets/eletro/${logo}`} alt="EletroAwards 2026" />}
                {theme && <img className="theme-logo" src={`/assets/eletro/${theme}`} alt="Tema da Convenção" />}
              </div>
              <form onSubmit={submitLogin} className="login-form">
                <label htmlFor="cpf">CPF</label>
                <div className="input-wrap">
                  <LockKeyhole size={18} />
                  <input id="cpf" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={cpf} onChange={(event) => setCpf(cpfMask(event.target.value))} />
                </div>
                {error && <p className="error">{error}</p>}
                <button className="primary-button" type="submit">
                  Acessar votação <ChevronRight size={18} />
                </button>
              </form>
            </motion.div>
          )}

          {screen === "vote" && (
            <motion.div key="vote" className="vote-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="vote-header">
                <div>
                  <p className="eyebrow"><Sparkles size={15} /> EletroAwards 2026</p>
                  <h1>{greeting()}, {firstName(name)}.</h1>
                  <p className="subtitle">Escolha seus destaques da temporada. Cada categoria aceita apenas um voto.</p>
                </div>
                <div className="progress-card">
                  <span>{completed.percent}%</span>
                  <p>{completed.done}/{AWARD_CATEGORIES.length} categorias</p>
                  <div className="progress-bar"><i style={{ width: `${completed.percent}%` }} /></div>
                </div>
              </header>

              <div className="award-grid">
                {AWARD_CATEGORIES.map((category, index) => (
                  <motion.article id={category.id} className="category-card" key={category.id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}>
                    <div className="category-head">
                      <div className="number">{String(category.number).padStart(2, "0")}</div>
                      <div>
                        <p>{category.area || "Categoria Especial"}</p>
                        <h2>{category.title}</h2>
                      </div>
                    </div>
                    {category.nominees.length === 0 ? (
                      <div className="null-box">
                        <Trophy size={18} /> Indicados serão inseridos posteriormente.
                      </div>
                    ) : (
                      <div className="nominees">
                        {category.nominees.map((nominee) => {
                          const selected = votes[category.id] === nominee;
                          return (
                            <button key={nominee} className={selected ? "nominee selected" : "nominee"} onClick={() => setVotes((old) => ({ ...old, [category.id]: nominee }))} type="button">
                              <span>{nominee}</span>
                              <i>{selected ? <Check size={16} /> : <Vote size={15} />}</i>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>

              <div className="submit-dock">
                <div>
                  <strong>{completed.percent}% concluído</strong>
                  <span>Revise suas escolhas antes de finalizar.</span>
                </div>
                <button className="primary-button" onClick={submitVotes} disabled={saving} type="button">
                  {saving ? "Computando..." : "Finalizar votação"} <ShieldCheck size={18} />
                </button>
              </div>
              {error && <p className="error dock-error">{error}</p>}
            </motion.div>
          )}

          {screen === "success" && (
            <FinalCard logo={logo} mote={mote} title="Votos computados com sucesso." text="Os(as) premiados(as) serão conhecidos na Convenção EletroMidia 2026." />
          )}
          {screen === "already" && (
            <FinalCard logo={logo} mote={mote} title="Seus votos já foram registrados." text="Obrigado por participar do EletroAwards 2026. A votação deste CPF já consta como concluída em nossa base." />
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

function FinalCard({ logo, mote, title, text }: { logo?: string; mote?: string; title: string; text: string }) {
  return (
    <motion.div className="final-card" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>
      {logo && <img className="brand-logo" src={`/assets/eletro/${logo}`} alt="EletroAwards 2026" />}
      <div className="check-orb"><Check size={36} /></div>
      <h1>{title}</h1>
      <p>{text}</p>
      {mote && <img className="mote" src={`/assets/eletro/${mote}`} alt="" />}
    </motion.div>
  );
}
