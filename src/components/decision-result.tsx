import { AlertTriangle, CheckCircle2, MinusCircle } from "lucide-react";
import type { DecisionResult } from "@/lib/decision-engine";

type DecisionResultProps = {
  result: DecisionResult;
};

export function DecisionResult({
  result,
}: DecisionResultProps) {
  if (!result.evaluation) {
    return (
      <section className="rounded-3xl bg-neutral-950 p-6 text-white">
        <p className="text-xs uppercase tracking-[0.15em] text-white/40">
          NOVNA decision
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight">
          {result.headline}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/60">
          {result.explanation}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-neutral-950 p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
        NOVNA decision
      </p>

      <h3 className="mt-3 text-2xl font-semibold tracking-tight">
        {result.headline}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/60">
        {result.explanation}
      </p>

      <div className="mt-6 space-y-2">
        {result.evaluation.factors.map((factor) => (
          <div
            key={factor.id}
            className="rounded-2xl bg-white/[0.06] p-3"
          >
            <div className="flex items-start gap-3">
              <StatusIcon status={factor.status} />

              <div>
                <p className="text-sm font-medium">
                  {factor.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  {factor.explanation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {result.warnings.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Things to question
          </p>

          <ul className="mt-3 space-y-2">
            {result.warnings.map((warning) => (
              <li
                key={warning}
                className="text-xs leading-5 text-white/60"
              >
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function StatusIcon({
  status,
}: {
  status: "GOOD" | "CAUTION" | "PROBLEM" | "UNKNOWN";
}) {
  if (status === "GOOD") {
    return (
      <CheckCircle2
        size={17}
        className="mt-0.5 shrink-0 text-white"
      />
    );
  }

  if (status === "PROBLEM") {
    return (
      <AlertTriangle
        size={17}
        className="mt-0.5 shrink-0 text-white/70"
      />
    );
  }

  return (
    <MinusCircle
      size={17}
      className="mt-0.5 shrink-0 text-white/40"
    />
  );
}