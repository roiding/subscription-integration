export function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  applyCorsHeaders(headers);
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers
  });
}

export function textResponse(text: string, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  applyCorsHeaders(headers);
  return new Response(text, {
    ...init,
    headers
  });
}

export function errorResponse(status: number, message: string, details?: unknown): Response {
  return jsonResponse(
    {
      error: {
        message,
        ...(details === undefined ? {} : { details })
      }
    },
    { status }
  );
}

export function applyCorsHeaders(headers: Headers): void {
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("access-control-allow-headers", "authorization,content-type");
}

export function normalizeBase64(input: string): string {
  const cleaned = input.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  const remainder = cleaned.length % 4;
  if (remainder === 0) {
    return cleaned;
  }
  return cleaned.padEnd(cleaned.length + (4 - remainder), "=");
}

export function decodeBase64(input: string): string {
  return atob(normalizeBase64(input));
}

export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function splitOnce(value: string, separator: string): [string, string] {
  const index = value.indexOf(separator);
  if (index === -1) {
    return [value, ""];
  }
  return [value.slice(0, index), value.slice(index + separator.length)];
}

export function parseJsonObject(value: string | null): Record<string, unknown> | null {
  if (!value) {
    return null;
  }
  const parsed = JSON.parse(value) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Expected JSON object");
  }
  return parsed as Record<string, unknown>;
}

export function parseJsonArray(value: string | null): string[] {
  if (!value) {
    return [];
  }
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Expected JSON array");
  }
  return parsed.map((item) => String(item));
}

export function asBoolean(value: unknown, defaultValue = true): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    return !["0", "false", "off", ""].includes(value.toLowerCase());
  }
  return defaultValue;
}

export function toNumber(value: unknown, fieldName: string, defaultValue?: number): number {
  if (value === undefined || value === null || value === "") {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`${fieldName} is required`);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a number`);
  }
  return parsed;
}

export function ensureString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

export function ensureOptionalString(value: unknown, fieldName: string): string | null {
  if (value === undefined) {
    return null;
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function ensureStringArray(value: unknown, fieldName: string): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value.map((item) => ensureString(item, `${fieldName} item`));
}

export function deepMerge<T extends Record<string, unknown>>(base: T, patch: Record<string, unknown>): T {
  const output: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      output[key] &&
      typeof output[key] === "object" &&
      !Array.isArray(output[key])
    ) {
      output[key] = deepMerge(
        output[key] as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      output[key] = value;
    }
  }
  return output as T;
}

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
