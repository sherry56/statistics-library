const ACTIONS = new Set(['site_view', 'resource_view', 'download']);
const SITE_KEY = '__site__';

const json = (body, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' }
});

const cleanText = (value, max = 240) => String(value ?? '').trim().slice(0, max);

function cleanResourceKey(value) {
  const key = cleanText(value, 320);
  if (!key || key === SITE_KEY || !key.startsWith('resources/') || key.includes('..') || key.includes('\\')) return '';
  return key;
}

function authorized(request, env) {
  const configured = cleanText(env.STATS_ADMIN_TOKEN, 256);
  if (!configured) return false;
  const header = request.headers.get('Authorization') || '';
  return header === `Bearer ${configured}`;
}

async function recordEvent(env, action, resourceKey, resourceTitle) {
  if (!env.STATS_DB) throw new Error('stats_database_unavailable');
  const now = new Date().toISOString();
  const views = action === 'site_view' || action === 'resource_view' ? 1 : 0;
  const downloads = action === 'download' ? 1 : 0;
  await env.STATS_DB.batch([
    env.STATS_DB.prepare(
      'INSERT INTO stats_events (action, resource_key, resource_title, created_at) VALUES (?, ?, ?, ?)'
    ).bind(action, resourceKey, resourceTitle, now),
    env.STATS_DB.prepare(`
      INSERT INTO resource_stats (resource_key, resource_title, views, downloads, last_event_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(resource_key) DO UPDATE SET
        resource_title = CASE WHEN excluded.resource_title <> '' THEN excluded.resource_title ELSE resource_stats.resource_title END,
        views = resource_stats.views + excluded.views,
        downloads = resource_stats.downloads + excluded.downloads,
        last_event_at = excluded.last_event_at
    `).bind(resourceKey, resourceTitle, views, downloads, now)
  ]);
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const action = cleanText(body?.action, 32);
  if (!ACTIONS.has(action)) return json({ ok: false, error: 'invalid_action' }, 400);
  const resourceKey = action === 'site_view' ? SITE_KEY : cleanResourceKey(body?.resourceKey);
  if (!resourceKey) return json({ ok: false, error: 'invalid_resource' }, 400);
  const resourceTitle = action === 'site_view' ? '资料库首页' : cleanText(body?.resourceTitle);

  try {
    await recordEvent(env, action, resourceKey, resourceTitle);
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return json({ ok: false, error: 'stats_unavailable' }, 503);
  }
}

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false, error: 'unauthorized' }, env.STATS_ADMIN_TOKEN ? 401 : 503);
  if (!env.STATS_DB) return json({ ok: false, error: 'stats_database_unavailable' }, 503);

  try {
    const [totals, resources, recent] = await Promise.all([
      env.STATS_DB.prepare('SELECT action, COUNT(*) AS count FROM stats_events GROUP BY action').all(),
      env.STATS_DB.prepare(`
        SELECT resource_key, resource_title, views, downloads, last_event_at
        FROM resource_stats
        WHERE resource_key <> ?
        ORDER BY downloads DESC, views DESC, resource_title COLLATE NOCASE
      `).bind(SITE_KEY).all(),
      env.STATS_DB.prepare(`
        SELECT action, resource_key, resource_title, created_at
        FROM stats_events
        ORDER BY id DESC
        LIMIT 100
      `).all()
    ]);
    const totalMap = Object.fromEntries((totals.results || []).map(row => [row.action, Number(row.count) || 0]));
    return json({
      ok: true,
      generatedAt: new Date().toISOString(),
      totals: {
        siteViews: totalMap.site_view || 0,
        resourceViews: totalMap.resource_view || 0,
        downloads: totalMap.download || 0
      },
      resources: resources.results || [],
      recent: recent.results || []
    });
  } catch {
    return json({ ok: false, error: 'stats_unavailable' }, 503);
  }
}

export function onRequestPut() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}

export function onRequestDelete() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
