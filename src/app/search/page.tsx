"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchArticles } from "@/lib/api";
import { SkeletonCard } from "@/components/skeleton-card";
import SearchBox from "@/components/search";
import { CrossrefItem } from "@/lib/interfaces";
import { ArticleCard } from "@/components/articleCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<CrossrefItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    searchArticles(q, 10)
      .then((res) => setResults(res))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Paprika</h1>
      <SearchBox />
      <h2 className="text-2xl font-semibold mb-6 mt-6">
        “<span className="italic">{q}</span>” için sonuçlar:
      </h2>

      {loading && <SkeletonCard />}

      {!loading && results.length === 0 && (
        <p className="text-center text-gray-500">
          Arama kriterlerine uygun sonuç bulunamadı.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((item) => (
            <ArticleCard key={item.DOI} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
