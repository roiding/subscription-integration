CREATE TABLE IF NOT EXISTS subscription_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('auto', 'uri-list', 'base64', 'clash-yaml')),
  enabled INTEGER NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 100,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_subscription_sources_enabled_priority
  ON subscription_sources(enabled, priority, name);
