"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type {
  DecisionEvent,
  DecisionEventType,
  DecisionState,
  UserGoal,
} from "@/types";

const createDefaultGoal =
  (): UserGoal => ({
    description:
      "I need a laptop for coding, studying and building projects.",

    budgetMinINR: 50000,

    budgetMaxINR: 150000,

    urgency: "SOON",

    requiredUseCases: [
      "coding",
      "study",
    ],

    priorities: [
      "value",
      "portability",
    ],
  });

const createInitialState =
  (): DecisionState => ({
    goal:
      createDefaultGoal(),

    consideredProductIds: [],

    rejectedProductIds: [],

    comparedProductIds: [],

    activeProductId: null,

    inferredPreferences: [],

    insights: [],

    currentOutcome: null,

    events: [],
  });

function createEvent(
  type: DecisionEventType,
  title: string,
  detail: string,
  source:
    | "HUMAN"
    | "AGENT"
    | "SYSTEM",
  productIds: string[] = [],
): DecisionEvent {
  return {
    id:
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,

    type,

    timestamp:
      new Date().toISOString(),

    title,

    detail,

    productIds,

    source,
  };
}

export function useDecisionState() {
  const [
    state,
    setState,
  ] = useState<DecisionState>(
    createInitialState,
  );

  const considerProduct =
    useCallback(
      (productId: string) => {
        setState(
          (current) => {
            if (
              current.consideredProductIds.includes(
                productId,
              )
            ) {
              return current;
            }

            return {
              ...current,

              consideredProductIds: [
                ...current.consideredProductIds,
                productId,
              ],

              rejectedProductIds:
                current.rejectedProductIds.filter(
                  (id) =>
                    id !== productId,
                ),

              activeProductId:
                productId,

              events: [
                ...current.events,

                createEvent(
                  "PRODUCT_CONSIDERED",
                  "Product considered",
                  "A product entered the active decision space.",
                  "HUMAN",
                  [productId],
                ),
              ],
            };
          },
        );
      },
      [],
    );

  const rejectProduct =
    useCallback(
      (productId: string) => {
        setState(
          (current) => {
            if (
              current.rejectedProductIds.includes(
                productId,
              )
            ) {
              return current;
            }

            return {
              ...current,

              rejectedProductIds: [
                ...current.rejectedProductIds,
                productId,
              ],

              consideredProductIds:
                current.consideredProductIds.filter(
                  (id) =>
                    id !== productId,
                ),

              activeProductId:
                current.activeProductId ===
                productId
                  ? null
                  : current.activeProductId,

              events: [
                ...current.events,

                createEvent(
                  "PRODUCT_REJECTED",
                  "Product rejected",
                  "A product was removed from the active decision space.",
                  "HUMAN",
                  [productId],
                ),
              ],
            };
          },
        );
      },
      [],
    );

  const toggleCompare =
    useCallback(
      (productId: string) => {
        setState(
          (current) => {
            const exists =
              current.comparedProductIds.includes(
                productId,
              );

            if (exists) {
              return {
                ...current,

                comparedProductIds:
                  current.comparedProductIds.filter(
                    (id) =>
                      id !== productId,
                  ),

                events: [
                  ...current.events,

                  createEvent(
                    "COMPARISON_UPDATED",
                    "Comparison updated",
                    "A product was removed from the comparison.",
                    "HUMAN",
                    [productId],
                  ),
                ],
              };
            }

            if (
              current.comparedProductIds
                .length >= 3
            ) {
              return current;
            }

            return {
              ...current,

              comparedProductIds: [
                ...current.comparedProductIds,
                productId,
              ],

              events: [
                ...current.events,

                createEvent(
                  "COMPARISON_UPDATED",
                  "Comparison updated",
                  "A product was added to the comparison.",
                  "HUMAN",
                  [
                    ...current.comparedProductIds,
                    productId,
                  ],
                ),
              ],
            };
          },
        );
      },
      [],
    );

  const setComparedProducts =
    useCallback(
      (
        productIds: string[],
      ) => {
        setState(
          (current) => {
            const nextIds =
              Array.from(
                new Set(
                  productIds,
                ),
              ).slice(0, 3);

            const changed =
              nextIds.join(",") !==
              current.comparedProductIds.join(
                ",",
              );

            if (!changed) {
              return current;
            }

            return {
              ...current,

              comparedProductIds:
                nextIds,

              events: [
                ...current.events,

                createEvent(
                  "COMPARISON_UPDATED",
                  "Comparison updated",
                  "The active comparison changed.",
                  "AGENT",
                  nextIds,
                ),
              ],
            };
          },
        );
      },
      [],
    );

  const updateGoal =
    useCallback(
      (
        updates: Partial<UserGoal>,
      ) => {
        setState(
          (current) => {
            const nextGoal = {
              ...current.goal,
              ...updates,
            };

            const changedFields =
              Object.keys(
                updates,
              );

            if (
              changedFields.length ===
              0
            ) {
              return current;
            }

            return {
              ...current,

              goal:
                nextGoal,

              events: [
                ...current.events,

                createEvent(
                  "GOAL_UPDATED",
                  "Decision goal updated",
                  `Updated: ${changedFields.join(
                    ", ",
                  )}.`,
                  "AGENT",
                ),
              ],
            };
          },
        );
      },
      [],
    );

  const addInsight =
    useCallback(
      (
        insight: string,
      ) => {
        const normalized =
          insight.trim();

        if (!normalized) {
          return;
        }

        setState(
          (current) => {
            if (
              current.insights.includes(
                normalized,
              )
            ) {
              return current;
            }

            return {
              ...current,

              insights: [
                ...current.insights,
                normalized,
              ],

              events: [
                ...current.events,

                createEvent(
                  "INSIGHT_CREATED",
                  "New insight",
                  normalized,
                  "AGENT",
                ),
              ],
            };
          },
        );
      },
      [],
    );

  const addDecisionEvent =
    useCallback(
      (
        type: DecisionEventType,
        title: string,
        detail: string,
        source:
          | "HUMAN"
          | "AGENT"
          | "SYSTEM",
        productIds: string[] = [],
      ) => {
        setState(
          (current) => ({
            ...current,

            events: [
              ...current.events,

              createEvent(
                type,
                title,
                detail,
                source,
                productIds,
              ),
            ],
          }),
        );
      },
      [],
    );

  const clearComparison =
    useCallback(
      () => {
        setState(
          (current) => ({
            ...current,

            comparedProductIds: [],

            events: [
              ...current.events,

              createEvent(
                "COMPARISON_UPDATED",
                "Comparison cleared",
                "The active comparison was cleared.",
                "HUMAN",
              ),
            ],
          }),
        );
      },
      [],
    );

  const consideredCount =
    useMemo(
      () =>
        state
          .consideredProductIds
          .length,

      [
        state.consideredProductIds,
      ],
    );

  return {
    state,

    consideredCount,

    considerProduct,

    rejectProduct,

    toggleCompare,

    setComparedProducts,

    updateGoal,

    addInsight,

    addDecisionEvent,

    clearComparison,
  };
}