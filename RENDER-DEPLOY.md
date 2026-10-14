# Publish Southbank Ready on Render

This setup publishes the website and quiz database together. Residents use one shared HTTPS link; your computer does not need to stay on. It works the same whether you upload from a Mac or Windows.

## Cost and storage

The included `render.yaml` uses Render's **paid 512 MB web service** plus a **1 GB persistent disk**. At the prices checked on 13 October 2026, the service is $7/month and the disk is $0.25/month: approximately **US$7.25/month** on a Hobby workspace, before tax and additional usage. Review the price Render displays before deploying. [Render pricing](https://render.com/pricing)

The disk keeps quiz responses across restarts and updates. Render's free web service cannot attach a persistent disk, and its normal filesystem is temporary. Use the supplied paid configuration when collecting real responses. [Persistent disk documentation](https://render.com/docs/disks)

## 1. Put the project on GitHub

1. Extract the latest `Southbank-Ready.zip` into a new folder.
2. Sign in to [GitHub](https://github.com) and create a repository named `southbank-ready`. A private repository is fine.
3. Upload the **contents of the extracted folder**, keeping the subfolders together. Do not upload the ZIP itself. Use **Add file → Upload files** (or the upload link in an empty repository), then commit the files. [GitHub's upload instructions](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
4. Check the repository's top level contains:

   ```text
   render.yaml
   package.json
   serve.mjs
   scripts/check-deploy.mjs
   dist/index.html
   dist/...other website files and assets
   translations/...
   ```

   `render.yaml` must be at the top level, not inside an extra `southbank-ready` folder. The guides and launchers can also be included.

Use the clean release ZIP: it excludes local responses and credentials. If uploading from your working folder instead, leave out `.data`, `tmp`, any `.env` files and `admin-key.txt`. Browser uploads do not enforce `.gitignore` for you.

## 2. Create the Render service

1. Sign in to the [Render dashboard](https://dashboard.render.com).
2. Choose **New → Blueprint**.
3. Connect GitHub and select your `southbank-ready` repository. Allow Render access to that repository.
4. Choose your branch, usually `main`, and keep **Blueprint Path** as `render.yaml`.
5. Give the Blueprint a name, such as `Southbank Ready`.
6. Review the web service and 1 GB disk, including the charges, then choose **Deploy Blueprint**.
7. When the web service is live, open the HTTPS address shown by Render. Share that address with learners.

The configuration sets the Node version, startup command, health check, database folder and organiser key automatically. It selects **Singapore** as the hosting region; your database will be hosted there. Change `region` in `render.yaml` before the first deployment if you need another supported region. [Blueprint deployment instructions](https://render.com/docs/infrastructure-as-code)

## 3. Open your organiser results

1. In Render, open the **southbank-ready web service** and its **Environment** settings.
2. Reveal and copy the generated value of **`SOUTHBANK_ADMIN_KEY`**. Treat it as your dashboard password; keep it out of GitHub and messages to learners.
3. On your live website, click **Organiser results** in the footer. Alternatively, add `/#organiser` to the site's address.
4. Paste the key and choose **Open results**.

You can inspect first answers, wrong answers, retries and final checks, and export the answer history as CSV. The Render key is separate from the `.data/admin-key.txt` key used on your computer.

The online database starts empty. Local test responses and browser progress are not automatically transferred to the new site.

## 4. Check that responses are reaching the database

1. Open the live site and choose **Get started**.
2. Tick **Share my anonymous quiz results with the organiser** before answering. Sharing is optional and starts off.
3. Start a path, deliberately choose one wrong answer, then retry correctly. Finish the module and final check to test the before/after comparison.
4. Open the organiser dashboard and check that the first answer, retry and final results appear.
5. Restart the web service from Render and check the same results are still present. This confirms the persistent storage is configured correctly on your deployment.

Only answers submitted after sharing is enabled are uploaded. A learner's private plan notes and booking details stay outside the quiz database.

## 5. Add your building and real booking link

The supplied site still uses **practice bookings** because no building or booking service has been supplied.

Use **Facilitator setup** to enter verified building details and real HTTPS booking links. Save to preview, then choose **Download config.js**. Replace `dist/config.js` in GitHub with that file and commit it. Render will deploy the change. Saving settings only in your browser does not change them for everyone else.

`config.js` is public website content. Keep the private organiser key in Render's Environment settings.

## Updates and backups

- Commit website changes to the connected GitHub branch. Render deploys them automatically; the attached disk retains the quiz database.
- The online database is `/var/data/results.sqlite`. It is outside the publicly served website folder. The app runs as one instance with one attached disk.
- Download CSV exports regularly for your research records. CSV is an analysis export, not a restorable SQLite backup.
- Deleting or replacing the persistent disk removes access to its stored responses. See Render's [disk and backup documentation](https://render.com/docs/disks) before changing storage.

## Manual setup, if you already created a Web Service

You can use these values instead of creating a second service with a Blueprint:

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Root directory | Leave blank if `serve.mjs` is at the repository's top level |
| Build command | `npm run build` |
| Start command | `npm start` |
| Instance | Paid 512 MB service (`0.5c-512mb`) |
| Health check | `/api/status` |
| Disk mount path | `/var/data` |
| Disk size | 1 GB |
| `NODE_VERSION` | `24.21.0` |
| `NODE_ENV` | `production` |
| `SOUTHBANK_HOST` | `0.0.0.0` |
| `SOUTHBANK_DATA_DIR` | `/var/data` |
| `SOUTHBANK_ADMIN_KEY` | A unique random password of at least 32 characters |

Render supplies `PORT`; the server now reads it automatically. Add the disk and environment variables before collecting any responses. The Blueprint generates the organiser key for you; with manual setup, generate one in a password manager and paste it directly into Render.

## Common problems

- **Blueprint cannot find the files:** check `render.yaml`, `package.json` and `serve.mjs` are at the repository's top level.
- **Build says `node:sqlite` is missing:** check `NODE_VERSION` is `24.21.0`, then redeploy.
- **No open port detected:** check `SOUTHBANK_HOST=0.0.0.0`, start command `npm start`, and use the updated `serve.mjs`.
- **No responses:** use the live HTTPS website, enable sharing before answering, and check **Your data** for upload status. The offline HTML version does not upload.
- **Key rejected:** copy `SOUTHBANK_ADMIN_KEY` from this Render service, rather than the local key file. Paste the value without quotes or extra spaces.
- **Responses disappear after restart:** verify the disk is mounted at `/var/data` and `SOUTHBANK_DATA_DIR` has exactly that value.

The release was prepared and tested locally. It has not been deployed to your Render account.
