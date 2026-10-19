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
 * 'free-ireland' = keyrings, fridge magnets and small flat pieces (ruler, comb), 'standard' = everything else.
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

/** Collection, hand delivery and delivery times, shared by the product, delivery and service pages. */
export const DELIVERY = {
  collectionAreas: 'Dublin 24, Dublin 8 or Dublin city centre',
  handDeliveryMin: 100,
  handDeliveryArea: 'the Dublin area, for example Blanchardstown, Swords or Dún Laoghaire',
  times: [
    { region: 'Ireland', days: '3-5 days' },
    { region: 'European Union', days: '5-7 days' },
    { region: 'Rest of the world', days: '7-14 days' },
  ],
};

/**
 * Small copies of the photos, made after the build by scripts/thumbnails.mjs:
 * 'sm' = 200px wide (gallery thumbnails), 'md' = 640px wide (product cards).
 * They do not exist in `npm run dev`, so <img> tags fall back to the full photo.
 */
export function thumbUrl(src: string, size: 'sm' | 'md') {
  const name = src.split('/').pop()!.replace(/\.[^.]+$/, '');
  return `/images/thumbs/${size}/${name}.webp`;
}

export const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

/** Products and the categories that have at least one product, in menu order. */
export async function getCatalog() {
  const products = (await getCollection('products')).map((entry) => ({
    slug: entry.id,
    name: entry.data.name,
    tagline: entry.data.tagline,
    fromPrice: entry.data.fromPrice,
    icon: entry.data.icon,
    category: entry.data.category,
    freeIreland: entry.data.shipping === 'free-ireland',
    thumb: entry.data.images.find((src) => !isVideo(src)) ?? null,
  }));
  const categories = (await getCollection('categories'))
    .map((entry) => ({
      slug: entry.id,
      name: entry.data.name,
      order: entry.data.order,
      count: products.filter((p) => p.category === entry.id).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return { products, categories };
}

export type CatalogProduct = Awaited<ReturnType<typeof getCatalog>>['products'][number];
