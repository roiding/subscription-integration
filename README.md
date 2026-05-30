# subscription-integration

[中文文档](./README.zh-CN.md)

Cloudflare Workers subscription service for aggregating:

- one upstream open-source ruleset
- personal nodes stored in Cloudflare D1
- third-party airport subscription sources stored in Cloudflare D1
- personal rule sets stored in Cloudflare D1

It targets Mihomo-compatible clients first:

- OpenClash
- Clash Mi
- Clash Verge Rev
- Stash

It also keeps raw URI outputs for clients that still want URI-list or base64 node feeds.

## What It Does

- hosts an admin console at `/admin`
- stores personal nodes as URIs in D1
- lets you add nodes by either raw URI or per-field parameter editing
- aggregates third-party airport subscriptions with your own nodes
- merges personal rules with the upstream ruleset
- emits Clash/Mihomo subscriptions with Worker-hosted `rule-providers`
- keeps an inline Clash fallback and raw URI outputs

## Admin Console

Open:

```text
/admin
```

Current console features:

- Chinese / English switch
- light / dark theme switch
- tabbed layout for overview, nodes, sources, and rule sets
- token storage only in the current browser
- subscription link preview and copy helpers
- personal node CRUD
- third-party subscription source CRUD
- admin token and scope management
- dual node input modes:
  - raw URI mode
  - parameter mode that builds the final URI for you
- rule-lines builder plus rule list editor
- clash-fragment raw editor for advanced YAML fragments

## Project Layout

- `src/index.ts`: Worker routes
- `src/admin-ui.ts`: Worker-hosted admin console
- `src/repositories.ts`: D1 persistence adapter
- `src/proxy.ts`: URI parsing and Clash conversion
- `src/subscription-sources.ts`: third-party subscription source parsing and aggregation
- `src/rules.ts`: upstream/personal rule merge logic
- `migrations/`: D1 schema
- `wrangler.toml.example`: committed config template
- `docs/cloudflare-deployment.md`: deployment guide

## Data Model

### `proxy_profiles`

- stores personal nodes as `ss://`, `vmess://`, `vless://`, or `trojan://`
- parameter-mode editing still ends by generating a URI for storage

### `subscription_sources`

- stores third-party airport subscription URLs
- supported formats:
  - `auto`
  - `base64`
  - `uri-list`
  - `clash-yaml`

### `personal_rule_sets`

- `rule-lines`: visual rule editing plus plain classical rule storage
- `clash-fragment`: raw YAML fragment mode for advanced configuration

### `admin_tokens`

- stores SHA-256 token digests only
- plaintext tokens are shown only when created client-side or by bootstrap script

## Subscription Outputs

- `GET /api/subscription/clash`
- `GET /api/subscription/clash-inline`
- `GET /api/subscription/uri-list`
- `GET /api/subscription/base64`
- `GET /api/subscription/shadowsocks`

Notes:

- `clash` is the preferred provider-backed Mihomo config
- `clash-inline` is the fallback expanded config
- `Proxy` is the auto-generated default select group. Rules without an explicit target also fall back to `Proxy`.
- When a rule targets a group name that does not exist in the upstream config, both `clash` and `clash-inline` create a fallback select group with `Proxy`, `DIRECT`, and `REJECT` as choices.
- `uri-list` and `base64` include personal nodes and URI-compatible third-party sources
- third-party `clash-yaml` sources contribute Clash proxies to Clash outputs, but not to raw URI outputs unless the source itself exposes URIs

Common rule patterns:

- Default proxy path: `DOMAIN-SUFFIX,example.com,Proxy`
- Separate AI traffic toggle: `DOMAIN-SUFFIX,openai.com,AI`
- Separate work traffic toggle: `DOMAIN-SUFFIX,company.com,Work`
- Force direct: `DOMAIN-SUFFIX,lan.example,DIRECT`
- Force reject: `DOMAIN-SUFFIX,ads.example,REJECT`

If you reference a group such as `AI`, `Work`, or `Streaming` that does not exist upstream, the service creates a fallback select group like:

```yaml
- name: AI
  type: select
  proxies:
    - Proxy
    - DIRECT
    - REJECT
```

That means the new group still falls back to `Proxy` by default, while letting you override it in the client later.

## Validation And Tests

Common commands:

- `npm run typecheck`
- `npm test`
- `npm run check`

What they do:

- `typecheck`: runs the TypeScript compiler for static analysis only; it does not start the Worker or call Cloudflare
- `test`: runs Vitest against `tests/**/*.test.ts`
- `check`: runs typecheck first, then the test suite

The current test style in this repo is mostly request-level unit testing:

- call `handleRequest()` directly without deploying the Worker
- use `InMemoryRepository` instead of D1
- stub upstream fetches with a fake `fetchFn`
- assert on status codes and returned JSON/YAML payloads

If you have not written tests in a while, a good mental model is:

- `typecheck` catches wiring mistakes between code paths
- `test` catches behavior regressions

## Deployment

Default path: use the bootstrap script.

1. Install dependencies:

```bash
npm install
```

2. Log in to Cloudflare once:

```bash
npx wrangler login
```

3. Run the bootstrap helper:

```bash
npm run cf:bootstrap
```

What it automates:

- checks `wrangler` login
- creates a remote D1 database
- creates a real local `wrangler.toml` from `wrangler.toml.example`
- applies remote migrations
- generates bootstrap token(s)
- inserts token hashes into D1
- writes plaintext bootstrap tokens into `.dev.vars`
- optionally stores `UPSTREAM_RULESET_URL`
- optionally deploys the Worker

Important:

- commit `wrangler.toml.example`
- do **not** commit your real `wrangler.toml`
- do **not** commit `.dev.vars`

For the full deployment walkthrough, including the manual fallback path, see [docs/cloudflare-deployment.md](/C:/Users/Roiding/Documents/v2ray_worker/docs/cloudflare-deployment.md).

## Local Development

1. Copy config from the template if you are not using the bootstrap script:

```bash
copy wrangler.toml.example wrangler.toml
```

2. Run local migrations if needed:

```bash
npm run db:migrate:local
```

3. Start dev server:

```bash
npm run dev
```

4. Run checks:

```bash
npm run check
```

## Token And Permission Model

The admin console can manage real D1-backed tokens and scopes.

Supported scopes:

- `admin:*`
- `subscriptions:read`
- `proxies:read`
- `proxies:write`
- `sources:read`
- `sources:write`
- `rules:read`
- `rules:write`
- `tokens:read`
- `tokens:write`

Recommended production split:

- one admin token with write scopes
- one subscription token with `subscriptions:read`

## Verification

Run:

```bash
npm run check
```
