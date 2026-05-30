# Design: Worker Subscription MVP

## Architecture

The Worker exposes two API areas:

- `/api/admin/*`: authenticated management endpoints
- `/api/subscription/*`: subscription generation endpoints

Data is stored in Cloudflare D1 using three core tables:

- `proxy_profiles`: raw proxy node definitions and parsed metadata
- `personal_rule_sets`: user-managed rule YAML/text blocks plus priority metadata
- `admin_tokens`: hashed admin credentials for API access

## Auth Model

Admin endpoints require a bearer token. The Worker hashes the presented token with SHA-256 and compares it to a stored digest in D1. This keeps the plaintext token out of the database and works for a first MVP without introducing external identity providers.

## Merge Strategy

1. Fetch upstream open-source rule content from a user-supplied URL.
2. Load active personal rule sets ordered by priority.
3. Load active proxy nodes ordered by priority.
4. Parse upstream Clash YAML when possible; otherwise fall back to line-based text merging.
5. Convert compatible rules into Worker-hosted `rule-providers` and emit `RULE-SET` references in the main Clash config.
6. Leave inline-only rules such as `MATCH` or pre-existing `RULE-SET` chains in the main config.
7. Merge proxies, proxy groups, and rules with deduplication by stable names/keys.

## Output Formats

- `/api/subscription/clash`: returns a provider-backed Clash-compatible YAML for OpenClash, Clash Mi, Clash Verge Rev, Stash, and other Mihomo-compatible clients.
- `/api/subscription/clash-inline`: returns an inline fallback Clash-compatible YAML.
- `/api/subscription/providers/*`: returns YAML payloads for generated `rule-providers`.
- `/api/subscription/uri-list`: returns newline-separated URI entries suitable for clients that accept raw node subscriptions.

## Forward Compatibility For Tauri

The admin API uses JSON CRUD shapes so a future Tauri desktop app can act as a thin authenticated client without changing the backend contract.
