"use client";
import React from "react";
import { Button } from "@/components/ui/button";

// Debounce đơn giản
function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export type FilterParams = {
  q: string;
  categoryId: string;
  brand: string;
  inStockOnly: boolean;
  sort: "newest" | "priceAsc" | "priceDesc";
};

export default function FilterBar({
  categories = [],
  brands = [],
  defaultValues,
  onChange,
}: {
  categories: { id: string; name: string }[];
  brands: string[];
  defaultValues?: Partial<FilterParams>;
  onChange: (f: FilterParams) => void;
}) {
  const [q, setQ] = React.useState(defaultValues?.q ?? "");
  const [categoryId, setCategoryId] = React.useState(defaultValues?.categoryId ?? "");
  const [brand, setBrand] = React.useState(defaultValues?.brand ?? "");
  const [inStockOnly, setInStockOnly] = React.useState(defaultValues?.inStockOnly ?? false);
  const [sort, setSort] = React.useState<FilterParams["sort"]>(defaultValues?.sort ?? "newest");

  // Nếu defaultValues có thể thay đổi từ parent: sync lại UI (tuỳ nhu cầu)
  React.useEffect(() => {
    if (!defaultValues) return;
    setQ(defaultValues.q ?? "");
    setCategoryId(defaultValues.categoryId ?? "");
    setBrand(defaultValues.brand ?? "");
    setInStockOnly(defaultValues.inStockOnly ?? false);
    setSort((defaultValues.sort as FilterParams["sort"]) ?? "newest");
  }, [defaultValues?.q, defaultValues?.categoryId, defaultValues?.brand, defaultValues?.inStockOnly, defaultValues?.sort]);

  // Debounce khi gõ
  const dq = useDebounced(q, 400);

  // Gửi filter lên parent (onChange đã memo ở parent để tránh loop)
  React.useEffect(() => {
    onChange({ q: dq, categoryId, brand, inStockOnly, sort });
  }, [dq, categoryId, brand, inStockOnly, sort, onChange]);

  const clearAll = () => {
    setQ("");
    setCategoryId("");
    setBrand("");
    setInStockOnly(false);
    setSort("newest");
    onChange({ q: "", categoryId: "", brand: "", inStockOnly: false, sort: "newest" });
  };

  return (
    <div id="filter" className="flex flex-col gap-2 md:flex-row md:items-end pb-2">
      {/* Search */}
      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">Search</label>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Product name"
          className="w-full bg-white h-8 rounded-md px-3 shadow outline-none"
        />
      </div>

      {/* Category */}
      <div className="min-w-48">
        <label className="block text-xs text-gray-500 mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full h-8 rounded-md shadow px-2 bg-white outline-none"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="min-w-40">
        <label className="block text-xs text-gray-500 mb-1">Brand</label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full h-8 rounded-md shadow px-2 bg-white outline-none"
        >
          <option value="">All</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* In stock */}
      <div className="flex items-center gap-2 h-8">
        <input
          id="inStock"
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="size-4 outline-none"
        />
        <label htmlFor="inStock" className="text-sm">In Stock</label>
      </div>

      {/* Sort */}
      <div className="min-w-24">
        <label className="block text-xs text-gray-500 mb-1">Sort</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as FilterParams["sort"])}
          className="w-full h-8 rounded-md shadow px-2 bg-white outline-none"
        >
        <option value="newest">Newest</option>
        <option value="priceAsc">Price ↑</option>
        <option value="priceDesc">Price ↓</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={clearAll}>
          Clear
        </Button>
      </div>
    </div>
  );
}
