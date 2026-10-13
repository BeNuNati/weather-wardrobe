const test = require('node:test');
const assert = require('node:assert/strict');
const { conditionFromCode, temperatureBand, buildSuggestion } = require('../lib/outfit');

test('weather codes map to coarse conditions', () => {
  assert.equal(conditionFromCode(0), 'clear');
  assert.equal(conditionFromCode(63), 'rain');
  assert.equal(conditionFromCode(75), 'snow');
  assert.equal(conditionFromCode(3), 'cloudy');
});

test('feels-like temperature maps to bands at the boundaries', () => {
  assert.equal(temperatureBand(5), 'freezing');
  assert.equal(temperatureBand(6), 'cold');
  assert.equal(temperatureBand(22), 'mild');
  assert.equal(temperatureBand(30), 'hot');
});

test('rainy cold day suggests waterproofs and puts style in the query', () => {
  const s = buildSuggestion({ feelsLikeC: 8, weatherCode: 61, windKmh: 35 }, 'sporty');
  assert.ok(s.items.includes('umbrella'));
  assert.ok(s.items.includes('windproof layer'));
  assert.match(s.query, /^sporty .*fashion$/);
});

test('empty style does not leave stray spaces in the query', () => {
  const s = buildSuggestion({ feelsLikeC: 25, weatherCode: 0 }, '');
  assert.equal(s.query, 'summer casual outfit fashion');
});
