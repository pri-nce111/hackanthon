Deployment Notes

Prerequisites

- Public URL with HTTPS (e.g., Cloud Run, ECS + ALB, App Service)
- Twilio WhatsApp/SMS number with webhook configured
- Docker installed in CI/CD or use Cloud buildpacks

Environment

- Copy `.env.example` to `.env` and fill in values
- For production, set secrets via your platform’s secret manager

Build & Run

```bash
docker compose --env-file .env up -d --build
```

Twilio Webhook

- Set to `https://YOUR_DOMAIN/webhooks/twilio/webhook`
- Verify the number matches `TWILIO_WHATSAPP_FROM` or `TWILIO_SMS_FROM`

Rasa REST Test

```bash
curl -s http://YOUR_DOMAIN/webhooks/rest/webhook \
  -H 'Content-Type: application/json' \
  -d '{"sender":"test-user","message":"hi"}'
```

Scaling

- Rasa and actions can be scaled horizontally; ensure sticky sessions via tracker store if needed
- Use a managed Postgres for reliability

Monitoring

- Collect container logs (Rasa, actions, scheduler, dashboard)
- Track latency and error rates; configure alerting

