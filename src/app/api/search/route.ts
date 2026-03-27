import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { CrossrefItem, UnifiedArticle, UnifiedSearchResponse } from "@/lib/interfaces";

const CROSSREF_API = "https://api.crossref.org/v1/works";
const OPENALEX_API = "https://api.openalex.org/works";

// Helper to normalize Crossref
function normalizeCrossref(item: CrossrefItem): UnifiedArticle {
  const authors = item.author?.map(a => `${a.given} ${a.family}`) || [];
  let date = null;
  if (item.issued && item.issued["date-parts"] && item.issued["date-parts"][0]) {
    const parts = item.issued["date-parts"][0];
    date = parts.join("-");
  } else if (item.created && item.created["date-parts"] && item.created["date-parts"][0]) {
    date = item.created["date-parts"][0].join("-");
  }

  // Crossref abstract sometimes comes as XML/HTML snippet (e.g., <jats:p>...</jats:p>)
  // A simple regex to strip basic XML tags or just pass it through
  let abstract = item.abstract || null;
  if (abstract) {
    abstract = abstract.replace(/<[^>]*>?/gm, '');
  }

  return {
    id: item.DOI,
    title: item.title?.[0] || "Untitled",
    authors,
    abstract,
    url: item.URL || (item.resource?.primary?.URL) || null,
    source: "Crossref",
    date,
    score: item.score || 0,
    doi: item.DOI,
    journal: item["container-title"]?.[0] || null,
    type: item.type ? item.type.replace("-", " ") : null,
    citationCount: item["is-referenced-by-count"] ?? null,
    openAccess: null,
  };
}

// Helper to normalize OpenAlex
function normalizeOpenAlex(item: any): UnifiedArticle {
  const authors = item.authorships?.map((a: any) => a.author.display_name) || [];
  
  // OpenAlex provides abstract_inverted_index. We need to reconstruct it if we want the full text.
  let abstract = null;
  if (item.abstract_inverted_index) {
    const index = item.abstract_inverted_index;
    const words: string[] = [];
    for (const [word, positions] of Object.entries(index)) {
      (positions as number[]).forEach(pos => {
        words[pos] = word;
      });
    }
    abstract = words.join(" ");
  }

  return {
    id: item.id,
    title: item.title || "Untitled",
    authors,
    abstract,
    url: item.doi || item.id,
    source: "OpenAlex",
    date: item.publication_date || item.publication_year?.toString() || null,
    score: item.relevance_score || 0,
    doi: item.doi ? item.doi.replace("https://doi.org/", "") : null,
    journal: item.primary_location?.source?.display_name || null,
    type: item.type ? item.type.replace("-", " ") : null,
    citationCount: item.cited_by_count ?? null,
    openAccess: item.open_access?.is_oa ?? null,
  };
}


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const rows = parseInt(searchParams.get("rows") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "relevance";
  
  // Custom filters
  const sources = searchParams.get("sources"); // e.g., "crossref,openalex"
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!q) {
    return NextResponse.json({ items: [], totalPages: 0, totalResults: 0 });
  }

  const offset = (page - 1) * rows;
  const halfRows = Math.ceil(rows / 2); // Split rows between sources roughly if both are enabled

  const useCrossref = !sources || sources.includes("crossref");
  const useOpenAlex = !sources || sources.includes("openalex");

  const promises = [];

  // 1. Crossref
  if (useCrossref) {
    let crossrefRows = useOpenAlex ? halfRows : rows;
    
    // Crossref filter mapping
    let filterStr = "";
    const filters = [];
    if (startDate) filters.push(`from-pub-date:${startDate}`);
    if (endDate) filters.push(`until-pub-date:${endDate}`);
    if (filters.length > 0) {
      filterStr = `&filter=${filters.join(",")}`;
    }

    const crossrefUrl = `${CROSSREF_API}?query.title=${encodeURIComponent(q)}&rows=${crossrefRows}&offset=${offset/2}&sort=${sort}${filterStr}`;
    promises.push(
      axios.get(crossrefUrl).then(res => ({
        source: "crossref",
        data: res.data.message
      })).catch(err => {
        console.error("Crossref API Error:", err.message);
        return { source: "crossref", data: { items: [], "total-results": 0 } };
      })
    );
  }

  // 2. OpenAlex
  if (useOpenAlex) {
    let openAlexRows = useCrossref ? halfRows : rows;
    
    // OpenAlex filter mapping
    const filters = [];
    if (startDate) filters.push(`from_publication_date:${startDate}`);
    if (endDate) filters.push(`to_publication_date:${endDate}`);
    if (q) filters.push(`default.search:${encodeURIComponent(q)}`); // OpenAlex semantic/keyword search
    
    let filterStr = filters.length > 0 ? `filter=${filters.join(",")}` : "";
    
    // OpenAlex uses page instead of offset
    const openAlexUrl = `${OPENALEX_API}?${filterStr}&per-page=${openAlexRows}&page=${page}`;
    
    promises.push(
      axios.get(openAlexUrl).then(res => ({
        source: "openalex",
        data: res.data
      })).catch(err => {
        console.error("OpenAlex API Error:", err.message);
        return { source: "openalex", data: { results: [], meta: { count: 0 } } };
      })
    );
  }

  const results = await Promise.all(promises);

  let unifiedItems: UnifiedArticle[] = [];
  let totalResults = 0;

  for (const result of results) {
    if (result.source === "crossref") {
      const items = result.data.items as CrossrefItem[];
      unifiedItems = [...unifiedItems, ...items.map(normalizeCrossref)];
      totalResults += result.data["total-results"] || 0;
    } else if (result.source === "openalex") {
      const items = result.data.results as any[];
      unifiedItems = [...unifiedItems, ...items.map(normalizeOpenAlex)];
      totalResults += result.data.meta?.count || 0;
    }
  }

  // Sort unified items. Both APIs return relevance scores, though they might be on different scales.
  // If sort parameter is relevance, let's sort descending by score.
  if (sort === "relevance") {
    unifiedItems.sort((a, b) => b.score - a.score);
  } else if (sort === "created" || sort === "issued") {
    // Basic date sort (newest first)
    unifiedItems.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  const totalPages = Math.ceil(totalResults / rows);

  return NextResponse.json({
    items: unifiedItems,
    totalPages,
    totalResults
  });
}
