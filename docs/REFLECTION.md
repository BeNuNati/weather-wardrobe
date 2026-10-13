# Reflection (week 4)

> Fill in the parts marked ✍️ with your own experience. They need to be your honest answers.

## 1. Could a better initial prompt have avoided UX problems?

✍️ Write what went wrong (if anything) and what you would add to the first prompt.
Examples worth considering: specifying the error behaviour up front (city not found, no photos, missing key), loading state, and where the API key lives.

## 2. Can any message become a skill?

✍️ Candidates: "explore this API with curl/fetch and summarise the response shape before writing code", and "write docs/ARCHITECTURE, API_NOTES and DECISIONS for this project".

## 3. Subagents or hooks I'd want later

✍️ Ideas: a hook that runs `npm test` after edits; a hook or check that blocks committing `.env`; a subagent that reviews docs against the code to catch drift.

## 4. Can I confidently talk about the project?

Summary I can defend:

- **Architecture:** browser to one `/api/suggest` endpoint to Open-Meteo (geocode, forecast) and Unsplash, with pure outfit logic in between.
- **Key decision:** a server proxy so the Unsplash key stays private.
- **Trade-off:** rule-based suggestions instead of an LLM, which makes them testable and free but less nuanced.
- **Weakest point:** photos match the query, not the exact listed items.

✍️ Add: which part you could *not* explain before reading the docs, and what that tells you.
