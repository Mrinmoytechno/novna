"use client";

import { X } from "lucide-react";
import type { Laptop } from "@/types";

type ComparisonDockProps = {
  products: Laptop[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function ComparisonDock({
  products,
  onRemove,
  onClear,
}: ComparisonDockProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.15)] backdrop-blur-xl">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="shrink-0 px-2">
            <p className="text-xs font-semibold text-neutral-900">
              Compare
            </p>

            <p className="text-[10px] text-neutral-400">
              {products.length}/3
            </p>
          </div>

          {products.map((product) => (
            <div
              key={product.id}
              className="flex min-w-[190px] items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2"
            >
              <img
                src={product.image.localPath}
                alt=""
                className="h-10 w-12 rounded-lg object-contain"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">
                  {product.brand} {product.family}
                </p>

                <p className="truncate text-[10px] text-neutral-400">
                  {product.variant}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(product.id)}
                className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-900"
                aria-label={`Remove ${product.model}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onClear}
            className="ml-auto shrink-0 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}