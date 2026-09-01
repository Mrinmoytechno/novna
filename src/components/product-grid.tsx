"use client";

import type { Laptop } from "@/types";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Laptop[];
  consideredIds: string[];
  rejectedIds: string[];
  comparedIds: string[];
  onConsider: (id: string) => void;
  onReject: (id: string) => void;
  onCompare: (id: string) => void;
};

export function ProductGrid({
  products,
  consideredIds,
  rejectedIds,
  comparedIds,
  onConsider,
  onReject,
  onCompare,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          considered={consideredIds.includes(product.id)}
          rejected={rejectedIds.includes(product.id)}
          compared={comparedIds.includes(product.id)}
          onConsider={() => onConsider(product.id)}
          onReject={() => onReject(product.id)}
          onCompare={() => onCompare(product.id)}
        />
      ))}
    </div>
  );
}