"use client";

import type {
  DecisionEvent,
} from "@/types";

type DecisionTimelineProps = {
  events: DecisionEvent[];
};

function formatTime(
  timestamp: string,
) {
  const date =
    new Date(timestamp);

  return date.toLocaleTimeString(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

function sourceLabel(
  source: DecisionEvent["source"],
) {
  if (source === "AGENT") {
    return "Agent";
  }

  if (source === "HUMAN") {
    return "You";
  }

  return "NOVNA";
}

export function DecisionTimeline({
  events,
}: DecisionTimelineProps) {
  if (events.length === 0) {
    return (
      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Decision history
            </p>

            <h2 className="mt-1 text-lg font-semibold text-zinc-950">
              Your decision will appear here
            </h2>
          </div>
        </div>

        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
          As you explore products and the agent
          changes the decision state, NOVNA will
          keep the important moments here.
        </p>
      </section>
    );
  }

  const visibleEvents =
    [...events]
      .reverse()
      .slice(0, 8);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            Decision history
          </p>

          <h2 className="mt-1 text-lg font-semibold text-zinc-950">
            How the decision evolved
          </h2>
        </div>

        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
          {events.length}{" "}
          {events.length === 1
            ? "moment"
            : "moments"}
        </span>
      </div>

      <div className="mt-6 space-y-0">
        {visibleEvents.map(
          (
            event,
            index,
          ) => (
            <div
              key={event.id}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {index <
                visibleEvents.length -
                  1 && (
                <div className="absolute left-[5px] top-3 h-full w-px bg-zinc-200" />
              )}

              <div className="relative mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-white bg-zinc-900 ring-1 ring-zinc-300" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {event.title}
                  </h3>

                  <span className="text-xs text-zinc-400">
                    {sourceLabel(
                      event.source,
                    )}
                  </span>

                  <span className="text-xs text-zinc-400">
                    ·
                  </span>

                  <time
                    className="text-xs text-zinc-400"
                    dateTime={
                      event.timestamp
                    }
                  >
                    {formatTime(
                      event.timestamp,
                    )}
                  </time>
                </div>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  {event.detail}
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      {events.length >
        visibleEvents.length && (
        <p className="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
          Showing the latest{" "}
          {visibleEvents.length}{" "}
          decision moments.
        </p>
      )}
    </section>
  );
}