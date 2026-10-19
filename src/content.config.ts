import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const GROUPS = ["Temeller", "AWS", "AI ve CLI", "Yayın rotaları", "Kapanış"] as const;

const bolumler = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/bolumler" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: z.enum(GROUPS),
    order: z.number(),
    authors: z.array(z.string()).default([]),
  }),
});

export const collections = { bolumler };
