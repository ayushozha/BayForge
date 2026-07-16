const LOCAL_ORIGIN = "https://bayforge.local";

export function safeReturnPath(value: unknown, fallback = "/dashboard"): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\r\n]/.test(value)
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, LOCAL_ORIGIN);
    if (url.origin !== LOCAL_ORIGIN) return fallback;
    const decodedPath = decodeURIComponent(url.pathname);
    if (decodedPath.startsWith("//") || decodedPath.includes("\\")) {
      return fallback;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function loginPath(returnTo: unknown): string {
  return `/login?from=${encodeURIComponent(safeReturnPath(returnTo))}`;
}
