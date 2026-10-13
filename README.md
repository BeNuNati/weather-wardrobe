# Weather Wardrobe

Type a city and a clothing preference. The app looks up the current weather and shows 4 outfit photos that fit it.

## Run it

1. Get a free Unsplash Access Key: https://unsplash.com/developers (create an app, copy the *Access Key*).
2. Copy `.env.example` to `.env` and paste the key in.
3. `npm start` (Node 18+; there are no dependencies to install)
4. Open http://localhost:3000

Tests: `npm test`

## How it works

```
Browser --/api/suggest?city&style--> Node server
                                       1. Open-Meteo geocoding  (city -> lat/lon)
                                       2. Open-Meteo forecast   (lat/lon -> current weather)
                                       3. lib/outfit.js         (weather + style -> items + search query)
                                       4. Unsplash search       (query -> 4 photos)
Browser <---------- one JSON response ----
```

See [docs/](docs/) for details:

- [ARCHITECTURE.md](docs/ARCHITECTURE.md): components and data flow
- [API_NOTES.md](docs/API_NOTES.md): what I learned exploring both APIs
- [DECISIONS.md](docs/DECISIONS.md): why it is built this way, and known limitations
- [REFLECTION.md](docs/REFLECTION.md): the week-4 learning-goal questions
