import axios from "axios";
import { CrossrefItem } from "./interfaces";

const API_BASE_URL = "https://api.crossref.org/v1";

export const searchArticles = async (
  query: string,
  rows: number = 10,
  page: number = 1,
  sort: string = "relevance"
): Promise<{
  items: CrossrefItem[];
  totalPages: number | null;
}> => {
  const offset = (page - 1) * rows;

  const response = await axios.get(
    `${API_BASE_URL}/works?query.title=${encodeURIComponent(
      query
    )}&rows=${rows}&offset=${offset}&sort=${sort}`
  );

  const totalResults = response.data.message["total-results"];
  const items: CrossrefItem[] = response.data.message.items;
  const totalPages = Math.ceil(totalResults / rows);

  return {
    items,
    totalPages,
  };
};
