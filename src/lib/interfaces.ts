export interface CrossrefAuthor {
  given: string;
  family: string;
  sequence?: "first" | "additional";
  affiliation?: { name: string }[];
}

export interface CrossRefResponse {
  totalPages: number | null;
  items: CrossrefItem[];
}

export interface CrossrefResource {
  URL: string;
}

export interface CrossrefItem {
  title: string[];
  author?: CrossrefAuthor[];
  DOI: string;
  URL: string;
  publisher?: string;
  abstract?: string;
  type?: string;
  created?: {
    "date-parts": number[][];
  };
  issued?: {
    "date-parts": number[][];
  };
  deposited?: {
    "date-parts": number[][];
    "date-time"?: string;
    timestamp?: number;
  };
  "published-online"?: {
    "date-parts": number[][];
  };
  "published-print"?: {
    "date-parts": number[][];
  };
  "container-title"?: string[];
  "is-referenced-by-count"?: number;
  "reference-count"?: number;
  page?: string;
  ISBN?: string[];
  language?: string;
  resource?: { primary: CrossrefResource };
  score?: number;
}

export interface UnifiedArticle {
  id: string; // DOI or OpenAlex ID
  title: string;
  authors: string[];
  abstract: string | null;
  url: string | null;
  source: string; // "Crossref", "OpenAlex", etc.
  date: string | null; // ISO string or YYYY string
  score: number; // Normalized to 0-100 or raw, used for sorting
  doi: string | null;
  journal: string | null;
  type?: string | null;
  citationCount?: number | null;
  openAccess?: boolean | null;
}

export interface UnifiedSearchResponse {
  items: UnifiedArticle[];
  totalPages: number | null;
  totalResults: number;
}
