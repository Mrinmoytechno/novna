import {
  CheckCircle2,
  Circle,
  Wrench,
} from "lucide-react";

type WebMCPStatusProps = {
  supported: boolean;
  registeredTools: string[];
  error: string | null;
};

export function WebMCPStatus({
  supported,
  registeredTools,
  error,
}: WebMCPStatusProps) {
  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <Circle
            size={17}
            className="fill-red-500 text-red-500"
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
              Agent connection
            </p>

            <p className="mt-1 text-sm font-medium text-red-900">
              WebMCP registration failed
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <Wrench size={16} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
              Agent access
            </p>

            <p className="mt-1 text-sm font-medium">
              {supported
                ? "NOVNA is agent-ready"
                : "Waiting for WebMCP support"}
            </p>
          </div>
        </div>

        {supported ? (
          <CheckCircle2
            size={18}
          />
        ) : (
          <Circle
            size={18}
            className="text-neutral-300"
          />
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-neutral-500">
        {supported
          ? `${registeredTools.length} structured tools are available to a compatible web agent.`
          : "The human shopping experience remains fully usable. A compatible WebMCP environment can connect when available."}
      </p>

      {supported &&
        registeredTools.length >
          0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {registeredTools.map(
              (tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-[9px] font-medium text-neutral-500"
                >
                  {tool}
                </span>
              ),
            )}
          </div>
        )}
    </div>
  );
}