import type {
  DecisionOutcome,
  DecisionState,
  Laptop,
} from "@/types";

export type DecisionFactor = {
  id: string;
  label: string;
  status: "GOOD" | "CAUTION" | "PROBLEM" | "UNKNOWN";
  explanation: string;
};

export type ProductEvaluation = {
  productId: string;
  outcome: DecisionOutcome;
  fit: "STRONG" | "GOOD" | "MIXED" | "WEAK" | "UNKNOWN";

  factors: DecisionFactor[];

  reasons: string[];

  tradeoffs: string[];

  confidence: "HIGH" | "MEDIUM" | "LOW";
};

export type DecisionResult = {
  outcome: DecisionOutcome;

  headline: string;

  explanation: string;

  recommendedProductId: string | null;

  evaluation: ProductEvaluation | null;

  alternatives: ProductEvaluation[];

  warnings: string[];
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function hasUseCase(product: Laptop, useCase: string) {
  const target = normalize(useCase);

  return product.useCases.some(
    (item) => normalize(item) === target,
  );
}

function evaluateBudget(
  product: Laptop,
  state: DecisionState,
): DecisionFactor {
  if (product.priceINR === null) {
    return {
      id: "budget",
      label: "Price",
      status: "UNKNOWN",
      explanation:
        "A current price could not be verified for this exact configuration.",
    };
  }

  const { budgetMinINR, budgetMaxINR } = state.goal;

  if (product.priceINR > budgetMaxINR) {
    const difference = product.priceINR - budgetMaxINR;

    return {
      id: "budget",
      label: "Budget",
      status: "PROBLEM",
      explanation: `This is ₹${difference.toLocaleString(
        "en-IN",
      )} above your stated maximum.`,
    };
  }

  if (product.priceINR < budgetMinINR) {
    return {
      id: "budget",
      label: "Budget",
      status: "GOOD",
      explanation:
        "This sits below the lower end of your stated budget, leaving money available for other priorities.",
    };
  }

  if (product.priceINR >= budgetMaxINR * 0.9) {
    return {
      id: "budget",
      label: "Budget",
      status: "CAUTION",
      explanation:
        "This is close to the top of your stated budget.",
    };
  }

  return {
    id: "budget",
    label: "Budget",
    status: "GOOD",
    explanation:
      "This fits within your stated budget.",
  };
}

function evaluateMemory(product: Laptop): DecisionFactor {
  const memory = product.memory.capacityGB;

  if (memory >= 32) {
    return {
      id: "memory",
      label: "Memory",
      status: "GOOD",
      explanation:
        "32GB provides substantial headroom for demanding multitasking and professional workloads.",
    };
  }

  if (memory >= 16) {
    return {
      id: "memory",
      label: "Memory",
      status: "GOOD",
      explanation:
        "16GB is a solid baseline for general productivity, study and development.",
    };
  }

  return {
    id: "memory",
    label: "Memory",
    status: "CAUTION",
    explanation:
      "Memory capacity is relatively limited for demanding long-term workloads.",
  };
}

function evaluateStorage(product: Laptop): DecisionFactor {
  const storage = product.storage.capacityGB;

  if (storage >= 1024) {
    return {
      id: "storage",
      label: "Storage",
      status: "GOOD",
      explanation:
        "1TB or more gives useful room for applications, projects and large files.",
    };
  }

  if (storage >= 512) {
    return {
      id: "storage",
      label: "Storage",
      status: "GOOD",
      explanation:
        "512GB provides a reasonable starting point for everyday use.",
    };
  }

  return {
    id: "storage",
    label: "Storage",
    status: "CAUTION",
    explanation:
      "The available storage may become restrictive as your projects and files grow.",
  };
}

function evaluatePortability(product: Laptop): DecisionFactor {
  const weight = product.physical.weightKg;

  if (weight === undefined) {
    return {
      id: "portability",
      label: "Portability",
      status: "UNKNOWN",
      explanation:
        "Weight could not be verified for this exact configuration.",
    };
  }

  if (weight <= 1.2) {
    return {
      id: "portability",
      label: "Portability",
      status: "GOOD",
      explanation:
        "At 1.2kg or less, this is particularly easy to carry regularly.",
    };
  }

  if (weight <= 1.6) {
    return {
      id: "portability",
      label: "Portability",
      status: "GOOD",
      explanation:
        "The weight is reasonable for a laptop intended to move around frequently.",
    };
  }

  if (weight <= 2) {
    return {
      id: "portability",
      label: "Portability",
      status: "CAUTION",
      explanation:
        "This is portable, but you will notice the additional weight compared with lighter options.",
    };
  }

  return {
    id: "portability",
    label: "Portability",
    status: "PROBLEM",
    explanation:
      "The weight makes this less attractive for frequent travel or carrying.",
  };
}

function evaluateDisplay(product: Laptop): DecisionFactor {
  const { panel, resolution, refreshRateHz } =
    product.display;

  const isHighQuality =
    panel.toLowerCase().includes("oled") ||
    resolution.includes("2880") ||
    resolution.includes("3840");

  if (isHighQuality) {
    return {
      id: "display",
      label: "Display",
      status: "GOOD",
      explanation: `${panel} display at ${resolution}${
        refreshRateHz ? ` and ${refreshRateHz}Hz` : ""
      }.`,
    };
  }

  return {
    id: "display",
    label: "Display",
    status: "GOOD",
    explanation: `${panel} display at ${resolution}.`,
  };
}

function evaluateUseCases(
  product: Laptop,
  state: DecisionState,
): DecisionFactor {
  const required = state.goal.requiredUseCases;

  if (required.length === 0) {
    return {
      id: "use-cases",
      label: "Use-case fit",
      status: "UNKNOWN",
      explanation:
        "No specific use cases have been defined yet.",
    };
  }

  const matched = required.filter((useCase) =>
    hasUseCase(product, useCase),
  );

  if (matched.length === required.length) {
    return {
      id: "use-cases",
      label: "Use-case fit",
      status: "GOOD",
      explanation:
        "The product's listed use cases cover the requirements you've provided.",
    };
  }

  if (matched.length > 0) {
    return {
      id: "use-cases",
      label: "Use-case fit",
      status: "CAUTION",
      explanation: `It matches ${matched.length} of ${required.length} stated use cases.`,
    };
  }

  return {
    id: "use-cases",
    label: "Use-case fit",
    status: "PROBLEM",
    explanation:
      "Its listed use cases do not clearly match the requirements you've provided.",
  };
}

export function evaluateProduct(
  product: Laptop,
  state: DecisionState,
): ProductEvaluation {
  const factors = [
    evaluateBudget(product, state),
    evaluateMemory(product),
    evaluateStorage(product),
    evaluatePortability(product),
    evaluateDisplay(product),
    evaluateUseCases(product, state),
  ];

  const problems = factors.filter(
    (factor) => factor.status === "PROBLEM",
  );

  const cautions = factors.filter(
    (factor) => factor.status === "CAUTION",
  );

  const unknowns = factors.filter(
    (factor) => factor.status === "UNKNOWN",
  );

  let fit: ProductEvaluation["fit"];

  if (problems.length >= 2) {
    fit = "WEAK";
  } else if (problems.length === 1) {
    fit = "MIXED";
  } else if (cautions.length >= 2) {
    fit = "MIXED";
  } else if (unknowns.length >= 2) {
    fit = "UNKNOWN";
  } else if (cautions.length === 1) {
    fit = "GOOD";
  } else {
    fit = "STRONG";
  }

  const reasons: string[] = [];
  const tradeoffs: string[] = [];

  for (const factor of factors) {
    if (factor.status === "GOOD") {
      reasons.push(factor.explanation);
    }

    if (
      factor.status === "CAUTION" ||
      factor.status === "PROBLEM"
    ) {
      tradeoffs.push(factor.explanation);
    }
  }

  let outcome: DecisionOutcome;

  if (fit === "WEAK") {
    outcome = "ALTERNATIVE";
  } else if (
    product.priceINR !== null &&
    product.priceINR > state.goal.budgetMaxINR
  ) {
    outcome = "SPEND_MORE";
  } else if (
    product.priceINR !== null &&
    product.priceINR < state.goal.budgetMinINR &&
    fit === "STRONG"
  ) {
    outcome = "BUY_CHEAPER";
  } else {
    outcome = "BUY_NOW";
  }

  const confidence =
    unknowns.length === 0
      ? "HIGH"
      : unknowns.length <= 1
        ? "MEDIUM"
        : "LOW";

  return {
    productId: product.id,
    outcome,
    fit,
    factors,
    reasons,
    tradeoffs,
    confidence,
  };
}

export function evaluateDecision(
  state: DecisionState,
  products: Laptop[],
): DecisionResult {
  if (products.length === 0) {
    return {
      outcome: "ALTERNATIVE",
      headline: "We need more options.",
      explanation:
        "NOVNA doesn't have enough products to make a useful comparison.",
      recommendedProductId: null,
      evaluation: null,
      alternatives: [],
      warnings: ["No products are available."],
    };
  }

  const evaluations = products.map((product) =>
    evaluateProduct(product, state),
  );

  const ranked = [...evaluations].sort((a, b) => {
    const rank = {
      STRONG: 4,
      GOOD: 3,
      MIXED: 2,
      UNKNOWN: 1,
      WEAK: 0,
    };

    return rank[b.fit] - rank[a.fit];
  });

  const best = ranked[0];

  if (!best) {
    return {
      outcome: "ALTERNATIVE",
      headline: "No clear fit yet.",
      explanation:
        "NOVNA needs more information before making this decision.",
      recommendedProductId: null,
      evaluation: null,
      alternatives: [],
      warnings: [],
    };
  }

  const bestProduct = products.find(
    (product) => product.id === best.productId,
  );

  if (!bestProduct) {
    return {
      outcome: "ALTERNATIVE",
      headline: "No clear fit yet.",
      explanation:
        "NOVNA couldn't resolve the selected product.",
      recommendedProductId: null,
      evaluation: null,
      alternatives: [],
      warnings: [],
    };
  }

  let outcome = best.outcome;
  let headline = "This looks like a strong fit.";
  let explanation =
    "The current requirements and product facts point toward this option.";

  if (best.fit === "WEAK") {
    outcome = "ALTERNATIVE";
    headline = "Don't force this choice.";
    explanation =
      "NOVNA found important mismatches between this option and your stated needs.";
  } else if (best.outcome === "BUY_CHEAPER") {
    headline = "You may not need to spend your full budget.";
    explanation =
      "This option appears to cover the current requirements without using the entire budget.";
  } else if (best.outcome === "SPEND_MORE") {
    headline = "Your requirements may justify spending more.";
    explanation =
      "The stronger fit sits beyond your current budget, so the trade-off deserves attention.";
  }

  const warnings = best.tradeoffs.slice(0, 3);

  return {
    outcome,
    headline,
    explanation,
    recommendedProductId: bestProduct.id,
    evaluation: best,
    alternatives: ranked.slice(1, 4),
    warnings,
  };
}