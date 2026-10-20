import { useState } from "react";

const API = "http://127.0.0.1:8000";

function getStored() {
  try { return JSON.parse(localStorage.getItem("gx_last")); } catch (e) { return null; }
}
function setStored(v) {
  try { localStorage.setItem("gx_last", JSON.stringify(v)); } catch (e) {}
}

export default function RedTeam() {
  const [data, setData] = useState(null);
  const [before, setBefore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API + "/redteam");
      const d = await res.json();
      setBefore(data ? data.score : getStored());
      setStored(d.score);
      setData(d);
    } catch (e) {
      setError("Cannot reach the backend. Is uvicorn running in the first terminal?");
    }
    setLoading(false);
  };

  const score = data ? data.score : 0;
  const color = score >= 90 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
  const grade = score >= 90 ? "Strong" : score >= 70 ? "Needs work" : "Weak";
  const C = 2 * Math.PI * 54;

  return (
    <section id="redteam" className="rt">
      <h2>
        Red-Team <span className="grad2">Twin</span>
      </h2>
      <p className="sub">
        Attack your own agent before real attackers do. Ten simulated attacks, one Safety Score.
      </p>

      <button className="rt-btn" onClick={run} disabled={loading}>
        {loading ? "Attacking..." : data ? "Run again" : "🧪 Run Red-Team Twin"}
      </button>

      {error && <div className="err" style={{ marginTop: 20 }}>{error}</div>}

      {data && before !== null && before !== score && (
        <div className="ba">
          <div className="ba-box ba-old"><small>Before</small><b>{before}</b></div>
          <div className="ba-arrow">→</div>
          <div className="ba-box ba-new"><small>Now</small><b>{score}</b></div>
        </div>
      )}

      {data && (
        <div className="rt-wrap">
          <div className="rt-score">
            <svg viewBox="0 0 140 140" width="200" height="200">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#f3f4f6" strokeWidth="12" />
              <circle
                cx="70" cy="70" r="54" fill="none" stroke={color} strokeWidth="12"
                strokeLinecap="round" strokeDasharray={C}
                strokeDashoffset={C * (1 - score / 100)}
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              <text x="70" y="72" textAnchor="middle" fontSize="30" fontWeight="800" fill={color}>
                {score}
              </text>
              <text x="70" y="92" textAnchor="middle" fontSize="11" fill="#6B7280">
                out of 100
              </text>
            </svg>
            <h3 style={{ color }}>{grade}</h3>
            <p className="rt-note">
              {data.caught} of {data.total} attacks caught.
              {data.missed > 0 && " " + data.missed + " slipped through."}
            </p>
          </div>

          <div className="rt-list">
            {data.results.map((r) => (
              <div className={"atk " + (r.caught ? "caught" : "missed")} key={r.name}>
                <div className="atk-top">
                  <b>{r.name}</b>
                  <span className="atk-type">{r.type}</span>
                  <span className="atk-badge">
                    {r.caught
                      ? r.decision === "block" ? "⛔ Blocked" : "✋ Held for approval"
                      : "❌ Slipped through"}
                  </span>
                </div>
                <small>{r.desc}</small>
                {!r.caught && r.fix && <div className="fix">💡 Fix: {r.fix}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}