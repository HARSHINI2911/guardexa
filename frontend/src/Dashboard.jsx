import { useEffect, useState, useCallback } from "react";

const API = "http://127.0.0.1:8000";

const SCENARIOS = [
  { key: "normal_payment", label: "Normal payment", emoji: "✅", color: "#10B981", desc: "Pay vendor ₹5,000" },
  { key: "poisoned_invoice", label: "Poisoned invoice", emoji: "☠️", color: "#EF4444", desc: "Hidden text says send ₹5,00,000" },
  { key: "data_leak", label: "Data leak email", emoji: "📧", color: "#F59E0B", desc: "Email with confidential salary data" },
  { key: "web_injection_delete", label: "Web injection", emoji: "🕸️", color: "#7C3AED", desc: "Website tells agent to delete 4,200 records" },
];

async function api(path, method = "GET") {
  const res = await fetch(API + path, { method });
  return res.json();
}

export default function Dashboard() {
  const [state, setState] = useState(null);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [chain, setChain] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [s, p, h, v] = await Promise.all([
        api("/state"),
        api("/pending"),
        api("/history"),
        api("/verify"),
      ]);
      setState(s);
      setPending(p);
      setHistory(h);
      setChain(v);
      setError("");
    } catch (e) {
      setError("Cannot reach the backend. Is uvicorn running in the first terminal?");
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [refresh]);

  const run = async (key) => {
    setBusy(key);
    try {
      const r = await api("/run/" + key, "POST");
      setResult(r);
    } catch (e) {
      setError("Cannot reach the backend.");
    }
    await refresh();
    setBusy("");
  };

  const act = async (path) => {
    try {
      await api(path, "POST");
    } catch (e) {
      setError("Cannot reach the backend.");
    }
    await refresh();
  };

  const reset = async () => {
    await act("/reset");
    setResult(null);
  };

  const waiting = pending.filter((p) => p.status === "pending");
  const undoable = history.filter((h) => h.status === "done" && h.tool !== "read_file");
  const r = result && result.results && result.results[0];
  const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

  return (
    <section id="demo" className="dash">
      <h2>
        Live <span className="grad">demo</span>
      </h2>
      <p className="sub">Pick a scenario. GuardExa decides before anything runs.</p>

      {error && <div className="err">{error}</div>}

      <div className="tiles">
        <div className="tile t1">
          <span>💰 Bank balance</span>
          <b>{state ? money(state.balance) : "-"}</b>
        </div>
        <div className="tile t2">
          <span>📧 Emails sent</span>
          <b>{state ? state.emails_sent : "-"}</b>
        </div>
        <div className="tile t3">
          <span>🗄️ Records</span>
          <b>{state ? state.records.toLocaleString("en-IN") : "-"}</b>
        </div>
        <div className={"tile " + (chain && !chain.valid ? "t5" : "t4")}>
          <span>🔗 Audit chain</span>
          <b>{chain ? (chain.valid ? "Intact" : "Tampered") : "-"}</b>
          <small>{chain ? chain.entries + " entries" : ""}</small>
        </div>
      </div>

      <div className="scen">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            className="scen-btn"
            style={{ "--c": s.color }}
            onClick={() => run(s.key)}
            disabled={busy !== ""}
          >
            <span className="emo">{s.emoji}</span>
            <b>{s.label}</b>
            <small>{s.desc}</small>
            {busy === s.key && <em>Checking...</em>}
          </button>
        ))}
      </div>

      <div className="panels">
        <div className="panel">
          <h3>🛡️ GuardExa verdict</h3>
          {!r && <p className="empty">Click a scenario above to see the decision.</p>}
          {r && (
            <div className={"res v-" + r.decision}>
              <div className="res-top">
                <span className="res-badge">
                  {r.decision === "block" && "⛔ BLOCKED"}
                  {r.decision === "approve" && "✋ NEEDS APPROVAL"}
                  {r.decision === "allow" && "✅ ALLOWED"}
                </span>
                <span>Tool: <b>{r.tool}</b></span>
              </div>
              <div className="risk-label">
                Risk score <b>{r.risk} / 100</b>
              </div>
              <div className="risk">
                <span style={{ width: r.risk + "%" }} />
              </div>
              <ul>
                {r.reasons.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
              <div className="outcome">{r.outcome}</div>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>✋ Waiting for human approval</h3>
          {waiting.length === 0 && <p className="empty">Nothing is waiting.</p>}
          {waiting.map((p) => (
            <div className="item" key={p.id}>
              <div>
                <b>#{p.id} {p.tool}</b>
                <small>{p.reasons.join(" · ")}</small>
              </div>
              <div className="item-btns">
                <button className="ok" onClick={() => act("/approve/" + p.id)}>Approve</button>
                <button className="no" onClick={() => act("/reject/" + p.id)}>Reject</button>
              </div>
            </div>
          ))}

          <h3 className="h3b">↩️ Undo history</h3>
          {undoable.length === 0 && <p className="empty">No actions to undo.</p>}
          {undoable.map((h) => (
            <div className="item" key={h.id}>
              <div>
                <b>#{h.id} {h.tool}</b>
                <small>{h.result}</small>
              </div>
              <div className="item-btns">
                <button className="undo" onClick={() => act("/undo/" + h.id)}>Undo</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="reset" onClick={reset}>Reset demo</button>
    </section>
  );
}