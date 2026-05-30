# Proposal: Worker Subscription MVP

## Why

Users need a single Cloudflare-hosted subscription endpoint that merges:

- upstream open-source proxy rules
- privately managed proxy nodes
- privately managed rule groups

The merged output must be consumable by OpenClash, ClashX, Clash Verge, and simple URI-list clients.

## Scope

- Cloudflare Worker service with D1-backed persistence
- authenticated admin APIs for proxy entries and personal rule sets
- public subscription APIs that merge upstream rules and personal data
- generated outputs for Clash YAML and plain Shadowsocks/V2Ray-style URI lists
- local tests and deployment documentation

## Non-Goals

- desktop UI implementation
- full user tenancy management beyond a single admin credential model
- support for every existing proxy scheme variant

## Success Criteria

- admin can create, update, list, and delete proxy entries and rule sets through authenticated APIs
- subscription endpoints generate valid merged payloads from D1 data plus an upstream URL
- test suite covers authentication, CRUD, merge behavior, and output serialization
