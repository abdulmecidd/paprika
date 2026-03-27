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
  endDate?: string
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

  const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);

  return response.data;
};
