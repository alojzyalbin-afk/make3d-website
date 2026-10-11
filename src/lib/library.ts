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

/** €7.20 instead of €7.2, but €36 stays €36. */
export function formatEuro(value: number) {
  return Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`;
}

/**
 * Delivery rates, same as the Etsy shipping profiles.
 * 'free-ireland' = keyrings and fridge magnets, 'standard' = everything else.
 * extra = what each additional item in the same order adds.
 */
export const SHIPPING = {
  'free-ireland': {
    badge: 'Free delivery in Ireland',
    rows: [
      { region: 'Ireland', price: 'Free' },
      { region: 'European Union', price: '€5', extra: '€5' },
      { region: 'Outside the EU', price: 'Message me first' },
    ],
  },
  standard: {
    badge: null,
    rows: [
      { region: 'Ireland', price: '€5', extra: '€5' },
      { region: 'European Union', price: '€10', extra: '€5' },
      { region: 'Rest of the world', price: '€15', extra: '€10' },
    ],
  },
} as const;

export type ShippingKey = keyof typeof SHIPPING;
