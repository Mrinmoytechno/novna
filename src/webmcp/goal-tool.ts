import type {
  UserGoal,
  Urgency,
} from "@/types";

import {
  emitAgentEvent,
} from "./agent-events";

import {
  failure,
  success,
} from "./tool-result";

export type GoalToolHandler = (
  updates: Partial<UserGoal>,
) => void;

type GoalUpdateInput = {
  description?: string;
  budgetMinINR?: number;
  budgetMaxINR?: number;
  urgency?: Urgency;
  requiredUseCases?: string[];
  priorities?: string[];
};

export const updateUserGoalSchema = {
  type: "object",
  properties: {
    description: {
      type: "string",
      description:
        "The user's updated description of what they are deciding.",
    },

    budgetMinINR: {
      type: "number",
      minimum: 0,
      description:
        "Optional minimum budget in Indian rupees.",
    },

    budgetMaxINR: {
      type: "number",
      minimum: 0,
      description:
        "Optional maximum budget in Indian rupees.",
    },

    urgency: {
      type: "string",
      enum: [
        "NOW",
        "SOON",
        "CAN_WAIT",
      ],
      description:
        "How urgently the user needs to make the purchase decision.",
    },

    requiredUseCases: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
      },
      description:
        "The use cases the product must support.",
    },

    priorities: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
      },
      description:
        "The factors the user currently cares about most.",
    },
  },
  additionalProperties: false,
} as const;

function cleanString(
  value: unknown,
) {
  if (
    typeof value !==
    "string"
  ) {
    return undefined;
  }

  const trimmed =
    value.trim();

  return trimmed.length > 0
    ? trimmed
    : undefined;
}

function cleanStringArray(
  value: unknown,
) {
  if (
    !Array.isArray(value)
  ) {
    return undefined;
  }

  const cleaned =
    value
      .filter(
        (
          item,
        ): item is string =>
          typeof item ===
          "string",
      )
      .map(
        (item) =>
          item.trim(),
      )
      .filter(
        (item) =>
          item.length > 0,
      );

  const unique =
    Array.from(
      new Set(cleaned),
    );

  return unique.length > 0
    ? unique
    : undefined;
}

function cleanBudget(
  value: unknown,
) {
  if (
    typeof value !==
    "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return undefined;
  }

  return Math.round(
    value,
  );
}

function validateUrgency(
  value: unknown,
): value is Urgency {
  return (
    value === "NOW" ||
    value === "SOON" ||
    value === "CAN_WAIT"
  );
}

export function createUpdateUserGoalTool(
  getCurrentGoal: () => UserGoal,
  updateGoal: GoalToolHandler,
): ModelContextTool {
  return {
    name:
      "update_user_goal",

    title:
      "Update NOVNA decision context",

    description:
      "Update the user's live NOVNA decision context. Use this only when the conversation or evidence justifies changing the goal, budget, urgency, use cases or priorities. This changes the shared decision state that other NOVNA tools read. Do not silently change the user's intent.",

    inputSchema:
      updateUserGoalSchema,

    annotations: {
      readOnlyHint:
        false,
    },

    execute: (
      rawInput,
    ) => {
      const input =
        rawInput as GoalUpdateInput;

      emitAgentEvent({
        type:
          "TOOL_STARTED",

        toolName:
          "update_user_goal",

        title:
          "Updating the decision context",

        message:
          "The agent is changing the shared decision context so the rest of NOVNA works from the latest requirements.",
      });

      const current =
        getCurrentGoal();

      const updates:
        Partial<UserGoal> =
        {};

      if (
        input.description !==
        undefined
      ) {
        const description =
          cleanString(
            input.description,
          );

        if (!description) {
          emitAgentEvent({
            type:
              "TOOL_FAILED",

            toolName:
              "update_user_goal",

            title:
              "Decision update failed",

            message:
              "The decision description cannot be empty.",
          });

          return failure(
            "INVALID_DESCRIPTION",
            "The decision description cannot be empty.",
          );
        }

        updates.description =
          description;
      }

      if (
        input.budgetMinINR !==
        undefined
      ) {
        const budget =
          cleanBudget(
            input.budgetMinINR,
          );

        if (
          budget ===
          undefined
        ) {
          emitAgentEvent({
            type:
              "TOOL_FAILED",

            toolName:
              "update_user_goal",

            title:
              "Decision update failed",

            message:
              "The minimum budget must be a finite non-negative number.",
          });

          return failure(
            "INVALID_MIN_BUDGET",
            "budgetMinINR must be a finite non-negative number.",
          );
        }

        updates.budgetMinINR =
          budget;
      }

      if (
        input.budgetMaxINR !==
        undefined
      ) {
        const budget =
          cleanBudget(
            input.budgetMaxINR,
          );

        if (
          budget ===
          undefined
        ) {
          emitAgentEvent({
            type:
              "TOOL_FAILED",

            toolName:
              "update_user_goal",

            title:
              "Decision update failed",

            message:
              "The maximum budget must be a finite non-negative number.",
          });

          return failure(
            "INVALID_MAX_BUDGET",
            "budgetMaxINR must be a finite non-negative number.",
          );
        }

        updates.budgetMaxINR =
          budget;
      }

      const nextMin =
        updates.budgetMinINR ??
        current.budgetMinINR;

      const nextMax =
        updates.budgetMaxINR ??
        current.budgetMaxINR;

      if (
        nextMin >
        nextMax
      ) {
        emitAgentEvent({
          type:
            "TOOL_FAILED",

          toolName:
            "update_user_goal",

          title:
            "Decision update failed",

          message:
            "The minimum budget cannot exceed the maximum budget.",
        });

        return failure(
          "INVALID_BUDGET_RANGE",
          "budgetMinINR cannot exceed budgetMaxINR.",
        );
      }

      if (
        input.urgency !==
        undefined
      ) {
        if (
          !validateUrgency(
            input.urgency,
          )
        ) {
          emitAgentEvent({
            type:
              "TOOL_FAILED",

            toolName:
              "update_user_goal",

            title:
              "Decision update failed",

            message:
              "The urgency value is invalid.",
          });

          return failure(
            "INVALID_URGENCY",
            "urgency must be NOW, SOON or CAN_WAIT.",
          );
        }

        updates.urgency =
          input.urgency;
      }

      if (
        input.requiredUseCases !==
        undefined
      ) {
        const useCases =
          cleanStringArray(
            input.requiredUseCases,
          );

        if (
          !useCases ||
          useCases.length ===
            0
        ) {
          emitAgentEvent({
            type:
              "TOOL_FAILED",

            toolName:
              "update_user_goal",

            title:
              "Decision update failed",

            message:
              "At least one required use case must remain.",
          });

          return failure(
            "INVALID_USE_CASES",
            "At least one required use case is required.",
          );
        }

        updates.requiredUseCases =
          useCases;
      }

      if (
        input.priorities !==
        undefined
      ) {
        const priorities =
          cleanStringArray(
            input.priorities,
          );

        if (
          !priorities ||
          priorities.length ===
            0
        ) {
          emitAgentEvent({
            type:
              "TOOL_FAILED",

            toolName:
              "update_user_goal",

            title:
              "Decision update failed",

            message:
              "At least one priority must remain.",
          });

          return failure(
            "INVALID_PRIORITIES",
            "At least one priority is required.",
          );
        }

        updates.priorities =
          priorities;
      }

      if (
        Object.keys(
          updates,
        ).length ===
        0
      ) {
        emitAgentEvent({
          type:
            "TOOL_FAILED",

          toolName:
            "update_user_goal",

          title:
            "Decision update failed",

          message:
            "No valid goal changes were provided.",
        });

        return failure(
          "NO_CHANGES",
          "Provide at least one valid decision-context change.",
        );
      }

      updateGoal(
        updates,
      );

      const nextGoal: UserGoal = {
        ...current,
        ...updates,
      };

      const changedFields =
        Object.keys(
          updates,
        );

      emitAgentEvent({
        type:
          "TOOL_COMPLETED",

        toolName:
          "update_user_goal",

        title:
          "Decision context updated",

        message:
          `Updated ${changedFields.length} decision field(s).`,

      });

      return success({
        action:
          "GOAL_UPDATED",

        goal:
          nextGoal,

        changedFields,

        nextStep:
          "Re-read the decision state and evaluate products against the updated context. Do not assume products previously rejected or considered are still the best fit.",
      });
    },
  };
}