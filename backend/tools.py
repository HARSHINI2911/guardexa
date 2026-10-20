from datetime import datetime, timezone

state = {"balance": 1000000, "emails_sent": 0, "records": 4200}
history = []
_next_id = 1


def run_tool(tool, args):
    global _next_id
    if tool == "send_money":
        state["balance"] -= args.get("amount", 0)
        result = f"Sent Rs {args.get('amount', 0)}"
    elif tool == "send_email":
        state["emails_sent"] += 1
        result = "Email sent"
    elif tool == "delete_records":
        state["records"] -= args.get("count", 0)
        result = f"Deleted {args.get('count', 0)} records"
    elif tool == "read_file":
        result = "File read"
    else:
        result = "Unknown tool"

    history.append({
        "id": _next_id,
        "tool": tool,
        "args": args,
        "result": result,
        "status": "done",
        "time": datetime.now(timezone.utc).isoformat(),
    })
    _next_id += 1
    return result


def undo(item_id):
    for h in history:
        if h["id"] == item_id:
            if h["status"] == "undone":
                return {"error": "Already undone"}
            tool, args = h["tool"], h["args"]
            if tool == "send_money":
                state["balance"] += args.get("amount", 0)
                msg = f"Payment of Rs {args.get('amount', 0)} returned"
            elif tool == "send_email":
                state["emails_sent"] -= 1
                msg = "Email recalled"
            elif tool == "delete_records":
                state["records"] += args.get("count", 0)
                msg = f"{args.get('count', 0)} records restored"
            else:
                msg = "Nothing to undo"
            h["status"] = "undone"
            h["undo_result"] = msg
            return h
    return None


def reset_state():
    global _next_id
    state["balance"] = 1000000
    state["emails_sent"] = 0
    state["records"] = 4200
    history.clear()
    _next_id = 1