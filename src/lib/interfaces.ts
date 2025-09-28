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
