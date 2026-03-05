export type TenantSlug = string;

export type TenantContext = {
  slug: TenantSlug;
  hostname: string;
};

export function parseTenantFromHostname(hostname: string, rootDomain: string): TenantContext | null {
  const host = hostname.toLowerCase().split(":")[0];
  if (host === rootDomain) return null;
  if (!host.endsWith("." + rootDomain)) return null;
  const slug = host.slice(0, -(rootDomain.length + 1));
  if (!slug) return null;
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(slug)) return null;
  return { slug, hostname: host };
}

export function isReservedTenantSlug(slug: string): boolean {
  return ["www", "api", "app", "admin", "static"].includes(slug);
}
