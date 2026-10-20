import { useEffect, useState, useCallback } from "react";

const API = "http://127.0.0.1:8000";

const EXAMPLES = [
  "Never send money above 20000",
  "Daily limit 80000",
  "Block emails containing invoice",
];

export default function ControlRoom() {
  const [kill, setKill] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const k = await fetch(API + "/killswitch").then((r) => r.json());
      const p = await fetch(API + "/policy").then((r) => r.json());
      setKill(k.active);
      setPolicy(p);
      setError("");
    } catch (e) {
      setError("Cannot reach the backend. Is uvicorn running in the first terminal?");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async () => {
    const r = await fetch(API + "/killswitch/" + (kill ? "off" : "on"), { method: "POST" });
    const d = await r.json();
    setKill(d.active);
  };

  const apply = async () => {
    const r = await fetch(API + "/policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    });
    const d = await r.json();
    setResult(d);
    setPolicy(d.policy);
  };

  const reset = async () => {
    const r = await fetch(API + "/policy/reset", { method: "POST" });
    setPolicy(await r.json());
    setResult(null);
  };

  const addExample = (ex) => setText((t) => (t ? t + "\n" + ex : ex));

  return (
    <section id="controls" className="ctrl">
      <h2>
        Control <span className="grad2">room</span>
      </h2>
      <p className="sub">Freeze every agent in one click. Change the rules in plain English.</p>

      {error && <div className="err" style={{ margin: "0 auto 20px", maxWidth: 520 }}>{error}</div>}

      <div className="ctrl-grid">
        <div className={"kill " + (kill ? "on" : "")}>
          <div style={{ fontSize: "2.4rem" }}>{kill ? "🛑" : "🟢"}</div>
          <h3>{kill ? "KILL SWITCH ACTIVE" : "Agents are running"}</h3>
          <p>
            {kill
              ? "Every new agent action is blocked until you turn this off."
              : "If an agent goes rogue, one click freezes all of them instantly."}
          </p>
          <button onClick={toggle}>{kill ? "Turn off, resume agents" : "Freeze all agents"}</button>
        </div>

        <div className="panel pol">
          <h3>📝 Rules in plain English</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"One rule per line, for example:\nNever send money above 20000"}
          />
          <div className="chips">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="chip" onClick={() => addExample(ex)}>
                {ex}
              </button>
            ))}
          </div>
          <div className="pol-actions">
            <button className="btn-sm" onClick={apply}>Apply rules</button>
            <button className="btn-sm alt" onClick={reset}>Back to defaults</button>
          </div>

          {result && (
            <div className="pol-res">
              {result.applied.map((a, i) => (
                <div key={i} className="okl">✅ {a}</div>
              ))}
              {result.ignored.map((a, i) => (
                <div key={i} className="badl">⚠️ Not understood: "{a}"</div>
              ))}
            </div>
          )}

          {policy && (
            <div className="pol-now">
              <div><small>Payment limit</small><b>₹{policy.money_limit.toLocaleString("en-IN")}</b></div>
              <div><small>Daily limit</small><b>₹{policy.daily_limit.toLocaleString("en-IN")}</b></div>
              <div>
                <small>Extra email words</small>
                <b>{policy.extra_words.length ? policy.extra_words.join(", ") : "none"}</b>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}