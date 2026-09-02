import {
  ArrowRight,
  CircleCheck,
  CircleHelp,
} from "lucide-react";

import type {
  DecisionResult,
} from "@/lib/decision-engine";

import type {
  DecisionState,
} from "@/types";

type DecisionBriefProps = {
  state: DecisionState;
  decision: DecisionResult;
};

export function DecisionBrief({
  state,
  decision,
}: DecisionBriefProps) {
  const considered =
    state.consideredProductIds.length;

  const rejected =
    state.rejectedProductIds.length;

  const compared =
    state.comparedProductIds.length;

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
            Shared decision brief
          </p>

          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            What matters right now
          </h3>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
          <CircleCheck size={17} />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <BriefRow
          label="Goal"
          value={state.goal.description}
        />

        <BriefRow
          label="Budget"
          value={`₹${state.goal.budgetMinINR.toLocaleString(
            "en-IN",
          )} – ₹${state.goal.budgetMaxINR.toLocaleString(
            "en-IN",
          )}`}
        />

        <BriefRow
          label="Urgency"
          value={state.goal.urgency}
        />

        <BriefRow
          label="Products considered"
          value={String(considered)}
        />

        <BriefRow
          label="Products rejected"
          value={String(rejected)}
        />

        <BriefRow
          label="Products compared"
          value={String(compared)}
        />
      </div>

      <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
        <div className="flex items-start gap-3">
          {decision.evaluation ? (
            <CircleCheck
              size={16}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <CircleHelp
              size={16}
              className="mt-0.5 shrink-0 text-neutral-400"
            />
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
              Current decision
            </p>

            <p className="mt-1 text-sm font-medium">
              {decision.headline}
            </p>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              {decision.explanation}
            </p>
          </div>
        </div>

        {decision.recommendedProductId && (
          <div className="mt-4 flex items-center gap-2 text-xs font-medium">
            <span>
              Active recommendation available
            </span>

            <ArrowRight size={13} />
          </div>
        )}
      </div>
    </section>
  );
}

function BriefRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-neutral-400">
        {label}
      </span>

      <span className="max-w-[210px] text-right text-xs font-medium text-neutral-800">
        {value}
      </span>
    </div>
  );
}