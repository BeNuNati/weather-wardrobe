// Pure logic: weather data -> outfit description + image search query.
// No I/O here so it can be unit-tested without network access.

// Open-Meteo WMO weather codes -> coarse condition
function conditionFromCode(code) {
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([0, 1].includes(code)) return 'clear';
  return 'cloudy';
}

function temperatureBand(feelsLikeC) {
  if (feelsLikeC <= 5) return 'freezing';
  if (feelsLikeC <= 14) return 'cold';
  if (feelsLikeC <= 22) return 'mild';
  if (feelsLikeC <= 29) return 'warm';
  return 'hot';
}

const BASE_ITEMS = {
  freezing: ['heavy winter coat', 'wool sweater', 'scarf and gloves'],
  cold: ['warm jacket', 'sweater', 'long pants'],
  mild: ['light jacket or hoodie', 'long sleeve shirt', 'jeans'],
  warm: ['t-shirt', 'light pants or shorts', 'sneakers'],
  hot: ['tank top or light t-shirt', 'shorts', 'sandals'],
};

const BAND_QUERY = {
  freezing: 'winter coat outfit',
  cold: 'autumn jacket outfit',
  mild: 'spring layered outfit',
  warm: 'summer casual outfit',
  hot: 'hot weather summer outfit',
};

const CONDITION_QUERY = { rain: 'raincoat rainy day', snow: 'snow winter boots' };
const CONDITION_ITEMS = {
  rain: ['waterproof jacket', 'umbrella'],
  snow: ['waterproof boots'],
};

function buildSuggestion({ feelsLikeC, weatherCode, windKmh = 0 }, style = '') {
  const band = temperatureBand(feelsLikeC);
  const condition = conditionFromCode(weatherCode);

  const items = [...BASE_ITEMS[band], ...(CONDITION_ITEMS[condition] || [])];
  if (windKmh >= 30) items.push('windproof layer');
  if (condition === 'clear' && (band === 'warm' || band === 'hot')) items.push('sunglasses and hat');

  const query = [style.trim(), CONDITION_QUERY[condition] || BAND_QUERY[band], 'fashion']
    .filter(Boolean)
    .join(' ');

  return { band, condition, items, query };
}

module.exports = { conditionFromCode, temperatureBand, buildSuggestion };
