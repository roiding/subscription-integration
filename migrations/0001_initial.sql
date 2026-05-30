CREATE TABLE IF NOT EXISTS admin_tokens (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  token_sha256 TEXT NOT NULL UNIQUE,
  scopes_json TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_used_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_tokens_hash ON admin_tokens(token_sha256);
CREATE INDEX IF NOT EXISTS idx_admin_tokens_enabled ON admin_tokens(enabled);

CREATE TABLE IF NOT EXISTS proxy_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('ss', 'vmess', 'vless', 'trojan')),
  uri TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  tags_json TEXT NOT NULL DEFAULT '[]',
  clash_overrides_json TEXT,
  notes TEXT,
  priority INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_proxy_profiles_enabled_priority ON proxy_profiles(enabled, priority, name);

CREATE TABLE IF NOT EXISTS personal_rule_sets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  format TEXT NOT NULL CHECK (format IN ('rule-lines', 'clash-fragment')),
  content TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 100,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_personal_rule_sets_enabled_priority ON personal_rule_sets(enabled, priority, name);
