// components/filterAndSorting.tsx
"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Filter, ChevronDown, ChevronUp, User, BookOpen, Unlock, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

interface FilterAndSortingProps {
  sort: string;
  onSortChange: (value: string) => void;
  sources: string;
  onSourcesChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  author?: string;
  onAuthorChange?: (value: string) => void;
  journal?: string;
  onJournalChange?: (value: string) => void;
  oaOnly?: boolean;
  onOaOnlyChange?: (value: boolean) => void;
  docType?: string;
  onDocTypeChange?: (value: string) => void;
  onClearFilters?: () => void;
}

export const FilterAndSorting = ({
  sort,
  onSortChange,
  sources,
  onSourcesChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  author = "",
  onAuthorChange,
  journal = "",
  onJournalChange,
  oaOnly = false,
  onOaOnlyChange,
  docType = "all",
  onDocTypeChange,
  onClearFilters,
}: FilterAndSortingProps) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === "tr" ? tr : enUS;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  // Keep state synced up to higher level when popover closes or date changes
  useEffect(() => {
    if (date?.from) {
      const fromStr = format(date.from, "yyyy-MM-dd");
      if (fromStr !== startDate) onStartDateChange(fromStr);
    } else if (!date?.from && startDate) {
      onStartDateChange("");
    }

    if (date?.to) {
      const toStr = format(date.to, "yyyy-MM-dd");
      if (toStr !== endDate) onEndDateChange(toStr);
    } else if (!date?.to && endDate) {
      onEndDateChange("");
    }
  }, [date, startDate, endDate, onStartDateChange, onEndDateChange]);

  const toggleSource = (source: string) => {
    const current = sources.split(",").filter(Boolean);
    if (current.includes(source)) {
      onSourcesChange(current.filter((s) => s !== source).join(","));
    } else {
      onSourcesChange([...current, source].join(","));
    }
  };

  const hasCrossref = sources.includes("crossref");
  const hasOpenAlex = sources.includes("openalex");

  const hasActiveFilters = Boolean(startDate || endDate || author || journal || oaOnly || (docType && docType !== "all"));

  const handleClear = () => {
    setDate(undefined);
    onStartDateChange("");
    onEndDateChange("");
    if (onAuthorChange) onAuthorChange("");
    if (onJournalChange) onJournalChange("");
    if (onOaOnlyChange) onOaOnlyChange(false);
    if (onDocTypeChange) onDocTypeChange("all");
    if (onClearFilters) onClearFilters();
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
      {/* Top Bar: Sort, Date Range, Sources, Advanced Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-shrink-0">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t("sort_by")}</label>
            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger className="w-44 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder={t("sort_by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">{t("relevance")}</SelectItem>
                <SelectItem value="created">{t("newest")}</SelectItem>
                <SelectItem value="issued">{t("issued_date")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-shrink-0 z-50">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t("date_range")}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[260px] justify-start text-left font-normal bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd MMM yyyy", { locale: currentLocale })} -{" "}
                        {format(date.to, "dd MMM yyyy", { locale: currentLocale })}
                      </>
                    ) : (
                      format(date.from, "dd MMM yyyy", { locale: currentLocale })
                    )
                  ) : (
                    <span>{t("select_date")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={currentLocale}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t("sources")}</label>
            <div className="flex gap-3 items-center h-10">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  checked={hasCrossref}
                  onChange={() => toggleSource("crossref")}
                />
                Crossref
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  checked={hasOpenAlex}
                  onChange={() => toggleSource("openalex")}
                />
                OpenAlex
              </label>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`mt-4 md:mt-0 flex items-center gap-1.5 border-dashed ${
              showAdvanced || hasActiveFilters
                ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <Filter size={14} />
            <span>{showAdvanced ? t("filters.hide_advanced") : t("filters.advanced")}</span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Advanced Filters Expandable Panel */}
      {showAdvanced && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Author Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <User size={13} className="text-blue-500" />
              {t("filters.author")}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => onAuthorChange && onAuthorChange(e.target.value)}
              placeholder={t("filters.author_placeholder")}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
            />
          </div>

          {/* Journal Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <BookOpen size={13} className="text-purple-500" />
              {t("filters.journal")}
            </label>
            <input
              type="text"
              value={journal}
              onChange={(e) => onJournalChange && onJournalChange(e.target.value)}
              placeholder={t("filters.journal_placeholder")}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
            />
          </div>

          {/* Document Type Select */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Filter size={13} className="text-amber-500" />
              {t("filters.doc_type")}
            </label>
            <Select value={docType} onValueChange={(val) => onDocTypeChange && onDocTypeChange(val)}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-sm">
                <SelectValue placeholder={t("filters.doc_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.doc_types.all")}</SelectItem>
                <SelectItem value="journal-article">{t("filters.doc_types.journal_article")}</SelectItem>
                <SelectItem value="book-chapter">{t("filters.doc_types.book_chapter")}</SelectItem>
                <SelectItem value="proceedings-article">{t("filters.doc_types.proceedings")}</SelectItem>
                <SelectItem value="preprint">{t("filters.doc_types.preprint")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Open Access Toggle & Clear Button */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
              <input
                type="checkbox"
                checked={oaOnly}
                onChange={(e) => onOaOnlyChange && onOaOnlyChange(e.target.checked)}
                className="rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <Unlock size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs sm:text-sm">{t("filters.oa_only")}</span>
            </label>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1"
              >
                <RotateCcw size={13} />
                {t("filters.clear")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
