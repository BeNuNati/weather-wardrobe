// Thin wrappers around the two external APIs. Each throws an Error with a
// user-presentable message and an optional `status` for the HTTP layer.

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

async function getJson(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw httpError('Could not reach an external service. Check your connection.', 502);
  }
  if (!res.ok) throw httpError(`External service returned ${res.status}.`, 502);
  return res.json();
}

// Open-Meteo geocoding: city name -> first matching place
async function geocode(city) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search = new URLSearchParams({ name: city, count: '1', language: 'en', format: 'json' });
  const data = await getJson(url);
  const place = data.results && data.results[0];
  if (!place) throw httpError(`Could not find a city called "${city}".`, 404);
  return { name: place.name, country: place.country, lat: place.latitude, lon: place.longitude };
}

// Open-Meteo forecast: current conditions for coordinates
async function getCurrentWeather(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation',
    timezone: 'auto',
  });
  const { current } = await getJson(url);
  return {
    temperatureC: current.temperature_2m,
    feelsLikeC: current.apparent_temperature,
    weatherCode: current.weather_code,
    windKmh: current.wind_speed_10m,
    precipitationMm: current.precipitation,
  };
}

// Unsplash search: query -> up to `count` photos
async function searchPhotos(query, count = 4) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw httpError('Server is missing UNSPLASH_ACCESS_KEY (see README).', 500);
  const url = new URL('https://api.unsplash.com/search/photos');
  url.search = new URLSearchParams({ query, per_page: String(count), orientation: 'portrait' });
  const data = await getJson(url, { headers: { Authorization: `Client-ID ${key}` } });
  return data.results.map((p) => ({
    id: p.id,
    url: p.urls.small,
    alt: p.alt_description || query,
    photographer: p.user.name,
    photographerUrl: `${p.user.links.html}?utm_source=weather_wardrobe&utm_medium=referral`,
  }));
}

module.exports = { geocode, getCurrentWeather, searchPhotos };
