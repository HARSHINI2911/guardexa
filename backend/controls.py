import re
import sqlite3
from fastapi import APIRouter
from pydantic import BaseModel
import engine
from audit import DB, verify_chain

router = APIRouter()


class PolicyText(BaseModel):
    text: str


UNITS = {"lakh": 100000, "lakhs": 100000, "lac": 100000,
         "crore": 10000000, "thousand": 1000, "k": 1000}

NUM = r"(?:rs\.?|inr|₹)?\s*([\d,]*\.?\d+)\s*(lakhs?|lac|crore|thousand|k)?\b"


def to_number(num, unit):
    n = float(num.replace(",", ""))
    if unit:
        n *= UNITS.get(unit.lower(), 1)
    return int(n)


def apply_rule(sentence):
    s = sentence.strip().lower().rstrip(".")
    if not s:
        return None

    # Daily spending limit
    if re.search(r"\bdaily\b|per day|a day|each day", s):
        m = re.search(NUM, s)
        if m:
            v = to_number(m.group(1), m.group(2))
            engine.config["daily_limit"] = v
            return f"Daily spending limit set to Rs {v:,}"
        return None

    # Words to hold in emails
    if "email" in s or "mail" in s:
        m = re.search(
            r"(?:containing|mentioning|mentions|including|includes|with the word|the word)"
            r"\s+['\"]?([a-z0-9 ]{2,40}?)['\"]?$", s)
        if not m:
            m = re.search(r"['\"]([a-z0-9 ]{2,40})['\"]", s)
        if m:
            w = m.group(1).strip()
            if w and w not in engine.config["extra_words"]:
                engine.config["extra_words"].append(w)
            return f'Emails containing "{w}" will be held for approval'
        return None

    # Single payment limit
    if re.search(r"\b(money|pay|payment|payments|transfer|spend|spending)\b", s):
        m = re.search(
            r"(?:above|over|more than|exceed\w*|limit(?:ed)?(?: of| to)?|under|below|up to|max(?:imum)?(?: of)?)\s*"
            + NUM, s)
        if not m:
            m = re.search(NUM, s)
        if m:
            v = to_number(m.group(1), m.group(2))
            engine.config["money_limit"] = v
            return f"Payments above Rs {v:,} will need approval"
    return None


@router.get("/policy")
def get_policy():
    return {
        "money_limit": engine.config["money_limit"],
        "daily_limit": engine.config["daily_limit"],
        "extra_words": engine.config["extra_words"],
    }


@router.post("/policy")
def set_policy(p: PolicyText):
    applied, ignored = [], []
    for line in re.split(r"[\n;]+", p.text):
        if not line.strip():
            continue
        result = apply_rule(line)
        if result:
            applied.append(result)
        else:
            ignored.append(line.strip())
    return {"applied": applied, "ignored": ignored, "policy": get_policy()}


@router.post("/policy/reset")
def reset_policy():
    engine.reset_config()
    return get_policy()


@router.get("/killswitch")
def get_kill():
    return {"active": engine.config["kill_switch"]}


@router.post("/killswitch/{state}")
def set_kill(state: str):
    engine.config["kill_switch"] = (state == "on")
    return {"active": engine.config["kill_switch"]}


@router.post("/audit/tamper")
def tamper():
    with sqlite3.connect(DB) as conn:
        row = conn.execute("SELECT id FROM audit ORDER BY id ASC LIMIT 1").fetchone()
        if not row:
            return {"error": "No entries to tamper with"}
        conn.execute("UPDATE audit SET risk = risk + 1 WHERE id = ?", (row[0],))
    return verify_chain()


@router.post("/audit/reset")
def reset_log():
    with sqlite3.connect(DB) as conn:
        conn.execute("DELETE FROM audit")
    return verify_chain()