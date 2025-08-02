import SearchPageClient from "@/components/searchPageClient";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
