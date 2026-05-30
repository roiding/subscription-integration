import type { Repository, TokenRecord } from "./types";

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function authorize(
  request: Request,
  repository: Repository,
  requiredScope: string,
  allowQueryToken = false
): Promise<TokenRecord | null> {
  const token = extractToken(request, allowQueryToken);
  if (!token) {
    return null;
  }
  const digest = await sha256Hex(token);
  const record = await repository.findTokenByDigest(digest);
  if (!record || !record.enabled) {
    return null;
  }
  if (record.scopes.includes("admin:*") || record.scopes.includes(requiredScope)) {
    return record;
  }
  return null;
}

export async function authorizeWithToken(
  request: Request,
  repository: Repository,
  requiredScope: string,
  allowQueryToken = false
): Promise<{ record: TokenRecord; token: string } | null> {
  const token = extractToken(request, allowQueryToken);
  if (!token) {
    return null;
  }
  const digest = await sha256Hex(token);
  const record = await repository.findTokenByDigest(digest);
  if (!record || !record.enabled) {
    return null;
  }
  if (record.scopes.includes("admin:*") || record.scopes.includes(requiredScope)) {
    return { record, token };
  }
  return null;
}

export function extractToken(request: Request, allowQueryToken = false): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }
  if (!allowQueryToken) {
    return null;
  }
  const url = new URL(request.url);
  return url.searchParams.get("token");
}
