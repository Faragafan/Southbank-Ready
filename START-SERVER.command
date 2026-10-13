#!/bin/bash
cd -- "$(dirname -- "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 22.13 or newer from https://nodejs.org and run this again."
  read -r -p "Press Return to close. "
  exit 1
fi
echo "Open http://127.0.0.1:4173 in your browser after the server starts."
echo "Keep this window open. Press Control+C to stop."
node serve.mjs
