import type { Shop } from '../types/shop';

export async function fetchShops(
  filters: { city?: string; type?: string } = {},
): Promise<Shop[]> {
  const params = new URLSearchParams();
  if (filters.city) params.set('city', filters.city);
  if (filters.type) params.set('type', filters.type);
  const query = params.toString();
  const res = await fetch(`/api/shops${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error(`Failed to load shops: ${res.status}`);
  return res.json() as Promise<Shop[]>;
}
