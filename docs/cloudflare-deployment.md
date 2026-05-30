# Cloudflare Deployment Guide

This project supports two deployment paths:

- automated bootstrap: recommended
- manual setup: fallback when you want full control

## Recommended Path: Automated Bootstrap

### 1. Install dependencies

```bash
npm install
```

### 2. Log in once

```bash
npx wrangler login
```

### 3. Run the bootstrap helper

```bash
npm run cf:bootstrap
```

The script prompts for:

- Worker name
- D1 database name
- optional default upstream ruleset URL
- token mode: `shared` or `split`
- whether to deploy automatically

It then:

1. verifies your Cloudflare login
2. creates the remote D1 database
3. creates a real local `wrangler.toml` from `wrangler.toml.example`
4. applies remote migrations
5. generates plaintext bootstrap token(s)
6. stores only token hashes in D1
7. writes plaintext tokens into `.dev.vars`
8. optionally stores `UPSTREAM_RULESET_URL`
9. optionally deploys the Worker

### 4. Open the admin console

After deploy, open:

```text
https://your-worker.your-subdomain.workers.dev/admin
```

Use the bootstrap admin token written to `.dev.vars`.

## Manual Path

Use this only if you do not want the helper script to edit local config for you.

### 1. Copy the template

```bash
copy wrangler.toml.example wrangler.toml
```

### 2. Log in

```bash
npx wrangler login
```

### 3. Create the remote D1 database

```bash
npx wrangler d1 create your-d1-database-name
```

Copy the returned `database_id` into `wrangler.toml`.

### 4. Apply remote migrations

```bash
npm run db:migrate:remote
```

### 5. Create bootstrap token hashes

Shared token setup:

```bash
npm run token:hash -- your-shared-token
```

Split token setup:

```bash
npm run token:hash -- your-admin-token
npm run token:hash -- your-subscription-token
```

### 6. Insert token hashes into D1

Shared token example:

```sql
INSERT INTO admin_tokens (
  id, name, token_sha256, scopes_json, enabled, notes, created_at, updated_at
) VALUES (
  'replace-with-uuid',
  'bootstrap-shared-token',
  '<sha256-from-script>',
  '["admin:*","subscriptions:read"]',
  1,
  'Single bootstrap token',
  '2026-05-30T00:00:00.000Z',
  '2026-05-30T00:00:00.000Z'
);
```

Split token example:

```sql
INSERT INTO admin_tokens (
  id, name, token_sha256, scopes_json, enabled, notes, created_at, updated_at
) VALUES (
  'replace-with-admin-uuid',
  'bootstrap-admin-token',
  '<admin-token-sha256>',
  '["admin:*"]',
  1,
  'Admin API token',
  '2026-05-30T00:00:00.000Z',
  '2026-05-30T00:00:00.000Z'
);

INSERT INTO admin_tokens (
  id, name, token_sha256, scopes_json, enabled, notes, created_at, updated_at
) VALUES (
  'replace-with-subscription-uuid',
  'bootstrap-subscription-token',
  '<subscription-token-sha256>',
  '["subscriptions:read"]',
  1,
  'Subscription API token',
  '2026-05-30T00:00:00.000Z',
  '2026-05-30T00:00:00.000Z'
);
```

### 7. Optional: set a default upstream ruleset

```bash
npx wrangler secret put UPSTREAM_RULESET_URL
```

### 8. Deploy the Worker

```bash
npx wrangler deploy
```

## Smoke Tests

Replace the domain and token values with your real ones.

Health check:

```bash
curl https://your-worker.your-subdomain.workers.dev/health
```

Admin console:

```text
https://your-worker.your-subdomain.workers.dev/admin
```

Provider-backed Clash subscription:

```bash
curl "https://your-worker.your-subdomain.workers.dev/api/subscription/clash?token=your-subscription-token"
```

Inline Clash fallback:

```bash
curl "https://your-worker.your-subdomain.workers.dev/api/subscription/clash-inline?token=your-subscription-token"
```

Raw URI list:

```bash
curl "https://your-worker.your-subdomain.workers.dev/api/subscription/uri-list?token=your-subscription-token"
```

## First Admin Actions

After login in `/admin`, the usual order is:

1. create or rotate managed tokens
2. add third-party subscription sources
3. add personal nodes
4. add personal rule sets
5. copy the final client subscription links

## Important Files

- commit `wrangler.toml.example`
- do not commit the real `wrangler.toml`
- do not commit `.dev.vars`

## Common Mistakes

- using a GitHub `refs/heads/...` URL inside `raw.githubusercontent.com`
- forgetting to apply remote D1 migrations before testing
- storing the plaintext token in D1 instead of its SHA-256 hash
- using the hash itself as the subscription token instead of the original plaintext token
- expecting `clash-yaml` third-party sources to appear in `uri-list` outputs when those sources do not expose raw URIs
