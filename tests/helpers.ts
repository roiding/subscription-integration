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
} from "../src/types";

export class InMemoryRepository implements Repository {
  tokens = new Map<string, TokenRecord>();
  proxies = new Map<string, ProxyProfile>();
  ruleSets = new Map<string, PersonalRuleSet>();
  subscriptionSources = new Map<string, SubscriptionSource>();

  seedToken(token: TokenRecord): void {
    this.tokens.set(token.tokenSha256, token);
  }

  async findTokenByDigest(tokenSha256: string): Promise<TokenRecord | null> {
    return this.tokens.get(tokenSha256) || null;
  }

  async listAdminTokens(): Promise<TokenRecord[]> {
    return [...this.tokens.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async getAdminToken(id: string): Promise<TokenRecord | null> {
    return [...this.tokens.values()].find((token) => token.id === id) || null;
  }

  async createAdminToken(input: AdminTokenInput): Promise<TokenRecord> {
    const now = new Date().toISOString();
    const record: TokenRecord = {
      id: crypto.randomUUID(),
      name: input.name,
      tokenSha256: input.tokenSha256,
      scopes: input.scopes,
      enabled: input.enabled ?? true,
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.tokens.set(record.tokenSha256, record);
    return record;
  }

  async updateAdminToken(id: string, input: AdminTokenUpdate): Promise<TokenRecord | null> {
    const existing = await this.getAdminToken(id);
    if (!existing) {
      return null;
    }
    this.tokens.delete(existing.tokenSha256);
    const updated: TokenRecord = {
      ...existing,
      ...input,
      tokenSha256: input.tokenSha256 ?? existing.tokenSha256,
      scopes: input.scopes ?? existing.scopes,
      updatedAt: new Date().toISOString()
    };
    this.tokens.set(updated.tokenSha256, updated);
    return updated;
  }

  async deleteAdminToken(id: string): Promise<boolean> {
    const existing = await this.getAdminToken(id);
    if (!existing) {
      return false;
    }
    return this.tokens.delete(existing.tokenSha256);
  }

  async listProxyProfiles(): Promise<ProxyProfile[]> {
    return [...this.proxies.values()].sort(sortByPriorityThenCreatedAt);
  }

  async getProxyProfile(id: string): Promise<ProxyProfile | null> {
    return this.proxies.get(id) || null;
  }

  async createProxyProfile(input: ProxyProfileInput): Promise<ProxyProfile> {
    const now = new Date().toISOString();
    const record: ProxyProfile = {
      id: crypto.randomUUID(),
      name: input.name,
      type: input.uri.split("://")[0] as ProxyProfile["type"],
      uri: input.uri,
      priority: input.priority ?? 100,
      enabled: input.enabled ?? true,
      tags: input.tags ?? [],
      clashOverrides: input.clashOverrides ?? null,
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.proxies.set(record.id, record);
    return record;
  }

  async updateProxyProfile(id: string, input: ProxyProfileUpdate): Promise<ProxyProfile | null> {
    const existing = this.proxies.get(id);
    if (!existing) {
      return null;
    }
    const updated: ProxyProfile = {
      ...existing,
      ...input,
      type: (input.uri ? input.uri.split("://")[0] : existing.type) as ProxyProfile["type"],
      updatedAt: new Date().toISOString()
    };
    this.proxies.set(id, updated);
    return updated;
  }

  async deleteProxyProfile(id: string): Promise<boolean> {
    return this.proxies.delete(id);
  }

  async listPersonalRuleSets(): Promise<PersonalRuleSet[]> {
    return [...this.ruleSets.values()].sort(sortByPriorityThenCreatedAt);
  }

  async getPersonalRuleSet(id: string): Promise<PersonalRuleSet | null> {
    return this.ruleSets.get(id) || null;
  }

  async createPersonalRuleSet(input: PersonalRuleSetInput): Promise<PersonalRuleSet> {
    const now = new Date().toISOString();
    const record: PersonalRuleSet = {
      id: crypto.randomUUID(),
      name: input.name,
      format: input.format,
      content: input.content,
      priority: input.priority ?? 100,
      enabled: input.enabled ?? true,
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.ruleSets.set(record.id, record);
    return record;
  }

  async updatePersonalRuleSet(
    id: string,
    input: PersonalRuleSetUpdate
  ): Promise<PersonalRuleSet | null> {
    const existing = this.ruleSets.get(id);
    if (!existing) {
      return null;
    }
    const updated: PersonalRuleSet = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString()
    };
    this.ruleSets.set(id, updated);
    return updated;
  }

  async deletePersonalRuleSet(id: string): Promise<boolean> {
    return this.ruleSets.delete(id);
  }

  async listSubscriptionSources(): Promise<SubscriptionSource[]> {
    return [...this.subscriptionSources.values()].sort(sortByPriorityThenCreatedAt);
  }

  async getSubscriptionSource(id: string): Promise<SubscriptionSource | null> {
    return this.subscriptionSources.get(id) || null;
  }

  async createSubscriptionSource(input: SubscriptionSourceInput): Promise<SubscriptionSource> {
    const now = new Date().toISOString();
    const record: SubscriptionSource = {
      id: crypto.randomUUID(),
      name: input.name,
      url: input.url,
      format: input.format,
      priority: input.priority ?? 100,
      enabled: input.enabled ?? true,
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.subscriptionSources.set(record.id, record);
    return record;
  }

  async updateSubscriptionSource(
    id: string,
    input: SubscriptionSourceUpdate
  ): Promise<SubscriptionSource | null> {
    const existing = this.subscriptionSources.get(id);
    if (!existing) {
      return null;
    }
    const updated: SubscriptionSource = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString()
    };
    this.subscriptionSources.set(id, updated);
    return updated;
  }

  async deleteSubscriptionSource(id: string): Promise<boolean> {
    return this.subscriptionSources.delete(id);
  }
}

function sortByPriorityThenCreatedAt<T extends { priority: number; createdAt: string }>(a: T, b: T): number {
  if (a.priority !== b.priority) {
    return a.priority - b.priority;
  }
  return a.createdAt.localeCompare(b.createdAt);
}
