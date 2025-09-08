#!/usr/bin/env bash
set -euo pipefail

cd /app

cat > /app/credentials.yml <<YAML
rest:

twilio:
  account_sid: "${TWILIO_ACCOUNT_SID:-}"
  auth_token: "${TWILIO_AUTH_TOKEN:-}"
  twilio_number: "${TWILIO_WHATSAPP_FROM:-${TWILIO_SMS_FROM:-}}"
  webhook_url: "http://localhost:5005/webhooks/twilio/webhook"
YAML

echo "Generated credentials.yml with Twilio settings."

rasa telemetry disable || true
rasa run --enable-api --cors '*' --debug --endpoints endpoints.yml --credentials credentials.yml

