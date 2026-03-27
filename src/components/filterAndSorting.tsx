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
import { Calendar as CalendarIcon } from "lucide-react";
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
}: FilterAndSortingProps) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === "tr" ? tr : enUS;

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

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t("sort_by")}</label>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-48 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
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
        <div className={cn("grid gap-2")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
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

      <div className="flex-shrink-0 ml-auto flex gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t("sources")}</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                checked={hasCrossref}
                onChange={() => toggleSource("crossref")}
              />
              Crossref
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
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
      </div>
    </div>
  );
};
