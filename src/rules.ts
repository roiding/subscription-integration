import { parse, stringify } from "yaml";
import type {
  ClashConfig,
  ClashFragment,
  ClashProxy,
  ClashProxyGroup,
  PersonalRuleSet,
  PersonalRuleSetInput,
  PersonalRuleSetUpdate,
  RuleProviderPlan,
  RuleProviderRun,
  RuleProviderSource,
  RuleSequenceEntry
} from "./types";
import { asBoolean, ensureOptionalString, ensureString, toNumber, unique } from "./utils";

export function validateRuleSetInput(body: unknown): PersonalRuleSetInput {
  const payload = ensureRecord(body);
  const format = ensureString(payload.format, "format");
  if (format !== "rule-lines" && format !== "clash-fragment") {
    throw new Error("format must be rule-lines or clash-fragment");
  }
  return {
    name: ensureString(payload.name, "name"),
    format,
    content: ensureString(payload.content, "content"),
    priority: payload.priority === undefined ? 100 : toNumber(payload.priority, "priority"),
    enabled: payload.enabled === undefined ? true : asBoolean(payload.enabled),
    notes: ensureOptionalString(payload.notes, "notes")
  };
}

export function validateRuleSetUpdate(body: unknown): PersonalRuleSetUpdate {
  const payload = ensureRecord(body);
  const update: PersonalRuleSetUpdate = {};
  if ("name" in payload) {
    update.name = ensureString(payload.name, "name");
  }
  if ("format" in payload) {
    const format = ensureString(payload.format, "format");
    if (format !== "rule-lines" && format !== "clash-fragment") {
      throw new Error("format must be rule-lines or clash-fragment");
    }
    update.format = format;
  }
  if ("content" in payload) {
    update.content = ensureString(payload.content, "content");
  }
  if ("priority" in payload) {
    update.priority = toNumber(payload.priority, "priority");
  }
  if ("enabled" in payload) {
    update.enabled = asBoolean(payload.enabled);
  }
  if ("notes" in payload) {
    update.notes = ensureOptionalString(payload.notes, "notes");
  }
  return update;
}

export function parseUpstreamFragment(source: string): ClashFragment {
  return parseFragmentFromText(source, "clash-fragment");
}

export function parsePersonalRuleFragment(ruleSet: PersonalRuleSet): ClashFragment {
  return parseFragmentFromText(ruleSet.content, ruleSet.format);
}

export function mergeClashFragments(
  upstream: ClashFragment,
  personalFragments: ClashFragment[],
  proxies: ClashProxy[]
): ClashConfig {
  const base = sanitizeClashConfig(upstream.raw || {});
  const mergedProxies = mergeProxies([
    ...upstream.proxies,
    ...personalFragments.flatMap((fragment) => fragment.proxies),
    ...proxies
  ]);
  const mergedGroups = mergeGroups([
    ...upstream.proxyGroups,
    ...personalFragments.flatMap((fragment) => fragment.proxyGroups)
  ]);
  const mergedRules = unique([
    ...personalFragments.flatMap((fragment) => fragment.rules),
    ...upstream.rules
  ]);
  const mergedProviders = Object.assign(
    {},
    upstream.ruleProviders,
    ...personalFragments.map((fragment) => fragment.ruleProviders)
  );
  const ruleTargets = collectRuleTargets(mergedRules);

  const config: ClashConfig = {
    ...base,
    proxies: mergedProxies,
    "proxy-groups": ensureDefaultGroups(
      ensureGroupsForTargets(mergedGroups, ruleTargets),
      mergedProxies.map((proxy) => proxy.name)
    ),
    rules: mergedRules.length > 0 ? mergedRules : [`MATCH,${mergedProxies.length > 0 ? "Proxy" : "DIRECT"}`],
    "rule-providers": Object.keys(mergedProviders).length > 0 ? mergedProviders : undefined
  };

  if (config["mixed-port"] === undefined && config.port === undefined && config["socks-port"] === undefined) {
    config["mixed-port"] = 7890;
  }
  if (config["allow-lan"] === undefined) {
    config["allow-lan"] = false;
  }
  if (config.mode === undefined) {
    config.mode = "rule";
  }
  if (config["log-level"] === undefined) {
    config["log-level"] = "info";
  }
  return config;
}

export function buildRuleProviderPlan(sources: RuleProviderSource[]): RuleProviderPlan {
  const sequence: RuleSequenceEntry[] = [];
  const runs: RuleProviderRun[] = [];
  const targets: string[] = [];

  for (const source of sources) {
    let currentPayload: string[] = [];
    let currentTarget = source.defaultTarget || "Proxy";
    let runIndex = 0;

    const flush = (): void => {
      const payload = unique(currentPayload);
      if (payload.length === 0) {
        currentPayload = [];
        return;
      }

      const run: RuleProviderRun = {
        sourceKind: source.sourceKind,
        sourceId: source.sourceId,
        sourceName: source.sourceName,
        index: runIndex,
        name: buildProviderName(source, runIndex),
        target: currentTarget,
        payload
      };
      runIndex += 1;
      runs.push(run);
      sequence.push({ kind: "provider", provider: run });
      targets.push(currentTarget);
      currentPayload = [];
    };

    for (const rule of source.rules) {
      const parsed = splitRuleTarget(rule);
      if (!parsed || isInlineOnlyRule(parsed.type)) {
        flush();
        sequence.push({ kind: "inline", rule });
        if (parsed?.target) {
          targets.push(parsed.target);
        }
        continue;
      }

      if (currentPayload.length > 0 && parsed.target !== currentTarget) {
        flush();
      }
      currentTarget = parsed.target;
      currentPayload.push(parsed.providerRule);
    }

    flush();
  }

  return {
    sequence,
    runs,
    targets: unique(targets.filter(Boolean))
  };
}

export function mergeClashWithRuleProviders(
  upstream: ClashFragment,
  personalFragments: ClashFragment[],
  proxies: ClashProxy[],
  plan: RuleProviderPlan,
  providerBaseUrl: string,
  subscriptionToken: string,
  upstreamUrl: string
): ClashConfig {
  const base = sanitizeClashConfig(upstream.raw || {});
  const mergedProxies = mergeProxies([
    ...upstream.proxies,
    ...personalFragments.flatMap((fragment) => fragment.proxies),
    ...proxies
  ]);
  const mergedGroups = ensureGroupsForTargets(
    mergeGroups([...upstream.proxyGroups, ...personalFragments.flatMap((fragment) => fragment.proxyGroups)]),
    plan.targets
  );
  const mergedProviders = {
    ...upstream.ruleProviders,
    ...Object.assign({}, ...personalFragments.map((fragment) => fragment.ruleProviders)),
    ...buildRuleProviderConfig(plan.runs, providerBaseUrl, subscriptionToken, upstreamUrl)
  };
  const rules = plan.sequence.map((entry) => {
    if (entry.kind === "inline") {
      return entry.rule;
    }
    return `RULE-SET,${entry.provider.name},${entry.provider.target}`;
  });

  const config: ClashConfig = {
    ...base,
    proxies: mergedProxies,
    "proxy-groups": ensureDefaultGroups(mergedGroups, mergedProxies.map((proxy) => proxy.name)),
    "rule-providers": Object.keys(mergedProviders).length > 0 ? mergedProviders : undefined,
    rules: rules.length > 0 ? rules : [`MATCH,${mergedProxies.length > 0 ? "Proxy" : "DIRECT"}`]
  };

  if (config["mixed-port"] === undefined && config.port === undefined && config["socks-port"] === undefined) {
    config["mixed-port"] = 7890;
  }
  if (config["allow-lan"] === undefined) {
    config["allow-lan"] = false;
  }
  if (config.mode === undefined) {
    config.mode = "rule";
  }
  if (config["log-level"] === undefined) {
    config["log-level"] = "info";
  }
  return config;
}

export function serializeRuleProviderPayload(run: RuleProviderRun): string {
  return serializeClashConfig({ payload: run.payload } as ClashConfig);
}

export function serializeClashConfig(config: ClashConfig): string {
  return stringify(cleanUndefined(config), {
    blockQuote: false,
    lineWidth: 0
  });
}

function parseFragmentFromText(
  content: string,
  format: "rule-lines" | "clash-fragment"
): ClashFragment {
  if (format === "rule-lines") {
    return {
      proxies: [],
      proxyGroups: [],
      rules: parseRuleLines(content),
      ruleProviders: {},
      raw: null
    };
  }

  try {
    const parsed = parse(content) as unknown;
    if (Array.isArray(parsed)) {
      return {
        proxies: [],
        proxyGroups: [],
        rules: parsed.map((item) => String(item).trim()).filter(Boolean),
        ruleProviders: {},
        raw: null
      };
    }
    if (parsed && typeof parsed === "object") {
      const config = sanitizeClashConfig(parsed as ClashConfig);
      return {
        proxies: Array.isArray(config.proxies) ? config.proxies : [],
        proxyGroups: Array.isArray(config["proxy-groups"]) ? config["proxy-groups"] : [],
        rules: Array.isArray(config.rules)
          ? config.rules.map((item) => String(item).trim()).filter(Boolean)
          : parseRuleLines(content),
        ruleProviders:
          config["rule-providers"] && typeof config["rule-providers"] === "object"
            ? (config["rule-providers"] as Record<string, unknown>)
            : {},
        raw: config
      };
    }
  } catch {
    return {
      proxies: [],
      proxyGroups: [],
      rules: parseRuleLines(content),
      ruleProviders: {},
      raw: null
    };
  }

  return {
    proxies: [],
    proxyGroups: [],
    rules: parseRuleLines(content),
    ruleProviders: {},
    raw: null
  };
}

function parseRuleLines(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"));
}

function splitRuleTarget(rule: string):
  | {
      type: string;
      target: string;
      providerRule: string;
    }
  | null {
  return splitRuleTargetWithDefault(rule, "Proxy");
}

function collectRuleTargets(rules: string[]): string[] {
  return unique(
    rules
      .map((rule) => splitRuleTarget(rule)?.target)
      .filter((target): target is string => Boolean(target))
  );
}

function splitRuleTargetWithDefault(
  rule: string,
  defaultTarget: string
):
  | {
      type: string;
      target: string;
      providerRule: string;
    }
  | null {
  const parts = splitRuleSegments(rule);
  if (parts.length < 2) {
    return null;
  }

  const type = parts[0].toUpperCase();
  if (type === "MATCH" || type === "FINAL") {
    return {
      type,
      target: parts[1],
      providerRule: rule
    };
  }

  if (parts.length === 2) {
    return {
      type,
      target: defaultTarget,
      providerRule: parts.join(",")
    };
  }

  if (looksLikeRuleOption(parts[2])) {
    return {
      type,
      target: defaultTarget,
      providerRule: parts.join(",")
    };
  }

  return {
    type,
    target: parts[2],
    providerRule: [parts[0], parts[1], ...parts.slice(3)].join(",")
  };
}

function isInlineOnlyRule(type: string): boolean {
  return type === "MATCH" || type === "FINAL" || type === "RULE-SET";
}

function buildProviderName(source: RuleProviderSource, index: number): string {
  return `${source.sourceKind}-${slugify(source.sourceName || source.sourceId)}-${index + 1}`;
}

function buildRuleProviderConfig(
  runs: RuleProviderRun[],
  providerBaseUrl: string,
  subscriptionToken: string,
  upstreamUrl: string
): Record<string, unknown> {
  const providers: Record<string, unknown> = {};
  for (const run of runs) {
    const path =
      run.sourceKind === "upstream"
        ? `upstream/${run.index}`
        : `rule-sets/${encodeURIComponent(run.sourceId)}/${run.index}`;
    const url = new URL(`${providerBaseUrl}/${path}`);
    url.searchParams.set("token", subscriptionToken);
    url.searchParams.set("upstream", upstreamUrl);
    providers[run.name] = {
      type: "http",
      behavior: "classical",
      format: "yaml",
      interval: 86400,
      path: `./rule-providers/${run.name}.yaml`,
      url: url.toString()
    };
  }
  return providers;
}

function ensureGroupsForTargets(
  groups: ClashProxyGroup[],
  targets: string[]
): ClashProxyGroup[] {
  const output = groups.map((group) => ({
    ...group,
    proxies: group.proxies ? [...group.proxies] : undefined
  }));
  const existingNames = new Set(output.map((group) => group.name));

  for (const target of targets) {
    if (!target || isBuiltInTargetGroup(target) || existingNames.has(target)) {
      continue;
    }
    output.push({
      name: target,
      type: "select",
      proxies: ["Proxy", "DIRECT", "REJECT"]
    });
    existingNames.add(target);
  }

  return output;
}

function isBuiltInTargetGroup(target: string): boolean {
  return target === "DIRECT" || target === "REJECT" || target === "Proxy" || target === "Auto";
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "rules";
}

function splitRuleSegments(rule: string): string[] {
  const segments: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of rule) {
    if (char === "(") {
      depth += 1;
    } else if (char === ")" && depth > 0) {
      depth -= 1;
    }

    if (char === "," && depth === 0) {
      segments.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim() !== "") {
    segments.push(current.trim());
  }
  return segments;
}

function looksLikeRuleOption(segment: string): boolean {
  const normalized = segment.trim().toLowerCase();
  return normalized === "no-resolve" || normalized === "src";
}

function mergeProxies(proxies: ClashProxy[]): ClashProxy[] {
  const byName = new Map<string, ClashProxy>();
  for (const proxy of proxies) {
    byName.set(proxy.name, proxy);
  }
  return [...byName.values()];
}

function mergeGroups(groups: ClashProxyGroup[]): ClashProxyGroup[] {
  const byName = new Map<string, ClashProxyGroup>();
  for (const group of groups) {
    const existing = byName.get(group.name);
    if (!existing) {
      byName.set(group.name, {
        ...group,
        proxies: group.proxies ? unique(group.proxies) : undefined
      });
      continue;
    }
    byName.set(group.name, {
      ...existing,
      ...group,
      proxies: unique([...(existing.proxies || []), ...(group.proxies || [])])
    });
  }
  return [...byName.values()];
}

function ensureDefaultGroups(groups: ClashProxyGroup[], proxyNames: string[]): ClashProxyGroup[] {
  const output = groups.map((group) => ({
    ...group,
    proxies: group.proxies ? [...group.proxies] : undefined
  }));

  if (proxyNames.length > 0) {
    upsertGroup(output, {
      name: "Auto",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: proxyNames
    });
  }

  upsertGroup(output, {
    name: "Proxy",
    type: "select",
    proxies: unique([
      ...(proxyNames.length > 0 ? ["Auto"] : []),
      "DIRECT",
      "REJECT",
      ...proxyNames
    ])
  });

  return output;
}

function upsertGroup(groups: ClashProxyGroup[], incoming: ClashProxyGroup): void {
  const index = groups.findIndex((group) => group.name === incoming.name);
  if (index === -1) {
    groups.push(incoming);
    return;
  }

  groups[index] = {
    ...groups[index],
    ...incoming,
    proxies: unique([...(groups[index].proxies || []), ...(incoming.proxies || [])])
  };
}

function sanitizeClashConfig(input: ClashConfig): ClashConfig {
  const output: ClashConfig = { ...input };
  if (output.proxies && !Array.isArray(output.proxies)) {
    output.proxies = [];
  }
  if (output["proxy-groups"] && !Array.isArray(output["proxy-groups"])) {
    output["proxy-groups"] = [];
  }
  if (output.rules && !Array.isArray(output.rules)) {
    output.rules = [];
  }
  return output;
}

function ensureRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be an object");
  }
  return value as Record<string, unknown>;
}

function cleanUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cleanUndefined(item)) as T;
  }
  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (item !== undefined) {
        output[key] = cleanUndefined(item);
      }
    }
    return output as T;
  }
  return value;
}
