export type DecisionOutcome =
  | "BUY_NOW"
  | "BUY_CHEAPER"
  | "SPEND_MORE"
  | "WAIT"
  | "DONT_BUY"
  | "KEEP_CURRENT"
  | "ALTERNATIVE";

export type Urgency = "NOW" | "SOON" | "CAN_WAIT";

export type ProductSource = {
  manufacturer: string;
  productPage: string;
  pricePage?: string;
  priceCheckedAt: string;
  priceType: "MRP" | "LISTED_PRICE" | "UNAVAILABLE";
};

export type ProductImage = {
  localPath: string;
  sourcePage: string;
  alt: string;
};

export type Verified<T> = {
  value: T;
  source: string;
};

export type Laptop = {
  id: string;

  brand: string;
  family: string;
  model: string;
  variant: string;

  priceINR: number | null;
  currency: "INR";

  source: ProductSource;
  image: ProductImage;

  operatingSystem: string;

  processor: {
    name: string;
    cores?: number;
    threads?: number;
    maxClockGHz?: number;
    npuTOPS?: number;
  };

  graphics: {
    name: string;
    type: "INTEGRATED" | "DEDICATED";
  };

  memory: {
    capacityGB: number;
    type: string;
    onboard?: boolean;
  };

  storage: {
    capacityGB: number;
    type: string;
    interface?: string;
  };

  display: {
    sizeInches: number;
    resolution: string;
    panel: string;
    refreshRateHz?: number;
    brightnessNits?: number;
    colorGamut?: string;
    touch?: boolean;
  };

  battery: {
    capacityWh?: number;
    claimedVideoHours?: number;
    claimedWebHours?: number;
  };

  physical: {
    weightKg?: number;
    dimensionsCm?: string;
  };

  connectivity: string[];

  camera: string;

  ports: string[];

  includedSoftware?: string[];

  warranty?: string;

  useCases: string[];

  notes?: string[];
};

export type UserGoal = {
  description: string;
  budgetMinINR: number;
  budgetMaxINR: number;
  urgency: Urgency;
  requiredUseCases: string[];
  priorities: string[];
};

export type DecisionState = {
  goal: UserGoal;

  consideredProductIds: string[];
  rejectedProductIds: string[];
  comparedProductIds: string[];

  activeProductId: string | null;

  inferredPreferences: string[];

  insights: string[];

  currentOutcome: DecisionOutcome | null;
};