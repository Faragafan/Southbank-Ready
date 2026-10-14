# Quiz results and the organiser dashboard

## Run with a database

Install Node.js 22.13 or newer from https://nodejs.org. No npm packages or database installation are required. Node 22 may print an experimental SQLite warning; the tested version is 22.14.

**Mac:** unzip the download. Open Terminal, type `cd ` (with a space), drag the extracted folder into Terminal, then press Return. Run:

```sh
node serve.mjs
```

Alternatively, double-click `START-SERVER.command`. If macOS does not allow the script to open, use the Terminal commands above.

**Windows:** double-click `START-SERVER.cmd`, or run `node serve.mjs` in the extracted folder.

Open **http://127.0.0.1:4173** in Safari, Chrome, Edge or Firefox. Keep Terminal open while using the site. Press Control+C to stop the server.

Opening `dist/index.html` still works offline, including learning, retests and the printable poster. It does **not** upload results or run an organiser database. `START.cmd` opens this offline mode.

## Collect answers

On the path-selection page, learners can tick **Share my anonymous quiz results with the organiser**. Sharing is off initially. The module records future submissions only, including:

- A random browser learner ID and a new run ID for each path restart.
- Learning path and curriculum version.
- Question ID, selected answer IDs, server-checked correctness and attempt number.
- Practice versus final-check stage, final round, sequence and submission/receipt times.

The server does not store names, emails, IP addresses, personal plan text, support-topic selections or booking details. Choosing the supported learning path is recorded as the path; it does not establish whether someone has a disability or is a carer. External hosting services may have their own access logs.

Failed uploads remain queued locally while sharing is enabled. Use **Your data → Retry upload** after reconnecting. Duplicate uploads do not duplicate records. Switching sharing off clears unsent uploads. Learners can delete their shared results using **Your data** while connected to the same server.

## Open your results

**On Render:** open your web service's **Environment** settings and copy `SOUTHBANK_ADMIN_KEY`. Visit your live website and click **Organiser results**. Follow [RENDER-DEPLOY.md](RENDER-DEPLOY.md) for the full hosting setup. The local key below is for the server on your computer.

1. Click **Organiser results** in the footer, or open **http://127.0.0.1:4173/#organiser**.
2. Open `.data/admin-key.txt` in the extracted project folder. On a Mac, press Command+Shift+. in Finder to show the hidden `.data` folder.
3. Copy the key into the dashboard. Do not share it with learners.
4. Expand a learning run to see every submitted answer in order. Use **Export answer history (CSV)** for analysis in Excel or another tool.

The dashboard key stays in page memory only. Use **Lock results**, or close/reload the page, to lock the dashboard. Dashboard summaries exclude runs without a complete first-attempt baseline or a first final check. The average is calculated per run; it does not combine all questions into one weighted score.

CSV exports contain canonical English question/answer text, stable IDs and each event. This keeps analysis consistent across learning languages. The learning experience and dashboard labels support all six languages.

## How the comparison works

The resident path has **4 questions**, including the emergency kit. The supported path has **5**. Clicking a scenario answer is an attempt. Pressing **Check my bag** submits the entire kit selection as one attempt. Selecting kit items alone does not submit them.

The baseline uses **attempt 1**, including a wrong answer. Practice retries never replace it. At the end, learners answer every question again without immediate correctness hints, then submit the whole final check. A final score does not need to be perfect to reach the building-walk booking; the summary explains safer choices. Later final checks are separate rounds. The organiser’s main comparison uses the **first final check** to avoid inflating it with repeated retakes.

Old progress from an earlier site version has no first-attempt history. It is labelled incomplete, never reconstructed from a saved correct answer. Answers submitted before sharing was enabled are not uploaded retrospectively. The server does not treat a later practice attempt as an original first answer. The learner may therefore see more local history than the organiser receives.

**Start again** creates a new run and clears that path’s current activities. Earlier shared runs remain in the database. The learner ID represents one browser profile, not a verified person. Use separate browser profiles for separate participants, or clear local learning data between participants. Clearing local data creates a new learner ID and removes the ability to delete the old shared results from that browser; delete shared records first when needed.

## Data location and backup

Locally, the database is `.data/results.sqlite`; the organiser key is `.data/admin-key.txt`. These are outside the served `dist` folder. They are excluded from the release ZIP. Stop the local server before backing up the entire `.data` folder. Keep the backup private. SQLite data remains after restarting the computer or server. With the supplied Render configuration, the database is `/var/data/results.sqlite` on the persistent disk and the key is `SOUTHBANK_ADMIN_KEY` in Render's Environment settings.

All results APIs require same-origin browser requests; reading results requires the organiser key. The server validates question and answer IDs and calculates correctness itself. The module is an educational tool, not a secure examination or proof of an individual’s identity.

## Use with a group

The default server binds only to **this computer**. A different laptop using its own copy has a separate database. To collect responses from residents on their phones, host this Node application on one shared HTTPS address with persistent private storage, then send everyone that address. Serving only `dist` on a static host cannot collect results.

For a hosting provider, configure `SOUTHBANK_HOST=0.0.0.0`, `SOUTHBANK_DATA_DIR` for a private persistent directory, and `SOUTHBANK_ADMIN_KEY` with a random secret of at least 32 characters. The server reads `SOUTHBANK_PORT`, then the provider's `PORT`, then defaults to `4173`. Put HTTPS in front of the application. The supplied [Render setup](RENDER-DEPLOY.md) handles these settings and persistent storage. No site has been deployed as part of this update.

Building and live booking links are still configured through **Facilitator setup**. The quiz database is separate from session booking; the included booking flow remains clearly labelled practice until you supply a real booking link.
