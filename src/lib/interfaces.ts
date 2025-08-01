export interface CrossrefAuthor {
  given?: string;
  family?: string;
}
export interface CrossrefResource {
  URL?: string;
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
  language?: string;
  resource?: { primary: CrossrefResource };
  "published-online"?: {
    "date-parts": number[][];
  };
  "published-print"?: {
    "date-parts": number[][];
  };
  "container-title"?: string[];
}
