"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchArticles } from "@/lib/api";
import { SkeletonCard } from "@/components/skeleton-card";
import SearchBox from "@/components/search";
import { UnifiedArticle, UnifiedSearchResponse } from "@/lib/interfaces";
import { ArticleCard } from "@/components/articleCard";
import { PaginationCard } from "@/components/paginationCard";
import { FilterAndSorting } from "@/components/filterAndSorting";
import { useTranslation } from "react-i18next";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { t } = useTranslation();

  const [results, setResults] = useState<UnifiedSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // Filters
  const [sort, setSort] = useState("relevance");
  const [sources, setSources] = useState("crossref,openalex");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    searchArticles(q, 10, page, sort, sources, startDate, endDate)
      .then((result) => setResults(result))
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [q, page, sort, sources, startDate, endDate]);

  return (
    <main className="min-h-screen px-4 py-2 max-w-4xl mx-auto">
      <div className="mb-2">
        <SearchBox defaultValue={q} loading={loading} />
      </div>
      <div className="my-4">
        <FilterAndSorting
          sort={sort}
          onSortChange={(val) => {
            setSort(val);
            setPage(1);
          }}
          sources={sources}
          onSourcesChange={(val) => {
            setSources(val);
            setPage(1);
          }}
          startDate={startDate}
          onStartDateChange={(val: string) => {
            setStartDate(val);
            setPage(1);
          }}
          endDate={endDate}
          onEndDateChange={(val: string) => {
            setEndDate(val);
            setPage(1);
          }}
        />
      </div>
      <h2 className="text-2xl font-semibold mb-6 mt-6 dark:text-gray-200">
        {t("results_for", { query: q })}
      </h2>
      {loading && <div className="space-y-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>}
      {!loading && results && results.items?.length === 0 && (
        <p className="text-center text-gray-500 bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          {t("no_results")}
        </p>
      )}
      {!loading && results && results.items?.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
            {t("total_results_found", { count: results.totalResults })}
          </p>
          {results.items.map((item: UnifiedArticle) => (
            <ArticleCard key={item.id} item={item} />
          ))}
          <PaginationCard
            page={page}
            onPageChange={setPage}
            totalPages={results?.totalPages ?? undefined}
          />
        </div>
      )}
    </main>
  );
}

