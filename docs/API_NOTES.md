# API notes

## Open-Meteo (no key needed)

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=Tel+Aviv&count=1`
  returns `results[0]` with `latitude`, `longitude`, `name`, `country`. `results` is **absent** (not empty) when nothing matches, so the code checks for that.
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&timezone=auto`
  returns the values under `current`.
- `weather_code` follows WMO codes: 0-1 clear, 2-3 cloudy/overcast, 45-48 fog, 51-67 drizzle/rain, 71-77 snow, 80-82 showers, 85-86 snow showers, 95-99 thunderstorm.
- I use `apparent_temperature` (feels-like) instead of raw temperature because wind and humidity change what people should wear.

## Unsplash (free key required)

- Search: `GET https://api.unsplash.com/search/photos?query=...&per_page=4&orientation=portrait`
  with header `Authorization: Client-ID <ACCESS_KEY>`.
- Response: `results[]` with `urls.small`, `alt_description`, `user.name`, `user.links.html`.
- Demo apps are rate limited to 50 requests/hour. One user search = one Unsplash request.
- The terms ask for photographer credit and a link back to Unsplash with UTM parameters; the UI does both.
