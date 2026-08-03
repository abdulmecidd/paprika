import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { CrossrefItem, UnifiedArticle } from "@/lib/interfaces";

interface OpenAlexItem {
  id: string;
  title?: string;
  authorships?: Array<{ author: { display_name: string } }>;
  abstract_inverted_index?: Record<string, number[]>;
  doi?: string;
  publication_date?: string;
  publication_year?: number;
  relevance_score?: number;
  primary_location?: { source?: { display_name?: string } };
  type?: string;
  cited_by_count?: number;
  open_access?: { is_oa?: boolean };
  concepts?: Array<{ display_name: string; score?: number }>;
}
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

  // Crossref abstract sometimes comes as XML/HTML snippet
  let abstract = item.abstract || null;
  if (abstract) {
    abstract = abstract.replace(/<[^>]*>?/gm, '');
  }

  const concepts = item.subject ? item.subject.slice(0, 4) : [];

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
    concepts,
  };
}

// Helper to normalize OpenAlex
function normalizeOpenAlex(item: OpenAlexItem): UnifiedArticle {
  const authors = item.authorships?.map((a) => a.author.display_name) || [];
  
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

  const concepts = item.concepts
    ? item.concepts.slice(0, 4).map((c) => c.display_name)
    : [];

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
    concepts,
  };
}


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const rows = parseInt(searchParams.get("rows") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "relevance";
  
  // Custom filters
  const sources = searchParams.get("sources"); // e.g., "crossref,openalex"
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const author = searchParams.get("author");
  const journal = searchParams.get("journal");
  const oaOnly = searchParams.get("oaOnly") === "true";
  const docType = searchParams.get("docType"); // e.g., "journal-article", "book-chapter"

  // Detect DOI in query (e.g. 10.1038/s41586-020-2649-2 or https://doi.org/10.1038/...)
  let doiQuery: string | null = null;
  const cleanedQ = q.trim();
  if (cleanedQ.startsWith("10.") || cleanedQ.includes("doi.org/10.")) {
    doiQuery = cleanedQ.replace(/^https?:\/\/(dx\.)?doi\.org\//, "");
  }

  if (!q && !author && !journal && !doiQuery) {
    return NextResponse.json({ items: [], totalPages: 0, totalResults: 0 });
  }

  const offset = (page - 1) * rows;
  const halfRows = Math.ceil(rows / 2);

  const useCrossref = !sources || sources.includes("crossref");
  const useOpenAlex = !sources || sources.includes("openalex");

  const promises = [];

  // 1. Crossref
  if (useCrossref) {
    const crossrefRows = useOpenAlex ? halfRows : rows;
    
    let filterStr = "";
    const filters = [];
    if (startDate) filters.push(`from-pub-date:${startDate}`);
    if (endDate) filters.push(`until-pub-date:${endDate}`);
    if (oaOnly) filters.push(`is-oa:true`);
    if (docType && docType !== "all") filters.push(`type:${docType}`);
    if (filters.length > 0) {
      filterStr = `&filter=${filters.join(",")}`;
    }

    let crossrefUrl = `${CROSSREF_API}?rows=${crossrefRows}&offset=${offset/2}&sort=${sort}${filterStr}`;
    if (doiQuery) {
      crossrefUrl += `&query.doi=${encodeURIComponent(doiQuery)}`;
    } else {
      if (q) crossrefUrl += `&query.title=${encodeURIComponent(q)}`;
      if (author) crossrefUrl += `&query.author=${encodeURIComponent(author)}`;
      if (journal) crossrefUrl += `&query.container-title=${encodeURIComponent(journal)}`;
    }

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
    const openAlexRows = useCrossref ? halfRows : rows;
    
    const filters = [];
    if (startDate) filters.push(`from_publication_date:${startDate}`);
    if (endDate) filters.push(`to_publication_date:${endDate}`);
    if (oaOnly) filters.push(`is_oa:true`);
    if (docType && docType !== "all") {
      const openAlexTypeMap: Record<string, string> = {
        "journal-article": "article",
        "book-chapter": "book-chapter",
        "proceedings-article": "article",
        "preprint": "preprint",
      };
      filters.push(`type:${openAlexTypeMap[docType] || docType}`);
    }
    if (doiQuery) {
      filters.push(`doi:https://doi.org/${encodeURIComponent(doiQuery)}`);
    } else {
      if (q) filters.push(`default.search:${encodeURIComponent(q)}`);
      if (author) filters.push(`raw_author_name.search:${encodeURIComponent(author)}`);
      if (journal) filters.push(`primary_location.source.display_name.search:${encodeURIComponent(journal)}`);
    }
    
    const filterStr = filters.length > 0 ? `filter=${filters.join(",")}` : "";
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
      const items = result.data.results as OpenAlexItem[];
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
