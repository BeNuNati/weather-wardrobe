# Architecture

## Files

| File | Responsibility |
|---|---|
| `server.js` | HTTP server. Serves `public/` and exposes `GET /api/suggest`. Orchestrates the steps; maps errors to HTTP status codes. |
| `lib/apis.js` | The only code that talks to the network: `geocode`, `getCurrentWeather`, `searchPhotos`. |
| `lib/outfit.js` | Pure functions: weather code and feels-like temperature to a band (freezing/cold/mild/warm/hot), a condition (rain/snow/clear/cloudy), a list of clothing items and an image search query. |
| `public/` | Static frontend (HTML, CSS, vanilla JS). Submits the form, renders the response. |
| `test/outfit.test.js` | Unit tests for the pure logic (`node --test`). |

## Data flow

1. User submits `city` and `style`.
2. `GET /api/suggest?city=...&style=...`
3. `geocode(city)` returns `{name, country, lat, lon}`, or a 404 "city not found".
4. `getCurrentWeather(lat, lon)` returns temperature, feels-like, WMO weather code, wind and precipitation.
5. `buildSuggestion(weather, style)` returns `{band, condition, items, query}`.
   The query is `"<style> <weather phrase> fashion"`, for example `sporty raincoat rainy day fashion`.
6. `searchPhotos(query)` returns 4 photos with photographer credit.
7. The server returns `{place, weather, suggestion, photos}` and the browser renders it.

## Why the server sits in the middle

The Unsplash key must not be shipped to the browser. The server holds it in `.env` and the frontend never sees it.
The server also keeps the weather-to-outfit logic in one testable place.
