"use client";

import {
  Bot,
  Check,
  ChevronDown,
  CircleAlert,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import type {
  AgentEvent,
} from "@/webmcp/agent-events";

type AgentActivityProps = {
  events: AgentEvent[];
  connected: boolean;
};

export function AgentActivity({
  events,
  connected,
}: AgentActivityProps) {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const activeEvent = useMemo(
    () =>
      events.find(
        (event) =>
          event.type === "TOOL_STARTED",
      ),
    [events],
  );

  const latestEvent = events[0];

  return (
    <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() =>
          setExpanded(
            (current) => !current,
          )
        }
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <Bot size={17} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
              Agent workspace
            </p>

            <p className="mt-1 text-sm font-medium">
              {activeEvent
                ? activeEvent.title
                : latestEvent
                  ? latestEvent.title
                  : connected
                    ? "Ready to work with you"
                    : "Waiting for an agent"}
            </p>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={[
            "text-neutral-400 transition-transform",
            expanded
              ? "rotate-180"
              : "",
          ].join(" ")}
        />
      </button>

      {activeEvent && (
        <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <Loader2
              size={16}
              className="animate-spin text-neutral-500"
            />

            <div>
              <p className="text-xs font-medium text-neutral-800">
                {activeEvent.title}
              </p>

              <p className="mt-0.5 text-xs text-neutral-500">
                {activeEvent.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="border-t border-neutral-100">
          {events.length === 0 ? (
            <div className="p-5">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={16}
                  className="mt-0.5 text-neutral-400"
                />

                <div>
                  <p className="text-sm font-medium">
                    No agent activity yet.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    When an agent works with NOVNA,
                    its actions will appear here.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {events.map((event) => (
                <ActivityItem
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ActivityItem({
  event,
}: {
  event: AgentEvent;
}) {
  const icon =
    event.type ===
    "TOOL_STARTED" ? (
      <Loader2
        size={15}
        className="animate-spin"
      />
    ) : event.type ===
      "TOOL_FAILED" ? (
      <CircleAlert size={15} />
    ) : (
      <Check size={15} />
    );

  return (
    <div className="flex gap-3 p-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-900">
          {event.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-neutral-500">
          {event.message}
        </p>

        <p className="mt-1 text-[10px] text-neutral-300">
          {new Date(
            event.timestamp,
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}