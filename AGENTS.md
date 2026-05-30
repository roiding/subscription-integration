# AGENTS

## Project Scope

- This repository hosts a Cloudflare Workers subscription service for personal proxy data.
- The MVP focuses on API-first delivery: D1 persistence, authenticated admin APIs, and multi-format subscription generation.
- Desktop or mobile UI clients are out of scope for the initial delivery, but the API contract should remain suitable for a future Tauri app.

## Stack Expectations

- Runtime: Cloudflare Workers
- Database: Cloudflare D1
- Language: TypeScript
- Tests: Vitest with `@cloudflare/vitest-pool-workers`

## Delivery Rules

- Keep changes small and reviewable.
- Prefer explicit types and deterministic transformations for subscription output.
- Treat security-sensitive behavior as first-class: authentication, authorization, and secret handling must be documented and tested.
- Update `README.md` when setup or API behavior changes.
- Add or update tests whenever behavior changes.

## MVP Priorities

1. Reliable authenticated CRUD for proxies and personal rule sets.
2. Deterministic merged subscription output for Clash-style YAML and plain URI lists.
3. Clear deploy and migration instructions for Cloudflare.
4. Maintainable service boundaries so a future Tauri app can call the same APIs.

## Non-Goals For MVP

- Full production-grade SSO.
- Rich admin UI.
- Exhaustive support for every proxy URI variant.
