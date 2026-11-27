@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nicht gefunden - bitte installieren: https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installiere Abhaengigkeiten ...
  npm install
)
if not exist .env (
  copy .env.example .env >nul
  echo .env wurde angelegt - bitte MISTRAL_API_KEY eintragen, speichern (Strg+S) und Fenster schliessen.
  notepad .env
)
npm run dev
