"use client";

import { Sparkles } from "lucide-react";
import { ExplorePanel } from "@/components/explore-panel";
import { useDecisionState } from "@/hooks/use-decision-state";

export default function Home() {
  const {
    state,
    considerProduct,
    rejectProduct,
    toggleCompare,
  } = useDecisionState();

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Sparkles size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">NOVNA</p>
              <p className="hidden text-[10px] uppercase tracking-[0.16em] text-neutral-400 sm:block">
                The decision before the purchase
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
              Your goal
            </p>
            <p className="max-w-[220px] truncate text-xs font-medium">
              {state.goal.description}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Laptop decision
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Don&apos;t just find a laptop.
            <br />
            <span className="text-neutral-400">
              Find the right decision.
            </span>
          </h1>
        </div>

        <ExplorePanel
          consideredIds={state.consideredProductIds}
          rejectedIds={state.rejectedProductIds}
          comparedIds={state.comparedProductIds}
          onConsider={considerProduct}
          onReject={rejectProduct}
          onCompare={toggleCompare}
        />
      </div>
    </main>
  );
}