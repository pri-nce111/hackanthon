import os
from typing import List, Dict

import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI
from fastapi.responses import HTMLResponse


app = FastAPI(title="HealthBot Dashboard")


def db_conn():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB", "healthbot"),
        user=os.getenv("POSTGRES_USER", "healthbot"),
        password=os.getenv("POSTGRES_PASSWORD", "healthbot"),
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
    )
    conn.autocommit = True
    return conn


def query(sql: str) -> List[Dict]:
    with db_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql)
            return cur.fetchall()


@app.get("/", response_class=HTMLResponse)
def index():
    interactions = query("SELECT created_at, user_id, intent, message, response FROM interactions ORDER BY created_at DESC LIMIT 50")
    total_users = query("SELECT COUNT(DISTINCT user_id) AS c FROM interactions")[0]["c"] if interactions is not None else 0
    total_interactions = query("SELECT COUNT(*) AS c FROM interactions")[0]["c"] if interactions is not None else 0
    subscribers = query("SELECT COUNT(*) AS c FROM subscribers")[0]["c"]
    rows = "".join(
        f"<tr><td>{i['created_at']}</td><td>{i['user_id']}</td><td>{i['intent']}</td><td>{i['message']}</td><td>{i['response']}</td></tr>"
        for i in interactions
    )
    html = f"""
    <html>
      <head>
        <title>HealthBot Dashboard</title>
        <style>
          body {{ font-family: Arial, sans-serif; margin: 20px; }}
          .cards {{ display: flex; gap: 16px; margin-bottom: 20px; }}
          .card {{ border: 1px solid #ddd; padding: 12px 16px; border-radius: 8px; }}
          table {{ width: 100%; border-collapse: collapse; }}
          th, td {{ border: 1px solid #eee; padding: 8px; font-size: 14px; }}
          th {{ background: #f7f7f7; }}
        </style>
      </head>
      <body>
        <h2>HealthBot Admin</h2>
        <div class="cards">
          <div class="card">Active users: <b>{total_users}</b></div>
          <div class="card">Total interactions: <b>{total_interactions}</b></div>
          <div class="card">Subscribers: <b>{subscribers}</b></div>
        </div>
        <h3>Recent interactions</h3>
        <table>
          <thead>
            <tr><th>Time</th><th>User</th><th>Intent</th><th>Message</th><th>Response</th></tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </body>
    </html>
    """
    return HTMLResponse(html)

