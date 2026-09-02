import type { DecisionState, Laptop } from "@/types";

export type PreferenceSignal = {
  id: string;
  label: string;
  explanation: string;
  strength: "LOW" | "MEDIUM" | "HIGH";
};

export function inferPreferences(
  state: DecisionState,
  products: Laptop[],
): PreferenceSignal[] {
  const considered = products.filter((product) =>
    state.consideredProductIds.includes(product.id),
  );

  const rejected = products.filter((product) =>
    state.rejectedProductIds.includes(product.id),
  );

  const signals: PreferenceSignal[] = [];

  if (considered.length > 0) {
    const averageWeight =
      considered.reduce(
        (sum, product) => sum + (product.physical.weightKg ?? 0),
        0,
      ) / considered.length;

    if (averageWeight > 0 && averageWeight <= 1.5) {
      signals.push({
        id: "portability",
        label: "Portability matters",
        explanation:
          "Most laptops you've considered are around 1.5kg or lighter.",
        strength: "HIGH",
      });
    }

    const sixteenGBOrMore = considered.filter(
      (product) => product.memory.capacityGB >= 16,
    );

    if (sixteenGBOrMore.length === considered.length) {
      signals.push({
        id: "memory",
        label: "16GB+ memory appears important",
        explanation:
          "Every laptop you've considered has at least 16GB of memory.",
        strength: "MEDIUM",
      });
    }

    const oledCount = considered.filter(
      (product) => product.display.panel.toLowerCase() === "oled",
    );

    if (oledCount.length >= 2) {
      signals.push({
        id: "display",
        label: "You seem drawn to OLED",
        explanation:
          "You've repeatedly considered laptops with OLED displays.",
        strength: "MEDIUM",
      });
    }

    const maxPrice = Math.max(
      ...considered
        .map((product) => product.priceINR)
        .filter((price): price is number => price !== null),
    );

    if (maxPrice >= state.goal.budgetMaxINR * 0.9) {
      signals.push({
        id: "budget",
        label: "You're exploring near the top of your budget",
        explanation:
          "Your shortlist is reaching the upper edge of your stated budget.",
        strength: "MEDIUM",
      });
    }
  }

  if (rejected.length >= 2) {
    const lowMemoryRejected = rejected.filter(
      (product) => product.memory.capacityGB < 16,
    );

    if (lowMemoryRejected.length >= 2) {
      signals.push({
        id: "memory-rejection",
        label: "You consistently reject lower-memory options",
        explanation:
          "Multiple rejected laptops had less than 16GB of memory.",
        strength: "HIGH",
      });
    }
  }

  return signals;
}