import { useState, useEffect, useRef } from "react";

/*  ─────────────────────────────────────────────────────
    usePlatformData  —  live GitHub + LeetCode stats
    Uses free public proxy APIs that do NOT require auth.
    Falls back to data.json values if the fetch fails.
    ───────────────────────────────────────────────────── */

const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache (was 10 min)
const cache = {};

async function cachedFetch(key, fetcher) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < CACHE_TTL) return cache[key].data;
  try {
    const data = await fetcher();
    cache[key] = { data, ts: now };
    return data;
  } catch {
    return cache[key]?.data ?? null;
  }
}

/* ── GitHub ─────────────────────────────────── */

async function fetchGitHub(username) {
  // Uses the GitHub contribution calendar proxy (ghchart/github-contributions-api)
  // Fallback: we scrape the user's profile page contribution count from the REST API

  const [eventsData, userResp] = await Promise.allSettled([
    fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
    ).then((r) => (r.ok ? r.json() : null)),
    fetch(`https://api.github.com/users/${username}`).then((r) =>
      r.ok ? r.json() : null,
    ),
  ]);

  const events = eventsData.status === "fulfilled" ? eventsData.value : null;
  const user = userResp.status === "fulfilled" ? userResp.value : null;

  if (!events && !user) return null;

  // Build a 12-week (84 day) activity grid from events
  const now = new Date();
  const dayBuckets = new Array(84).fill(0);

  if (events) {
    for (const e of events) {
      if (e.type === "PushEvent") {
        const d = new Date(e.created_at);
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 84) {
          dayBuckets[83 - diffDays] += e.payload?.commits?.length || 1;
        }
      }
    }
  }

  // Normalize to 0-4 intensity scale
  const max = Math.max(1, ...dayBuckets);
  const activity = dayBuckets.map((v) => Math.ceil((v / max) * 4));

  // Count all push events available in the fetched activity window
  const pushesTotal = events
    ? events.filter((e) => e.type === "PushEvent").length
    : 0;

  // Commits this year (approximate from events we have)
  const thisYear = now.getFullYear();
  const commitsThisYear = events
    ? events
        .filter(
          (e) =>
            e.type === "PushEvent" &&
            new Date(e.created_at).getFullYear() === thisYear,
        )
        .reduce((sum, e) => sum + (e.payload?.commits?.length || 0), 0)
    : 0;

  // Calculate streak from activity
  let streak = 0;
  for (let i = activity.length - 1; i >= 0; i--) {
    if (activity[i] > 0) streak++;
    else break;
  }

  console.log("GitHub data:", {
    commitsThisYear,
    pushesTotal,
    streak,
    activityDays: activity.filter((a) => a > 0).length,
  });

  return {
    username,
    activity,
    commitsThisYear,
    pushesTotal,
    publicRepos: user?.public_repos,
    streak:
      streak > 1
        ? `${streak}-day activity streak`
        : "Activity tracked in real time",
  };
}

/* ── LeetCode ─────────────────────────────── */

async function fetchLeetCode(username) {
  // Uses the free alfa-leetcode-api (no auth needed)
  // Note: This API has strict rate limits, relies on cache
  const resp = await fetch(
    `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
  );
  if (!resp.ok) {
    console.warn(
      "LeetCode API fetch failed:",
      resp.status,
      "— using fallback data",
    );
    return null;
  }
  const d = await resp.json();

  return {
    solved: d.totalSolved ?? 0,
    easy: d.easySolved ?? 0,
    medium: d.mediumSolved ?? 0,
    hard: d.hardSolved ?? 0,
    streak: d.streak ?? 0,
    activeDays: d.totalActiveDays
      ? `${d.totalActiveDays} active days`
      : undefined,
    reputation: d.reputation ? `${d.reputation}` : undefined,
    ranking: d.ranking ? `Top ${Math.round(d.ranking)}%` : undefined,
  };
}

/* ── Hook ──────────────────────────────────── */

export function usePlatformData(fallback = {}) {
  const [github, setGitHub] = useState(fallback.github || {});
  const [leetcode, setLeetcode] = useState(fallback.leetcode || {});
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const ghUser = fallback.github?.username;
    const lcUser = fallback.leetcode?.username;

    if (ghUser) {
      cachedFetch(`gh-${ghUser}`, () => fetchGitHub(ghUser)).then((d) => {
        if (d) setGitHub((prev) => ({ ...prev, ...d }));
      });
    }

    if (lcUser) {
      cachedFetch(`lc-${lcUser}`, () => fetchLeetCode(lcUser)).then((d) => {
        if (d) setLeetcode((prev) => ({ ...prev, ...d }));
      });
    }
  }, [fallback.github?.username, fallback.leetcode?.username]); // eslint-disable-line react-hooks/exhaustive-deps

  return { github, leetcode };
}
