"use client";

import { useState } from "react";
import { UnifiedArticle } from "@/lib/interfaces";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Calendar, FileText, Users, BookOpen, Quote, Unlock } from "lucide-react";
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
import { useTranslation } from "react-i18next";

interface ArticleCardProps {
  item: UnifiedArticle;
}

export const ArticleCard = ({ item }: ArticleCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const title = item.title || t("no_title");
  const source = item.source || t("unknown_source");
  const url = item.url || "#";
  const authors = item.authors.length > 0 ? item.authors.join(", ") : t("no_author");
  const journal = item.journal || null;
  const abstract = item.abstract || null;
  const citationCount = item.citationCount ?? null;
  const type = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : null;
  const isOA = item.openAccess === true;

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-gray-900">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1">
          <CardTitle className="text-xl font-semibold dark:text-gray-100">
            {truncuateText(title, 80)}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-2 flex flex-wrap items-center gap-2 dark:text-gray-400">
            <span className="font-semibold px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {source}
            </span>
            {type && (
              <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {type}
              </span>
            )}
            {isOA && (
              <span className="flex items-center gap-1 font-medium px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                <Unlock size={12} /> {t("open_access")}
              </span>
            )}
            {item.doi && <span className="text-xs">DOI: {item.doi}</span>}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-4 flex-wrap mb-2">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {item.date || t("date_missing")}
          </div>
          {citationCount !== null && (
            <div className="flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400">
              <Quote size={16} />
              {t("citation_count", { count: citationCount })}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          {showDetails ? t("hide_details") : t("show_details")}
        </button>

        {showDetails && (
          <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl space-y-4 border border-gray-100 dark:border-gray-700 text-sm">
            <div className="flex items-start gap-3">
              <Users size={16} className="mt-0.5 shrink-0 text-gray-400" /> 
              <div className="flex-1">
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{t("authors")}</span>
                <span className="text-gray-700 dark:text-gray-300">{authors}</span>
              </div>
            </div>
            
            {journal && (
              <div className="flex items-start gap-3">
                <BookOpen size={16} className="mt-0.5 shrink-0 text-gray-400" /> 
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{t("journal")}</span>
                  <span className="text-gray-700 dark:text-gray-300">{journal}</span>
                </div>
              </div>
            )}
            
            {abstract && (
              <div className="flex items-start gap-3">
                <FileText size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{t("abstract")}</span>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">{truncuateText(abstract, 350)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="w-full sm:w-auto">{t("view_article")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{truncuateText(title, 60)}</DialogTitle>
              <DialogDescription>
                <div className="mb-2">
                  {t("dialog.external_source", { source })}
                </div>
                <div>{t("dialog.warning")}</div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="default"
                onClick={() => window.open(url, "_blank")}
                disabled={url === "#"}
              >
                {t("dialog.go_to_article")}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t("dialog.close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};


