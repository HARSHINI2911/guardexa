import { useEffect, useState, useCallback } from "react";
import { LANGS, T, reasonKey } from "./translations";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Alerts() {
  const [lang, setLang] = useState("hi");
  const [items, setItems] = useState([]);
  const [last, setLast] = useState(null);
  const [error, setError] = useState("");
  const t = T[lang];

  const load = useCallback(async () => {
    try {
      const r = await fetch(API + "/pending");
      setItems(await r.json());
      setError("");
    } catch (e) {
      setError("Cannot reach the backend. Is uvicorn running in the first terminal?");
    }
  }, []);

  useEffect(() => {
    load();
    const i = setInterval(load, 2500);
    return () => clearInterval(i);
  }, [load]);

  const item = items.filter((p) => p.status === "pending")[0];

  const decide = async (kind) => {
    await fetch(API + "/" + kind + "/" + item.id, { method: "POST" });
    setLast(kind === "approve" ? "approved" : "rejected");
    load();
  };

  const toolName = item ? t.tools[item.tool] || t.tools.other : "";
  const amount =
    item && item.args && item.args.amount
      ? " · ₹" + Number(item.args.amount).toLocaleString("en-IN")
      : "";

  return (
    <section id="alerts" className="alerts">
      <h2>
        Approvals in <span className="grad">your language</span>
      </h2>
      <p className="sub">
        Pick a language. The alert reaches the owner the way they read it.
      </p>

      <div className="chips">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={"chip " + (lang === l.code ? "on" : "")}
            onClick={() => setLang(l.code)}
          >
            {l.name}
          </button>
        ))}
      </div>

      {error && <div className="err" style={{ margin: "0 auto 20px", maxWidth: 420 }}>{error}</div>}

      <div className="phone">
        <div className="phone-top">
          <span style={{ fontSize: "1rem", fontWeight: 700, opacity: 1 }}>🛡️ GuardExa</span>
          <span>online</span>
        </div>
        <div className="chat">
          {!item && !last && (
            <div className="bubble hint">
              No alert yet. In the Live demo above, click "Data leak email" and the alert will appear here.
            </div>
          )}

          {item && (
            <>
              <div className="bubble">
                <b>⚠️ {t.title}</b>
                <p>{t.wants}</p>
                <p className="act">{toolName}{amount}</p>
                <p>{t.why}</p>
                <ul>
                  {item.reasons.map((r, i) => (
                    <li key={i}>{t.reasons[reasonKey(r)]}</li>
                  ))}
                </ul>
                <p><b>{t.ask}</b></p>
              </div>
              <div className="quick">
                <button className="ok" onClick={() => decide("approve")}>✅ {t.approve}</button>
                <button className="no" onClick={() => decide("reject")}>❌ {t.reject}</button>
              </div>
            </>
          )}

          {!item && last && (
            <div className="bubble out">
              {last === "approved" ? t.approved : t.rejected}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}