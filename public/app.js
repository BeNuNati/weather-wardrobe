const form = document.getElementById('form');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submit');
const result = document.getElementById('result');

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const params = new URLSearchParams({
    city: form.city.value,
    style: form.style.value,
  });

  submitBtn.disabled = true;
  result.hidden = true;
  statusEl.className = '';
  statusEl.textContent = 'Checking the weather and finding outfits…';

  try {
    const res = await fetch(`/api/suggest?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    render(data);
    statusEl.textContent = '';
  } catch (err) {
    statusEl.className = 'error';
    statusEl.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
  }
});

function render({ place, weather, suggestion, photos }) {
  document.getElementById('weather').textContent =
    `${place.name}, ${place.country}: ${Math.round(weather.temperatureC)}°C ` +
    `(feels like ${Math.round(weather.feelsLikeC)}°C), ${suggestion.condition}`;
  document.getElementById('items').textContent = `Suggested: ${suggestion.items.join(', ')}.`;

  const box = document.getElementById('photos');
  box.replaceChildren(
    ...photos.map((p) =>
      el('figure', {},
        el('img', { src: p.url, alt: p.alt, loading: 'lazy' }),
        el('figcaption', {}, 'Photo by ', el('a', { href: p.photographerUrl, target: '_blank', rel: 'noopener' }, p.photographer))
      )
    )
  );
  if (!photos.length) box.textContent = 'No photos found for this combination. Try a different style.';
  result.hidden = false;
}
