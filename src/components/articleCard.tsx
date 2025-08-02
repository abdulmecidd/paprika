import { CrossrefItem } from "@/lib/interfaces";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Calendar, Globe, ExternalLink, FileText } from "lucide-react";
import { truncuateText } from "@/lib/funcs";

interface ArticleCardProps {
  item: CrossrefItem;
}

export const ArticleCard = ({ item }: ArticleCardProps) => {
  const title = item.title?.[0] || "Başlık bulunamadı";
  const publisher = item.publisher || "Yayınevi bilgisi yok";
  const language = item.language?.toUpperCase() || "Dil bilgisi yok";
  const url = item.URL || "#";
  const sourceUrl = item.resource?.primary?.URL;
  const createdDate =
    item.created?.["date-parts"]?.[0]?.join("-") || "Tarih yok";
  const citationCount = item["is-referenced-by-count"] ?? null;

  return (
    <Card
      className="rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-all duration-300
      dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-gray-900"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-start gap-2 dark:text-gray-100">
          {truncuateText(title, 60)}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1 flex items-center gap-1 dark:text-gray-400">
          <FileText size={16} />
          {publisher}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-sm space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
          <span>Yayın Tarihi: {createdDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gray-500 dark:text-gray-400" />
          <span>Dil: {language}</span>
        </div>

        {citationCount !== null && (
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-500 dark:text-gray-400" />
            <span>Atıf: {citationCount} kez</span>
          </div>
        )}

        {sourceUrl && (
          <div className="flex items-center gap-2">
            <ExternalLink
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <a
              href={sourceUrl}
              className="text-gray-600 hover:underline dark:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kaynak bağlantısı
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <a
          href={url}
          className="inline-flex items-center gap-2 text-sm text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-700 transition
            dark:bg-gray-700 dark:hover:bg-gray-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          DOI Görüntüle
        </a>
      </CardFooter>
    </Card>
  );
};
