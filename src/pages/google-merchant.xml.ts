import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SHIPPING } from '../lib/library';

/**
 * Google Merchant Center product feed (RSS 2.0 with the g: namespace).
 * Built from src/content/products at every build, so it never goes out of date.
 * Live address: https://make3d.ie/google-merchant.xml
 *
 * Target country: Ireland (prices in EUR, shipping rates for Ireland only).
 */

const SITE = 'https://make3d.ie';
const BRAND = 'make3d.ie';

// Google product category IDs, checked against Google's official taxonomy file (en-US).
// A product that is not listed here gets no category and Google assigns one itself.
const GOOGLE_CATEGORY: Record<string, string> = {
  'caduceus-keyring': '175', // Apparel & Accessories > Handbag & Wallet Accessories > Keychains
  'dublin-street-sign-keyring': '175',
  'fire-brigade-shield-keyring': '175',
  'irish-air-corps-rank-keyring': '175',
  'irish-army-rank-keyring': '175',
  'irish-navy-rank-keyring': '175',
  'irish-road-sign-keyring': '175',
  'personalised-name-keyring': '175',
  'personalised-medical-alert-keyring': '175',
  'star-of-life-keyring': '175',
  'dachshund-keyrings-set-of-5': '175',
  'personalised-kids-school-bag-tag': '5651', // Luggage & Bags > Luggage Accessories > Luggage Tags
  'dublin-street-sign-fridge-magnet': '5876', // Home & Garden > Decor > Refrigerator Magnets
  'irish-road-sign-fridge-magnet': '5876',
  'georgian-door-fridge-magnet': '5876',
  'dachshund-fridge-magnets-set-of-5': '5876',
  'dachshund-christmas-decorations-set-of-5': '3144', // Home & Garden > Decor > Seasonal & Holiday Decorations > Holiday Ornaments
  'personalised-christmas-baubles-set-of-3': '3144',
  'personalised-christmas-ornaments-set-of-2': '3144',
  'personalised-christmas-gift-tags-set-of-3': '8213', // Arts & Entertainment > Party & Celebration > Gift Giving > Gift Wrapping > Gift Tags & Labels
  'personalised-christmas-name-tags-set-of-3': '8213',
  'hohoho-light-up-sign': '596', // Home & Garden > Decor > Seasonal & Holiday Decorations
  'gnome-cottage-christmas-lantern': '596',
  'pumpkin-house-lantern': '596',
  'cursive-name-light': '4636', // Home & Garden > Lighting > Lamps
  'mini-barber-pole-lamp': '4636',
  'straight-razor-lamp': '4636',
  'pet-memorial-urn': '5607', // Religious & Ceremonial > Memorial Ceremony Supplies > Memorial Urns
  'dachshund-desk-organiser': '939', // Office Supplies > Filing & Organization > Desk Organizers
  'birth-announcement-shadow-box': '5922', // Home & Garden > Decor > Shadow Boxes
  'hot-air-balloon-birth-announcement': '696', // Home & Garden > Decor
  'georgian-door-desk-ornament': '696',
  'irish-mammy-wooden-spoon-plaque': '708', // Home & Garden > Decor > Decorative Plaques
  'large-custom-dublin-street-sign': '5885', // Home & Garden > Decor > Novelty Signs
  'large-custom-irish-road-sign': '5885',
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const money = (n: number) => `${n.toFixed(2)} EUR`;

/** Markdown body -> plain text for the description (Google allows up to 5000 characters). */
function plainText(tagline: string, body: string) {
  const parts: string[] = [tagline];
  for (const raw of body.split('\n')) {
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    line = line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/^[-+]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .trim();
    if (!line) continue;
    if (!/[.!?:]$/.test(line)) line += '.';
    parts.push(line);
  }
  let text = parts.join(' ').replace(/\s+/g, ' ');
  if (text.length > 4800) {
    text = text.slice(0, 4800);
    text = text.slice(0, Math.max(text.lastIndexOf('. '), 0) + 1) || text;
  }
  return text;
}

/** Postage to Ireland in euro, read from the same delivery table the product pages show. */
function irelandPostage(mode: keyof typeof SHIPPING) {
  const row = SHIPPING[mode].rows.find((r) => r.region === 'Ireland');
  const match = row?.price.match(/€(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0; // 'Free' and 'Free, built into the price' -> 0
}

export const GET: APIRoute = async () => {
  const products = (await getCollection('products')).sort((a, b) => a.id.localeCompare(b.id));
  const categories = new Map((await getCollection('categories')).map((c) => [c.id, c.data.name]));

  const items = products.map((p) => {
    const d = p.data;
    const photos = d.images.filter((src) => /\.(jpe?g|png|webp|gif)$/i.test(src));
    const [main, ...more] = photos;
    const lines = [
      `<g:id>${esc(p.id)}</g:id>`,
      `<g:title>${esc(d.name)}</g:title>`,
      `<g:description>${esc(plainText(d.tagline, p.body ?? ''))}</g:description>`,
      `<g:link>${SITE}/shop/${p.id}/</g:link>`,
    ];
    if (main) lines.push(`<g:image_link>${SITE}${esc(main)}</g:image_link>`);
    for (const extra of more.slice(0, 10)) lines.push(`<g:additional_image_link>${SITE}${esc(extra)}</g:additional_image_link>`);
    lines.push(
      `<g:condition>new</g:condition>`,
      `<g:availability>in_stock</g:availability>`,
      `<g:price>${money(d.fromPrice)}</g:price>`,
      `<g:brand>${BRAND}</g:brand>`,
      `<g:identifier_exists>no</g:identifier_exists>`,
    );
    const cat = GOOGLE_CATEGORY[p.id];
    if (cat) lines.push(`<g:google_product_category>${cat}</g:google_product_category>`);
    const type = categories.get(d.category);
    if (type) lines.push(`<g:product_type>${esc(type)}</g:product_type>`);
    lines.push(
      `<g:shipping><g:country>IE</g:country><g:service>Standard</g:service><g:price>${money(irelandPostage(d.shipping))}</g:price></g:shipping>`,
    );
    return `<item>\n      ${lines.join('\n      ')}\n    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>make3d.ie - personalised 3D printed gifts made in Dublin</title>
    <link>${SITE}</link>
    <description>Personalised keyrings, fridge magnets, signs, lamps and Christmas decorations, 3D printed to order in Dublin, Ireland.</description>
    ${items.join('\n    ')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
