import type {
  DecisionState,
  Laptop,
  UserGoal,
} from "@/types";

import {
  searchLaptops,
  getLaptopById,
} from "@/data/laptops";

import {
  evaluateDecision,
  evaluateProduct,
} from "@/lib/decision-engine";

import {
  challengeDecision,
  compareProducts,
  findValueAlternatives,
  evaluateWaitVsBuy,
} from "@/webmcp/tool-logic";

import {
  emitAgentEvent,
} from "./agent-events";

import {
  challengeDecisionSchema,
  compareProductsSchema,
  emptySchema,
  productIdSchema,
  searchProductsSchema,
  valueAlternativesSchema,
  waitDecisionSchema,
} from "./schemas";

import {
  failure,
  success,
} from "./tool-result";

export type WebMCPHandlers = {
  getState: () => DecisionState;

  considerProduct: (
    productId: string,
  ) => void;

  setComparedProducts: (
    productIds: string[],
  ) => void;

  addInsight: (
    insight: string,
  ) => void;

  updateGoal: (
    updates: Partial<UserGoal>,
  ) => void;
  
};

function serializeProduct(
  product: Laptop,
) {
  return {
    id: product.id,

    brand:
      product.brand,

    family:
      product.family,

    model:
      product.model,

    variant:
      product.variant,

    priceINR:
      product.priceINR,

    operatingSystem:
      product.operatingSystem,

    processor:
      product.processor,

    graphics:
      product.graphics,

    memory:
      product.memory,

    storage:
      product.storage,

    display:
      product.display,

    battery:
      product.battery,

    physical:
      product.physical,

    connectivity:
      product.connectivity,

    camera:
      product.camera,

    ports:
      product.ports,

    useCases:
      product.useCases,

    warranty:
      product.warranty,

    source:
      product.source,
  };
}

function toolStarted(
  toolName: string,
  title: string,
  message: string,
) {
  emitAgentEvent({
    type:
      "TOOL_STARTED",

    toolName,

    title,

    message,
  });
}

function toolCompleted(
  toolName: string,
  title: string,
  message: string,
  productId?: string,
) {
  emitAgentEvent({
    type:
      "TOOL_COMPLETED",

    toolName,

    title,

    message,

    productId,
  });
}

function toolFailed(
  toolName: string,
  title: string,
  message: string,
) {
  emitAgentEvent({
    type:
      "TOOL_FAILED",

    toolName,

    title,

    message,
  });
}

export function createWebMCPTools(
  handlers: WebMCPHandlers,
): ModelContextTool[] {
  return [
    {
      name:
        "get_decision_state",

      title:
        "Get NOVNA decision state",

      description:
        "Read the complete current NOVNA decision state. Use this FIRST when helping the user make a purchase decision. It contains the user's goal, budget, urgency, considered products, rejected products, comparisons, inferred preferences and agent insights.",

      inputSchema:
        emptySchema,

      annotations: {
        readOnlyHint:
          true,
      },

      execute: () => {
        toolStarted(
          "get_decision_state",
          "Reading your decision",
          "The agent is looking at what matters to you before recommending anything.",
        );

        const state =
          handlers.getState();

        const considered =
          state.consideredProductIds.length;

        const rejected =
          state.rejectedProductIds.length;

        const response =
          success({
            state,

            agentGuidance: {
              workflow:
                [
                  "Understand the user's goal before recommending.",
                  "Inspect exact product facts before making claims.",
                  "Use the user's behavior as evidence, not as an unquestionable preference.",
                  "Challenge assumptions when appropriate.",
                  "Never invent future discounts, releases, benchmarks or missing specifications.",
                  "Prefer explaining trade-offs over declaring a universal winner.",
                ],

              activity: {
                considered,
                rejected,
                compared:
                  state
                    .comparedProductIds
                    .length,
              },
            },
          });

        toolCompleted(
          "get_decision_state",
          "Decision understood",
          `${considered} product(s) considered and ${rejected} rejected so far.`,
        );

        return response;
      },
    },

    {
      name:
        "get_user_goal",

      title:
        "Get user's purchase goal",

      description:
        "Read the user's current purchase goal, budget, urgency, required use cases and priorities.",

      inputSchema:
        emptySchema,

      annotations: {
        readOnlyHint:
          true,
      },

      execute: () => {
        toolStarted(
          "get_user_goal",
          "Understanding the goal",
          "The agent is checking what the purchase actually needs to accomplish.",
        );

        const goal =
          handlers.getState()
            .goal;

        toolCompleted(
          "get_user_goal",
          "Goal understood",
          `Budget: ₹${goal.budgetMinINR.toLocaleString(
            "en-IN",
          )}–₹${goal.budgetMaxINR.toLocaleString(
            "en-IN",
          )}.`,
        );

        return success({
          goal,

          nextStep:
            "If the goal is sufficiently specific, inspect candidate products rather than asking unnecessary questions.",
        });
      },
    },

    {
      name:
        "get_product_details",

      title:
        "Inspect exact laptop",

      description:
        "Retrieve verified product information for one exact NOVNA laptop configuration. Use this before making product-specific claims.",

      inputSchema:
        productIdSchema,

      annotations: {
        readOnlyHint:
          true,
      },

      execute: (
        rawInput,
      ) => {
        const input =
          rawInput as {
            productId?:
              string;
          };

        toolStarted(
          "get_product_details",
          "Inspecting a laptop",
          "The agent is checking the exact configuration instead of relying on a generic model name.",
          );

        if (
          !input.productId
        ) {
          toolFailed(
            "get_product_details",
            "Laptop inspection failed",
            "No product ID was provided.",
          );

          return failure(
            "MISSING_PRODUCT_ID",
            "A productId is required.",
          );
        }

        const product =
          getLaptopById(
            input.productId,
          );

        if (!product) {
          toolFailed(
            "get_product_details",
            "Laptop not found",
            "That product is not in NOVNA's verified catalog.",
          );

          return failure(
            "PRODUCT_NOT_FOUND",
            `No NOVNA product exists with ID "${input.productId}".`,
          );
        }

        toolCompleted(
          "get_product_details",
          "Laptop inspected",
          `${product.brand} ${product.model} checked.`,
          product.id,
        );

        return success({
          product:
            serializeProduct(
              product,
            ),

          dataIntegrity:
            "Only stored verified facts are exposed. Unknown fields are not fabricated.",
        });
      },
    },

    {
      name:
        "get_shortlist",

      title:
        "Get user's shortlist",

      description:
        "Read the products the user is currently considering. Use this to work with the user's actual behavior rather than restarting the shopping journey.",

      inputSchema:
        emptySchema,

      annotations: {
        readOnlyHint:
          true,
      },

      execute: () => {
        toolStarted(
          "get_shortlist",
          "Reviewing the shortlist",
          "The agent is looking at the products you already considered.",
        );

        const state =
          handlers.getState();

        const products =
          state
            .consideredProductIds
            .map(
              getLaptopById,
            )
            .filter(
              (
                product,
              ): product is Laptop =>
                product !==
                undefined,
            )
            .map(
              serializeProduct,
            );

        toolCompleted(
          "get_shortlist",
          "Shortlist reviewed",
          `${products.length} product(s) are currently being considered.`,
        );

        return success({
          productIds:
            state.consideredProductIds,

          products,

          instruction:
            "Do not assume the first considered product is the preferred product. Evaluate the shortlist against the goal.",
        });
      },
    },

    {
      name:
        "search_products",

      title:
        "Search NOVNA catalog",

      description:
        "Search NOVNA's verified laptop catalog using natural language. Optionally constrain price and minimum memory.",

      inputSchema:
        searchProductsSchema,

      annotations: {
        readOnlyHint:
          true,
      },

      execute: (
        rawInput,
      ) => {
        const input =
          rawInput as {
            query?:
              string;

            maxPriceINR?:
              number;

            minMemoryGB?:
              number;
          };

        toolStarted(
          "search_products",
          "Searching the catalog",
          input.query
            ? `Looking for ${input.query}.`
            : "Searching NOVNA's verified catalog.",
        );

        if (
          !input.query
        ) {
          toolFailed(
            "search_products",
            "Search failed",
            "No search query was provided.",
          );

          return failure(
            "MISSING_QUERY",
            "A search query is required.",
          );
        }

        let products =
          searchLaptops(
            input.query,
          );

        if (
          input.maxPriceINR !==
          undefined
        ) {
          products =
            products.filter(
              (product) =>
                product.priceINR !==
                  null &&
                product.priceINR <=
                  input.maxPriceINR!,
            );
        }

        if (
          input.minMemoryGB !==
          undefined
        ) {
          products =
            products.filter(
              (product) =>
                product
                  .memory
                  .capacityGB >=
                input.minMemoryGB!,
            );
        }

        toolCompleted(
          "search_products",
          "Catalog searched",
          `${products.length} matching product(s) found.`,
        );

        return success({
          count:
            products.length,

          products:
            products.map(
              serializeProduct,
            ),

          nextStep:
            products.length > 0
              ? "Inspect the exact configurations that appear relevant before making a recommendation."
              : "Broaden the search or ask the user for a missing requirement.",
        });
      },
    },

    {
      name:
        "compare_products",

      title:
        "Compare laptops",

      description:
        "Compare up to three exact NOVNA laptop configurations against the user's actual decision goal. Use this when the user is choosing between concrete options.",

      inputSchema:
        compareProductsSchema,

      annotations: {
        readOnlyHint:
          false,
      },

      execute: (
        rawInput,
      ) => {
        const input =
          rawInput as {
            productIds?:
              string[];
          };

        toolStarted(
          "compare_products",
          "Comparing options",
          "The agent is comparing the actual trade-offs between the selected configurations.",
        );

        if (
          !input.productIds ||
          input.productIds.length ===
            0
        ) {
          toolFailed(
            "compare_products",
            "Comparison failed",
            "No products were selected.",
          );

          return failure(
            "MISSING_PRODUCTS",
            "At least one product ID is required.",
          );
        }

        if (
          input.productIds.length >
          3
        ) {
          toolFailed(
            "compare_products",
            "Comparison failed",
            "NOVNA compares at most three products at once.",
          );

          return failure(
            "TOO_MANY_PRODUCTS",
            "NOVNA compares at most three products at once.",
          );
        }

        const state =
          handlers.getState();

        const products =
          input.productIds
            .map(
              getLaptopById,
            )
            .filter(
              (
                product,
              ): product is Laptop =>
                product !==
                undefined,
            );

        if (
          products.length !==
          input.productIds.length
        ) {
          toolFailed(
            "compare_products",
            "Comparison failed",
            "One or more product IDs are invalid.",
          );

          return failure(
            "INVALID_PRODUCT",
            "One or more product IDs are not in the NOVNA catalog.",
          );
        }

        const result =
          compareProducts(
            products,
            state,
          );

        handlers.setComparedProducts(
          input.productIds,
        );

        emitAgentEvent({
          type:
            "COMPARISON_UPDATED",

          toolName:
            "compare_products",

          title:
            "Comparison updated",

          message:
            `${products.length} laptop(s) are now being compared.`,
        });

        toolCompleted(
          "compare_products",
          "Comparison ready",
          `${products.length} laptop(s) compared.`,
        );

        return success({
          ...result,

          nextStep:
            "Explain the meaningful trade-offs. Do not reduce the decision to a single arbitrary score.",
        });
      },
    },

    {
      name:
        "find_value_alternatives",

      title:
        "Find value alternatives",

      description:
        "Find alternatives that may be cheaper or better aligned with the user's goal. A cheaper product is not automatically a better decision.",

      inputSchema:
        valueAlternativesSchema,

      annotations: {
        readOnlyHint:
          true,
      },

      execute: (
        rawInput,
      ) => {
        const input =
          rawInput as {
            productId?:
              string;

            direction?:
              | "CHEAPER"
              | "BETTER_FIT"
              | "EITHER";
          };

        toolStarted(
          "find_value_alternatives",
          "Looking for better value",
          "The agent is checking whether the user can achieve the same goal without unnecessary spending.",
        );

        if (
          !input.productId
        ) {
          toolFailed(
            "find_value_alternatives",
            "Alternative search failed",
            "No product was specified.",
          );

          return failure(
            "MISSING_PRODUCT_ID",
            "A productId is required.",
          );
        }

        const product =
          getLaptopById(
            input.productId,
          );

        if (!product) {
          toolFailed(
            "find_value_alternatives",
            "Product not found",
            "That product is not in NOVNA's verified catalog.",
          );

          return failure(
            "PRODUCT_NOT_FOUND",
            "The requested product was not found.",
          );
        }

        const state =
          handlers.getState();

        const result =
          findValueAlternatives(
            product,
            state,
            input.direction ??
              "EITHER",
          );

        toolCompleted(
          "find_value_alternatives",
          "Value alternatives found",
          `${result.alternatives.length} alternative(s) evaluated.`,
        );

        return success(
          result,
        );
      },
    },

    {
      name:
        "evaluate_wait_vs_buy",

      title:
        "Evaluate wait versus buy",

      description:
        "Evaluate whether buying now or waiting makes sense. NOVNA must never invent future prices, discounts, launches or product releases.",

      inputSchema:
        waitDecisionSchema,

      annotations: {
        readOnlyHint:
          true,
      },

      execute: (
        rawInput,
      ) => {
        const input =
          rawInput as {
            productId?:
              string;

            reason?:
              string;
          };

        toolStarted(
          "evaluate_wait_vs_buy",
          "Evaluating buy versus wait",
          "The agent is checking whether waiting is justified by the actual decision—not by an invented future discount.",
        );

        const state =
          handlers.getState();

        const product =
          input.productId
            ? getLaptopById(
                input.productId,
              )
            : undefined;

        if (
          input.productId &&
          !product
        ) {
          toolFailed(
            "evaluate_wait_vs_buy",
            "Wait analysis failed",
            "The requested product was not found.",
          );

          return failure(
            "PRODUCT_NOT_FOUND",
            "The requested product was not found.",
          );
        }

        const result =
          evaluateWaitVsBuy(
            state,
            product,
            input.reason,
          );

        toolCompleted(
          "evaluate_wait_vs_buy",
          "Buy versus wait evaluated",
          result.decision,
        );

        return success(
          result,
        );
      },
    },

    {
      name:
        "surface_product",

      title:
        "Surface product in NOVNA",

      description:
        "Bring a specific verified laptop into the user's active decision space. Use this when the agent has found an option worth the user's attention. This changes the human-visible state.",

      inputSchema:
        productIdSchema,

      annotations: {
        readOnlyHint:
          false,
      },

      execute: (
        rawInput,
      ) => {
        const input =
          rawInput as {
            productId?:
              string;
          };

        toolStarted(
          "surface_product",
          "Putting an option in front of you",
          "The agent is adding a product to your active decision space.",
        );

        if (
          !input.productId
        ) {
          toolFailed(
            "surface_product",
            "Surface action failed",
            "No product was specified.",
          );

          return failure(
            "MISSING_PRODUCT_ID",
            "A productId is required.",
          );
        }

        const product =
          getLaptopById(
            input.productId,
          );

        if (!product) {
          toolFailed(
            "surface_product",
            "Product not found",
            "That product is not in NOVNA's verified catalog.",
          );

          return failure(
            "PRODUCT_NOT_FOUND",
            "The requested product was not found.",
          );
        }

        handlers.considerProduct(
          product.id,
        );

        emitAgentEvent({
          type:
            "PRODUCT_SURFACED",

          toolName:
            "surface_product",

          title:
            "Agent surfaced an option",

          message:
            `${product.brand} ${product.model} is now in your decision space.`,

          productId:
            product.id,
   });

        toolCompleted(
          "surface_product",
          "Option surfaced",
          `${product.brand} ${product.model} added to your decision space.`,
          product.id,
        );

        return success({
          action:
            "SURFACED",

          product:
            serializeProduct(
              product,
            ),

          message:
            "The product is now part of the user's active decision space.",

          nextStep:
            "Explain why the product was surfaced and what trade-off the user should consider.",
        });
      },
    },

    {
      name:
        "challenge_decision",

      title:
        "Challenge a decision",

      description:
        "Challenge an assumption in the current purchase decision using the user's actual goal, behavior and verified product facts. Use this when the user may be optimizing for price, brand, specifications or status instead of the underlying need.",

      inputSchema:
        challengeDecisionSchema,

      annotations: {
        readOnlyHint:
          false,
      },

      execute: (
        rawInput,
      ) => {
        const input =
          rawInput as {
            assumption?:
              string;

            productId?:
              string;
          };

        toolStarted(
          "challenge_decision",
          "Challenging the decision",
          "The agent is checking whether an assumption is actually helping the user's goal.",
        );

        if (
          !input.assumption
        ) {
          toolFailed(
            "challenge_decision",
            "Challenge failed",
            "No assumption was provided.",
          );

          return failure(
            "MISSING_ASSUMPTION",
            "An assumption is required.",
          );
        }

        const state =
          handlers.getState();

        const product =
          input.productId
            ? getLaptopById(
                input.productId,
              )
            : undefined;

        if (
          input.productId &&
          !product
        ) {
          toolFailed(
            "challenge_decision",
            "Challenge failed",
            "The specified product was not found.",
          );

          return failure(
            "PRODUCT_NOT_FOUND",
            "The requested product was not found.",
          );
        }

        const result =
          challengeDecision(
            state,
            input.assumption,
            product,
          );

        if (
          result.insight
        ) {
          handlers.addInsight(
            result.insight,
          );

          emitAgentEvent({
            type:
              "INSIGHT_CREATED",

            toolName:
              "challenge_decision",

            title:
              "Agent found something worth questioning",

            message:
              result.insight,
          });
        }

        toolCompleted(
          "challenge_decision",
          "Decision challenged",
          result.insight,
        );

        return success(
          result,
        );
      },
    },
  ];
}