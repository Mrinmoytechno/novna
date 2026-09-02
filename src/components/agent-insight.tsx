import {
  Lightbulb,
} from "lucide-react";

type AgentInsightProps = {
  insights: string[];
};

export function AgentInsight({
  insights,
}: AgentInsightProps) {
  if (insights.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-neutral-300 bg-transparent p-5">
        <div className="flex items-start gap-3">
          <Lightbulb
            size={17}
            className="mt-0.5 text-neutral-400"
          />

          <div>
            <p className="text-sm font-medium">
              No agent insights yet.
            </p>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              When an agent challenges a decision or
              discovers an important trade-off, it will
              appear here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Lightbulb size={16} />

        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
          Agent insights
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {insights.map((insight) => (
          <div
            key={insight}
            className="rounded-2xl bg-neutral-50 p-4"
          >
            <p className="text-sm leading-6 text-neutral-700">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}