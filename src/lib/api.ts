import axios from "axios";
import { CrossrefItem } from "./interfaces";

const API_BASE_URL = "https://api.crossref.org/v1";

export const searchArticles = async (
  query: string,
  rows: number = 20
): Promise<CrossrefItem[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/works?query.title=${query}&rows=${rows}`,
    {}
  );
  console.log(response.data);
  return response.data.message.items;
};
