import { CrossrefItem } from "@/lib/interfaces";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  Calendar,
  Globe,
  BookOpen,
  ExternalLink,
  FileText,
} from "lucide-react";

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

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-start gap-2">
          <BookOpen size={20} className="text-blue-600 mt-1" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          <FileText size={16} />
          {publisher}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-sm space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span>Yayın Tarihi: {createdDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gray-500" />
          <span>Dil: {language}</span>
        </div>

        {sourceUrl && (
          <div className="flex items-center gap-2">
            <ExternalLink size={16} className="text-gray-500" />
            <a
              href={sourceUrl}
              className="text-blue-600 hover:underline"
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
          className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
