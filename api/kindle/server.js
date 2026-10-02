// POST /api/kindle/server — the ThinkCentre pushes its stats here every few
// minutes (scripts/kindle-push.sh). The home server is never exposed.
const crypto = require('crypto');
const { setServer } = require('../_lib/store');

const num = (v, digits) => (Number.isFinite(Number(v)) ? Number(Number(v).toFixed(digits)) : null);
const sameSecret = (a = '', b = '') => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();
    const secret = process.env.KINDLE_PUSH_TOKEN;
    if (!secret || !sameSecret(req.headers['x-kindle-token'], secret)) return res.status(401).end();

    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    // Whitelist only: nothing the box sends (IPs, hostnames…) leaks to the public feed.
    const value = {
        name: String(b.name || 'ThinkCentre').slice(0, 30),
        status: String(b.status || 'ok').slice(0, 12),
        containers_running: num(b.containers_running, 0),
        containers_total: num(b.containers_total, 0),
        pool_tb: num(b.pool_tb, 1),
        storage_used_tb: num(b.storage_used_tb, 1),
        storage_total_tb: num(b.storage_total_tb, 1),
        received_at: Date.now(),
    };

    try {
        await setServer(value);
    } catch (err) {
        console.error('[kindle] store:', err.message);
        return res.status(502).json({ ok: false });
    }
    return res.status(200).json({ ok: true });
};
