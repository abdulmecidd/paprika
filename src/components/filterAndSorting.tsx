// components/filterAndSorting.tsx
"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface FilterAndSortingProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterAndSorting = ({
  value,
  onChange,
}: FilterAndSortingProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Sırala" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">İlgililiğe göre</SelectItem>
        <SelectItem value="created">Sisteme eklenme tarihi</SelectItem>
        <SelectItem value="issued">Yayımlanma tarihi</SelectItem>
        <SelectItem value="is-referenced-by-count">Atıf sayısı</SelectItem>
        <SelectItem value="updated">Güncellenme tarihi</SelectItem>
      </SelectContent>
    </Select>
  );
};
