"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchArticles } from "@/lib/api";
import { SkeletonCard } from "@/components/skeleton-card";
import SearchBox from "@/components/search";
import { CrossRefResponse } from "@/lib/interfaces";
import { ArticleCard } from "@/components/articleCard";
import { PaginationCard } from "@/components/paginationCard";
import Link from "next/link";
import { FilterAndSorting } from "@/components/filterAndSorting";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<CrossRefResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    searchArticles(q, 10, page, sort)
      .then((result) => setResults(result))
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [q, page, sort]);

  return (
    <main className="min-h-screen px-4 py-2 max-w-4xl mx-auto">
      <Link href="/">
        <h1 className="text-3xl font-semibold mb-4">Paprika</h1>
      </Link>
      <SearchBox defaultValue={q} />
      <div className="my-4">
        <FilterAndSorting
          value={sort}
          onChange={(val) => {
            setSort(val);
            setPage(1);
          }}
        />
      </div>
      <h2 className="text-2xl font-semibold mb-6 mt-6">
        “<span className="italic">{q}</span>” için sonuçlar:
      </h2>
      {loading && <SkeletonCard />}
      {!loading && results && results.items?.length === 0 && (
        <p className="text-center text-gray-500">
          Arama kriterlerine uygun sonuç bulunamadı.
        </p>
      )}
      {!loading && results && results.items?.length > 0 && (
        <div className="space-y-4">
          {results.items.map((item) => (
            <ArticleCard key={item.DOI} item={item} />
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
