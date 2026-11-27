# Mistral Chat App

Minimale Web-App: TypeScript-Server (Express) ruft die Mistral-API ueber das offizielle SDK [`@mistralai/mistralai`](https://www.npmjs.com/package/@mistralai/mistralai) auf, die Chat-Oberflaeche ist eine statische HTML-Seite. Das Modell ist `mistral-small-latest`. Der API-Key (`MISTRAL_API_KEY`) liegt ausschliesslich auf dem Server und wird nie an den Browser ausgeliefert.

## Voraussetzungen

- Node.js >= 20
- Ein Mistral API-Key (https://console.mistral.ai)

## Installation

```bash
npm install
cp .env.example .env
```

Danach in `.env` den eigenen Key eintragen:

```
MISTRAL_API_KEY=dein-api-key-hier
```

## Lokal ausfuehren

```bash
npm run dev
```

(Alternativ ohne Auto-Reload: `npm start`)

Windows ohne Terminal: `start.bat` im Ordner `chat-app` doppelklicken (installiert bei Bedarf die Abhaengigkeiten, legt `.env` an und startet den Server).

Danach im Browser oeffnen: http://localhost:3000

## Struktur

- `server.ts` – Express-Server, `POST /api/chat` (ruft `client.chat.complete` mit `mistral-small-latest` auf), liefert `public/` statisch aus
- `public/index.html` – einfache Chat-Schnittstelle
- `.env` – enthaelt `MISTRAL_API_KEY` (nicht commiten, siehe `.gitignore`)

## API

`POST /api/chat`

```json
{
  "messages": [{ "role": "user", "content": "Hallo!" }]
}
```

Antwort: `{ "reply": "..." }`
