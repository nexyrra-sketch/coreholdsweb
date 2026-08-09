import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

type Route = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** The Arabic counterpart, where one exists. */
  ar?: string;
};

const routes: Route[] = [
  { path: "/", priority: 1, changeFrequency: "monthly", ar: "/ar" },
  { path: "/method", priority: 0.9, changeFrequency: "monthly", ar: "/ar/method" },
  { path: "/ownership", priority: 0.9, changeFrequency: "monthly", ar: "/ar/ownership" },
  { path: "/register", priority: 0.9, changeFrequency: "monthly" },
  { path: "/specimen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ledger", priority: 0.85, changeFrequency: "monthly" },
  { path: "/capabilities", priority: 0.8, changeFrequency: "monthly", ar: "/ar/capabilities" },
  { path: "/audit", priority: 0.8, changeFrequency: "yearly", ar: "/ar/audit" },
  { path: "/standard", priority: 0.8, changeFrequency: "monthly" },
  { path: "/manifesto", priority: 0.7, changeFrequency: "yearly" },
  { path: "/brand", priority: 0.6, changeFrequency: "monthly" },
  { path: "/system", priority: 0.6, changeFrequency: "monthly" },
];

const arabicOnly = ["/ar", "/ar/method", "/ar/ownership", "/ar/capabilities", "/ar/audit"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const english = routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: route.ar
      ? {
          languages: {
            "en-AE": `${site.url}${route.path}`,
            "ar-AE": `${site.url}${route.ar}`,
          },
        }
      : undefined,
  }));

  const arabic = arabicOnly.map((path) => {
    const parent = routes.find((r) => r.ar === path);
    return {
      url: `${site.url}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: (parent?.priority ?? 0.7) - 0.1,
      alternates: parent
        ? {
            languages: {
              "en-AE": `${site.url}${parent.path}`,
              "ar-AE": `${site.url}${path}`,
            },
          }
        : undefined,
    };
  });

  return [...english, ...arabic];
}
