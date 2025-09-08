Healthcare Chatbot MVP (Rasa + Twilio + PostgreSQL)

Overview

This MVP delivers:

- Multilingual chatbot (English and Hindi)
- Answers on preventive healthcare, common disease symptoms, vaccination schedules
- Integration point for government health APIs (placeholders included)
- WhatsApp and SMS via Twilio (no app install required)
- Simple admin dashboard for logs and stats
- Real-time outbreak alerts broadcast to subscribers

Architecture

- Rasa (NLU + Dialogue)
- Rasa Action Server (custom actions, DB logging, API integrations)
- PostgreSQL (subscribers + logs + alert tracking)
- Twilio (WhatsApp/SMS)
- FastAPI Dashboard (stats & logs)
- Outbreak Alert Scheduler (polls API and notifies subscribers)

Quick start

1) Copy env and configure

```bash
cp .env.example .env
# Fill in Twilio and database values
```

2) Train the model

```bash
docker compose run --rm rasa train | cat
```

3) Start the stack

```bash
docker compose up -d
# Rasa:       http://localhost:5005
# Actions:    http://localhost:5055
# Dashboard:  http://localhost:8000
```

4) Connect Twilio

- Set the webhook URL for your Twilio number to:
  - `https://YOUR_PUBLIC_DOMAIN/webhooks/twilio/webhook`
- For WhatsApp sandbox, use the same webhook; ensure your `from_number` is the WhatsApp-enabled number (`whatsapp:+123456789`).

5) Try it

- Send “Hi” to your Twilio number on WhatsApp or SMS
- Choose language (English/Hindi) when prompted
- Ask:
  - “What are the symptoms of dengue?”
  - “Malaria prevention?”
  - “Vaccination schedule for infants?”
  - “Subscribe to outbreak alerts”

Environment variables

See `.env.example` for all settings. Key ones:

- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM, TWILIO_WHATSAPP_FROM
- POSTGRES_* for database connection
- OUTBREAK_API_URL for alerts feed (JSON)
- PREFERRED_CHANNEL=sms|whatsapp

Notes

- Government API integration points are stubbed; add your base URL and API keys in actions where marked.
- Tracker store is in-memory for simplicity; logs and subscribers are persisted in Postgres via the action server.
- For production, front with HTTPS (e.g., nginx + certs) and secure env handling.

