import os
import time
import json
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from twilio.rest import Client


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


def get_subscribers():
    with db_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT user_id, channel, address, language FROM subscribers")
            return cur.fetchall()


def fetch_outbreaks():
    url = os.getenv("OUTBREAK_API_URL", "")
    if not url:
        return []
    try:
        r = requests.get(url, timeout=10)
        if r.ok:
            data = r.json()
            # Expecting list of alerts: [{"title":..., "region":..., "severity":..., "message":...}]
            return data if isinstance(data, list) else data.get("alerts", [])
    except Exception:
        return []
    return []


def send_alerts(alerts, subscribers):
    if not alerts or not subscribers:
        return
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    sms_from = os.getenv("TWILIO_SMS_FROM", "")
    wa_from = os.getenv("TWILIO_WHATSAPP_FROM", "")
    preferred = (os.getenv("PREFERRED_CHANNEL", "whatsapp") or "whatsapp").lower()
    if not account_sid or not auth_token:
        return
    client = Client(account_sid, auth_token)

    for sub in subscribers:
        to = sub["address"]
        if sub["channel"].startswith("twilio") and to and not to.startswith("whatsapp:") and preferred == "whatsapp" and wa_from:
            # normalize to WhatsApp if desired
            to = f"whatsapp:{to}"
        from_num = wa_from if to.startswith("whatsapp:") else sms_from
        if not from_num:
            continue
        # Build a concise message from the first alert for MVP
        alert = alerts[0]
        title = alert.get("title") or "Outbreak Alert"
        region = alert.get("region") or ""
        message = alert.get("message") or "Stay cautious and follow preventive measures."
        text = f"{title} {('- ' + region) if region else ''}: {message}"
        try:
            client.messages.create(body=text, from_=from_num, to=to)
        except Exception:
            # Skip failures
            pass


def main():
    interval = int(os.getenv("ALERT_POLL_INTERVAL_SECONDS", "900"))
    while True:
        alerts = fetch_outbreaks()
        subs = get_subscribers()
        send_alerts(alerts, subs)
        time.sleep(interval)


if __name__ == "__main__":
    main()

