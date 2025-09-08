## AI-Driven Public Health Chatbot (Frontend)

Multilingual React app for disease awareness, prevention tips, vaccination guidance, and outbreak alerts. Built with Vite + TypeScript. This repo includes the UI only; replace the placeholder logic with your backend APIs for accuracy and real-time data.

### Features
- Multilingual i18n (English, Hindi, Spanish)
- Chatbot UI with quick tips and basic rule-based responses
- Outbreak alert banner (stubbed fetch)
- Pages and routing: Home, Learn, Chatbot

### Prerequisites
- Node.js 18+ and npm
- VS Code (recommended) with the official ESLint and TypeScript extensions

### Install
```bash
npm install
```

### Run (VS Code)
1. Open the project folder in VS Code: File > Open Folder… and select `health-chatbot`.
2. Open an integrated terminal: View > Terminal.
3. Start the dev server:
```bash
npm run dev
```
4. Click the printed local URL (usually `http://localhost:5173`).

### Build
```bash
npm run build
npm run preview
```

### Project Structure
- `src/i18n.ts`: Translations and i18n init
- `src/components/`: `Header`, `AlertBanner`, `Chatbot`
- `src/pages/`: `Home`, `Learn`, `Chat`
- `src/App.tsx`: Routes and layout

### Backend Integration (placeholders to replace)
- Replace rule-based responses in `src/components/Chatbot.tsx` with your API call.
- Replace simulated alerts in `src/components/AlertBanner.tsx` with government health database endpoint.

### Notes
- This app is for education. It does not diagnose or replace professional medical advice.
