"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SearchBox({
  defaultValue = "",
  loading = false,
}: {
  defaultValue?: string;
  loading?: boolean;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  useEffect(() => {
    setSearchQuery(defaultValue);
  }, [defaultValue]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-sm flex gap-2">
      <Input
        type="text"
        placeholder="Makale veya anahtar kelime ara..."
        className="flex-1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Yükleniyor...
          </>
        ) : (
          "Ara"
        )}
      </Button>
    </form>
  );
}
