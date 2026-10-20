from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ActionRequest, Verdict
from engine import check_action
from audit import init_db, log_action, get_logs, verify_chain
from demo import router
from redteam import router as redteam_router
from controls import router as controls_router

app = FastAPI(title="GuardExa")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
app.include_router(router)
app.include_router(redteam_router)
app.include_router(controls_router)


@app.get("/")
def home():
    return {"status": "GuardExa is running"}


@app.post("/check", response_model=Verdict)
def check(req: ActionRequest):
    verdict = check_action(req)
    log_action(req, verdict)
    return verdict


@app.get("/logs")
def logs(limit: int = 50):
    return get_logs(limit)


@app.get("/verify")
def verify():
    return verify_chain()