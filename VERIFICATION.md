# Update verification - 13 October 2026

## PDF poster and final quiz update

- A4 poster preview checked in English, Indonesian, Arabic (RTL), Simplified Chinese, Traditional Chinese and Italian. No overflow in the sheet, contact cards or personal-plan fields. Notes are escaped; longer/multiline notes continue in full on extra sheets; blank-copy mode omits personal notes.
- The print button reached the system print flow. The in-app browser tool cannot control that OS dialog, so an actual browser-produced PDF and a physical print still need checking in the chosen rollout browser. The screen preview uses the same A4 geometry and content as the print stylesheet. The TXT plan action has been removed.
- Resident browser journey: wrong first scenario, correct retry, complete kit and remaining chapters, final review, 3/4 original answers versus 4/4 final answers (+25 percentage points). Booking is gated by the final check.
- Protected organiser dashboard displayed that wrong answer, the retry and all four final answers, with 75% to 100% paired scores. CSV download completed and its content was inspected.
- Automated frontend checks cover both paths (4 and 5 questions), kit scoring, incomplete submissions, first-attempt preservation, multiple final rounds, new-run replay isolation, opt-in queueing, opt-out, clearing local data and private-note exclusion.
- API/SQLite integration tests cover restart persistence, server-side grading, authentication, same-origin checks, invalid options, immutable answers, duplicate and concurrent retry uploads, atomic final submissions, late-consent baselines and authenticated deletion.
- Translation build: 769 messages in five additional languages. 674 currently displayed messages covered by the render-corpus test; all six languages preserve learner state. Existing calendar/timezone and replay regression tests pass.
- Mac launcher supplied as a Unix executable in the ZIP. Mac instructions reviewed; this Windows environment cannot execute macOS Finder/Terminal or Safari.
- Release ZIP excludes `.data`, organiser keys, responses and development test data. It is CRC-checked and every included file is compared with the workspace source.

## Previous visual update checks

# Verification notes

## Visuals and entry flow — 12 October 2026

- The home page now contains a flood photograph, title, short overview and one Get started link. Both path cards, saved-progress summaries and Start again controls are on the separate path-selection page. Lesson and completion links return to that page when choosing another path.
- All three JPEGs are bundled locally with visible creator/source/licence credits and recorded provenance. Flood captions identify the historical dates and actual locations. Images keep their original proportions; they are not live flood information.
- Browser checks verified both photo disclosures open with the keyboard, Arabic captions and explanations render, the photos load locally, and all ten kit illustrations retain the existing selectable controls. A test kit selection was returned to its original unselected state.
- Checked the apartment cutaway with the basement selected and the supported-path medical/mobility power illustration. The existing text and controls remain available independently of these decorative drawings.
- Checked the home page and path-selection page in all six languages at a 390-pixel viewport: no document-width overflow, zero path cards on the home page, two on the next page, and Arabic right-to-left direction. Also inspected desktop layouts at 1280 pixels, the mobile photo disclosure and mobile kit.
- Automated checks passed for startup, local assets, the new entry flow, both learning paths, replay isolation, state-preserving language changes, private plan exports, and Melbourne-time calendar generation. The translation catalogue contains 660 messages in five translated languages alongside English; all 586 extracted displayed messages are covered.
- The local HTTP server serves JPEGs as image/jpeg. No image requests to third-party servers are needed for learning.

## Checked

- Both resident and supported learning journeys reach completion and the building-walk step.
- Incorrect scenario answers and unsafe kit items block completion until corrected.
- Map view switching, the included PDF/map asset, safe-destination guidance and emergency contacts.
- Personal notes are not retained after reload unless the learner opts in; opted-in notes and learning progress persist.
- Practice booking acknowledgement, stored practice confirmation and the supported-session default.
- Separate HTTPS booking-link configuration, rejection of non-HTTPS links, and removal of the practice form when a live link is configured. Temporary test links were removed.
- Keyboard-operated activities, dialogs, larger text and higher contrast. A 390-pixel viewport with larger text had no document-width overflow in the booking view.
- Source checks verify script startup, relative local assets, text escaping, plan content and calendar dates in both Melbourne standard time and daylight-saving time.
- Replay regression checks cover both paths: answers, kit choices, reminders, progress and the selected path's practice booking reset; personal notes, the other path and building settings are preserved.
- The completion-screen replay button was also checked in the browser: it returned to chapter one with zero progress, no selected answer and Next chapter disabled until a new answer is given.

## Limits of verification

- Browser automation does not allow direct file-URL navigation in this environment. The no-install version uses classic relative scripts and bundled assets, with no module fetch or build dependency; opening it directly is a manual check.
- The preview browser did not expose a download event for the plan download. Export generation was checked separately. Download handling and the print dialog should be checked in the browser chosen for rollout.
- External service availability, actual building accessibility and real bookings cannot be verified without the building and organiser's live service.
- This is functional and layout testing, not a formal accessibility conformance audit or building-safety approval.

## Multilingual update — 24 September 2026

- Bundled 628 message entries in Indonesian, Arabic, Simplified Chinese, Traditional Chinese and Italian, alongside English. A coverage check found translations for all 565 unique messages extracted from the rendered lesson variants, quiz states, maps, dialogs and booking screens.
- Checked all six language choices at a 390-pixel viewport: correct headings, document language, Arabic direction and no horizontal page overflow on the entry page.
- In-browser checks confirmed an answered quiz survives language switching and reload. Kit feedback updates in Traditional Chinese, including the unsafe-item explanation. Arabic practice-booking dates localise while the selected slot, format, preference and acknowledgement remain intact.
- Export checks cover all six languages, personal notes and organiser text preserved verbatim, unchanged emergency numbers, and UTF-8 calendar line folding within 75 bytes. Melbourne standard-time and daylight-saving dates still resolve correctly.
- Language preference persists, invalid language values fall back safely, and blocked browser storage does not prevent the module from loading.
- Translations have not had an independent native-speaker or professional translation review. Before community rollout, review the safety wording with speakers of each language alongside the existing building and disability/carer review.
