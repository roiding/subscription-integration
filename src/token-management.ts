import type { AdminTokenInput, AdminTokenUpdate } from "./types";
import { asBoolean, ensureOptionalString, ensureString, ensureStringArray } from "./utils";

const allowedScopes = new Set([
  "admin:*",
  "subscriptions:read",
  "proxies:read",
  "proxies:write",
  "rules:read",
  "rules:write",
  "sources:read",
  "sources:write",
  "tokens:read",
  "tokens:write"
]);

export function validateAdminTokenInput(body: unknown): AdminTokenInput {
  const payload = ensureRecord(body);
  return {
    name: ensureString(payload.name, "name"),
    tokenSha256: validateSha256(payload.tokenSha256),
    scopes: validateScopes(payload.scopes),
    enabled: payload.enabled === undefined ? true : asBoolean(payload.enabled),
    notes: ensureOptionalString(payload.notes, "notes")
  };
}

export function validateAdminTokenUpdate(body: unknown): AdminTokenUpdate {
  const payload = ensureRecord(body);
  const update: AdminTokenUpdate = {};
  if ("name" in payload) {
    update.name = ensureString(payload.name, "name");
  }
  if ("tokenSha256" in payload) {
    update.tokenSha256 = validateSha256(payload.tokenSha256);
  }
  if ("scopes" in payload) {
    update.scopes = validateScopes(payload.scopes);
  }
  if ("enabled" in payload) {
    update.enabled = asBoolean(payload.enabled);
  }
  if ("notes" in payload) {
    update.notes = ensureOptionalString(payload.notes, "notes");
  }
  return update;
}

export function serializeAdminToken(record: {
  id: string;
  name: string;
  scopes: string[];
  enabled: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}): Record<string, unknown> {
  return {
    id: record.id,
    name: record.name,
    scopes: record.scopes,
    enabled: record.enabled,
    notes: record.notes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function validateSha256(value: unknown): string {
  const tokenSha256 = ensureString(value, "tokenSha256").toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(tokenSha256)) {
    throw new Error("tokenSha256 must be a 64-character lowercase SHA-256 hex string");
  }
  return tokenSha256;
}

function validateScopes(value: unknown): string[] {
  const scopes = ensureStringArray(value, "scopes");
  if (scopes.length === 0) {
    throw new Error("scopes must contain at least one scope");
  }
  for (const scope of scopes) {
    if (!allowedScopes.has(scope)) {
      throw new Error(`unsupported scope: ${scope}`);
    }
  }
  return scopes;
}

function ensureRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be an object");
  }
  return value as Record<string, unknown>;
}
