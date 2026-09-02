"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  subscribeToAgentEvents,
  type AgentEvent,
} from "@/webmcp/agent-events";

const MAX_EVENTS = 12;

export function useAgentEvents() {
  const [events, setEvents] =
    useState<AgentEvent[]>([]);

  const addEvent = useCallback(
    (event: AgentEvent) => {
      setEvents((current) =>
        [event, ...current].slice(
          0,
          MAX_EVENTS,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    return subscribeToAgentEvents(
      addEvent,
    );
  }, [addEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    clearEvents,
  };
}