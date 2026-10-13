# Decisions and limitations

| Decision | Why | Alternative rejected |
|---|---|---|
| Small Node server as a proxy | Keeps the Unsplash key secret; one round trip for the browser | Calling Unsplash from the browser (leaks the key) |
| Zero dependencies (built-in `http`, `fetch`, `node:test`) | Nothing to install, little to explain or break | Express: more code to learn for 1 endpoint |
| Vanilla JS frontend | The brief says the UI doesn't need to be perfect | React/Vite: build step with no benefit here |
| Rule-based outfit logic, not an LLM | Deterministic, free, testable, explainable | LLM suggestions: cost, latency, harder to test |
| Feels-like temperature, five bands | Matches how people actually dress | Raw temperature |
| Free-text style input with suggestions (`datalist`) | The brief asks for "clothing preference"; free text works with Unsplash search | Fixed dropdown (less flexible) |
| Weather logic in a pure module | Can be unit-tested without network | Logic inline in the route |

## Known limitations

- Photos are search results, so they match the *query* but not necessarily the exact items listed.
- Only current conditions are used, not the day's forecast (a cold morning followed by a warm afternoon isn't handled).
- Geocoding takes the first match, so "Springfield" returns whichever one Open-Meteo ranks first.
- Temperatures are in Celsius only.
- No caching; the Unsplash demo limit (50/hour) would be hit quickly with real traffic.
- No gender or age preference: the query is not tailored to that.
