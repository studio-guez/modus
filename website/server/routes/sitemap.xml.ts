interface PageEntry {
  slug: string;
  modified: string | null;
}

interface SitemapData {
  genericPages: PageEntry[];
  projects: PageEntry[];
  reports: PageEntry[];
  tools: PageEntry[];
  tags: PageEntry[];
}

function buildUrlEntry(
  loc: string,
  opts: { modified?: string | null; changefreq: string; priority: number },
): string {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    opts.modified ? `    <lastmod>${opts.modified}</lastmod>` : null,
    `    <changefreq>${opts.changefreq}</changefreq>`,
    `    <priority>${opts.priority.toFixed(1)}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export default defineEventHandler(
  async (
    event: Parameters<typeof defineEventHandler>[0] extends (
      e: infer E,
    ) => unknown
      ? E
      : never,
  ) => {
    const config = useRuntimeConfig(event);
    const apiBase =
      (config.apiBaseUrlServer as string) ||
      (config.public.apiBaseUrl as string);
    const baseUrl = apiBase.endsWith("/") ? apiBase : apiBase + "/";

    const data: SitemapData = await fetch(`${baseUrl}sitemap-data.json`).then(
      (r) => r.json(),
    );

    const requestUrl = getRequestURL(event);
    const siteBase = `${requestUrl.protocol}//${requestUrl.host}`;

    const staticEntries = [
      { path: "/", changefreq: "weekly", priority: 1.0 },
      { path: "/projects", changefreq: "weekly", priority: 0.8 },
      { path: "/bibliotheque", changefreq: "weekly", priority: 0.8 },
      { path: "/medias", changefreq: "weekly", priority: 0.8 },
      { path: "/proposer-un-projet", changefreq: "monthly", priority: 0.7 },
      { path: "/boite-a-outils", changefreq: "monthly", priority: 0.7 },
    ];

    const dynamicGroups = [
      {
        entries: data.genericPages ?? [],
        prefix: "/",
        changefreq: "yearly",
        priority: 0.5,
      },
      {
        entries: data.projects ?? [],
        prefix: "/project/",
        changefreq: "monthly",
        priority: 0.7,
      },
      {
        entries: data.reports ?? [],
        prefix: "/rapport/",
        changefreq: "monthly",
        priority: 0.6,
      },
      {
        entries: data.tools ?? [],
        prefix: "/boite-a-outils/",
        changefreq: "yearly",
        priority: 0.6,
      },
      {
        entries: data.tags ?? [],
        prefix: "/tag/",
        changefreq: "weekly",
        priority: 0.4,
      },
    ];

    const urlElements: string[] = [
      ...staticEntries.map((e) =>
        buildUrlEntry(`${siteBase}${e.path}`, {
          changefreq: e.changefreq,
          priority: e.priority,
        }),
      ),
      ...dynamicGroups.flatMap(({ entries, prefix, changefreq, priority }) =>
        entries.map((e) =>
          buildUrlEntry(`${siteBase}${prefix}${e.slug}`, {
            modified: e.modified,
            changefreq,
            priority,
          }),
        ),
      ),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urlElements,
      "</urlset>",
    ].join("\n");

    setHeader(event, "Content-Type", "application/xml; charset=utf-8");
    return xml;
  },
);
