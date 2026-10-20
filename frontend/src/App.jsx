import { useEffect, useRef } from "react";
import Dashboard from "./Dashboard";
import RedTeam from "./RedTeam";
import Playground from "./Playground";
import Alerts from "./Alerts";
import ControlRoom from "./ControlRoom";
import AuditLog from "./AuditLog";

function useCursor() {
  useEffect(() => {
    const root = document.documentElement;
    const move = (e) => {
      root.style.setProperty("--cx", e.clientX + "px");
      root.style.setProperty("--cy", e.clientY + "px");
      root.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
      root.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function TiltCard({ color, icon, title, text }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform =
      "perspective(700px) rotateX(" + (-y * 10).toFixed(2) +
      "deg) rotateY(" + (x * 10).toFixed(2) + "deg) translateY(-6px)";
    ref.current.style.setProperty("--sx", (x + 0.5) * 100 + "%");
    ref.current.style.setProperty("--sy", (y + 0.5) * 100 + "%");
  };
  const onLeave = () => {
    ref.current.style.transform = "";
  };
  return (
    <div
      className="card"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ "--c": color }}
    >
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

const FEATURES = [
  { icon: "🧪", color: "#EC4899", title: "Red-Team Twin",
    text: "Attacks your agent before launch with poisoned files and gives a Safety Score." },
  { icon: "🎯", color: "#7C3AED", title: "Intent-Lock",
    text: "Blocks any action that does not match what the user actually asked for." },
  { icon: "🧬", color: "#F59E0B", title: "Taint Tracking",
    text: "Content from untrusted emails and PDFs can never trigger risky actions." },
  { icon: "↩️", color: "#10B981", title: "One-Click Undo",
    text: "Reverse payments, deletions and emails with a single tap." },
  { icon: "💬", color: "#06B6D4", title: "Approvals in Your Language",
    text: "WhatsApp and Telegram alerts in English, Hindi and Kannada." },
  { icon: "🔗", color: "#3B82F6", title: "Tamper-Proof Audit Log",
    text: "A hash-chained history that exposes any edited record instantly." },
];

const STEPS = [
  { n: "1", title: "Agent asks", text: "An AI agent wants to use a tool like email, bank or database." },
  { n: "2", title: "GuardExa checks", text: "Intent, source, amount and policies are scored for risk." },
  { n: "3", title: "Verdict", text: "Allow it, ask a human, or block it before anything runs." },
  { n: "4", title: "Log and undo", text: "Everything is recorded, and risky actions can be reversed." },
];

export default function App() {
  useCursor();
  useReveal();

  return (
    <>
      <div className="glow" />
      <div className="blob b1" style={{ "--k": 30 }} />
      <div className="blob b2" style={{ "--k": -40 }} />
      <div className="blob b3" style={{ "--k": 50 }} />
      <div className="blob b4" style={{ "--k": -25 }} />

      <header className="nav">
        <div className="logo">🛡️ <span className="grad">GuardExa</span></div>
        <nav>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#demo" className="nav-btn">Live demo</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <span className="badge">AI Agent Safety and Control</span>
            <h1>
              <span className="grad">Test it.</span> <span className="grad2">Guard it.</span>{" "}
              <span className="grad3">Undo it.</span>
            </h1>
            <p>
              GuardExa is the safety net for AI agents. It checks every action before
              it runs, asks a human when unsure, and lets you undo mistakes.
            </p>
            <div className="btns">
              <a href="#demo" className="btn-primary">See it block an attack</a>
              <a href="#how" className="btn-ghost">How it works</a>
            </div>
          </div>

          <div className="verdict">
            <div className="v-head">
              <span className="dot" /> Agent action intercepted
            </div>
            <div className="v-row"><b>Tool</b><span>send_money</span></div>
            <div className="v-row"><b>Amount</b><span>₹5,00,000</span></div>
            <div className="v-row"><b>Task given</b><span>Summarise this invoice</span></div>
            <div className="v-row"><b>Source</b><span className="tag">untrusted PDF</span></div>
            <div className="risk-label">Risk score <b>100 / 100</b></div>
            <div className="risk"><span /></div>
            <ul>
              <li>Triggered by untrusted content</li>
              <li>Amount above the limit</li>
              <li>Does not match the user's task</li>
            </ul>
            <div className="v-badge">⛔ BLOCKED — tool never ran</div>
          </div>
        </section>

        <section className="stats reveal">
          <div><b>3</b><span>verdicts: allow, approve, block</span></div>
          <div><b>1 click</b><span>to undo an action</span></div>
          <div><b>3</b><span>languages for approvals</span></div>
          <div><b>0</b><span>unchecked actions</span></div>
        </section>

        <section id="features" className="section">
          <h2 className="reveal">Everything an agent needs <span className="grad">before it acts</span></h2>
          <p className="sub reveal">One safety net for before, during and after.</p>
          <div className="grid">
            {FEATURES.map((f) => (
              <TiltCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        <section id="how" className="section">
          <h2 className="reveal">How <span className="grad2">GuardExa</span> works</h2>
          <div className="steps reveal">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Dashboard />
        <RedTeam />
        <Playground/>
        <Alerts/>
        <ControlRoom/>
        <AuditLog/>

        <section className="cta reveal">
          <h2>Ready to watch an attack get blocked?</h2>
          <p>The live dashboard is coming in the next step.</p>
          <a href="#demo" className="btn-white">Open live demo</a>
        </section>
      </main>

      <footer>
        <span>🛡️ GuardExa · Test it. Guard it. Undo it.</span>
      </footer>
    </>
  );
}