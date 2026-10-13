const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { geocode, getCurrentWeather, searchPhotos } = require('./lib/apis');
const { buildSuggestion } = require('./lib/outfit');

// Minimal .env loader (avoids a dependency)
try {
  for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function handleSuggest(url, res) {
  const city = (url.searchParams.get('city') || '').trim();
  const style = (url.searchParams.get('style') || '').trim().slice(0, 60);
  if (!city) return sendJson(res, 400, { error: 'Please enter a city.' });

  try {
    const place = await geocode(city);
    const weather = await getCurrentWeather(place.lat, place.lon);
    const suggestion = buildSuggestion(weather, style);
    const photos = await searchPhotos(suggestion.query);
    sendJson(res, 200, { place, weather, suggestion, photos });
  } catch (err) {
    sendJson(res, err.status || 500, { error: err.message });
  }
}

function serveStatic(url, res) {
  const rel = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const file = path.join(PUBLIC, rel);
  if (!file.startsWith(PUBLIC + path.sep)) return sendJson(res, 403, { error: 'Forbidden' });
  fs.readFile(file, (err, data) => {
    if (err) return sendJson(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/api/suggest') return handleSuggest(url, res);
    serveStatic(url, res);
  })
  .listen(PORT, () => console.log(`Weather Wardrobe running at http://localhost:${PORT}`));
