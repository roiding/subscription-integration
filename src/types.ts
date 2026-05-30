export type ProxyType = "ss" | "vmess" | "vless" | "trojan";

export type RuleSetFormat = "rule-lines" | "clash-fragment";

export type SubscriptionSourceFormat = "auto" | "uri-list" | "base64" | "clash-yaml";

export interface Env {
  DB: D1Database;
  UPSTREAM_RULESET_URL?: string;
}

export interface TokenRecord {
  id: string;
  name: string;
  tokenSha256: string;
  scopes: string[];
  enabled: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTokenInput {
  name: string;
  tokenSha256: string;
  scopes: string[];
  enabled?: boolean;
  notes?: string | null;
}

export interface AdminTokenUpdate {
  name?: string;
  tokenSha256?: string;
  scopes?: string[];
  enabled?: boolean;
  notes?: string | null;
}

export interface ProxyProfile {
  id: string;
  name: string;
  type: ProxyType;
  uri: string;
  priority: number;
  enabled: boolean;
  tags: string[];
  clashOverrides: Record<string, unknown> | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalRuleSet {
  id: string;
  name: string;
  format: RuleSetFormat;
  content: string;
  priority: number;
  enabled: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionSource {
  id: string;
  name: string;
  url: string;
  format: SubscriptionSourceFormat;
  priority: number;
  enabled: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProxyProfileInput {
  name: string;
  uri: string;
  priority?: number;
  enabled?: boolean;
  tags?: string[];
  clashOverrides?: Record<string, unknown> | null;
  notes?: string | null;
}

export interface ProxyProfileUpdate {
  name?: string;
  uri?: string;
  priority?: number;
  enabled?: boolean;
  tags?: string[];
  clashOverrides?: Record<string, unknown> | null;
  notes?: string | null;
}

export interface PersonalRuleSetInput {
  name: string;
  format: RuleSetFormat;
  content: string;
  priority?: number;
  enabled?: boolean;
  notes?: string | null;
}

export interface PersonalRuleSetUpdate {
  name?: string;
  format?: RuleSetFormat;
  content?: string;
  priority?: number;
  enabled?: boolean;
  notes?: string | null;
}

export interface SubscriptionSourceInput {
  name: string;
  url: string;
  format: SubscriptionSourceFormat;
  priority?: number;
  enabled?: boolean;
  notes?: string | null;
}

export interface SubscriptionSourceUpdate {
  name?: string;
  url?: string;
  format?: SubscriptionSourceFormat;
  priority?: number;
  enabled?: boolean;
  notes?: string | null;
}

export interface ClashProxy extends Record<string, unknown> {
  name: string;
  type: string;
  server: string;
  port: number;
}

export interface ClashProxyGroup extends Record<string, unknown> {
  name: string;
  type: string;
  proxies?: string[];
}

export interface ClashConfig extends Record<string, unknown> {
  proxies?: ClashProxy[];
  "proxy-groups"?: ClashProxyGroup[];
  rules?: string[];
  "rule-providers"?: Record<string, unknown>;
}

export interface ClashFragment {
  proxies: ClashProxy[];
  proxyGroups: ClashProxyGroup[];
  rules: string[];
  ruleProviders: Record<string, unknown>;
  raw?: ClashConfig | null;
}

export type RuleProviderSourceKind = "upstream" | "rule-set";

export interface RuleProviderSource {
  sourceKind: RuleProviderSourceKind;
  sourceId: string;
  sourceName: string;
  rules: string[];
  defaultTarget?: string;
}

export interface RuleProviderRun {
  sourceKind: RuleProviderSourceKind;
  sourceId: string;
  sourceName: string;
  index: number;
  name: string;
  target: string;
  payload: string[];
}

export type RuleSequenceEntry =
  | {
      kind: "provider";
      provider: RuleProviderRun;
    }
  | {
      kind: "inline";
      rule: string;
    };

export interface RuleProviderPlan {
  sequence: RuleSequenceEntry[];
  runs: RuleProviderRun[];
  targets: string[];
}

export interface AggregatedSubscriptionSources {
  uris: string[];
  clashProxies: ClashProxy[];
}

export interface Repository {
  findTokenByDigest(tokenSha256: string): Promise<TokenRecord | null>;
  listAdminTokens(): Promise<TokenRecord[]>;
  getAdminToken(id: string): Promise<TokenRecord | null>;
  createAdminToken(input: AdminTokenInput): Promise<TokenRecord>;
  updateAdminToken(id: string, input: AdminTokenUpdate): Promise<TokenRecord | null>;
  deleteAdminToken(id: string): Promise<boolean>;
  listProxyProfiles(): Promise<ProxyProfile[]>;
  getProxyProfile(id: string): Promise<ProxyProfile | null>;
  createProxyProfile(input: ProxyProfileInput): Promise<ProxyProfile>;
  updateProxyProfile(id: string, input: ProxyProfileUpdate): Promise<ProxyProfile | null>;
  deleteProxyProfile(id: string): Promise<boolean>;
  listPersonalRuleSets(): Promise<PersonalRuleSet[]>;
  getPersonalRuleSet(id: string): Promise<PersonalRuleSet | null>;
  createPersonalRuleSet(input: PersonalRuleSetInput): Promise<PersonalRuleSet>;
  updatePersonalRuleSet(id: string, input: PersonalRuleSetUpdate): Promise<PersonalRuleSet | null>;
  deletePersonalRuleSet(id: string): Promise<boolean>;
  listSubscriptionSources(): Promise<SubscriptionSource[]>;
  getSubscriptionSource(id: string): Promise<SubscriptionSource | null>;
  createSubscriptionSource(input: SubscriptionSourceInput): Promise<SubscriptionSource>;
  updateSubscriptionSource(id: string, input: SubscriptionSourceUpdate): Promise<SubscriptionSource | null>;
  deleteSubscriptionSource(id: string): Promise<boolean>;
}
