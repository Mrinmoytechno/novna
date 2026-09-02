export const emptySchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
} as const;

export const productIdSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      description: "The exact NOVNA product ID.",
    },
  },
  required: ["productId"],
  additionalProperties: false,
} as const;

export const searchProductsSchema = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description:
        "Natural-language search query such as coding, OLED, lightweight, MacBook, or gaming.",
    },
    maxPriceINR: {
      type: "number",
      description:
        "Optional maximum price in Indian rupees.",
    },
    minMemoryGB: {
      type: "number",
      description:
        "Optional minimum RAM capacity in GB.",
    },
  },
  required: ["query"],
  additionalProperties: false,
} as const;

export const compareProductsSchema = {
  type: "object",
  properties: {
    productIds: {
      type: "array",
      description:
        "One to three exact NOVNA product IDs to compare.",
      items: {
        type: "string",
      },
      minItems: 1,
      maxItems: 3,
    },
  },
  required: ["productIds"],
  additionalProperties: false,
} as const;

export const valueAlternativesSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      description:
        "The product for which NOVNA should find alternatives.",
    },
    direction: {
      type: "string",
      enum: ["CHEAPER", "BETTER_FIT", "EITHER"],
      description:
        "Whether to prioritize a cheaper option, better fit, or either.",
    },
  },
  required: ["productId"],
  additionalProperties: false,
} as const;

export const waitDecisionSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      description:
        "Optional product currently being considered.",
    },
    reason: {
      type: "string",
      description:
        "Optional reason the user may be considering waiting.",
    },
  },
  additionalProperties: false,
} as const;

export const challengeDecisionSchema = {
  type: "object",
  properties: {
    assumption: {
      type: "string",
      description:
        "The assumption or decision NOVNA should challenge.",
    },
    productId: {
      type: "string",
      description:
        "Optional product associated with the assumption.",
    },
  },
  required: ["assumption"],
  additionalProperties: false,
} as const;