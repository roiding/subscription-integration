import { parse } from "yaml";
import { parseProxyUri } from "./proxy";
import type {
  AggregatedSubscriptionSources,
  ClashProxy,
  SubscriptionSource,
  SubscriptionSourceFormat,
  SubscriptionSourceInput,
  SubscriptionSourceUpdate
} from "./types";
import { asBoolean, decodeBase64, ensureOptionalString, ensureString, isHttpUrl, unique } from "./utils";

export function validateSubscriptionSourceInput(body: unknown): SubscriptionSourceInput {
  const payload = ensureRecord(body);
  const format = validateFormat(payload.format);
  const url = ensureString(payload.url, "url");
  if (!isHttpUrl(url)) {
    throw new Error("url must be a valid http or https URL");
  }
  return {
    name: ensureString(payload.name, "name"),
    url,
    format,
    priority: payload.priority === undefined ? 100 : toNumber(payload.priority, "priority"),
    enabled: payload.enabled === undefined ? true : asBoolean(payload.enabled),
    notes: ensureOptionalString(payload.notes, "notes")
  };
}

export function validateSubscriptionSourceUpdate(body: unknown): SubscriptionSourceUpdate {
  const payload = ensureRecord(body);
  const update: SubscriptionSourceUpdate = {};
  if ("name" in payload) {
    update.name = ensureString(payload.name, "name");
  }
  if ("url" in payload) {
    const url = ensureString(payload.url, "url");
    if (!isHttpUrl(url)) {
      throw new Error("url must be a valid http or https URL");
    }
    update.url = url;
  }
  if ("format" in payload) {
    update.format = validateFormat(payload.format);
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

export async function loadThirdPartySubscriptionSources(
  sources: SubscriptionSource[],
  fetchFn: typeof fetch
): Promise<AggregatedSubscriptionSources> {
  const enabledSources = sources.filter((source) => source.enabled);
  const results = await Promise.all(
    enabledSources.map(async (source) => {
      const response = await fetchFn(source.url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch subscription source ${source.name} (${response.status})`
        );
      }
      const text = await response.text();
      return parseSubscriptionSourcePayload(source, text);
    })
  );

  return {
    uris: unique(results.flatMap((result) => result.uris)),
    clashProxies: dedupeClashProxies(results.flatMap((result) => result.clashProxies))
  };
}

export function parseSubscriptionSourcePayload(
  source: SubscriptionSource,
  rawText: string
): AggregatedSubscriptionSources {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { uris: [], clashProxies: [] };
  }

  switch (source.format) {
    case "uri-list":
      return parseUriLikeContent(trimmed);
    case "base64":
      return parseUriLikeContent(decodeBase64(trimmed));
    case "clash-yaml":
      return parseClashSubscription(trimmed, source.name);
    case "auto":
    default:
      return parseAutoSubscription(trimmed, source.name);
  }
}

function parseAutoSubscription(content: string, sourceName: string): AggregatedSubscriptionSources {
  const clashResult = tryParseClashSubscription(content, sourceName);
  if (clashResult) {
    return clashResult;
  }

  const plainResult = parseUriLikeContent(content);
  if (plainResult.uris.length > 0) {
    return plainResult;
  }

  try {
    const decoded = decodeBase64(content);
    const decodedResult = parseUriLikeContent(decoded);
    if (decodedResult.uris.length > 0) {
      return decodedResult;
    }
  } catch {
    // Ignore base64 decode failure for auto mode.
  }

  throw new Error(`Unable to detect subscription source format for ${sourceName}`);
}

function parseUriLikeContent(content: string): AggregatedSubscriptionSources {
  const uris = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => isSupportedUri(line));
  return {
    uris,
    clashProxies: dedupeClashProxies(uris.map((uri) => parseProxyUri(uri)))
  };
}

function parseClashSubscription(content: string, sourceName: string): AggregatedSubscriptionSources {
  const result = tryParseClashSubscription(content, sourceName);
  if (!result) {
    throw new Error(`Unable to parse Clash YAML subscription for ${sourceName}`);
  }
  return result;
}

function tryParseClashSubscription(
  content: string,
  sourceName: string
): AggregatedSubscriptionSources | null {
  try {
    const parsed = parse(content) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const config = parsed as Record<string, unknown>;
    if (!Array.isArray(config.proxies)) {
      return null;
    }
    const clashProxies = config.proxies
      .filter((item): item is ClashProxy => Boolean(item) && typeof item === "object" && !Array.isArray(item))
      .map((proxy, index) => ensureNamedClashProxy(proxy, `${sourceName}-${index + 1}`));
    return {
      uris: [],
      clashProxies: dedupeClashProxies(clashProxies)
    };
  } catch {
    return null;
  }
}

function ensureNamedClashProxy(proxy: ClashProxy, fallbackName: string): ClashProxy {
  return {
    ...proxy,
    name: typeof proxy.name === "string" && proxy.name.trim() !== "" ? proxy.name : fallbackName
  };
}

function dedupeClashProxies(proxies: ClashProxy[]): ClashProxy[] {
  const byName = new Map<string, ClashProxy>();
  for (const proxy of proxies) {
    byName.set(proxy.name, proxy);
  }
  return [...byName.values()];
}

function validateFormat(value: unknown): SubscriptionSourceFormat {
  const format = ensureString(value, "format") as SubscriptionSourceFormat;
  if (!["auto", "uri-list", "base64", "clash-yaml"].includes(format)) {
    throw new Error("format must be auto, uri-list, base64, or clash-yaml");
  }
  return format;
}

function isSupportedUri(value: string): boolean {
  return /^(ss|vmess|vless|trojan):\/\//i.test(value);
}

function ensureRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be an object");
  }
  return value as Record<string, unknown>;
}

function toNumber(value: unknown, fieldName: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a number`);
  }
  return parsed;
}
