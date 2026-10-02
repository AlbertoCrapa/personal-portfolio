// GET /api/kindle.json — feed for the e-ink Kindle dashboard.
// Weather + quote of the day. A broken source becomes null, the response stays 200.
// No secrets or storage needed: works straight from a git push.
const quotes = require('../src/data/data.json').homepage.extras.favoriteQuotes;

const TZ = 'Europe/Rome';
const TIMEOUT_MS = 5000;

// ponytail: per-instance memory cache, lost on cold start; the CDN cache in
// vercel.json absorbs most traffic anyway. Move to KV if upstream quotas bite.
const cache = new Map();
const cached = async (key, ttlMs, fn) => {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < ttlMs) return hit.value;
    const value = await fn();
    cache.set(key, { at: Date.now(), value });
    return value;
};

const fetchWithTimeout = async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`${res.status} ${url.split('?')[0]}`);
    return res;
};

const safe = async (name, fn) => {
    try {
        return await fn();
    } catch (err) {
        console.error(`[kindle] ${name}:`, err.message);
        return null;
    }
};

/* ── Time helpers (Europe/Rome wall clock) ─────────────────────────────── */

const parts = (date, timeZone = TZ) => {
    const out = {};
    new Intl.DateTimeFormat('en-GB', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hourCycle: 'h23', timeZoneName: 'longOffset',
    }).formatToParts(date).forEach((p) => { out[p.type] = p.value; });
    return out;
};

const localDay = (date, timeZone = TZ) => {
    const p = parts(date, timeZone);
    return `${p.year}-${p.month}-${p.day}`;
};

// "2026-10-02T19:30:00+02:00"
const localIso = (date) => {
    const p = parts(date);
    const offset = p.timeZoneName === 'GMT' ? '+00:00' : p.timeZoneName.slice(3);
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${offset}`;
};

/* ── Weather (Open-Meteo, WMO codes) ───────────────────────────────────── */

const WMO = {
    0: ['Cielo sereno', 'clear'], 1: ['Poco nuvoloso', 'partly'], 2: ['Parz. nuvoloso', 'partly'],
    3: ['Coperto', 'cloudy'], 45: ['Nebbia', 'fog'], 48: ['Nebbia gelata', 'fog'],
    51: ['Pioviggine leggera', 'rain'], 53: ['Pioviggine', 'rain'], 55: ['Pioviggine intensa', 'rain'],
    56: ['Pioviggine gelata', 'rain'], 57: ['Pioviggine gelata', 'rain'],
    61: ['Pioggia leggera', 'rain'], 63: ['Pioggia moderata', 'rain'], 65: ['Pioggia forte', 'rain'],
    66: ['Pioggia gelata', 'rain'], 67: ['Pioggia gelata', 'rain'],
    71: ['Neve leggera', 'snow'], 73: ['Neve moderata', 'snow'], 75: ['Neve forte', 'snow'], 77: ['Nevischio', 'snow'],
    80: ['Rovesci leggeri', 'rain'], 81: ['Rovesci', 'rain'], 82: ['Rovesci violenti', 'rain'],
    85: ['Rovesci di neve', 'snow'], 86: ['Rovesci di neve', 'snow'],
    95: ['Temporale', 'storm'], 96: ['Temporale e grandine', 'storm'], 99: ['Temporale e grandine', 'storm'],
};
const describe = (code, isDay = 1) => {
    const [condition, icon] = WMO[code] || ['—', 'cloudy'];
    return { condition, icon: icon === 'clear' && !isDay ? 'night' : icon, code };
};

const getWeather = (location) => cached('weather', 15 * 60e3, async () => {
    const lat = '45.4642';
    const lon = '9.19';
    const url = 'https://api.open-meteo.com/v1/forecast'
        + `?latitude=${lat}&longitude=${lon}&timezone=${encodeURIComponent(TZ)}&forecast_days=3`
        + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day'
        + '&daily=weather_code,temperature_2m_max,temperature_2m_min';
    const data = await (await fetchWithTimeout(url)).json();
    const c = data.current;
    return {
        unit: 'C',
        location,
        current: {
            temp: c.temperature_2m,
            feels_like: c.apparent_temperature,
            humidity: c.relative_humidity_2m,
            ...describe(c.weather_code, c.is_day),
        },
        daily: data.daily.time.map((date, i) => ({
            date,
            min: data.daily.temperature_2m_min[i],
            max: data.daily.temperature_2m_max[i],
            ...describe(data.daily.weather_code[i]),
        })),
    };
});

/* ── Quote of the day (reuses the homepage list) ───────────────────────── */

const getQuote = () => {
    const days = Math.floor(new Date(`${localDay(new Date())}T00:00:00Z`).getTime() / 86400e3);
    const q = quotes[days % quotes.length];
    return { text: q.text, author: q.author || '' };
};

/* ── Handler ───────────────────────────────────────────────────────────── */

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).end();

    const location = 'Milano';
    const weather = await safe('weather', () => getWeather(location));

    const body = {
        version: 1,
        updated: localIso(new Date()),
        refresh_seconds: 300,
        location,
        note: 'albyeah.com',
        weather,
        quote: await safe('quote', async () => getQuote()),
    };

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(JSON.stringify(body));
};
