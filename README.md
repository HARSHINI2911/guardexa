# GuardExa

**Test it. Guard it. Undo it.**

GuardExa is a safety layer for AI agents. It checks every action an agent wants to take (send money, send email, delete records) before it runs, then allows it, asks a human, or blocks it.

PS 2.1: AI Agent Safety and Control.

## Features
- Intent-lock: blocks actions that do not match the user's task
- Untrusted-source check, amount limits and a daily spending cap
- Human approval queue and one-click undo
- Tamper-proof, hash-chained audit log with a viewer
- Kill switch that freezes all agents
- Rules in plain English
- Red-Team Twin: 10 simulated attacks and a Safety Score
- Approval alerts in 7 Indian languages (prototype)

## Tech stack
Python, FastAPI, SQLite, React, Vite

## Run locally

Backend:

    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install fastapi uvicorn
    uvicorn main:app --reload

Frontend:

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

## Limitations
- Risk checks use keyword rules, not an AI judge yet
- The "untrusted" source label is set manually in the demo
- WhatsApp and Telegram delivery is a mock-up
- Plain-English rules support a few sentence patterns
- Demo state is kept in memory and resets on restart