from pydantic import BaseModel


class ActionRequest(BaseModel):
    agent_id: str = "agent-1"
    task: str
    tool: str
    args: dict = {}
    source: str = "user"


class Verdict(BaseModel):
    decision: str
    risk: int
    reasons: list[str]