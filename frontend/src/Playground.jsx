import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const EXAMPLES = [
  { label: "Normal payment", task: "Pay vendor 2000", tool: "send_money", amount: 2000, count: 10, body: "", source: "user" },
  { label: "Huge payment", task: "Pay vendor 80000", tool: "send_money", amount: 80000, count: 10, body: "", source: "user" },
  { label: "Trick from a PDF", task: "Summarise this invoice", tool: "send_money", amount: 500, count: 10, body: "", source: "untrusted" },
  { label: "Private email", task: "Email the team an update", tool: "send_email", amount: 0, count: 10, body: "Here are the passwords and salary sheet", source: "user" },
  { label: "Delete everything", task: "Clean up old files", tool: "delete_records", amount: 0, count: 4000, body: "", source: "user" },
];

export default function Playground() {
  const [form, setForm] = useState(EXAMPLES[0]);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm({ ...form, [k]: v });

  const test = async () => {
    setLoading(true);
    setError("");
    let args = {};
    if (form.tool === "send_money" || form.tool === "transfer_crypto") {
      args = { amount: Number(form.amount) || 0 };
    } else if (form.tool === "delete_records") {
      args = { count: Number(form.count) || 0 };
    } else if (form.tool === "send_email") {
      args = { body: form.body };
    }
    try {
      const r = await fetch(API + "/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: "playground",
          task: form.task,
          tool: form.tool,
          args: args,
          source: form.source,
        }),
      });
      setRes(await r.json());
    } catch (e) {
      setError("Cannot reach the backend. Is uvicorn running in the first terminal?");
    }
    setLoading(false);
  };

  return (
    <section id="try" className="play">
      <h2>
        Try <span className="grad3">your own</span> values
      </h2>
      <p className="sub">Type anything. The guard decides. Nothing real is sent.</p>

      <div className="chips">
        {EXAMPLES.map((e) => (
          <button key={e.label} className="chip" onClick={() => { setForm(e); setRes(null); }}>
            {e.label}
          </button>
        ))}
      </div>

      <div className="play-grid">
        <div className="panel">
          <h3>🧾 The agent wants to act</h3>

          <div className="field">
            <label>What did the user ask the agent to do?</label>
            <input value={form.task} onChange={(e) => set("task", e.target.value)} />
          </div>

          <div className="field">
            <label>Which tool does the agent want to use?</label>
            <select value={form.tool} onChange={(e) => set("tool", e.target.value)}>
              <option value="send_money">send_money</option>
              <option value="send_email">send_email</option>
              <option value="delete_records">delete_records</option>
              <option value="read_file">read_file</option>
              <option value="transfer_crypto">transfer_crypto (unknown tool)</option>
            </select>
          </div>

          {(form.tool === "send_money" || form.tool === "transfer_crypto") && (
            <div className="field">
              <label>Amount (₹)</label>
              <input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
            </div>
          )}
          {form.tool === "delete_records" && (
            <div className="field">
              <label>How many records?</label>
              <input type="number" value={form.count} onChange={(e) => set("count", e.target.value)} />
            </div>
          )}
          {form.tool === "send_email" && (
            <div className="field">
              <label>Email text</label>
              <input value={form.body} onChange={(e) => set("body", e.target.value)} />
            </div>
          )}

          <div className="field">
            <label>Where did this instruction come from?</label>
            <select value={form.source} onChange={(e) => set("source", e.target.value)}>
              <option value="user">The real user (trusted)</option>
              <option value="untrusted">An email, PDF or website (untrusted)</option>
            </select>
          </div>

          <button className="rt-btn" onClick={test} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Checking..." : "🛡️ Ask the guard"}
          </button>
        </div>

        <div className="panel">
          <h3>🛡️ The guard's decision</h3>
          {error && <div className="err">{error}</div>}
          {!res && !error && <p className="empty">Fill the form and click "Ask the guard".</p>}
          {res && (
            <div className={"res v-" + res.decision}>
              <div className="res-top">
                <span className="res-badge">
                  {res.decision === "block" && "⛔ BLOCKED"}
                  {res.decision === "approve" && "✋ NEEDS APPROVAL"}
                  {res.decision === "allow" && "✅ ALLOWED"}
                </span>
              </div>
              <div className="risk-label">
                Risk score <b>{res.risk} / 100</b>
              </div>
              <div className="risk">
                <span style={{ width: res.risk + "%" }} />
              </div>
              <ul>
                {res.reasons.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}