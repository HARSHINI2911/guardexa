import sqlite3
import json
import hashlib
from datetime import datetime, timezone

DB = "guardexa.db"


def init_db():
    with sqlite3.connect(DB) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS audit (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ts TEXT, agent_id TEXT, task TEXT, tool TEXT,
                args TEXT, source TEXT, decision TEXT, risk INTEGER,
                reasons TEXT, prev_hash TEXT, hash TEXT
            )
        """)


def _compute_hash(prev_hash, record):
    data = prev_hash + json.dumps(record, sort_keys=True)
    return hashlib.sha256(data.encode()).hexdigest()


def log_action(req, verdict):
    record = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "agent_id": req.agent_id,
        "task": req.task,
        "tool": req.tool,
        "args": json.dumps(req.args, sort_keys=True),
        "source": req.source,
        "decision": verdict.decision,
        "risk": verdict.risk,
        "reasons": json.dumps(verdict.reasons),
    }
    with sqlite3.connect(DB) as conn:
        row = conn.execute(
            "SELECT hash FROM audit ORDER BY id DESC LIMIT 1"
        ).fetchone()
        prev = row[0] if row else "GENESIS"
        h = _compute_hash(prev, record)
        conn.execute(
            """INSERT INTO audit (ts, agent_id, task, tool, args, source,
               decision, risk, reasons, prev_hash, hash)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
            (record["ts"], record["agent_id"], record["task"], record["tool"],
             record["args"], record["source"], record["decision"],
             record["risk"], record["reasons"], prev, h),
        )


def get_logs(limit=50):
    with sqlite3.connect(DB) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            "SELECT * FROM audit ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    logs = []
    for r in rows:
        d = dict(r)
        d["args"] = json.loads(d["args"])
        d["reasons"] = json.loads(d["reasons"])
        logs.append(d)
    return logs


def verify_chain():
    with sqlite3.connect(DB) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM audit ORDER BY id ASC").fetchall()
    expected_prev = "GENESIS"
    for r in rows:
        record = {
            "ts": r["ts"], "agent_id": r["agent_id"], "task": r["task"],
            "tool": r["tool"], "args": r["args"], "source": r["source"],
            "decision": r["decision"], "risk": r["risk"],
            "reasons": r["reasons"],
        }
        if r["prev_hash"] != expected_prev or \
           r["hash"] != _compute_hash(expected_prev, record):
            return {"valid": False, "entries": len(rows), "broken_at": r["id"]}
        expected_prev = r["hash"]
    return {"valid": True, "entries": len(rows), "broken_at": None}