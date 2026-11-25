import type { MetadataRoute } from "next";
import { events } from "@/data/events";
import { eventTerms } from "@/data/terms";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    ...events.map((event) => ({
      url: `${site.url}/events/${event.slug}`,
      priority: 0.8,
    })),
    ...eventTerms.map((terms) => ({
      url: `${site.url}/events/${terms.slug}/terms`,
      priority: 0.4,
    })),
  ];
}
