import { getCollection } from 'astro:content';

/**
 * Products store category and details as slugs pointing at the
 * /categories and /details libraries. If a slug has no matching file
 * (e.g. it was typed in by hand, or the library entry was deleted),
 * the raw string is shown instead so nothing ever disappears.
 */

export async function getCategoryMap() {
  const cats = await getCollection('categories');
  return new Map(cats.map((c) => [c.id, c.data]));
}

export async function getDetailMap() {
  const items = await getCollection('details');
  return new Map(items.map((d) => [d.id, d.data.text]));
}

export function resolveCategory(slug: string, map: Map<string, { name: string }>) {
  return map.get(slug)?.name ?? slug;
}

export function resolveDetails(slugs: string[], map: Map<string, string>) {
  return slugs.map((s) => map.get(s) ?? s);
}
