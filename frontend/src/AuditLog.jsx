import { useEffect, useState, useCallback } from "react";

const API = "http://127.0.0.1:8000";
const LABEL = { allow: "Allowed", approve: "Held", block: "Blocked" };

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [chain, setChain] = useState(null);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const get = (p) => fetch(API + p).then((r) => r.json());
      const [l, v, p, h] = await Promise.all([
        get("/logs?limit=12"),
        get("/verify"),
        get("/pending"),
        get("/history"),
      ]);
      setLogs(l);
      setChain(v);
      setPending(p);
      setHistory(h);
      setError("");
    } catch (e) {
      setError("Cannot reach the backend. Is uvicorn running in the first terminal?");
    }
  }, []);

  useEffect(() => {
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, [load]);

  const post = async (path) => {
    await fetch(API + path, { method: "POST" });
    load();
  };

  const inter = [
    ...pending
      .filter((p) => p.status !== "pending")
      .map((p) => ({
        key: "p" + p.id,
        icon: p.status === "approved" ? "✅" : "❌",
        text: "Human " + p.status + " · #" + p.id + " " + p.tool,
      })),
    ...history
      .filter((h) => h.status === "undone")
      .map((h) => ({
        key: "h" + h.id,
        icon: "↩️",
        text: "Action undone · #" + h.id + " " + h.tool + " · " + h.undo_result,
      })),
  ];

  return (
    <section id="audit" className="aud">
      <h2>
        Audit <span className="grad3">log</span>
      </h2>
      <p className="sub">
        Every decision is recorded. Each entry is chained to the one before it.
      </p>

      {error && <div className="err" style={{ margin: "0 auto 20px", maxWidth: 520 }}>{error}</div>}

      {chain && (
        <div className={"chain " + (chain.valid ? "ok" : "bad")}>
          {chain.valid
            ? "🔗 Chain intact · " + chain.entries + " entries verified"
            : "🚨 Tampering detected at entry #" + chain.broken_at}
        </div>
      )}

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Time</th>
              <th>Tool</th>
              <th>Decision</th>
              <th>Risk</th>
              <th>Why</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#6B7280" }}>
                  No entries yet. Run a scenario in the Live demo.
                </td>
              </tr>
            )}
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{new Date(l.ts).toLocaleTimeString("en-IN")}</td>
                <td><b>{l.tool}</b></td>
                <td><span className={"pill " + l.decision}>{LABEL[l.decision]}</span></td>
                <td>{l.risk}</td>
                <td>{l.reasons[0]}</td>
                <td className="mono">{l.hash.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="aud-btns">
        <button className="btn-sm" onClick={() => post("/audit/tamper")}>
          🕵️ Simulate tampering
        </button>
        <button className="btn-sm alt" onClick={() => post("/audit/reset")}>
          Clear log
        </button>
      </div>

      <div className="inter">
        <h3>🧑‍⚖️ Human interventions</h3>
        {inter.length === 0 && <p className="empty">No approvals, rejections or undos yet.</p>}
        {inter.map((x) => (
          <div className="row" key={x.key}>{x.icon} {x.text}</div>
        ))}
      </div>
    </section>
  );
}