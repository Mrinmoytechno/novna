"use client";

import {
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";

import type {
  Urgency,
  UserGoal,
} from "@/types";

type DecisionSetupProps = {
  goal: UserGoal;
  onUpdate: (
    updates: Partial<UserGoal>,
  ) => void;
};

const USE_CASE_OPTIONS = [
  "coding",
  "study",
  "building projects",
  "creative work",
  "gaming",
  "travel",
];

const PRIORITY_OPTIONS = [
  "value",
  "portability",
  "performance",
  "battery",
  "display",
  "durability",
];

const URGENCY_OPTIONS: Array<{
  value: Urgency;
  label: string;
  description: string;
}> = [
  {
    value: "NOW",
    label: "Now",
    description: "I need it immediately.",
  },
  {
    value: "SOON",
    label: "Soon",
    description: "I'll buy in the near term.",
  },
  {
    value: "CAN_WAIT",
    label: "Can wait",
    description: "I'm willing to wait for the right decision.",
  },
];

function formatUseCase(
  value: string,
) {
  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export function DecisionSetup({
  goal,
  onUpdate,
}: DecisionSetupProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    minBudget,
    setMinBudget,
  ] = useState(
    String(goal.budgetMinINR),
  );

  const [
    maxBudget,
    setMaxBudget,
  ] = useState(
    String(goal.budgetMaxINR),
  );

  const selectedUseCases =
    goal.requiredUseCases;

  const selectedPriorities =
    goal.priorities;

  function updateBudget(
    nextMin: string,
    nextMax: string,
  ) {
    setMinBudget(nextMin);
    setMaxBudget(nextMax);

    const parsedMin =
      Number(nextMin);
    const parsedMax =
      Number(nextMax);

    if (
      !Number.isFinite(parsedMin) ||
      !Number.isFinite(parsedMax)
    ) {
      return;
    }

    if (
      parsedMin < 0 ||
      parsedMax < 0 ||
      parsedMin > parsedMax
    ) {
      return;
    }

    onUpdate({
      budgetMinINR: Math.round(
        parsedMin,
      ),
      budgetMaxINR: Math.round(
        parsedMax,
      ),
    });
  }

  function toggleUseCase(
    value: string,
  ) {
    const exists =
      selectedUseCases.includes(
        value,
      );

    const next =
      exists
        ? selectedUseCases.filter(
            (item) =>
              item !== value,
          )
        : [
            ...selectedUseCases,
            value,
          ];

    if (next.length === 0) {
      return;
    }

    onUpdate({
      requiredUseCases: next,
    });
  }

  function togglePriority(
    value: string,
  ) {
    const exists =
      selectedPriorities.includes(
        value,
      );

    const next =
      exists
        ? selectedPriorities.filter(
            (item) =>
              item !== value,
          )
        : [
            ...selectedPriorities,
            value,
          ];

    if (next.length === 0) {
      return;
    }

    onUpdate({
      priorities: next,
    });
  }

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-neutral-50"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <SlidersHorizontal
              size={16}
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">
              Decision setup
            </p>

            <p className="mt-0.5 truncate text-xs text-neutral-500">
              {
                goal.description
              }
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-neutral-500">
          <span className="hidden sm:inline">
            {open
              ? "Close"
              : "Edit"}
          </span>

          {open ? (
            <ChevronUp
              size={16}
            />
          ) : (
            <ChevronDown
              size={16}
            />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-5 py-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="novna-decision-description"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400"
              >
                What are you deciding?
              </label>

              <textarea
                id="novna-decision-description"
                value={
                  goal.description
                }
                onChange={(event) =>
                  onUpdate({
                    description:
                      event.target
                        .value,
                  })
                }
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
                placeholder="Describe what you actually need."
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Budget
              </p>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-neutral-500">
                    Minimum
                  </span>

                  <div className="mt-1 flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 focus-within:border-neutral-400 focus-within:bg-white">
                    <span className="text-sm text-neutral-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={minBudget}
                      onChange={(event) =>
                        updateBudget(
                          event.target
                            .value,
                          maxBudget,
                        )
                      }
                      className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs text-neutral-500">
                    Maximum
                  </span>

                  <div className="mt-1 flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 focus-within:border-neutral-400 focus-within:bg-white">
                    <span className="text-sm text-neutral-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={maxBudget}
                      onChange={(event) =>
                        updateBudget(
                          minBudget,
                          event.target
                            .value,
                        )
                      }
                      className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Urgency
                </p>

                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {URGENCY_OPTIONS.map(
                    (option) => {
                      const selected =
                        goal.urgency ===
                        option.value;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() =>
                            onUpdate({
                              urgency:
                                option.value,
                            })
                          }
                          className={[
                            "rounded-xl border px-3 py-3 text-left transition",
                            selected
                              ? "border-neutral-950 bg-neutral-950 text-white"
                              : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-white",
                          ].join(
                            " ",
                          )}
                        >
                          <span className="flex items-center justify-between gap-2 text-xs font-semibold">
                            {
                              option.label
                            }

                            {selected && (
                              <Check
                                size={14}
                              />
                            )}
                          </span>

                          <span
                            className={[
                              "mt-1 block text-[11px] leading-4",
                              selected
                                ? "text-neutral-300"
                                : "text-neutral-500",
                            ].join(
                              " ",
                            )}
                          >
                            {
                              option.description
                            }
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                What will you use it for?
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {USE_CASE_OPTIONS.map(
                  (option) => {
                    const selected =
                      selectedUseCases.includes(
                        option,
                      );

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          toggleUseCase(
                            option,
                          )
                        }
                        className={[
                          "rounded-full border px-3 py-2 text-xs font-medium transition",
                          selected
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                        ].join(
                          " ",
                        )}
                      >
                        {selected && (
                          <Check
                            size={12}
                            className="mr-1 inline"
                          />
                        )}

                        {
                          formatUseCase(
                            option,
                          )
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                What matters most?
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map(
                  (option) => {
                    const selected =
                      selectedPriorities.includes(
                        option,
                      );

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          togglePriority(
                            option,
                          )
                        }
                        className={[
                          "rounded-full border px-3 py-2 text-xs font-medium transition",
                          selected
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                        ].join(
                          " ",
                        )}
                      >
                        {selected && (
                          <Check
                            size={12}
                            className="mr-1 inline"
                          />
                        )}

                        {
                          formatUseCase(
                            option,
                          )
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-neutral-50 px-4 py-3 text-xs leading-5 text-neutral-500">
            This is your live decision context.
            Changes here affect NOVNA&apos;s
            evaluation and, later, what an agent
            can reason about through WebMCP.
          </div>
        </div>
      )}
    </section>
  );
}