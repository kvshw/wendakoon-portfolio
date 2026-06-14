export type NewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  snippet: string;
  link: string;
};

const SEARCH_QUERIES = [
  "artificial intelligence healthcare",
  "adaptive AI machine learning",
  "clinical AI regulation FDA",
  "large language models engineering",
  "AI agents autonomous systems",
  "privacy preserving machine learning",
  "EU AI Act healthcare",
  "AI infrastructure inference",
];

const GOOGLE_NEWS_RSS =
  "https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en";

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .trim();
}

function parseRssItems(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  for (const block of itemBlocks) {
    const title = decodeXml(
      block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""
    );
    const link = decodeXml(
      block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? ""
    );
    const pubDate = decodeXml(
      block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? ""
    );
    const source = decodeXml(
      block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "News"
    );
    const description = decodeXml(
      block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? ""
    )
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!title || !link) continue;

    items.push({
      title,
      source,
      publishedAt: pubDate,
      snippet: description.slice(0, 280),
      link,
    });
  }

  return items;
}

function dedupeNews(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  const out: NewsItem[] = [];

  for (const item of items) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

export async function fetchRecentAiNews(limit = 12): Promise<NewsItem[]> {
  const queries = [...SEARCH_QUERIES].sort(() => Math.random() - 0.5).slice(0, 5);
  const results: NewsItem[] = [];

  await Promise.all(
    queries.map(async (query) => {
      try {
        const url = GOOGLE_NEWS_RSS.replace(
          "{query}",
          encodeURIComponent(query)
        );
        const res = await fetch(url, {
          next: { revalidate: 3600 },
          headers: { "User-Agent": "KavishwaContentEngine/1.0" },
        });
        if (!res.ok) return;
        const xml = await res.text();
        results.push(...parseRssItems(xml).slice(0, 4));
      } catch {
        // Skip failed feeds; generation still works without news context.
      }
    })
  );

  return dedupeNews(results).slice(0, limit);
}

export function formatNewsForPrompt(items: NewsItem[]): string {
  if (items.length === 0) {
    return "No live news headlines were retrieved. Use your knowledge of recent AI developments, but avoid inventing specific news events or dates.";
  }

  return items
    .map(
      (item, i) =>
        `${i + 1}. "${item.title}" (${item.source}, ${item.publishedAt || "recent"})\n   ${item.snippet}\n   ${item.link}`
    )
    .join("\n\n");
}
