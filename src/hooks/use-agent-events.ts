"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  subscribeToAgentEvents,
} from "@/webmcp/agent-events";

import type {
  AgentEvent,
} from "@/webmcp/agent-events";

export function useAgentEvents() {
  const [
    events,
    setEvents,
  ] = useState<AgentEvent[]>(
    [],
  );

  useEffect(() => {
    return subscribeToAgentEvents(
      (event) => {
        setEvents(
          (current) => [
            ...current,
            event,
          ],
        );
      },
    );
  }, []);

  return {
    events,
  };
}