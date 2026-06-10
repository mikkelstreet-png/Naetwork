import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1, alternates: { languages: { en: site.url, da: `${site.url}/da` } } },
    { url: `${site.url}/da`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/da/privatliv`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
