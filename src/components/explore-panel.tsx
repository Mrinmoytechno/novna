"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { laptops } from "@/data/laptops";
import { ProductGrid } from "./product-grid";

type ExplorePanelProps = {
  consideredIds: string[];
  rejectedIds: string[];
  comparedIds: string[];
  onConsider: (id: string) => void;
  onReject: (id: string) => void;
  onCompare: (id: string) => void;
};

export function ExplorePanel({
  consideredIds,
  rejectedIds,
  comparedIds,
  onConsider,
  onReject,
  onCompare,
}: ExplorePanelProps) {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);

  const products = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return laptops.filter((product) => {
      const searchable = [
        product.brand,
        product.family,
        product.model,
        product.variant,
        product.processor.name,
        product.graphics.name,
        ...product.useCases,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalized || searchable.includes(normalized);

      const matchesPrice =
        product.priceINR === null || product.priceINR <= maxPrice;

      return matchesSearch && matchesPrice;
    });
  }, [query, maxPrice]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Explore
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Find what fits.
          </h2>

          <p className="mt-1 max-w-xl text-sm text-neutral-500">
            Explore naturally. NOVNA will learn from the decisions you make.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <label className="relative block min-w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search laptops..."
              className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-neutral-500"
            />
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3">
            <SlidersHorizontal size={15} className="text-neutral-400" />

            <select
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(Number(event.target.value))
              }
              className="bg-transparent py-3 text-sm outline-none"
            >
              <option value={100000}>Under ₹1L</option>
              <option value={150000}>Under ₹1.5L</option>
              <option value={200000}>Under ₹2L</option>
              <option value={300000}>All prices</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>{products.length} products</span>

        {comparedIds.length > 0 && (
          <span className="font-medium text-neutral-700">
            {comparedIds.length}/3 selected for comparison
          </span>
        )}
      </div>

      <ProductGrid
        products={products}
        consideredIds={consideredIds}
        rejectedIds={rejectedIds}
        comparedIds={comparedIds}
        onConsider={onConsider}
        onReject={onReject}
        onCompare={onCompare}
      />
    </section>
  );
}