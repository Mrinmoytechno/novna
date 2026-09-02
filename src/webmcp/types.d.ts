export {};

declare global {
  interface ModelContextTool {
    name: string;
    title?: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations?: {
      readOnlyHint?: boolean;
      untrustedContentHint?: boolean;
    };
    execute: (
      input: unknown,
      options?: {
        signal?: AbortSignal;
      },
    ) => Promise<string> | string;
  }

  interface RegisteredTool {
    name: string;
    title?: string;
    description: string;
    inputSchema: string;
    origin: string;
    annotations?: {
      readOnlyHint?: boolean;
      untrustedContentHint?: boolean;
    };
  }

  interface ModelContext {
    registerTool(
      tool: ModelContextTool,
      options?: {
        exposedTo?: string[];
        signal?: AbortSignal;
      },
    ): Promise<undefined>;

    getTools(
      options?: {
        fromOrigins?: string[];
      },
    ): Promise<RegisteredTool[]>;

    executeTool(
      tool: RegisteredTool,
      inputObject?: Record<string, unknown>,
      options?: {
        signal?: AbortSignal;
      },
    ): Promise<string>;

    ontoolchange: ((event: Event) => void) | null;
  }

  interface Document {
    readonly modelContext: ModelContext;
  }
}