import type {
  WebMCPHandlers,
} from "./tools";

import {
  createWebMCPTools,
} from "./tools";

export async function registerNOVNAWebMCP(
  handlers: WebMCPHandlers,
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      supported: false,
      registered: [],
    };
  }

  if (
    !("modelContext" in
      document)
  ) {
    return {
      supported: false,
      registered: [],
    };
  }

  const controller =
    new AbortController();

  const tools =
    createWebMCPTools(
      handlers,
    );

  try {
    for (
      const tool of tools
    ) {
      await document.modelContext.registerTool(
        tool,
        {
          signal:
            controller.signal,
        },
      );
    }

    const registered =
      await document.modelContext.getTools();

    return {
      supported: true,
      registered,

      dispose: () =>
        controller.abort(),
    };
  } catch (error) {
    controller.abort();

    throw error;
  }
}