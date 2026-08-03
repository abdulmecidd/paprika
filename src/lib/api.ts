import axios from "axios";
import { UnifiedSearchResponse } from "./interfaces";

const API_BASE_URL = "/api/search";

export const searchArticles = async (
  query: string,
  rows: number = 10,
  page: number = 1,
  sort: string = "relevance",
  sources?: string,
  startDate?: string,
  endDate?: string,
  author?: string,
  journal?: string,
  oaOnly?: boolean,
  docType?: string
): Promise<UnifiedSearchResponse> => {
  const params = new URLSearchParams({
    q: query,
    rows: rows.toString(),
    page: page.toString(),
    sort: sort,
  });

  if (sources) params.append("sources", sources);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (author) params.append("author", author);
  if (journal) params.append("journal", journal);
  if (oaOnly) params.append("oaOnly", "true");
  if (docType && docType !== "all") params.append("docType", docType);

  const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);

  return response.data;
};
