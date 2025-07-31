"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchArticles } from "@/lib/api";
import { SkeletonCard } from "@/components/skeleton-card";
import SearchBox from "@/components/search";
import { CrossrefItem } from "@/lib/interfaces";

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
      <SearchBox />
      <h1 className="text-2xl font-semibold mb-6 mt-6">
        “<span className="italic">{q}</span>” için sonuçlar
      </h1>

      {loading && <SkeletonCard />}

      {!loading && results.length === 0 && (
        <p className="text-center text-gray-500">
          Arama kriterlerine uygun sonuç bulunamadı.
        </p>
      )}

      <ul className="space-y-6">
        {!loading &&
          results.map((item) => (
            <li
              key={item.DOI}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold mb-1">{item.title?.[0]}</h2>
              <p className="text-sm text-muted-foreground mb-2">
                {item["container-title"]?.[0]} &middot; {item.publisher}{" "}
                &middot; {item.published?.["date-parts"]?.[0]?.[0]}
              </p>
              <a
                href={item.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Makaleye Git
              </a>
            </li>
          ))}
      </ul>
    </main>
  );
}
