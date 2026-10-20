import tools
from datetime import datetime, timezone

pending = []
_next_id = 1


def add(req, verdict):
    global _next_id
    item = {
        "id": _next_id,
        "tool": req.tool,
        "args": req.args,
        "task": req.task,
        "risk": verdict.risk,
        "reasons": verdict.reasons,
        "status": "pending",
        "created": datetime.now(timezone.utc).isoformat(),
    }
    _next_id += 1
    pending.append(item)
    return item


def list_all():
    return pending


def decide(item_id, approve):
    for item in pending:
        if item["id"] == item_id:
            if item["status"] != "pending":
                return {"error": "Already decided"}
            if approve:
                item["status"] = "approved"
                item["outcome"] = tools.run_tool(item["tool"], item["args"])
            else:
                item["status"] = "rejected"
                item["outcome"] = "Rejected by human: tool never ran"
            return item
    return None