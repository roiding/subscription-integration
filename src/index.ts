import { authorize, authorizeWithToken } from "./auth";
import { renderAdminPage } from "./admin-ui";
import { buildClashProxy, parseProxyUri, validateProxyProfileInput, validateProxyProfileUpdate } from "./proxy";
import { D1Repository } from "./repositories";
import {
  buildRuleProviderPlan,
  mergeClashFragments,
  mergeClashWithRuleProviders,
  parsePersonalRuleFragment,
  parseUpstreamFragment,
  serializeClashConfig,
  serializeRuleProviderPayload,
  validateRuleSetInput,
  validateRuleSetUpdate
} from "./rules";
import {
  serializeAdminToken,
  validateAdminTokenInput,
  validateAdminTokenUpdate
} from "./token-management";
import {
  loadThirdPartySubscriptionSources,
  validateSubscriptionSourceInput,
  validateSubscriptionSourceUpdate
} from "./subscription-sources";
import type {
  AggregatedSubscriptionSources,
  ClashFragment,
  Env,
  PersonalRuleSet,
  ProxyProfile,
  Repository,
  RuleProviderSource,
  SubscriptionSource
} from "./types";
import { applyCorsHeaders, errorResponse, isHttpUrl, jsonResponse, textResponse } from "./utils";

interface AppContext {
  repository: Repository;
  fetchFn: typeof fetch;
  upstreamRulesetUrl?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const context: AppContext = {
      repository: new D1Repository(env.DB),
      fetchFn: (input, init) => fetch(input, init),
      upstreamRulesetUrl: env.UPSTREAM_RULESET_URL
    };
    return handleRequest(request, context);
  }
};

export async function handleRequest(request: Request, context: AppContext): Promise<Response> {
  try {
    if (request.method === "OPTIONS") {
      const headers = new Headers();
      applyCorsHeaders(headers);
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    const pathname = trimTrailingSlash(url.pathname);

    if (pathname === "" || pathname === "/") {
      return jsonResponse({
        service: "v2ray-worker",
        endpoints: {
          adminConsole: "/admin",
          health: "/health",
          tokens: "/api/admin/tokens",
          proxies: "/api/admin/proxies",
          subscriptionSources: "/api/admin/subscription-sources",
          ruleSets: "/api/admin/rule-sets",
          clash: "/api/subscription/clash",
          clashInline: "/api/subscription/clash-inline",
          providers: "/api/subscription/providers",
          uriList: "/api/subscription/uri-list",
          base64: "/api/subscription/base64",
          shadowsocks: "/api/subscription/shadowsocks"
        }
      });
    }

    if (pathname === "/health" && request.method === "GET") {
      return jsonResponse({ ok: true });
    }

    if (pathname === "/admin" && request.method === "GET") {
      return textResponse(renderAdminPage(), {
        headers: {
          "content-type": "text/html; charset=utf-8"
        }
      });
    }

    if (pathname.startsWith("/api/admin/")) {
      return handleAdminRequest(request, pathname, context);
    }

    if (pathname.startsWith("/api/subscription/")) {
      return handleSubscriptionRequest(request, pathname, context);
    }

    return errorResponse(404, "Route not found");
  } catch (error) {
    return errorResponse(500, "Unexpected server error", getErrorMessage(error));
  }
}

async function handleAdminRequest(
  request: Request,
  pathname: string,
  context: AppContext
): Promise<Response> {
  const resource = pathname.replace("/api/admin/", "");
  if (resource.startsWith("proxies")) {
    return handleProxyAdmin(request, resource, context.repository);
  }
  if (resource.startsWith("tokens")) {
    return handleTokenAdmin(request, resource, context.repository);
  }
  if (resource.startsWith("subscription-sources")) {
    return handleSubscriptionSourceAdmin(request, resource, context.repository);
  }
  if (resource.startsWith("rule-sets")) {
    return handleRuleSetAdmin(request, resource, context.repository);
  }
  return errorResponse(404, "Admin route not found");
}

async function handleProxyAdmin(
  request: Request,
  resource: string,
  repository: Repository
): Promise<Response> {
  const requiredScope = request.method === "GET" ? "proxies:read" : "proxies:write";
  const token = await authorize(request, repository, requiredScope);
  if (!token) {
    return errorResponse(401, "Unauthorized for proxy management");
  }

  const id = getResourceId(resource, "proxies");
  if (request.method === "GET" && !id) {
    const data = await repository.listProxyProfiles();
    return jsonResponse({ data });
  }
  if (request.method === "POST" && !id) {
    const body = validateProxyProfileInput(await readJson(request));
    const data = await repository.createProxyProfile(body);
    return jsonResponse({ data }, { status: 201 });
  }
  if (!id) {
    return errorResponse(405, "Method not allowed");
  }
  if (request.method === "GET") {
    const data = await repository.getProxyProfile(id);
    return data ? jsonResponse({ data }) : errorResponse(404, "Proxy profile not found");
  }
  if (request.method === "PUT") {
    const body = validateProxyProfileUpdate(await readJson(request));
    const data = await repository.updateProxyProfile(id, body);
    return data ? jsonResponse({ data }) : errorResponse(404, "Proxy profile not found");
  }
  if (request.method === "DELETE") {
    const deleted = await repository.deleteProxyProfile(id);
    return deleted ? new Response(null, { status: 204 }) : errorResponse(404, "Proxy profile not found");
  }
  return errorResponse(405, "Method not allowed");
}

async function handleTokenAdmin(
  request: Request,
  resource: string,
  repository: Repository
): Promise<Response> {
  const requiredScope = request.method === "GET" ? "tokens:read" : "tokens:write";
  const token = await authorize(request, repository, requiredScope);
  if (!token) {
    return errorResponse(401, "Unauthorized for token management");
  }

  const id = getResourceId(resource, "tokens");
  if (request.method === "GET" && !id) {
    const data = await repository.listAdminTokens();
    return jsonResponse({ data: data.map(serializeAdminToken) });
  }
  if (request.method === "POST" && !id) {
    const body = validateAdminTokenInput(await readJson(request));
    const data = await repository.createAdminToken(body);
    return jsonResponse({ data: serializeAdminToken(data) }, { status: 201 });
  }
  if (!id) {
    return errorResponse(405, "Method not allowed");
  }
  if (request.method === "GET") {
    const data = await repository.getAdminToken(id);
    return data ? jsonResponse({ data: serializeAdminToken(data) }) : errorResponse(404, "Token not found");
  }
  if (request.method === "PUT") {
    const body = validateAdminTokenUpdate(await readJson(request));
    const data = await repository.updateAdminToken(id, body);
    return data ? jsonResponse({ data: serializeAdminToken(data) }) : errorResponse(404, "Token not found");
  }
  if (request.method === "DELETE") {
    const deleted = await repository.deleteAdminToken(id);
    return deleted ? new Response(null, { status: 204 }) : errorResponse(404, "Token not found");
  }
  return errorResponse(405, "Method not allowed");
}

async function handleRuleSetAdmin(
  request: Request,
  resource: string,
  repository: Repository
): Promise<Response> {
  const requiredScope = request.method === "GET" ? "rules:read" : "rules:write";
  const token = await authorize(request, repository, requiredScope);
  if (!token) {
    return errorResponse(401, "Unauthorized for personal rule set management");
  }

  const id = getResourceId(resource, "rule-sets");
  if (request.method === "GET" && !id) {
    const data = await repository.listPersonalRuleSets();
    return jsonResponse({ data });
  }
  if (request.method === "POST" && !id) {
    const body = validateRuleSetInput(await readJson(request));
    const data = await repository.createPersonalRuleSet(body);
    return jsonResponse({ data }, { status: 201 });
  }
  if (!id) {
    return errorResponse(405, "Method not allowed");
  }
  if (request.method === "GET") {
    const data = await repository.getPersonalRuleSet(id);
    return data ? jsonResponse({ data }) : errorResponse(404, "Personal rule set not found");
  }
  if (request.method === "PUT") {
    const body = validateRuleSetUpdate(await readJson(request));
    const data = await repository.updatePersonalRuleSet(id, body);
    return data ? jsonResponse({ data }) : errorResponse(404, "Personal rule set not found");
  }
  if (request.method === "DELETE") {
    const deleted = await repository.deletePersonalRuleSet(id);
    return deleted ? new Response(null, { status: 204 }) : errorResponse(404, "Personal rule set not found");
  }
  return errorResponse(405, "Method not allowed");
}

async function handleSubscriptionSourceAdmin(
  request: Request,
  resource: string,
  repository: Repository
): Promise<Response> {
  const requiredScope = request.method === "GET" ? "sources:read" : "sources:write";
  const token = await authorize(request, repository, requiredScope);
  if (!token) {
    return errorResponse(401, "Unauthorized for subscription source management");
  }

  const id = getResourceId(resource, "subscription-sources");
  if (request.method === "GET" && !id) {
    const data = await repository.listSubscriptionSources();
    return jsonResponse({ data });
  }
  if (request.method === "POST" && !id) {
    const body = validateSubscriptionSourceInput(await readJson(request));
    const data = await repository.createSubscriptionSource(body);
    return jsonResponse({ data }, { status: 201 });
  }
  if (!id) {
    return errorResponse(405, "Method not allowed");
  }
  if (request.method === "GET") {
    const data = await repository.getSubscriptionSource(id);
    return data ? jsonResponse({ data }) : errorResponse(404, "Subscription source not found");
  }
  if (request.method === "PUT") {
    const body = validateSubscriptionSourceUpdate(await readJson(request));
    const data = await repository.updateSubscriptionSource(id, body);
    return data ? jsonResponse({ data }) : errorResponse(404, "Subscription source not found");
  }
  if (request.method === "DELETE") {
    const deleted = await repository.deleteSubscriptionSource(id);
    return deleted ? new Response(null, { status: 204 }) : errorResponse(404, "Subscription source not found");
  }
  return errorResponse(405, "Method not allowed");
}

async function handleSubscriptionRequest(
  request: Request,
  pathname: string,
  context: AppContext
): Promise<Response> {
  if (request.method !== "GET") {
    return errorResponse(405, "Method not allowed");
  }

  const auth = await authorizeWithToken(request, context.repository, "subscriptions:read", true);
  if (!auth) {
    return errorResponse(401, "Unauthorized for subscription access");
  }

  const url = new URL(request.url);
  const upstreamUrl = url.searchParams.get("upstream") || context.upstreamRulesetUrl;
  if (!upstreamUrl || !isHttpUrl(upstreamUrl)) {
    return errorResponse(400, "A valid upstream ruleset URL is required");
  }

  const subscription = await loadSubscriptionData(context, upstreamUrl);
  if (subscription instanceof Response) {
    return subscription;
  }

  const { upstream, enabledProxies, enabledRuleSets, personalFragments, thirdPartySources } = subscription;
  const thirdPartyUriClashProxies = thirdPartySources.uris.map((uri) => parseProxyUri(uri));
  const clashProxies = [
    ...enabledProxies.map(buildClashProxy),
    ...thirdPartyUriClashProxies,
    ...thirdPartySources.clashProxies
  ];

  if (pathname === "/api/subscription/clash") {
    const plan = buildRuleProviderPlan(createRuleProviderSources(upstream, enabledRuleSets, personalFragments));
    const providerBaseUrl = new URL("/api/subscription/providers", request.url).toString();
    const mergedConfig = mergeClashWithRuleProviders(
      upstream,
      personalFragments,
      clashProxies,
      plan,
      providerBaseUrl,
      auth.token,
      upstreamUrl
    );
    return textResponse(serializeClashConfig(mergedConfig), {
      headers: {
        "content-type": "application/yaml; charset=utf-8"
      }
    });
  }

  if (pathname === "/api/subscription/clash-inline") {
    const mergedConfig = mergeClashFragments(upstream, personalFragments, clashProxies);
    return textResponse(serializeClashConfig(mergedConfig), {
      headers: {
        "content-type": "application/yaml; charset=utf-8"
      }
    });
  }

  if (pathname.startsWith("/api/subscription/providers/")) {
    return handleRuleProviderRequest(pathname, upstream, enabledRuleSets, personalFragments);
  }

  const enabledUris = [...enabledProxies.map((proxy) => proxy.uri), ...thirdPartySources.uris];
  if (pathname === "/api/subscription/uri-list") {
    return textResponse(`${enabledUris.join("\n")}\n`, {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    });
  }

  if (pathname === "/api/subscription/base64") {
    return textResponse(btoa(enabledUris.join("\n")), {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    });
  }

  if (pathname === "/api/subscription/shadowsocks") {
    const shadowsocksUris = enabledProxies
      .filter((proxy) => proxy.type === "ss")
      .map((proxy) => proxy.uri);
    return textResponse(btoa(shadowsocksUris.join("\n")), {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    });
  }

  return errorResponse(404, "Subscription route not found");
}

async function loadSubscriptionData(
  context: AppContext,
  upstreamUrl: string
): Promise<
  | Response
  | {
      upstream: ClashFragment;
      enabledProxies: ProxyProfile[];
      enabledRuleSets: PersonalRuleSet[];
      personalFragments: ClashFragment[];
      thirdPartySources: AggregatedSubscriptionSources;
    }
> {
  const [upstreamResponse, proxies, ruleSets, subscriptionSources] = await Promise.all([
    context.fetchFn(upstreamUrl),
    context.repository.listProxyProfiles(),
    context.repository.listPersonalRuleSets(),
    context.repository.listSubscriptionSources()
  ]);

  if (!upstreamResponse.ok) {
    return errorResponse(502, "Failed to fetch upstream ruleset", {
      upstreamUrl,
      status: upstreamResponse.status
    });
  }

  const upstreamText = await upstreamResponse.text();
  const enabledRuleSets = ruleSets.filter((ruleSet) => ruleSet.enabled);
  const enabledSubscriptionSources = subscriptionSources.filter((source) => source.enabled);
  let thirdPartySources: AggregatedSubscriptionSources;

  try {
    thirdPartySources = await loadThirdPartySubscriptionSources(enabledSubscriptionSources, context.fetchFn);
  } catch (error) {
    return errorResponse(502, "Failed to fetch one of the third-party subscription sources", getErrorMessage(error));
  }

  return {
    upstream: parseUpstreamFragment(upstreamText),
    enabledProxies: proxies.filter((proxy) => proxy.enabled),
    enabledRuleSets,
    personalFragments: enabledRuleSets.map(parsePersonalRuleFragment),
    thirdPartySources
  };
}

function handleRuleProviderRequest(
  pathname: string,
  upstream: ClashFragment,
  enabledRuleSets: PersonalRuleSet[],
  personalFragments: ClashFragment[]
): Response {
  const resource = pathname.replace("/api/subscription/providers/", "");
  const sources = createRuleProviderSources(upstream, enabledRuleSets, personalFragments);
  const plan = buildRuleProviderPlan(sources);
  const sourceRun = findProviderRun(resource, plan.runs);

  if (!sourceRun) {
    return errorResponse(404, "Rule provider not found");
  }

  return textResponse(serializeRuleProviderPayload(sourceRun), {
    headers: {
      "content-type": "application/yaml; charset=utf-8"
    }
  });
}

function createRuleProviderSources(
  upstream: ClashFragment,
  enabledRuleSets: PersonalRuleSet[],
  personalFragments: ClashFragment[]
): RuleProviderSource[] {
  const sources: RuleProviderSource[] = [];
  for (const [index, fragment] of personalFragments.entries()) {
    if (fragment.rules.length === 0) {
      continue;
    }
    sources.push({
      sourceKind: "rule-set",
      sourceId: enabledRuleSets[index].id,
      sourceName: enabledRuleSets[index].name,
      rules: fragment.rules,
      defaultTarget: "Proxy"
    });
  }
  if (upstream.rules.length > 0) {
    sources.push({
      sourceKind: "upstream",
      sourceId: "default",
      sourceName: "upstream",
      rules: upstream.rules,
      defaultTarget: "Proxy"
    });
  }
  return sources;
}

function findProviderRun(resource: string, runs: ReturnType<typeof buildRuleProviderPlan>["runs"]) {
  const segments = resource.split("/");
  if (segments[0] === "upstream" && segments.length === 2) {
    const index = Number(segments[1]);
    return runs.find((run) => run.sourceKind === "upstream" && run.index === index) || null;
  }
  if (segments[0] === "rule-sets" && segments.length === 3) {
    const sourceId = decodeURIComponent(segments[1]);
    const index = Number(segments[2]);
    return runs.find(
      (run) => run.sourceKind === "rule-set" && run.sourceId === sourceId && run.index === index
    ) || null;
  }
  return null;
}

function getResourceId(resource: string, collectionName: string): string | null {
  const prefix = `${collectionName}/`;
  if (!resource.startsWith(prefix)) {
    return null;
  }
  return resource.slice(prefix.length) || null;
}

async function readJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Request content-type must be application/json");
  }
  return request.json();
}

function trimTrailingSlash(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
