"use client";

import { Check, GitCompareArrows, X } from "lucide-react";
import type { Laptop } from "@/types";

type ProductCardProps = {
  product: Laptop;
  considered: boolean;
  rejected: boolean;
  compared: boolean;
  onConsider: () => void;
  onReject: () => void;
  onCompare: () => void;
};

function formatPrice(price: number | null) {
  if (price === null) return "Price unavailable";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({
  product,
  considered,
  rejected,
  compared,
  onConsider,
  onReject,
  onCompare,
}: ProductCardProps) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl border bg-white transition-all duration-300",
        considered
          ? "border-black shadow-[0_16px_50px_rgba(0,0,0,0.12)]"
          : rejected
            ? "border-neutral-200 opacity-55"
            : "border-neutral-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)]",
      ].join(" ")}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={product.image.localPath}
          alt={product.image.alt}
          className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {considered && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
            <Check size={13} />
            Considering
          </div>
        )}

        {rejected && (
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur">
            Rejected
          </div>
        )}
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
            {product.brand} · {product.family}
          </p>

          <h3 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
            {product.model}
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            {product.variant}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Spec label="Memory" value={`${product.memory.capacityGB}GB`} />
          <Spec
            label="Storage"
            value={`${product.storage.capacityGB / 1024 >= 1 ? `${product.storage.capacityGB / 1024}TB` : `${product.storage.capacityGB}GB`}`}
          />
          <Spec
            label="Display"
            value={`${product.display.sizeInches}" ${product.display.panel}`}
          />
          <Spec
            label="Weight"
            value={
              product.physical.weightKg
                ? `${product.physical.weightKg}kg`
                : "—"
            }
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-neutral-400">Current listed price</p>
            <p className="mt-0.5 text-xl font-semibold tracking-tight">
              {formatPrice(product.priceINR)}
            </p>
          </div>

          <button
            type="button"
            onClick={onCompare}
            className={[
              "rounded-full border p-2.5 transition",
              compared
                ? "border-black bg-black text-white"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-black",
            ].join(" ")}
            aria-label={`Compare ${product.model}`}
            title="Compare"
          >
            <GitCompareArrows size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onConsider}
            className={[
              "rounded-xl px-4 py-3 text-sm font-medium transition",
              considered
                ? "bg-black text-white"
                : "bg-neutral-950 text-white hover:bg-neutral-800",
            ].join(" ")}
          >
            {considered ? "Considering" : "Consider"}
          </button>

          <button
            type="button"
            onClick={onReject}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-black"
          >
            <X size={15} />
            Reject
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2">
      <p className="text-neutral-400">{label}</p>
      <p className="mt-0.5 truncate font-medium text-neutral-800">{value}</p>
    </div>
  );
}