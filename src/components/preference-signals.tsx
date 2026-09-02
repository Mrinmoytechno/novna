import type { PreferenceSignal } from "@/lib/preference-engine";

type PreferenceSignalsProps = {
  signals: PreferenceSignal[];
};

export function PreferenceSignals({
  signals,
}: PreferenceSignalsProps) {
  if (signals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-5">
        <p className="text-sm font-medium text-neutral-800">
          NOVNA is still learning.
        </p>

        <p className="mt-1 text-xs leading-5 text-neutral-500">
          Consider or reject a few laptops and your decision
          patterns will start to appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {signals.map((signal) => (
        <div
          key={signal.id}
          className="rounded-2xl border border-neutral-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-neutral-900">
              {signal.label}
            </p>

            <span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
              {signal.strength}
            </span>
          </div>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {signal.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}