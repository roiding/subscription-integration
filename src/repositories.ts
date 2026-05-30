import type {
  AdminTokenInput,
  AdminTokenUpdate,
  PersonalRuleSet,
  PersonalRuleSetInput,
  PersonalRuleSetUpdate,
  ProxyProfile,
  ProxyProfileInput,
  ProxyProfileUpdate,
  Repository,
  SubscriptionSource,
  SubscriptionSourceInput,
  SubscriptionSourceUpdate,
  TokenRecord
} from "./types";
import { detectProxyType } from "./proxy";
import { parseJsonArray, parseJsonObject } from "./utils";

export class D1Repository implements Repository {
  constructor(private readonly db: D1Database) {}

  async findTokenByDigest(tokenSha256: string): Promise<TokenRecord | null> {
    const row = await this.db
      .prepare(
        `SELECT id, name, token_sha256, scopes_json, enabled, notes, created_at, updated_at
         FROM admin_tokens
         WHERE token_sha256 = ?`
      )
      .bind(tokenSha256)
      .first<Record<string, unknown>>();
    return row ? mapToken(row) : null;
  }

  async listAdminTokens(): Promise<TokenRecord[]> {
    const result = await this.db
      .prepare(
        `SELECT id, name, token_sha256, scopes_json, enabled, notes, created_at, updated_at
         FROM admin_tokens
         ORDER BY created_at ASC`
      )
      .all<Record<string, unknown>>();
    return (result.results || []).map(mapToken);
  }

  async getAdminToken(id: string): Promise<TokenRecord | null> {
    const row = await this.db
      .prepare(
        `SELECT id, name, token_sha256, scopes_json, enabled, notes, created_at, updated_at
         FROM admin_tokens
         WHERE id = ?`
      )
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? mapToken(row) : null;
  }

  async createAdminToken(input: AdminTokenInput): Promise<TokenRecord> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO admin_tokens
         (id, name, token_sha256, scopes_json, enabled, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        input.tokenSha256,
        JSON.stringify(input.scopes),
        input.enabled ? 1 : 0,
        input.notes ?? null,
        now,
        now
      )
      .run();
    return (await this.getAdminToken(id)) as TokenRecord;
  }

  async updateAdminToken(id: string, input: AdminTokenUpdate): Promise<TokenRecord | null> {
    const existing = await this.getAdminToken(id);
    if (!existing) {
      return null;
    }
    const merged: TokenRecord = {
      ...existing,
      ...input,
      tokenSha256: input.tokenSha256 ?? existing.tokenSha256,
      scopes: input.scopes ?? existing.scopes,
      updatedAt: new Date().toISOString()
    };
    await this.db
      .prepare(
        `UPDATE admin_tokens
         SET name = ?, token_sha256 = ?, scopes_json = ?, enabled = ?, notes = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        merged.name,
        merged.tokenSha256,
        JSON.stringify(merged.scopes),
        merged.enabled ? 1 : 0,
        merged.notes,
        merged.updatedAt,
        id
      )
      .run();
    return this.getAdminToken(id);
  }

  async deleteAdminToken(id: string): Promise<boolean> {
    const result = await this.db
      .prepare("DELETE FROM admin_tokens WHERE id = ?")
      .bind(id)
      .run();
    return Boolean(result.meta.changes);
  }

  async listProxyProfiles(): Promise<ProxyProfile[]> {
    const result = await this.db
      .prepare(
        `SELECT id, name, type, uri, priority, enabled, tags_json, clash_overrides_json, notes, created_at, updated_at
         FROM proxy_profiles
         ORDER BY priority ASC, created_at ASC`
      )
      .all<Record<string, unknown>>();
    return (result.results || []).map(mapProxyProfile);
  }

  async getProxyProfile(id: string): Promise<ProxyProfile | null> {
    const row = await this.db
      .prepare(
        `SELECT id, name, type, uri, priority, enabled, tags_json, clash_overrides_json, notes, created_at, updated_at
         FROM proxy_profiles
         WHERE id = ?`
      )
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? mapProxyProfile(row) : null;
  }

  async createProxyProfile(input: ProxyProfileInput): Promise<ProxyProfile> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const type = detectProxyType(input.uri);
    await this.db
      .prepare(
        `INSERT INTO proxy_profiles
         (id, name, type, uri, priority, enabled, tags_json, clash_overrides_json, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        type,
        input.uri,
        input.priority ?? 100,
        input.enabled ? 1 : 0,
        JSON.stringify(input.tags ?? []),
        input.clashOverrides ? JSON.stringify(input.clashOverrides) : null,
        input.notes ?? null,
        now,
        now
      )
      .run();
    return (await this.getProxyProfile(id)) as ProxyProfile;
  }

  async updateProxyProfile(id: string, input: ProxyProfileUpdate): Promise<ProxyProfile | null> {
    const existing = await this.getProxyProfile(id);
    if (!existing) {
      return null;
    }

    const merged: ProxyProfile = {
      ...existing,
      ...input,
      type: detectProxyType(input.uri ?? existing.uri),
      updatedAt: new Date().toISOString()
    };

    await this.db
      .prepare(
        `UPDATE proxy_profiles
         SET name = ?, type = ?, uri = ?, priority = ?, enabled = ?, tags_json = ?, clash_overrides_json = ?, notes = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        merged.name,
        merged.type,
        merged.uri,
        merged.priority,
        merged.enabled ? 1 : 0,
        JSON.stringify(merged.tags),
        merged.clashOverrides ? JSON.stringify(merged.clashOverrides) : null,
        merged.notes,
        merged.updatedAt,
        id
      )
      .run();

    return this.getProxyProfile(id);
  }

  async deleteProxyProfile(id: string): Promise<boolean> {
    const result = await this.db
      .prepare("DELETE FROM proxy_profiles WHERE id = ?")
      .bind(id)
      .run();
    return Boolean(result.meta.changes);
  }

  async listPersonalRuleSets(): Promise<PersonalRuleSet[]> {
    const result = await this.db
      .prepare(
        `SELECT id, name, format, content, priority, enabled, notes, created_at, updated_at
         FROM personal_rule_sets
         ORDER BY priority ASC, created_at ASC`
      )
      .all<Record<string, unknown>>();
    return (result.results || []).map(mapRuleSet);
  }

  async getPersonalRuleSet(id: string): Promise<PersonalRuleSet | null> {
    const row = await this.db
      .prepare(
        `SELECT id, name, format, content, priority, enabled, notes, created_at, updated_at
         FROM personal_rule_sets
         WHERE id = ?`
      )
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? mapRuleSet(row) : null;
  }

  async createPersonalRuleSet(input: PersonalRuleSetInput): Promise<PersonalRuleSet> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO personal_rule_sets
         (id, name, format, content, priority, enabled, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        input.format,
        input.content,
        input.priority ?? 100,
        input.enabled ? 1 : 0,
        input.notes ?? null,
        now,
        now
      )
      .run();
    return (await this.getPersonalRuleSet(id)) as PersonalRuleSet;
  }

  async updatePersonalRuleSet(
    id: string,
    input: PersonalRuleSetUpdate
  ): Promise<PersonalRuleSet | null> {
    const existing = await this.getPersonalRuleSet(id);
    if (!existing) {
      return null;
    }
    const merged: PersonalRuleSet = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString()
    };
    await this.db
      .prepare(
        `UPDATE personal_rule_sets
         SET name = ?, format = ?, content = ?, priority = ?, enabled = ?, notes = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        merged.name,
        merged.format,
        merged.content,
        merged.priority,
        merged.enabled ? 1 : 0,
        merged.notes,
        merged.updatedAt,
        id
      )
      .run();
    return this.getPersonalRuleSet(id);
  }

  async deletePersonalRuleSet(id: string): Promise<boolean> {
    const result = await this.db
      .prepare("DELETE FROM personal_rule_sets WHERE id = ?")
      .bind(id)
      .run();
    return Boolean(result.meta.changes);
  }

  async listSubscriptionSources(): Promise<SubscriptionSource[]> {
    const result = await this.db
      .prepare(
        `SELECT id, name, url, format, priority, enabled, notes, created_at, updated_at
         FROM subscription_sources
         ORDER BY priority ASC, created_at ASC`
      )
      .all<Record<string, unknown>>();
    return (result.results || []).map(mapSubscriptionSource);
  }

  async getSubscriptionSource(id: string): Promise<SubscriptionSource | null> {
    const row = await this.db
      .prepare(
        `SELECT id, name, url, format, priority, enabled, notes, created_at, updated_at
         FROM subscription_sources
         WHERE id = ?`
      )
      .bind(id)
      .first<Record<string, unknown>>();
    return row ? mapSubscriptionSource(row) : null;
  }

  async createSubscriptionSource(input: SubscriptionSourceInput): Promise<SubscriptionSource> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO subscription_sources
         (id, name, url, format, priority, enabled, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        input.url,
        input.format,
        input.priority ?? 100,
        input.enabled ? 1 : 0,
        input.notes ?? null,
        now,
        now
      )
      .run();
    return (await this.getSubscriptionSource(id)) as SubscriptionSource;
  }

  async updateSubscriptionSource(
    id: string,
    input: SubscriptionSourceUpdate
  ): Promise<SubscriptionSource | null> {
    const existing = await this.getSubscriptionSource(id);
    if (!existing) {
      return null;
    }
    const merged: SubscriptionSource = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString()
    };
    await this.db
      .prepare(
        `UPDATE subscription_sources
         SET name = ?, url = ?, format = ?, priority = ?, enabled = ?, notes = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        merged.name,
        merged.url,
        merged.format,
        merged.priority,
        merged.enabled ? 1 : 0,
        merged.notes,
        merged.updatedAt,
        id
      )
      .run();
    return this.getSubscriptionSource(id);
  }

  async deleteSubscriptionSource(id: string): Promise<boolean> {
    const result = await this.db
      .prepare("DELETE FROM subscription_sources WHERE id = ?")
      .bind(id)
      .run();
    return Boolean(result.meta.changes);
  }
}

function mapToken(row: Record<string, unknown>): TokenRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    tokenSha256: String(row.token_sha256),
    scopes: parseJsonArray(String(row.scopes_json)),
    enabled: Number(row.enabled) === 1,
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function mapProxyProfile(row: Record<string, unknown>): ProxyProfile {
  return {
    id: String(row.id),
    name: String(row.name),
    type: detectProxyType(String(row.uri)),
    uri: String(row.uri),
    priority: Number(row.priority),
    enabled: Number(row.enabled) === 1,
    tags: parseJsonArray(String(row.tags_json)),
    clashOverrides: parseJsonObject(
      row.clash_overrides_json ? String(row.clash_overrides_json) : null
    ),
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function mapRuleSet(row: Record<string, unknown>): PersonalRuleSet {
  return {
    id: String(row.id),
    name: String(row.name),
    format: String(row.format) as PersonalRuleSet["format"],
    content: String(row.content),
    priority: Number(row.priority),
    enabled: Number(row.enabled) === 1,
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function mapSubscriptionSource(row: Record<string, unknown>): SubscriptionSource {
  return {
    id: String(row.id),
    name: String(row.name),
    url: String(row.url),
    format: String(row.format) as SubscriptionSource["format"],
    priority: Number(row.priority),
    enabled: Number(row.enabled) === 1,
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}
