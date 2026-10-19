import { getCollection, type CollectionEntry } from "astro:content";
import { GROUPS } from "../content.config";

export type Bolum = CollectionEntry<"bolumler">;

export async function sortedBolumler(): Promise<Bolum[]> {
  const all = await getCollection("bolumler");
  return all.sort(
    (a, b) =>
      GROUPS.indexOf(a.data.group) - GROUPS.indexOf(b.data.group) || a.data.order - b.data.order,
  );
}

export function bolumHref(entry: Bolum): string {
  return `/${entry.id}.html`;
}
