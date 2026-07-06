# Email Scam Analyzer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Ollama](https://img.shields.io/badge/AI-Ollama-black?logo=ollama)

A privacy-first email scam detection tool powered by a **locally running AI model**. Paste any email, click **Analyse**, and get an instant scam risk score with detailed reasoning — no cloud API key, no data ever leaves your machine.

---

## Features

- **Scam risk score** — 0–100% likelihood with a visual gauge
- **Detailed signal breakdown** — bullet-point indicators with `low`, `medium`, or `high` severity labels
- **Plain-English summary** — a concise explanation of why the email was flagged
- **Analysis history** — keeps your last 15 analyses in the browser, fully browseable
- **Side-by-side comparison** — compare any two analyses from your history
- **Demo mode** — preview the full UI without Ollama using `npm run dev:demo`
- **Fully local** — all analysis runs on your machine via Ollama; no data sent to external servers
- **Responsive design** — works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | Express 5, TypeScript, tsx |
| AI | [Ollama](https://ollama.com) (local LLM, default: `llama3.2:3b`) |
| Validation | Zod |
| Dev tooling | ESLint, Concurrently |

---

## Prerequisites

- **[Node.js](https://nodejs.org) 18+**
- **[Ollama](https://ollama.com)** installed and running with a model pulled:

  **macOS:**
  ```bash
  brew install ollama
  ```
  Or download the Mac app directly from [ollama.com/download](https://ollama.com/download).

  **Windows/Linux:** Download the installer from [ollama.com/download](https://ollama.com/download).

  Then pull the model and start Ollama:
  ```bash
  ollama pull llama3.2:3b
  ollama serve
  ```

> You can swap `llama3.2:3b` for any Ollama-compatible model by changing `OLLAMA_MODEL` in your `.env`.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/panhadoodleflunky/EmailScamAnalyzer.git
cd EmailScamAnalyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` if you need to change the Ollama URL, model, or port (defaults work for most setups).

### 4. Start the app

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_URL` | `http://localhost:11434` | Base URL of your Ollama instance |
| `OLLAMA_MODEL` | `llama3.2:3b` | Ollama model name to use for analysis |
| `PORT` | `8787` | Port the Express API server listens on |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend (Vite) and backend (Express) together |
| `npm run dev:demo` | Start frontend only with mock data — no Ollama needed |
| `npm run build` | Type-check and build the frontend for production |
| `npm run lint` | Run ESLint across the codebase |
| `npm run preview` | Preview the production frontend build locally |

---

## Architecture

```
EmailScamAnalyzer/
├── server/
│   ├── index.ts              # Express entry point
│   ├── models/analysis.ts    # Zod schemas + system prompt
│   └── services/
│       ├── agentService.ts   # Calls Ollama, parses response
│       └── restService.ts    # POST /api/analyse route
├── src/
│   ├── localization/         # i18n context and English strings
│   ├── models/scam.ts        # Frontend types and helpers
│   ├── services/
│   │   ├── mockService.ts    # Demo mode — no backend needed
│   │   ├── restService.ts    # Calls the Express API
│   │   └── storageService.ts # localStorage history persistence
│   └── ui/
│       ├── components/       # AnalysisForm, Result, History, Comparison
│       └── views/MainView.tsx
└── .env.example
```

**Request flow:**
```
Browser → POST /api/analyse → Express → Ollama (local) → JSON response → UI
```

---

## Contributing

Contributions are welcome! Please open an issue before submitting a pull request so we can discuss the change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a pull request

---

## License

This project is licensed under the [MIT License](LICENSE).
