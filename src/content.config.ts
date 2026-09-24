import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    heading: z.string(),
    category: z.string(),
    tagline: z.string(),
    icon: z.enum(['nameLights', 'shadowBox', 'dateBalloon', 'figurines', 'generic']).default('generic'),
    images: z.array(z.string()).default([]),
    fromPrice: z.number(),

    // Etsy listing for this product. When set, a "Buy on Etsy" button
    // appears under the order form. Leave empty for items not listed there.
    etsyUrl: z.string().url().optional(),

    priceMode: z.enum(['single', 'matrix']),
    optionsLabel: z.string().default('Options'),
    options: z
      .array(z.object({ label: z.string(), price: z.number() }))
      .optional(),

    sizes: z.array(z.string()).optional(),
    tiers: z
      .array(
        z.object({
          key: z.string(),
          label: z.string(),
          desc: z.string().optional(),
          prices: z.array(z.number()),
        })
      )
      .optional(),

    customFields: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          placeholder: z.string().optional(),
          required: z.boolean().default(false),
        })
      )
      .default([]),

    // Slugs from the details library. Plain text still works as a fallback.
    details: z.array(z.string()).default([]),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    order: z.number().default(99),
  }),
});

const details = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/details' }),
  schema: z.object({
    text: z.string(),
  }),
});

export const collections = { products, categories, details };
