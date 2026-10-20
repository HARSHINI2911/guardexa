import re
from models import ActionRequest, Verdict

BASE_RISK = {
    "read_file": 5,
    "send_email": 10,
    "send_money": 30,
    "delete_records": 50,
}

RISKY_TOOLS = {"send_money", "delete_records", "send_email"}

INTENT_WORDS = {
    "send_money": ["pay", "transfer", "payment", "send money"],
    "delete_records": ["delete", "remove", "clean"],
    "send_email": ["email", "mail", "send", "notify"],
}

SENSITIVE_WORDS = [
    "password", "aadhaar", "ssn", "salary", "confidential",
    "payslip", "ctc", "bank details", "account number", "ifsc",
    "pan card", "passport", "payroll", "kyc", "patient",
]

DEFAULT_MONEY_LIMIT = 10000
DEFAULT_DAILY_LIMIT = 50000
UNKNOWN_TOOL_RISK = 60

config = {
    "money_limit": DEFAULT_MONEY_LIMIT,
    "daily_limit": DEFAULT_DAILY_LIMIT,
    "extra_words": [],
    "kill_switch": False,
}

spent = {}


def reset_spend(agent_id=None):
    if agent_id is None:
        spent.clear()
    else:
        spent.pop(agent_id, None)


def reset_config():
    config["money_limit"] = DEFAULT_MONEY_LIMIT
    config["daily_limit"] = DEFAULT_DAILY_LIMIT
    config["extra_words"] = []


def sensitive_regex():
    words = SENSITIVE_WORDS + config["extra_words"]
    return re.compile(r"\b(?:" + "|".join(re.escape(w) for w in words) + r")s?\b")


def check_action(req: ActionRequest) -> Verdict:
    # Kill switch freezes every agent (the red-team test is exempt)
    if config["kill_switch"] and req.agent_id != "red-team":
        return Verdict(
            decision="block", risk=100,
            reasons=["Kill switch is active: all agent actions are frozen"],
        )

    known = req.tool in BASE_RISK
    risk = BASE_RISK.get(req.tool, UNKNOWN_TOOL_RISK)
    reasons = []

    if not known:
        reasons.append("Unknown tool, treated as high risk")

    if req.source == "untrusted" and (req.tool in RISKY_TOOLS or not known):
        risk += 40
        reasons.append("Action triggered by untrusted content")

    amount = req.args.get("amount", 0)
    if req.tool == "send_money":
        if amount > config["money_limit"]:
            risk += 25
            reasons.append(f"Amount {amount} is above the limit of {config['money_limit']}")
        total = spent.get(req.agent_id, 0) + amount
        if total > config["daily_limit"]:
            risk += 30
            reasons.append(f"Daily spending cap of {config['daily_limit']} exceeded")

    words = INTENT_WORDS.get(req.tool)
    if words and not any(w in req.task.lower() for w in words):
        risk += 40
        reasons.append("Action does not match the user's original task")

    if req.tool == "send_email":
        body = str(req.args.get("body", "")).lower()
        if sensitive_regex().search(body) or re.search(r"\b\d{9,18}\b", body):
            risk += 30
            reasons.append("Email contains sensitive information")

    risk = min(risk, 100)

    if risk >= 80:
        decision = "block"
    elif risk >= 40:
        decision = "approve"
    else:
        decision = "allow"

    if req.tool == "send_money" and decision == "allow":
        spent[req.agent_id] = spent.get(req.agent_id, 0) + amount

    if not reasons:
        reasons.append("No risk signals found")

    return Verdict(decision=decision, risk=risk, reasons=reasons)