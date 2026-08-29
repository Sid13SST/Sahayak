# Sahayak — the case file for your complaint

A prototype for the Codex/OpenAI public-service hackathon. Most people don't
give up on a civic complaint because it's hard to write — they give up
because they can't find the right department, don't know how to phrase it
formally, and can't tell what "under process" means.

Sahayak takes a complaint in plain language, routes it to the right
department with a plain-English reason why, drafts the formal letter,
and translates every status update back into plain language.

## What's real vs. mocked

- **Real:** department routing, letter drafting, and status translation run
  live on an OpenAI model (`gpt-4o-mini`), called from `/api/complete.js`.
- **Mocked:** the department directory, the submission backend, timeline
  progress, and the 15-day escalation trigger — no live government system
  is touched, per the hackathon's rules.

## Running it

The app is a single static page (`index.html`) plus one serverless function
(`api/complete.js`). Deploy on Vercel:

1. Import this repo at vercel.com.
2. Add an environment variable `OPENAI_API_KEY` in the project settings.
3. Deploy — the app and the API live on the same domain, so there's no
   CORS issue and the key never reaches the browser.

If the API isn't reachable (e.g. running `index.html` directly from disk),
the app falls back to a local rule-based simulation automatically, so the
citizen journey always works end to end.
