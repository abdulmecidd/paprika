"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBox({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(defaultValue);

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
        placeholder="Makale başlığı veya anahtar kelime..."
        className="flex-1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button type="submit">Ara</Button>
    </form>
  );
}
