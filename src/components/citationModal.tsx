"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UnifiedArticle } from "@/lib/interfaces";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Quote, Copy, Check } from "lucide-react";

interface CitationModalProps {
  item: UnifiedArticle;
}

export const CitationModal = ({ item }: CitationModalProps) => {
  const { t } = useTranslation();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<"bibtex" | "apa" | "mla" | "ieee" | "chicago">("bibtex");

  const title = item.title || "Untitled";
  const journal = item.journal || "Academic Repository";
  const year = item.date ? item.date.split("-")[0] : "n.d.";
  const doi = item.doi || "";
  const authors = item.authors && item.authors.length > 0 ? item.authors : ["Anonymous"];

  // Generate citation string by format
  const generateCitation = (formatKey: string): string => {
    const authorStr = authors.join(", ");
    const bibAuthors = authors.join(" and ");

    switch (formatKey) {
      case "bibtex": {
        const citeKey = (authors[0] || "article").split(" ").pop()?.toLowerCase() + year + (title.split(" ")[0]?.toLowerCase() || "");
        return `@article{${citeKey},
  title = {${title}},
  author = {${bibAuthors}},
  journal = {${journal}},
  year = {${year}}${doi ? `,\n  doi = {${doi}}` : ""}${item.url ? `,\n  url = {${item.url}}` : ""}
}`;
      }
      case "apa": {
        return `${authorStr} (${year}). ${title}. ${journal}.${doi ? ` https://doi.org/${doi}` : ""}`;
      }
      case "mla": {
        return `${authorStr}. "${title}." ${journal}, ${year}.`;
      }
      case "ieee": {
        return `${authorStr}, "${title}," ${journal}, ${year}.`;
      }
      case "chicago": {
        return `${authorStr}. "${title}." ${journal} (${year}).`;
      }
      default:
        return title;
    }
  };

  const currentText = generateCitation(activeFormat);

  const handleCopy = (fmt: string) => {
    const textToCopy = generateCitation(fmt);
    navigator.clipboard.writeText(textToCopy);
    setCopiedFormat(fmt);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs font-medium">
          <Quote size={14} className="text-orange-500" />
          {t("cite")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Quote className="text-orange-500" size={18} />
            {t("citation_modal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("citation_modal.description")}
          </p>

          {/* Format Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-gray-200 dark:border-gray-700 pb-2">
            {(["bibtex", "apa", "mla", "ieee", "chicago"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFormat === fmt
                    ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {t(`citation_modal.formats.${fmt}`)}
              </button>
            ))}
          </div>

          {/* Code/Text Output Box */}
          <div className="relative group">
            <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-x-auto border border-gray-800 leading-relaxed max-h-60">
              {currentText}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleCopy(activeFormat)}
              className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
            >
              {copiedFormat === activeFormat ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">{t("citation_modal.copied")}</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>{t("citation_modal.copy")}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
