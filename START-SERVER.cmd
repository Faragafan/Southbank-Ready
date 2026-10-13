@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.13 or newer from https://nodejs.org then run this again.
  pause
  exit /b 1
)
echo Open http://127.0.0.1:4173 in your browser after the server starts.
echo Keep this window open. Press Ctrl+C to stop.
node serve.mjs
pause
