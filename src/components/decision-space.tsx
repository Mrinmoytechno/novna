"use client";

import { ArrowUpRight, BrainCircuit, Target } from "lucide-react";
import type { DecisionState, Laptop } from "@/types";
import {
  inferPreferences,
  type PreferenceSignal,
} from "@/lib/preference-engine";
import { PreferenceSignals } from "./preference-signals";

type DecisionSpaceProps = {
  state: DecisionState;
  products: Laptop[];
};

export function DecisionSpace({
  state,
  products,
}: DecisionSpaceProps) {
  const signals: PreferenceSignal[] = inferPreferences(
    state,
    products,
  );

  const considered = products.filter((product) =>
    state.consideredProductIds.includes(product.id),
  );

  const rejected = products.filter((product) =>
    state.rejectedProductIds.includes(product.id),
  );

  const compared = products.filter((product) =>
    state.comparedProductIds.includes(product.id),
  );

  return (
    <aside className="space-y-4">
      <section className="rounded-3xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <Target size={16} />

          <p className="text-xs font-semibold uppercase tracking-[0.15em]">
            Decision space
          </p>
        </div>

        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {state.goal.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>
            ₹{state.goal.budgetMinINR.toLocaleString("en-IN")}–
            ₹{state.goal.budgetMaxINR.toLocaleString("en-IN")}
          </Pill>

          <Pill>{state.goal.urgency}</Pill>

          {state.goal.requiredUseCases.map((useCase) => (
            <Pill key={useCase}>{useCase}</Pill>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} />

          <p className="text-xs font-semibold uppercase tracking-[0.15em]">
            What NOVNA sees
          </p>
        </div>

        <div className="mt-4">
          <PreferenceSignals signals={signals} />
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
          Your activity
        </p>

        <div className="mt-4 space-y-3">
          <ActivityRow
            label="Considering"
            value={considered.length}
          />

          <ActivityRow
            label="Rejected"
            value={rejected.length}
          />

          <ActivityRow
            label="Comparing"
            value={compared.length}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-neutral-950 p-5 text-white">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
            NOVNA
          </p>

          <ArrowUpRight size={16} className="text-white/50" />
        </div>

        <p className="mt-4 text-lg font-medium tracking-tight">
          Keep exploring.
        </p>

        <p className="mt-2 text-sm leading-6 text-white/60">
          Your actions are becoming part of the decision—not
          just your search query.
        </p>
      </section>
    </aside>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-medium capitalize text-neutral-600">
      {children}
    </span>
  );
}

function ActivityRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-neutral-500">{label}</span>

      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}