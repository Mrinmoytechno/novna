"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type {
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
  });

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
          (current) => ({
            ...current,

            consideredProductIds:
              current.consideredProductIds.includes(
                productId,
              )
                ? current.consideredProductIds
                : [
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
          }),
        );
      },
      [],
    );

  const rejectProduct =
    useCallback(
      (productId: string) => {
        setState(
          (current) => ({
            ...current,

            rejectedProductIds:
              current.rejectedProductIds.includes(
                productId,
              )
                ? current.rejectedProductIds
                : [
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
          }),
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
            };
          },
        );
      },
      [],
    );

  const setComparedProducts =
    useCallback(
      (productIds: string[]) => {
        setState(
          (current) => ({
            ...current,
            comparedProductIds:
              Array.from(
                new Set(
                  productIds,
                ),
              ).slice(0, 3),
          }),
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
          (current) => ({
            ...current,

            goal: {
              ...current.goal,
              ...updates,
            },
          }),
        );
      },
      [],
    );

  const addInsight =
    useCallback(
      (insight: string) => {
        const normalized =
          insight.trim();

        if (!normalized) {
          return;
        }

        setState(
          (current) => ({
            ...current,

            insights:
              current.insights.includes(
                normalized,
              )
                ? current.insights
                : [
                    ...current.insights,
                    normalized,
                  ],
          }),
        );
      },
      [],
    );

  const clearComparison =
    useCallback(() => {
      setState(
        (current) => ({
          ...current,
          comparedProductIds: [],
        }),
      );
    }, []);

  const consideredCount =
    useMemo(
      () =>
        state.consideredProductIds
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

    clearComparison,
  };
}