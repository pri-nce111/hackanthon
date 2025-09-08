# Public Health Chatbot (Frontend)

Multilingual React (Vite) frontend for an AI-driven public health chatbot that educates rural/semi-urban populations about preventive healthcare, disease symptoms, and vaccination schedules. Includes simple knowledge-base matching, outbreak alerts (stub/API), and a vaccination schedule.

## Features
- Multilingual: English, Hindi, Bengali
- Chat UI with simple knowledge-base matcher (no backend required)
- Outbreak alerts polling from `VITE_ALERTS_URL` or local stub
- Vaccination schedule component (India UIP milestones)
- Mobile-friendly and accessible controls

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Then open the printed local URL in your browser.

### Build
```bash
npm run build
npm run preview
```

### Configure Alerts API (optional)
Create `.env` in project root:
```bash
cp .env.example .env
# edit .env and set VITE_ALERTS_URL to your government health alerts endpoint
```

### Project Structure
```
src/
  i18n.js                    # i18next setup and translations
  components/
    LanguageSwitcher.jsx
    Chat.jsx                 # chat UI with knowledge-base matching
    Alerts.jsx               # outbreak alerts widget (uses SWR)
    Vaccination.jsx          # basic UIP schedule table
  data/
    knowledgeBase.js         # patterns mapping to answers
  utils/
    textMatch.js             # simple text similarity utility
public/
  api/alerts.json           # local stub data for alerts
```

## Notes
- This frontend is educational and not a medical device. For emergencies, follow local guidance.
- To integrate real-time government databases, set `VITE_ALERTS_URL` to a valid endpoint that returns JSON like `public/api/alerts.json`.
