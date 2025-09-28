"use client";

import { useState, useEffect } from "react";
import { CrossrefItem } from "@/lib/interfaces";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Calendar, Globe, FileText, Users, BookOpen } from "lucide-react";
import { truncuateText } from "@/lib/funcs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ArticleCardProps {
  item: CrossrefItem;
}

export const ArticleCard = ({ item }: ArticleCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [open, setOpen] = useState(false);

  const title = item.title?.[0] || "Başlık bulunamadı";
  const publisher = item.publisher || "Yayınevi bilgisi yok";
  const language = item.language?.toUpperCase() || "Dil bilgisi yok";
  const url = item.URL || "#";
  const citationCount = item["is-referenced-by-count"] ?? null;
  const authors =
    item.author?.map((a) => `${a.given} ${a.family}`).join(", ") ||
    "Yazar bilgisi yok";
  const containerTitle = item["container-title"]?.[0] || null;
  const page = item.page || null;
  const isbn = item.ISBN?.[0] || null;
  const type = item.type?.replace("-", " ") || "Bilgi yok";

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-gray-900">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1">
          <CardTitle className="text-xl font-semibold dark:text-gray-100">
            {truncuateText(title, 60)}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1 flex items-center gap-1 dark:text-gray-400">
            <FileText size={16} />
            {publisher}
          </CardDescription>
        </div>
        <span className="mt-2 sm:mt-0 inline-block text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
          {type.toLocaleUpperCase()}
        </span>
      </CardHeader>

      <CardContent className="text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-4 flex-wrap">
          <div title="Yayın Tarihi" className="flex items-center gap-1">
            <Calendar size={16} />
            {item.created?.["date-parts"]?.[0].join("-") || "Tarih yok"}
          </div>
          <div title="Dil" className="flex items-center gap-1">
            <Globe size={16} />
            {language}
          </div>
          {citationCount !== null && (
            <div title="Atıf Sayısı" className="flex items-center gap-1">
              <FileText size={16} />
              {citationCount}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          {showDetails ? "Detayları Gizle" : "Detayları Göster"}
        </button>

        {showDetails && (
          <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Users size={16} /> Yazarlar: {truncuateText(authors, 80)}
            </div>
            {containerTitle && (
              <div className="flex items-center gap-2">
                <BookOpen size={16} /> Kitap/Dergi: {containerTitle}{" "}
                {page && `(Sayfa: ${page})`}
              </div>
            )}
            {isbn && (
              <div className="flex items-center gap-2">
                <FileText size={16} /> ISBN: {isbn}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Tam Makaleyi Görüntüle</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{truncuateText(title, 60)}</DialogTitle>
              <DialogDescription>
                Makale içeriği aşağıdaki alanda görüntüleniyor. Eğer sayfa
                yüklenmezse
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 ml-1"
                >
                  buraya tıklayın
                </a>
                .
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 h-[70vh] relative">
              <iframe
                id={`iframe-${item.DOI}`}
                src={url}
                className="w-full h-full border rounded-md"
                title={title}
                sandbox="allow-scripts allow-same-origin allow-popups"
              ></iframe>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => {
                  const iframe = document.getElementById(`iframe-${item.DOI}`);
                  if (iframe && iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                  }
                }}
              >
                Tam Ekran
              </Button>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
