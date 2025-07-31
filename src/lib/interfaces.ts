export interface CrossrefAuthor {
  given?: string;
  family?: string;
}

export interface CrossrefItem {
  title: string[];
  author?: CrossrefAuthor[];
  DOI: string;
  URL: string;
  publisher?: string;
  type?: string;
  "published-online"?: {
    "date-parts": number[][];
  };
  "published-print"?: {
    "date-parts": number[][];
  };
  "container-title"?: string[];
}
