// Tiny Redis-over-REST store (Upstash, via the Vercel marketplace).
// Accepts both env names the integration may inject.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'kindle:server';

const redis = async (command) => {
    if (!URL_ || !TOKEN) return null;
    const res = await fetch(URL_, {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify(command),
        signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`redis ${res.status}`);
    return (await res.json()).result;
};

exports.getServer = async () => {
    const raw = await redis(['GET', KEY]);
    return raw ? JSON.parse(raw) : null;
};

exports.setServer = (value) => redis(['SET', KEY, JSON.stringify(value)]);
