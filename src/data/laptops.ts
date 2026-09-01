import type { Laptop } from "@/types";

export const laptops: Laptop[] = [
  {
    id: "apple-macbook-air-15-m5-16-512",
    brand: "Apple",
    family: "MacBook Air",
    model: "MacBook Air 15-inch",
    variant: "M5 · 16GB · 512GB",

    priceINR: 144900,
    currency: "INR",

    source: {
      manufacturer: "Apple",
      productPage: "https://www.apple.com/in/macbook-air/",
      pricePage:
        "https://www.apple.com/in/shop/buy-mac/macbook-air/15-inch",
      priceCheckedAt: "2026-09-01",
      priceType: "MRP",
    },

    image: {
      localPath: "/products/apple-macbook-air-15-m5.webp",
      sourcePage: "https://www.apple.com/in/macbook-air/",
      alt: "Apple MacBook Air 15-inch with M5",
    },

    operatingSystem: "macOS",

    processor: {
      name: "Apple M5",
      cores: 10,
      threads: 10,
    },

    graphics: {
      name: "Apple M5 10-core GPU",
      type: "INTEGRATED",
    },

    memory: {
      capacityGB: 16,
      type: "Unified Memory",
      onboard: true,
    },

    storage: {
      capacityGB: 512,
      type: "SSD",
    },

    display: {
      sizeInches: 15.3,
      resolution: "2880 × 1864",
      panel: "Liquid Retina IPS",
      brightnessNits: 500,
      colorGamut: "P3",
      touch: false,
    },

    battery: {
      capacityWh: 66.5,
      claimedVideoHours: 18,
      claimedWebHours: 15,
    },

    physical: {
      weightKg: 1.51,
      dimensionsCm: "34.04 × 23.76 × 1.15",
    },

    connectivity: [
      "Wi-Fi 7",
      "Bluetooth 6",
    ],

    camera: "12MP Center Stage camera",

    ports: [
      "2 × Thunderbolt 4 / USB-C",
      "MagSafe 3",
      "3.5mm headphone jack",
    ],

    includedSoftware: [
      "macOS",
      "Apple Intelligence",
    ],

    useCases: [
      "study",
      "coding",
      "productivity",
      "creative",
      "portable work",
    ],

    warranty: "Apple limited warranty",
  },

  {
    id: "asus-zenbook-a14-ux3407qa-16-512",
    brand: "ASUS",
    family: "Zenbook A14",
    model: "Zenbook A14 UX3407",
    variant: "UX3407QA · Snapdragon X · 16GB · 512GB",

    priceINR: 86990,
    currency: "INR",

    source: {
      manufacturer: "ASUS",
      productPage:
        "https://www.asus.com/in/laptops/for-home/zenbook/asus-zenbook-a14-ux3407/",
      pricePage:
        "https://in.store.asus.com/",
      priceCheckedAt: "2026-09-01",
      priceType: "LISTED_PRICE",
    },

    image: {
      localPath: "/products/asus-zenbook-a14-ux3407.webp",
      sourcePage:
        "https://www.asus.com/in/laptops/for-home/zenbook/asus-zenbook-a14-ux3407/",
      alt: "ASUS Zenbook A14 UX3407",
    },

    operatingSystem: "Windows 11 Home",

    processor: {
      name: "Qualcomm Snapdragon X X1 26 100",
      cores: 8,
      threads: 8,
      maxClockGHz: 2.97,
      npuTOPS: 45,
    },

    graphics: {
      name: "Qualcomm Adreno GPU",
      type: "INTEGRATED",
    },

    memory: {
      capacityGB: 16,
      type: "LPDDR5X",
      onboard: true,
    },

    storage: {
      capacityGB: 512,
      type: "NVMe SSD",
      interface: "PCIe 4.0",
    },

    display: {
      sizeInches: 14,
      resolution: "1920 × 1200",
      panel: "OLED",
      refreshRateHz: 60,
      brightnessNits: 600,
      colorGamut: "100% DCI-P3",
      touch: false,
    },

    battery: {
      capacityWh: 70,
    },

    physical: {
      weightKg: 0.98,
      dimensionsCm: "31.07 × 21.39 × 1.34–1.59",
    },

    connectivity: [
      "Wi-Fi 6E",
      "Bluetooth 5.3",
    ],

    camera: "FHD IR camera",

    ports: [
      "2 × USB4 Type-C",
      "1 × USB 3.2 Type-A",
      "HDMI 2.1 TMDS",
      "3.5mm audio jack",
    ],

    includedSoftware: [
      "Windows 11 Home",
      "Microsoft Office Home 2024",
      "Microsoft 365 Basic 100GB for 1 year",
    ],

    warranty: "1 year manufacturer's limited warranty",

    useCases: [
      "study",
      "coding",
      "productivity",
      "portable work",
      "travel",
    ],
  },

  {
    id: "asus-zenbook-14-ux3405ma-pz752ws",
    brand: "ASUS",
    family: "Zenbook 14",
    model: "Zenbook 14 OLED UX3405",
    variant: "UX3405MA-PZ752WS · Core Ultra 7 155H · 16GB · 1TB",

    priceINR: 134990,
    currency: "INR",

    source: {
      manufacturer: "ASUS",
      productPage:
        "https://www.asus.com/in/laptops/for-home/zenbook/asus-zenbook-14-oled-ux3405/",
      pricePage:
        "https://in.store.asus.com/light-weight-laptop-asus-zenbook-14-oled-ux3405ma.html",
      priceCheckedAt: "2026-09-01",
      priceType: "LISTED_PRICE",
    },

    image: {
      localPath: "/products/asus-zenbook-14-ux3405.webp",
      sourcePage:
        "https://www.asus.com/in/laptops/for-home/zenbook/asus-zenbook-14-oled-ux3405/",
      alt: "ASUS Zenbook 14 OLED UX3405",
    },

    operatingSystem: "Windows 11 Home",

    processor: {
      name: "Intel Core Ultra 7 155H",
      cores: 16,
      threads: 22,
      maxClockGHz: 4.8,
      npuTOPS: 11,
    },

    graphics: {
      name: "Intel Arc Graphics",
      type: "INTEGRATED",
    },

    memory: {
      capacityGB: 16,
      type: "LPDDR5X",
      onboard: true,
    },

    storage: {
      capacityGB: 1024,
      type: "NVMe SSD",
      interface: "PCIe 4.0",
    },

    display: {
      sizeInches: 14,
      resolution: "2880 × 1800",
      panel: "OLED",
      refreshRateHz: 120,
      brightnessNits: 500,
      colorGamut: "100% DCI-P3",
      touch: true,
    },

    battery: {
      capacityWh: 75,
    },

    physical: {
      weightKg: 1.2,
      dimensionsCm: "31.24 × 22.01 × 1.49",
    },

    connectivity: [
      "Wi-Fi 6E",
      "Bluetooth 5.3",
    ],

    camera: "FHD IR camera",

    ports: [
      "2 × Thunderbolt 4",
      "1 × USB 3.2 Gen 1 Type-A",
      "HDMI 2.1 TMDS",
      "3.5mm audio jack",
    ],

    includedSoftware: [
      "Windows 11 Home",
      "Microsoft Office Home 2024",
      "Microsoft 365 Basic 100GB for 1 year",
    ],

    warranty: "1 year manufacturer's limited warranty",

    useCases: [
      "study",
      "coding",
      "creative",
      "productivity",
      "portable work",
    ],
  },

  {
    id: "lenovo-yoga-slim-7i-gen11-83qm0049in",
    brand: "Lenovo",
    family: "Yoga Slim 7i Gen 11 Aura Edition",
    model: "Yoga Slim 7i",
    variant: "83QM0049IN · Core Ultra 7 · 32GB · 1TB",

    priceINR: 180991,
    currency: "INR",

    source: {
      manufacturer: "Lenovo",
      productPage:
        "https://www.lenovo.com/in/en/p/laptops/yoga/yoga-s-series/lenovo-yoga-slim-7i-gen-11-aura-edition-14-inch-intel/83qm0049in",
      pricePage:
        "https://www.lenovo.com/buy/in/en/intel/yoga-slim-series-70wh-0acz00a",
      priceCheckedAt: "2026-09-01",
      priceType: "LISTED_PRICE",
    },

    image: {
      localPath: "/products/lenovo-yoga-slim-7i-gen11.webp",
      sourcePage:
        "https://www.lenovo.com/in/en/p/laptops/yoga/yoga-s-series/lenovo-yoga-slim-7i-gen-11-aura-edition-14-inch-intel/83qm0049in",
      alt: "Lenovo Yoga Slim 7i Gen 11 Aura Edition",
    },

    operatingSystem: "Windows 11 Home",

    processor: {
      name: "Intel Core Ultra 7 355",
    },

    graphics: {
      name: "Intel integrated graphics",
      type: "INTEGRATED",
    },

    memory: {
      capacityGB: 32,
      type: "LPDDR5X",
      onboard: true,
    },

    storage: {
      capacityGB: 1024,
      type: "SSD",
      interface: "PCIe Gen4",
    },

    display: {
      sizeInches: 14,
      resolution: "2880 × 1800",
      panel: "OLED",
      refreshRateHz: 120,
    },

    battery: {
      capacityWh: 70,
    },

    physical: {
      weightKg: 1.39,
      dimensionsCm: "31.2 × 22.1 × 1.39–1.59",
    },

    connectivity: [
      "Wi-Fi 7",
      "Wi-Fi 6E",
      "Bluetooth 5.4",
    ],

    camera: "FHD IR camera",

    ports: [
      "3 × USB-C",
      "USB4",
      "Thunderbolt 4",
      "DisplayPort 2.1",
    ],

    includedSoftware: [
      "Windows 11 Home",
    ],

    useCases: [
      "coding",
      "study",
      "productivity",
      "creative",
      "professional",
    ],

    notes: [
      "Exact Lenovo India part number: 83QM0049IN.",
      "Lenovo lists this configuration with Core Ultra 7, 32GB RAM and 1TB SSD.",
      "The 14-inch Yoga Slim 7 Gen 11 family supports OLED 1920×1200 or 2880×1800 configurations; this entry uses the 2880×1800/120Hz configuration associated with this Aura Edition family.",
    ],
  },

  {
    id: "hp-omnibook-5-flip-14-fp0990tu",
    brand: "HP",
    family: "OmniBook 5",
    model: "OmniBook 5 Flip 14",
    variant: "14-fp0990TU · Core 5 120U · 16GB · 1TB",

    priceINR: 112998.99,
    currency: "INR",

    source: {
      manufacturer: "HP",
      productPage:
        "https://www.hp.com/in-en/shop/products/laptops/hp-omnibook-5-flip-2-in-1-laptop-14-fp0990tu-d7kq0pa-acj",
      pricePage:
        "https://www.hp.com/in-en/shop/products/laptops/hp-omnibook-5-flip-2-in-1-laptop-14-fp0990tu-d7kq0pa-acj",
      priceCheckedAt: "2026-09-01",
      priceType: "LISTED_PRICE",
    },

    image: {
      localPath: "/products/hp-omnibook-5-flip-14.webp",
      sourcePage:
        "https://www.hp.com/in-en/shop/products/laptops/hp-omnibook-5-flip-2-in-1-laptop-14-fp0990tu-d7kq0pa-acj",
      alt: "HP OmniBook 5 Flip 14",
    },

    operatingSystem: "Windows 11 Home Single Language",

    processor: {
      name: "Intel Core 5 120U",
    },

    graphics: {
      name: "Intel Graphics",
      type: "INTEGRATED",
    },

    memory: {
      capacityGB: 16,
      type: "System memory",
    },

    storage: {
      capacityGB: 1024,
      type: "SSD",
    },

    display: {
      sizeInches: 14,
      resolution: "1920 × 1200",
      panel: "IPS touchscreen",
      touch: true,
    },

    battery: {},

    physical: {
      weightKg: 1.62,
    },

    connectivity: [],

    camera: "HP camera",

    ports: [],

    includedSoftware: [
      "Windows 11 Home",
      "Microsoft Office Home 2024",
    ],

    warranty: "1 year limited warranty",

    useCases: [
      "study",
      "productivity",
      "office",
      "portable work",
    ],

    notes: [
      "Exact HP India SKU: 14-fp0990TU / D7KQ0PA.",
      "Convertible 2-in-1 form factor.",
    ],
  },

  {
    id: "hp-omnibook-7-14-hg0062tu",
    brand: "HP",
    family: "OmniBook 7",
    model: "OmniBook 7 Next Gen AI 14",
    variant: "14-hg0062TU · Core Ultra X7 358H · 32GB · 1TB",

    priceINR: 249999,
    currency: "INR",

    source: {
      manufacturer: "HP",
      productPage:
        "https://www.hp.com/in-en/shop/products/laptops/hp-omnibook-7-laptop-next-gen-ai-14-hg0062tu-dr5g8pa-acj",
      pricePage:
        "https://www.hp.com/in-en/shop/products/laptops/hp-omnibook-7-laptop-next-gen-ai-14-hg0062tu-dr5g8pa-acj",
      priceCheckedAt: "2026-09-01",
      priceType: "LISTED_PRICE",
    },

    image: {
      localPath: "/products/hp-omnibook-7-14.webp",
      sourcePage:
        "https://www.hp.com/in-en/shop/products/laptops/hp-omnibook-7-laptop-next-gen-ai-14-hg0062tu-dr5g8pa-acj",
      alt: "HP OmniBook 7 Next Gen AI 14",
    },

    operatingSystem: "Windows 11 Home Single Language",

    processor: {
      name: "Intel Core Ultra X7 358H",
      cores: 16,
      threads: 16,
      maxClockGHz: 4.8,
      npuTOPS: 50,
    },

    graphics: {
      name: "Intel Arc B390 GPU",
      type: "INTEGRATED",
    },

    memory: {
      capacityGB: 32,
      type: "LPDDR5X",
      onboard: true,
    },

    storage: {
      capacityGB: 1024,
      type: "NVMe SSD",
      interface: "PCIe Gen4",
    },

    display: {
      sizeInches: 14,
      resolution: "2880 × 1800",
      panel: "OLED",
      refreshRateHz: 120,
      brightnessNits: 500,
      colorGamut: "100% DCI-P3",
      touch: false,
    },

    battery: {
      capacityWh: 68,
      claimedVideoHours: 20,
    },

    physical: {
      weightKg: 1.43,
      dimensionsCm: "31.4 × 22.65 × 1.49",
    },

    connectivity: [
      "Wi-Fi 7",
      "Bluetooth 6.0",
    ],

    camera: "5MP IR camera with HDR",

    ports: [
      "1 × Thunderbolt 4 USB-C",
      "1 × USB-C",
      "2 × USB-A",
      "HDMI 2.1",
      "3.5mm audio jack",
    ],

    includedSoftware: [
      "Windows 11 Home",
      "Microsoft Office",
    ],

    warranty: "1 year limited warranty",

    useCases: [
      "coding",
      "creative",
      "professional",
      "AI workloads",
      "productivity",
    ],
  },
];

export function getLaptopById(id: string): Laptop | undefined {
  return laptops.find((laptop) => laptop.id === id);
}

export function searchLaptops(query: string): Laptop[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return laptops;
  }

  return laptops.filter((laptop) => {
    const searchable = [
      laptop.brand,
      laptop.family,
      laptop.model,
      laptop.variant,
      laptop.processor.name,
      laptop.graphics.name,
      laptop.operatingSystem,
      ...laptop.useCases,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalized);
  });
}