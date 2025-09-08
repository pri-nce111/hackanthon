# Health Education Chatbot (MVP)

Multilingual (English/Hindi) Rasa-based chatbot for preventive healthcare, symptoms guidance, and vaccination schedules. Includes WhatsApp/SMS channel placeholders and fallback policies.

## Quickstart

Prerequisites: Python 3.10/3.11, pip, virtualenv (recommended).

```bash
cd /workspace/health-bot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Train
rasa train

# Run the bot (REST/twilio credentials configured separately)
rasa run --enable-api --cors "*" --debug

# In another terminal, run action server (for API integrations)
rasa run actions --debug

# Test via Rasa shell (for quick dev)
rasa shell
```

## Files
- `config.yml`: NLU pipeline and policies (fallback enabled)
- `domain.yml`: Intents, entities, slots, responses
- `data/nlu.yml`: Training data (English/Hindi)
- `data/stories.yml`: Sample stories
- `data/rules.yml`: Fallback and simple rules
- `credentials.yml`: Channel config (REST, Twilio/WhatsApp placeholders)
- `endpoints.yml`: Action server config
- `actions/`: Custom actions (API calls)

## Environment
Copy `.env.example` to `.env` and fill secrets if using Twilio or APIs.

## Next Steps
- Implement vaccination schedule and outbreak APIs in `actions/actions.py`
- Connect WhatsApp/SMS via Twilio by filling `credentials.yml`
