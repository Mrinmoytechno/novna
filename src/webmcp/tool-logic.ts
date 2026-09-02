import type {
  DecisionState,
  Laptop,
} from "@/types";

import {
  laptops,
} from "@/data/laptops";

import {
  evaluateProduct,
} from "@/lib/decision-engine";

function priceDifference(
  a: number | null,
  b: number | null,
) {
  if (
    a === null ||
    b === null
  ) {
    return null;
  }

  return a - b;
}

export function compareProducts(
  products: Laptop[],
  state: DecisionState,
) {
  const evaluations =
    products.map((product) => ({
      product: {
        id: product.id,
        brand: product.brand,
        family: product.family,
        model: product.model,
        variant: product.variant,
        priceINR: product.priceINR,
        memoryGB:
          product.memory.capacityGB,
        storageGB:
          product.storage.capacityGB,
        weightKg:
          product.physical.weightKg ?? null,
        display:
          product.display,
      },

      evaluation:
        evaluateProduct(
          product,
          state,
        ),
    }));

  return {
    products: evaluations,

    comparison: {
      lowestPriceINR:
        products
          .map(
            (product) =>
              product.priceINR,
          )
          .filter(
            (
              price,
            ): price is number =>
              price !== null,
          )
          .sort(
            (a, b) =>
              a - b,
          )[0] ?? null,

      highestPriceINR:
        products
          .map(
            (product) =>
              product.priceINR,
          )
          .filter(
            (
              price,
            ): price is number =>
              price !== null,
          )
          .sort(
            (a, b) =>
              b - a,
          )[0] ?? null,

      productCount:
        products.length,
    },
  };
}

export function findValueAlternatives(
  target: Laptop,
  state: DecisionState,
  direction:
    | "CHEAPER"
    | "BETTER_FIT"
    | "EITHER",
) {
  const candidates =
    laptops
      .filter(
        (product) =>
          product.id !== target.id,
      )
      .map((product) => ({
        product,

        evaluation:
          evaluateProduct(
            product,
            state,
          ),
      }));

  const fitRank = {
    STRONG: 4,
    GOOD: 3,
    MIXED: 2,
    UNKNOWN: 1,
    WEAK: 0,
  };

  const ranked =
    candidates.sort(
      (a, b) => {
        if (
          direction ===
          "CHEAPER"
        ) {
          const aCheaper =
            a.product.priceINR !==
              null &&
            target.priceINR !==
              null &&
            a.product.priceINR <
              target.priceINR;

          const bCheaper =
            b.product.priceINR !==
              null &&
            target.priceINR !==
              null &&
            b.product.priceINR <
              target.priceINR;

          if (
            aCheaper !==
            bCheaper
          ) {
            return aCheaper
              ? -1
              : 1;
          }
        }

        const fitDifference =
          fitRank[
            b.evaluation.fit
          ] -
          fitRank[
            a.evaluation.fit
          ];

        if (
          fitDifference !== 0
        ) {
          return fitDifference;
        }

        return (
          (a.product
            .priceINR ??
            Infinity) -
          (b.product
            .priceINR ??
            Infinity)
        );
      },
    );

  return {
    target: {
      id: target.id,
      brand: target.brand,
      model: target.model,
      variant: target.variant,
      priceINR:
        target.priceINR,
    },

    alternatives:
      ranked
        .slice(0, 5)
        .map(
          ({
            product,
            evaluation,
          }) => ({
            product: {
              id:
                product.id,
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
            },

            evaluation,

            savingsINR:
              priceDifference(
                target.priceINR,
                product.priceINR,
              ),
          }),
        ),
  };
}

export function evaluateWaitVsBuy(
  state: DecisionState,
  product?: Laptop,
  reason?: string,
) {
  if (!product) {
    return {
      decision:
        "INSUFFICIENT_INFORMATION",

      reason:
        "There is no specific product to evaluate against the current goal.",

      userReason:
        reason ?? null,
    };
  }

  const evaluation =
    evaluateProduct(
      product,
      state,
    );

  if (
    state.goal.urgency ===
    "NOW"
  ) {
    return {
      decision:
        "BUY_NOW_MAY_BE_JUSTIFIED",

      reason:
        "The user marked the purchase as urgent, so waiting has a meaningful opportunity cost.",

      productId:
        product.id,

      evaluation,
    };
  }

  if (
    evaluation.fit ===
      "WEAK" ||
    evaluation.fit ===
      "MIXED"
  ) {
    return {
      decision:
        "WAIT_AND_REASSESS",

      reason:
        "The current product does not clearly fit the stated requirements. Waiting is preferable to forcing a poor purchase.",

      productId:
        product.id,

      evaluation,
    };
  }

  return {
    decision:
      "BUY_NOW_OR_WAIT",

    reason:
      "The product fits reasonably well, but NOVNA has no verified future price or release information. It will not invent a future discount.",

    productId:
      product.id,

    evaluation,
  };
}

export function challengeDecision(
  state: DecisionState,
  assumption: string,
  product?: Laptop,
) {
  const normalized =
    assumption
      .trim()
      .toLowerCase();

  if (
    normalized.includes(
      "discount",
    ) ||
    normalized.includes(
      "sale",
    ) ||
    normalized.includes(
      "cheaper",
    ) ||
    normalized.includes(
      "deal",
    )
  ) {
    return {
      challenged: true,

      insight:
        "A lower price is not automatically a better decision. NOVNA should first verify whether the product actually meets the user's requirements.",

      severity:
        "MEDIUM",
    };
  }

  if (
    normalized.includes(
      "most expensive",
    ) ||
    normalized.includes(
      "expensive",
    ) ||
    normalized.includes(
      "premium",
    )
  ) {
    return {
      challenged: true,

      insight:
        "Higher price does not automatically mean better value. The additional capability should be connected to an actual need.",

      severity:
        "HIGH",
    };
  }

  if (
    normalized.includes(
      "most powerful",
    ) ||
    normalized.includes(
      "best",
    ) ||
    normalized.includes(
      "highest spec",
    )
  ) {
    return {
      challenged: true,

      insight:
        "The most powerful laptop may be unnecessary if the user's actual workload does not benefit from that additional capability.",

      severity:
        "HIGH",
    };
  }

  if (
    normalized.includes(
      "macbook",
    ) ||
    normalized.includes(
      "apple",
    )
  ) {
    return {
      challenged: true,

      insight:
        "Brand preference should not automatically become a requirement unless it changes something important about the user's actual work.",

      severity:
        "MEDIUM",
    };
  }

  if (product) {
    const evaluation =
      evaluateProduct(
        product,
        state,
      );

    return {
      challenged:
        evaluation.tradeoffs
          .length > 0,

      insight:
        evaluation
          .tradeoffs.length > 0
          ? `NOVNA found ${evaluation.tradeoffs.length} trade-off(s) worth questioning before purchasing this product.`
          : "NOVNA did not find a major mismatch in the currently available verified information.",

      severity:
        evaluation
          .tradeoffs.length > 1
          ? "HIGH"
          : "LOW",
    };
  }

  return {
    challenged: true,

    insight:
      "Before committing, NOVNA should verify that this assumption is actually necessary for the user's stated goal.",

    severity:
      "LOW",
  };
}