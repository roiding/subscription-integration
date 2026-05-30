import type {
  ClashProxy,
  ProxyProfile,
  ProxyProfileInput,
  ProxyProfileUpdate,
  ProxyType
} from "./types";
import {
  asBoolean,
  decodeBase64,
  deepMerge,
  ensureOptionalString,
  ensureString,
  ensureStringArray,
  splitOnce,
  toNumber
} from "./utils";

export function validateProxyProfileInput(body: unknown): ProxyProfileInput {
  const payload = ensureRecord(body);
  return {
    name: ensureString(payload.name, "name"),
    uri: ensureString(payload.uri, "uri"),
    priority: toOptionalNumber(payload.priority, "priority", 100),
    enabled: toOptionalBoolean(payload.enabled, true),
    tags: ensureStringArray(payload.tags, "tags"),
    clashOverrides: toOptionalObject(payload.clashOverrides, "clashOverrides"),
    notes: ensureOptionalString(payload.notes, "notes")
  };
}

export function validateProxyProfileUpdate(body: unknown): ProxyProfileUpdate {
  const payload = ensureRecord(body);
  const update: ProxyProfileUpdate = {};
  if ("name" in payload) {
    update.name = ensureString(payload.name, "name");
  }
  if ("uri" in payload) {
    update.uri = ensureString(payload.uri, "uri");
  }
  if ("priority" in payload) {
    update.priority = toNumber(payload.priority, "priority");
  }
  if ("enabled" in payload) {
    update.enabled = asBoolean(payload.enabled);
  }
  if ("tags" in payload) {
    update.tags = ensureStringArray(payload.tags, "tags");
  }
  if ("clashOverrides" in payload) {
    update.clashOverrides = toOptionalObject(payload.clashOverrides, "clashOverrides");
  }
  if ("notes" in payload) {
    update.notes = ensureOptionalString(payload.notes, "notes");
  }
  return update;
}

export function detectProxyType(uri: string): ProxyType {
  const scheme = splitOnce(uri.trim(), "://")[0].toLowerCase();
  if (scheme === "ss" || scheme === "vmess" || scheme === "vless" || scheme === "trojan") {
    return scheme;
  }
  throw new Error(`Unsupported proxy scheme: ${scheme}`);
}

export function buildClashProxy(profile: ProxyProfile): ClashProxy {
  const parsed = parseProxyUri(profile.uri, profile.name);
  if (profile.clashOverrides) {
    return deepMerge(parsed, profile.clashOverrides);
  }
  return parsed;
}

export function parseProxyUri(uri: string, fallbackName?: string): ClashProxy {
  const type = detectProxyType(uri);
  if (type === "ss") {
    return parseShadowsocks(uri, fallbackName);
  }
  if (type === "vmess") {
    return parseVmess(uri, fallbackName);
  }
  if (type === "vless") {
    return parseVless(uri, fallbackName);
  }
  return parseTrojan(uri, fallbackName);
}

function parseShadowsocks(uri: string, fallbackName?: string): ClashProxy {
  const remainder = uri.slice("ss://".length);
  const [withoutHash, hashPart] = splitOnce(remainder, "#");
  const [mainPart, queryPart] = splitOnce(withoutHash, "?");
  let credentials = "";
  let serverPart = "";

  if (mainPart.includes("@")) {
    const atIndex = mainPart.lastIndexOf("@");
    credentials = decodeBase64IfPossible(mainPart.slice(0, atIndex));
    serverPart = mainPart.slice(atIndex + 1);
  } else {
    const decoded = decodeBase64(mainPart);
    const [userinfo, serverInfo] = splitOnce(decoded, "@");
    credentials = userinfo;
    serverPart = serverInfo;
  }

  const [method, password] = splitOnce(credentials, ":");
  const { host, port } = parseHostPort(serverPart);
  const proxy: ClashProxy = {
    name: decodeURIComponent(hashPart || fallbackName || `${host}:${port}`),
    type: "ss",
    server: host,
    port,
    cipher: method,
    password,
    udp: true
  };

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const plugin = params.get("plugin");
    if (plugin) {
      const [pluginName, pluginArgs] = splitOnce(plugin, ";");
      proxy.plugin = pluginName;
      if (pluginArgs) {
        const pluginOptions: Record<string, string> = {};
        for (const segment of pluginArgs.split(";")) {
          if (!segment) {
            continue;
          }
          const [key, value] = splitOnce(segment, "=");
          pluginOptions[key] = value;
        }
        proxy["plugin-opts"] = pluginOptions;
      }
    }
  }

  return proxy;
}

function parseTrojan(uri: string, fallbackName?: string): ClashProxy {
  const url = new URL(uri);
  const network = url.searchParams.get("type") || "tcp";
  const proxy: ClashProxy = {
    name: decodeURIComponent(url.hash.slice(1) || fallbackName || `${url.hostname}:${url.port || "443"}`),
    type: "trojan",
    server: url.hostname,
    port: toNumber(url.port || "443", "port"),
    password: decodeURIComponent(url.username),
    udp: true
  };

  applyCommonTransportOptions(proxy, url, network);
  return proxy;
}

function parseVless(uri: string, fallbackName?: string): ClashProxy {
  const url = new URL(uri);
  const network = url.searchParams.get("type") || "tcp";
  const security = url.searchParams.get("security") || "";
  const proxy: ClashProxy = {
    name: decodeURIComponent(url.hash.slice(1) || fallbackName || `${url.hostname}:${url.port || "443"}`),
    type: "vless",
    server: url.hostname,
    port: toNumber(url.port || "443", "port"),
    uuid: decodeURIComponent(url.username),
    udp: true
  };

  if (security === "tls" || security === "reality") {
    proxy.tls = true;
  }
  const flow = url.searchParams.get("flow");
  if (flow) {
    proxy.flow = flow;
  }
  if (security === "reality") {
    const publicKey = url.searchParams.get("pbk");
    const shortId = url.searchParams.get("sid");
    if (publicKey) {
      proxy["reality-opts"] = {
        "public-key": publicKey,
        ...(shortId ? { "short-id": shortId } : {})
      };
    }
  }

  applyCommonTransportOptions(proxy, url, network);
  return proxy;
}

function parseVmess(uri: string, fallbackName?: string): ClashProxy {
  const encoded = uri.slice("vmess://".length);
  const decoded = decodeBase64(encoded);
  const payload = JSON.parse(decoded) as Record<string, string>;
  const network = payload.net || "tcp";
  const tlsEnabled = payload.tls === "tls" || payload.tls === "1";
  const proxy: ClashProxy = {
    name: fallbackName || payload.ps || `${payload.add}:${payload.port}`,
    type: "vmess",
    server: payload.add,
    port: toNumber(payload.port, "port"),
    uuid: payload.id,
    alterId: toOptionalNumber(payload.aid, "aid", 0),
    cipher: payload.scy || "auto",
    udp: true
  };

  if (tlsEnabled) {
    proxy.tls = true;
  }
  const serverName = payload.sni || payload.host;
  if (serverName) {
    proxy.servername = serverName;
  }
  if (network && network !== "tcp") {
    proxy.network = network;
  }
  if (network === "ws") {
    proxy["ws-opts"] = {
      path: payload.path || "/",
      headers: payload.host ? { Host: payload.host } : {}
    };
  }
  if (network === "grpc") {
    proxy["grpc-opts"] = {
      "grpc-service-name": payload.path || payload.serviceName || ""
    };
  }
  return proxy;
}

function applyCommonTransportOptions(proxy: ClashProxy, url: URL, network: string): void {
  if (network && network !== "tcp") {
    proxy.network = network;
  }

  const serverName = url.searchParams.get("sni") || url.searchParams.get("host");
  if (serverName) {
    proxy.servername = serverName;
  }

  const allowInsecure = url.searchParams.get("allowInsecure");
  if (allowInsecure === "1" || allowInsecure === "true") {
    proxy["skip-cert-verify"] = true;
  }

  if (network === "ws") {
    const hostHeader = url.searchParams.get("host");
    proxy["ws-opts"] = {
      path: decodeURIComponent(url.searchParams.get("path") || "/"),
      headers: hostHeader ? { Host: hostHeader } : {}
    };
  }

  if (network === "grpc") {
    proxy["grpc-opts"] = {
      "grpc-service-name": url.searchParams.get("serviceName") || ""
    };
  }

  if (network === "http" || network === "h2") {
    proxy["http-opts"] = {
      method: "GET",
      path: [decodeURIComponent(url.searchParams.get("path") || "/")],
      headers: url.searchParams.get("host")
        ? {
            Host: [url.searchParams.get("host") as string]
          }
        : {}
    };
  }
}

function parseHostPort(input: string): { host: string; port: number } {
  const lastColon = input.lastIndexOf(":");
  if (lastColon === -1) {
    throw new Error("Missing host or port");
  }
  return {
    host: input.slice(0, lastColon),
    port: toNumber(input.slice(lastColon + 1), "port")
  };
}

function ensureRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be an object");
  }
  return value as Record<string, unknown>;
}

function toOptionalNumber(value: unknown, fieldName: string, defaultValue: number): number {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  return toNumber(value, fieldName);
}

function toOptionalBoolean(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  return asBoolean(value, defaultValue);
}

function toOptionalObject(
  value: unknown,
  fieldName: string
): Record<string, unknown> | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${fieldName} must be an object`);
  }
  return value as Record<string, unknown>;
}

function decodeBase64IfPossible(value: string): string {
  try {
    return decodeBase64(value);
  } catch {
    return value;
  }
}
