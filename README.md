# Southbank Ready

A friendly, interactive flood-awareness module for new residents and renters in Southbank, Melbourne, with a separate path for people with disability and their carers.

## Run it on your computer

**Windows:** double-click `START.cmd`.

**Mac:** double-click the ZIP to extract it, open the extracted folder, then open `dist/index.html` in Safari or Chrome. Keep `dist` and everything inside it together; `START.cmd` is only for Windows.

**Any computer:** open `dist/index.html` in a current browser, such as Edge, Chrome, Firefox or Safari. No install, account, Node.js or internet connection is needed for the learning activities. Keep the whole folder together.

If you received a ZIP, extract it first. Then open `START.cmd` or `dist/index.html` from the extracted folder.

The street map, current official guidance and real booking links require internet. The supplied Southbank flood guide, its map, all photographs and illustrations work offline.

## Save anonymous quiz results (Mac and Windows)

Use the included **Node.js server** when you want the organiser database. Install Node.js 22.13 or newer from https://nodejs.org, open Terminal in the extracted folder, and run:

```sh
node serve.mjs
```

Then visit **http://127.0.0.1:4173**. Keep Terminal open. Windows users can double-click **START-SERVER.cmd**; Mac users can use **START-SERVER.command** or the Terminal command above.

Learners can opt into anonymous sharing on the path-selection page. The **Organiser results** footer link opens a protected dashboard. Your private key is in `.data/admin-key.txt`. See **RESULTS-GUIDE.md** for Mac steps, viewing/exporting responses, backups, privacy and shared hosting.

## What is included

- A simple introduction with a historical flood photograph and one **Get started** button. Path selection is on the following page.
- Resident/renter path: local flood risk, maps, kit activity, apartment/basement preparation, warning scenarios and a personal plan.
- Supported path: local risk, personal support needs, power outages, adapted kit, accessible exits and help, plus a personal plan.
- A building-walk flow after learning completion, with a practice booking, an explicitly labelled practice calendar file, and live booking-link integration.
- Larger text, higher contrast, visible keyboard focus, screen-reader labels, reduced-motion support and no timed activities.
- Optional private plan notes and a designed A4 wall poster. Preview it, print it or save it as PDF; long notes continue on additional pages. The TXT download has been removed.
- Recorded first quiz attempts and retries, a final check repeating every scenario and the kit, and a before/after comparison.
- An optional SQLite backend with anonymous sharing, a protected organiser dashboard and CSV answer-history export.
- An included official 2021 Southbank flood guide/map, clear map limitations, and links to current official guidance.
- English, Bahasa Indonesia, Arabic, Simplified Chinese, Traditional Chinese and Italian, including both learning paths, activities, help, booking and plan/calendar exports.
- Two keyboard-accessible flood-photo activities with revealable explanations, illustrated emergency-kit items, an apartment cutaway linked to floor selection, and illustrations for power-cut planning.

## Photographs and visual learning

The home page shows a historical river flood in Werribee, with its actual location and date. The first chapter of both paths includes historical Melbourne CBD and Werribee flood photos. They are not current conditions or photographs of flooding in Southbank. The Southbank neighbourhood photo appears in the image credits.

All images are bundled locally. Captions, alternative text and activity explanations are available in all six languages. Source and Creative Commons licence links appear with each photograph and under **Sources & guidance → Photo credits**. See `PHOTO-CREDITS.md` and `dist/assets/photos/attribution.json` for provenance and redistribution details. Preserve the credits when sharing this folder.

The apartment cutaway is a learning illustration, not a map of a real building. The accompanying text remains available without relying on the pictures or colour. The supported path includes illustrated reminders for lifts, equipment, communication and daily needs during a power cut.

## Choose a language

Use the **Language** menu near the top of every page. The language names are shown in their own scripts. Arabic uses a right-to-left layout; the document language and accessible labels update for screen readers. Your choice is remembered in this browser.

Switching languages keeps your current page, quiz answers, packed items, personal notes and booking-form choices. It does not restart the module. Use **Start again** when you want a fresh attempt.

All translations are bundled and work offline. Personal notes and organiser-supplied building details stay exactly as entered; no data is sent to a translation service. The original official map and PDF remain in English, with translated text explanations. External services have their own language settings.

The poster preview, print/PDF content, final check, result summaries and practice calendar descriptions use the selected language. Calendar times remain Melbourne time, correctly accounting for daylight saving.

## Connect real building sessions

No building, real session availability or booking service was supplied, so the default is **practice mode**. The sample slots make no real reservation and do not contact an organiser.

1. Open **Facilitator setup** in the footer.
2. Add building details verified by your building manager, including after-hours contacts, accessible routes, assistance arrangements and backup-power coverage.
3. Add your HTTPS booking link. An optional separate link can serve the supported orientation.
4. Save to preview the settings in this browser. The live link replaces the practice form.
5. To distribute those settings, use **Download config.js**, replace `dist/config.js` with the downloaded file, then share the whole folder or host the contents of `dist` using an HTTPS static host.

For a real public rollout, connect a booking system that manages session availability, access requests, privacy, confirmation and cancellations. This static module does not itself run a shared booking database or verify completion on the external booking site. Do not place API keys or private records in config.js.

The module runs locally by default. It has not been published to the internet.

## Print the plan

Open **My plan → Preview my PDF plan**. Include your notes or untick the option for a blank worksheet. The poster uses A4 portrait with large emergency contacts, writing spaces, illustrated kit items and key reminders. Long or multiline notes continue on extra pages with the complete original text. Building information appears on extra pages when configured.

Choose **Print / save as PDF** and select your browser’s **Save as PDF** destination (on Mac, the PDF menu in the print window). Use A4, 100% scale and no browser headers/footers. Print only personal details you are comfortable displaying. Text stays selectable and uses your chosen language, including Arabic and Chinese.

## Take a path again

Choose **Get started** on the home page, then **Start again** under the relevant path, or **Do this path again** on its completion screen. That clears the selected path's quiz answers, kit choices, reminders, progress and practice booking, and opens chapter one. The supported path also clears its selected support topics. Your personal plan notes, display settings, building details and progress in the other path are kept.

You can still choose the main path card to resume or view its learning summary. The final check is required before the booking page; it has no pass threshold. Use **Try the final check again** for another round without changing original first-attempt results. Starting the whole path again creates a new learning run; earlier shared records remain available to the organiser.

## Privacy

Progress, personal notes, support-topic selections, display preferences and practice bookings stay in the browser. Personal notes are retained after closing only if the learner chooses to remember them. With explicit opt-in, the server receives learning-path and quiz-answer events under a random browser learner ID: selections, attempt numbers, scores and timestamps. It never receives plan text or booking details. Sharing is off by default; offline mode sends no results. Downloads remain on the user's computer.

Use **Your data** to change sharing, retry uploads or delete shared results. Clearing local learning data does not remove server records; delete shared results first if needed. Use **Your data** to clear learning data. Building configuration is stored separately. A shared browser profile can expose local notes to another user; use personal devices for personal notes. Storage availability for file URLs varies by browser. If the browser blocks storage, the module still works for the current page session and offers plan downloads.

## Guidance and limits

Content checked: 15 September 2026. The supplied local flood map was reviewed on 1 July 2021; it is a planning reference, not live risk information. The newer 2026 Melbourne Water planning resource is linked. Do not infer a safe refuge, open road or evacuation route from either planning map.

The module is an independent educational resource, not an official VICSES product or evacuation certification. Live official warnings and the verified building emergency plan take precedence. Before community use, have the building team review the content and co-review the supported path with people with disability and carers. See `FACILITATOR-GUIDE.md` for the proposed in-person sessions and review checklist.

## Local server and development

Run `node serve.mjs` using Node.js 22.13+ and visit `http://127.0.0.1:4173`. The server binds to this computer only and saves records in `.data/results.sqlite`. No package installation or build step is required. A public/group rollout needs one shared HTTPS backend with private persistent storage; sending everyone a separate ZIP does not collect their data centrally. See RESULTS-GUIDE.md.

### Files

- `dist/index.html` — page shell and metadata
- `dist/styles.css` — layout, responsive styles and print styles
- `dist/content.js` — chapter content, activity data, source links
- `dist/app.js` — navigation, activities, plans, booking and settings
- `dist/visuals.js` — historical photo activities, photo credits and SVG learning illustrations
- `dist/config.js` — building configuration, safe to edit
- `dist/i18n.js` — language choice, text localisation, dates and document direction
- `dist/i18n-data.js` — bundled translations; works when opened directly from disk
- `translations/` — editable translation sources and optional builder (`node translations/build.mjs`)
- `dist/assets/` — supplied official flood guide, rendered map page and licensed photographs
- `PHOTO-CREDITS.md` — photograph provenance and licences
- `serve.mjs` — static website server, validated quiz APIs, protected results and SQLite persistence
- `dist/curriculum.js` — shared question IDs and scoring rules
- `dist/learning.js` — local attempts, anonymous identity, sharing queue and final checks
- `dist/learning-ui.js` — retest, comparison and organiser dashboard
- `dist/poster.js`, `dist/learning.css` — A4 poster and new layouts
- `RESULTS-GUIDE.md` — start, collect, inspect and back up quiz results

If the browser supports WebMCP, the page exposes read-progress and start-path tools. They use the same state as the visible UI and do not disclose plan notes.

Translation source IDs refer to `translations/en.json`. Each numbered text file has one message per line, with Indonesian, Arabic, Simplified Chinese, Traditional Chinese and Italian separated by `|`. The optional builder validates completeness and placeholders and regenerates the bundled file. Learners do not need to run it.
