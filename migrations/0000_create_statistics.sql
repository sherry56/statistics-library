CREATE TABLE IF NOT EXISTS stats_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL CHECK (action IN ('site_view', 'resource_view', 'download')),
  resource_key TEXT NOT NULL,
  resource_title TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stats_events_created_at ON stats_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stats_events_resource ON stats_events(resource_key, action);

CREATE TABLE IF NOT EXISTS resource_stats (
  resource_key TEXT PRIMARY KEY,
  resource_title TEXT NOT NULL DEFAULT '',
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  last_event_at TEXT NOT NULL
);
