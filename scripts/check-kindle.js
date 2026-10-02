// Validates the Kindle feed shape.  node scripts/check-kindle.js [url]
const assert = require('assert');

const url = process.argv[2] || 'https://www.albyeah.com/api/kindle.json';
const ICONS = ['clear', 'night', 'partly', 'cloudy', 'rain', 'storm', 'snow', 'fog', 'wind'];
const ISO_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

(async () => {
    const res = await fetch(url, { headers: { 'User-Agent': 'AlbyDash-Kindle/1.0' } });
    assert.strictEqual(res.status, 200, `status ${res.status}`);
    assert.match(res.headers.get('content-type'), /application\/json/);
    assert.strictEqual(res.headers.get('access-control-allow-origin'), '*');
    const raw = await res.text();
    assert.ok(raw.length < 20000, `too big: ${raw.length}`);
    const j = JSON.parse(raw);

    assert.strictEqual(j.version, 1);
    assert.match(j.updated, ISO_LOCAL);
    assert.ok(j.refresh_seconds >= 60);

    if (j.weather) {
        const { current, daily } = j.weather;
        for (const k of ['temp', 'feels_like', 'humidity']) assert.strictEqual(typeof current[k], 'number', k);
        assert.ok(ICONS.includes(current.icon), current.icon);
        assert.ok(daily.length >= 2);
        daily.forEach((d) => {
            assert.match(d.date, DAY);
            assert.strictEqual(typeof d.min, 'number');
            assert.strictEqual(typeof d.max, 'number');
            assert.ok(ICONS.includes(d.icon));
            assert.ok(d.condition.length <= 22, d.condition);
        });
    }
    if (j.quote) assert.ok(j.quote.text);
    if (j.calendar) {
        j.calendar.events.forEach((e) => {
            assert.match(e.start, e.all_day ? DAY : ISO_LOCAL);
            assert.match(e.end, e.all_day ? DAY : ISO_LOCAL);
            assert.ok(e.title.length <= 60);
        });
    }
    if (j.server) assert.strictEqual(typeof j.server.status, 'string');

    console.log('OK', { weather: !!j.weather, calendar: !!j.calendar, server: !!j.server, bytes: raw.length });
})().catch((err) => {
    console.error('FAIL', err.message);
    process.exit(1);
});
