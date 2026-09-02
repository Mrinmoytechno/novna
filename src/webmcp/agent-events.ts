export type AgentEventType =
  | "TOOL_STARTED"
  | "TOOL_COMPLETED"
  | "TOOL_FAILED"
  | "INSIGHT_CREATED"
  | "PRODUCT_SURFACED"
  | "COMPARISON_UPDATED";

export type AgentEvent = {
  id: string;
  type: AgentEventType;
  toolName: string;
  title: string;
  message: string;
  timestamp: string;
  productId?: string;
};

const EVENT_NAME = "novna:agent-event";

export function emitAgentEvent(
  event: Omit<AgentEvent, "id" | "timestamp">,
) {
  if (typeof window === "undefined") {
    return;
  }

  const fullEvent: AgentEvent = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(
    new CustomEvent<AgentEvent>(
      EVENT_NAME,
      {
        detail: fullEvent,
      },
    ),
  );
}

export function subscribeToAgentEvents(
  listener: (event: AgentEvent) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (
    event: Event,
  ) => {
    const customEvent =
      event as CustomEvent<AgentEvent>;

    listener(customEvent.detail);
  };

  window.addEventListener(
    EVENT_NAME,
    handler,
  );

  return () => {
    window.removeEventListener(
      EVENT_NAME,
      handler,
    );
  };
}