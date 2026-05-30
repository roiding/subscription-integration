import { beforeEach, describe, expect, it } from "vitest";
import { parse } from "yaml";
import { sha256Hex } from "../src/auth";
import { handleRequest } from "../src/index";
import type { TokenRecord } from "../src/types";
import { InMemoryRepository } from "./helpers";

describe("subscription-integration", () => {
  let repository: InMemoryRepository;
  let proxyAdminToken: string;
  let rulesAdminToken: string;
  let sourcesAdminToken: string;
  let tokenAdminToken: string;
  let subscriptionToken: string;

  beforeEach(async () => {
    repository = new InMemoryRepository();
    proxyAdminToken = "proxy-admin-token";
    rulesAdminToken = "rules-admin-token";
    sourcesAdminToken = "sources-admin-token";
    tokenAdminToken = "token-admin-token";
    subscriptionToken = "subscription-token";

    const tokens: Array<[string, string[]]> = [
      [proxyAdminToken, ["proxies:read", "proxies:write"]],
      [rulesAdminToken, ["rules:read", "rules:write"]],
      [sourcesAdminToken, ["sources:read", "sources:write"]],
      [tokenAdminToken, ["tokens:read", "tokens:write"]],
      [subscriptionToken, ["subscriptions:read"]]
    ];

    for (const [plain, scopes] of tokens) {
      repository.seedToken(await createTokenRecord(plain, scopes));
    }
  });

  it("rejects proxy admin access without a valid token", async () => {
    const response = await send(
      new Request("https://worker.test/api/admin/proxies", {
        method: "GET"
      })
    );

    expect(response.status).toBe(401);
  });

  it("serves the admin console html", async () => {
    const response = await send(
      new Request("https://worker.test/admin", {
        method: "GET"
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    const body = await response.text();
    expect(body).toContain("Subscription Atelier");
    expect(body).toContain('data-tab-button="nodes"');
    expect(body).toContain('id="proxy-editor"');
  });

  it("creates and lists proxy profiles with scoped auth", async () => {
    const createResponse = await send(
      new Request("https://worker.test/api/admin/proxies", {
        method: "POST",
        headers: {
          authorization: `Bearer ${proxyAdminToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: "HK-WS",
          uri: "vless://11111111-1111-1111-1111-111111111111@example.com:443?security=tls&type=ws&host=edge.example.com&path=%2Fws#HK-WS",
          priority: 10,
          tags: ["hk", "ws"]
        })
      })
    );

    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as { data: { id: string } };

    const listResponse = await send(
      new Request("https://worker.test/api/admin/proxies", {
        method: "GET",
        headers: {
          authorization: `Bearer ${proxyAdminToken}`
        }
      })
    );

    expect(listResponse.status).toBe(200);
    const listJson = (await listResponse.json()) as { data: Array<{ id: string; tags: string[] }> };
    expect(listJson.data).toHaveLength(1);
    expect(listJson.data[0].id).toBe(created.data.id);
    expect(listJson.data[0].tags).toEqual(["hk", "ws"]);
  });

  it("keeps proxy and rule permissions separate", async () => {
    const response = await send(
      new Request("https://worker.test/api/admin/rule-sets", {
        method: "POST",
        headers: {
          authorization: `Bearer ${proxyAdminToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: "Streaming",
          format: "rule-lines",
          content: "DOMAIN-SUFFIX,netflix.com,Proxy"
        })
      })
    );

    expect(response.status).toBe(401);
  });

  it("creates and lists third-party subscription sources with scoped auth", async () => {
    const createResponse = await send(
      new Request("https://worker.test/api/admin/subscription-sources", {
        method: "POST",
        headers: {
          authorization: `Bearer ${sourcesAdminToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: "Airport Base64 Feed",
          url: "https://airport.example/subscription.txt",
          format: "base64",
          priority: 30,
          enabled: true
        })
      })
    );

    expect(createResponse.status).toBe(201);

    const listResponse = await send(
      new Request("https://worker.test/api/admin/subscription-sources", {
        method: "GET",
        headers: {
          authorization: `Bearer ${sourcesAdminToken}`
        }
      })
    );

    expect(listResponse.status).toBe(200);
    const listJson = (await listResponse.json()) as { data: Array<{ name: string; format: string }> };
    expect(listJson.data).toHaveLength(1);
    expect(listJson.data[0].name).toBe("Airport Base64 Feed");
    expect(listJson.data[0].format).toBe("base64");
  });

  it("creates and lists admin tokens without exposing hashes", async () => {
    const createResponse = await send(
      new Request("https://worker.test/api/admin/tokens", {
        method: "POST",
        headers: {
          authorization: `Bearer ${tokenAdminToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: "viewer-token",
          tokenSha256: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          scopes: ["subscriptions:read"],
          enabled: true
        })
      })
    );

    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as { data: Record<string, unknown> };
    expect(created.data).not.toHaveProperty("tokenSha256");

    const listResponse = await send(
      new Request("https://worker.test/api/admin/tokens", {
        method: "GET",
        headers: {
          authorization: `Bearer ${tokenAdminToken}`
        }
      })
    );

    expect(listResponse.status).toBe(200);
    const listJson = (await listResponse.json()) as { data: Array<Record<string, unknown>> };
    expect(listJson.data.some((item) => item.name === "viewer-token")).toBe(true);
    expect(listJson.data.every((item) => !("tokenSha256" in item))).toBe(true);
  });

  it("builds clash yaml with worker-hosted rule providers", async () => {
    await repository.createProxyProfile({
      name: "SS-US",
      uri: "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@1.2.3.4:8388#SS-US",
      priority: 20,
      enabled: true
    });
    await repository.createPersonalRuleSet({
      name: "Video",
      format: "rule-lines",
      content: "DOMAIN-SUFFIX,example-video.com,Proxy",
      priority: 1,
      enabled: true
    });

    const response = await send(
      new Request(
        `https://worker.test/api/subscription/clash?token=${subscriptionToken}&upstream=${encodeURIComponent("https://rules.example/config.yaml")}`
      ),
      {
        fetchFn: async () =>
          new Response(
            [
              "mixed-port: 7891",
              "proxy-groups:",
              "  - name: Existing",
              "    type: select",
              "    proxies:",
              "      - DIRECT",
              "rules:",
              "  - MATCH,Existing"
            ].join("\n")
          )
      }
    );

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain("name: SS-US");
    expect(body).toContain("RULE-SET,rule-set-video-1,Proxy");
    expect(body).toContain("rule-providers:");
    expect(body).toContain("/api/subscription/providers/rule-sets/");
    expect(body).toContain("token=subscription-token");
    expect(body).toContain("name: Proxy");
    expect(body).toContain("mixed-port: 7891");
  });

  it("avoids creating a self-referencing Proxy group when rules target Proxy", async () => {
    await repository.createProxyProfile({
      name: "SS-US",
      uri: "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@1.2.3.4:8388#SS-US",
      enabled: true
    });

    const response = await send(
      new Request(
        `https://worker.test/api/subscription/clash?token=${subscriptionToken}&upstream=${encodeURIComponent("https://rules.example/config.yaml")}`
      ),
      {
        fetchFn: async () => new Response("rules:\n  - DOMAIN-SUFFIX,example.com,Proxy\n")
      }
    );

    expect(response.status).toBe(200);
    const body = await response.text();
    const config = parse(body) as { "proxy-groups"?: Array<{ name?: string; proxies?: string[] }> };
    const proxyGroup = config["proxy-groups"]?.find((group) => group.name === "Proxy");

    expect(proxyGroup).toBeTruthy();
    expect(proxyGroup?.proxies).not.toContain("Proxy");
  });

  it("returns provider payloads for personal rule sets", async () => {
    const ruleSet = await repository.createPersonalRuleSet({
      name: "Video",
      format: "rule-lines",
      content: "DOMAIN-SUFFIX,example-video.com,Proxy\nIP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
      priority: 1,
      enabled: true
    });

    const response = await send(
      new Request(
        `https://worker.test/api/subscription/providers/rule-sets/${ruleSet.id}/0?token=${subscriptionToken}&upstream=${encodeURIComponent("https://rules.example/config.yaml")}`
      ),
      {
        fetchFn: async () => new Response("rules:\n  - MATCH,Proxy")
      }
    );

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain("payload:");
    expect(body).toContain("DOMAIN-SUFFIX,example-video.com");
    expect(body).not.toContain("DOMAIN-SUFFIX,example-video.com,Proxy");
  });

  it("keeps expanded clash yaml available as an inline fallback", async () => {
    await repository.createPersonalRuleSet({
      name: "Video",
      format: "rule-lines",
      content: "DOMAIN-SUFFIX,example-video.com,Proxy",
      enabled: true
    });

    const response = await send(
      new Request(
        `https://worker.test/api/subscription/clash-inline?token=${subscriptionToken}&upstream=${encodeURIComponent("https://rules.example/config.yaml")}`
      ),
      {
        fetchFn: async () => new Response("rules:\n  - MATCH,Proxy")
      }
    );

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain("DOMAIN-SUFFIX,example-video.com,Proxy");
  });

  it("creates fallback target groups for clash-inline when custom rules reference missing groups", async () => {
    await repository.createProxyProfile({
      name: "SS-US",
      uri: "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@1.2.3.4:8388#SS-US",
      enabled: true
    });

    const response = await send(
      new Request(
        `https://worker.test/api/subscription/clash-inline?token=${subscriptionToken}&upstream=${encodeURIComponent("https://rules.example/config.yaml")}`
      ),
      {
        fetchFn: async () => new Response("rules:\n  - DOMAIN-SUFFIX,example.com,Work\n")
      }
    );

    expect(response.status).toBe(200);
    const body = await response.text();
    const config = parse(body) as { "proxy-groups"?: Array<{ name?: string; proxies?: string[] }> };
    const workGroup = config["proxy-groups"]?.find((group) => group.name === "Work");

    expect(workGroup).toBeTruthy();
    expect(workGroup?.proxies).toEqual(["Proxy", "DIRECT", "REJECT"]);
  });

  it("returns base64 shadowsocks-only subscriptions", async () => {
    await repository.createProxyProfile({
      name: "SS-Node",
      uri: "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@1.2.3.4:8388#SS-Node",
      enabled: true
    });
    await repository.createProxyProfile({
      name: "Trojan-Node",
      uri: "trojan://password@example.com:443?security=tls#Trojan-Node",
      enabled: true
    });

    const response = await send(
      new Request(
        `https://worker.test/api/subscription/shadowsocks?token=${subscriptionToken}&upstream=${encodeURIComponent("https://rules.example/list.txt")}`
      ),
      {
        fetchFn: async () => new Response("DOMAIN-SUFFIX,example.com,Proxy\n")
      }
    );

    expect(response.status).toBe(200);
    const decoded = atob(await response.text());
    expect(decoded).toContain("ss://");
    expect(decoded).not.toContain("trojan://");
  });

  it("aggregates third-party subscription source nodes with personal nodes", async () => {
    await repository.createProxyProfile({
      name: "Local-Trojan",
      uri: "trojan://password@example.com:443?security=tls#Local-Trojan",
      enabled: true
    });
    await repository.createSubscriptionSource({
      name: "Remote Base64",
      url: "https://airport.example/feed.txt",
      format: "base64",
      enabled: true
    });

    const response = await send(
      new Request(
        `https://worker.test/api/subscription/base64?token=${subscriptionToken}&upstream=${encodeURIComponent("https://rules.example/config.yaml")}`
      ),
      {
        fetchFn: async (input) => {
          const url = String(input);
          if (url === "https://rules.example/config.yaml") {
            return new Response("rules:\n  - MATCH,Proxy\n");
          }
          if (url === "https://airport.example/feed.txt") {
            return new Response(
              btoa("ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@1.2.3.4:8388#Remote-SS\nvless://11111111-1111-1111-1111-111111111111@edge.example.com:443?security=tls&type=ws&host=cdn.example.com&path=%2Fws#Remote-VLESS")
            );
          }
          throw new Error(`unexpected fetch: ${url}`);
        }
      }
    );

    expect(response.status).toBe(200);
    const decoded = atob(await response.text());
    expect(decoded).toContain("trojan://password@example.com:443?security=tls#Local-Trojan");
    expect(decoded).toContain("ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@1.2.3.4:8388#Remote-SS");
    expect(decoded).toContain("vless://11111111-1111-1111-1111-111111111111@edge.example.com:443?security=tls&type=ws&host=cdn.example.com&path=%2Fws#Remote-VLESS");
  });

  async function send(
    request: Request,
    overrides: Partial<{
      fetchFn: typeof fetch;
    }> = {}
  ): Promise<Response> {
    return handleRequest(request, {
      repository,
      fetchFn:
        overrides.fetchFn ||
        (async () => {
          throw new Error("fetchFn not mocked");
        }),
      upstreamRulesetUrl: "https://rules.example/default.yaml"
    });
  }
});

async function createTokenRecord(plainToken: string, scopes: string[]): Promise<TokenRecord> {
  const digest = await sha256Hex(plainToken);
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: plainToken,
    tokenSha256: digest,
    scopes,
    enabled: true,
    notes: null,
    createdAt: now,
    updatedAt: now
  };
}
