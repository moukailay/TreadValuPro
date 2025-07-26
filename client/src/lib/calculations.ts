export interface ROIResult {
  annualSavings: number;
  fiveYearSavings: number;
  co2Reduction: number;
  roi: number;
  costPerKm: number;
  paybackPeriod: number;
  savingsBreakdown: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
  };
}

export interface ROIInput {
  fleetSize: number;
  annualKilometers: number;
  vehicleType: "heavy_truck" | "medium_truck" | "light_utility" | "bus";
  fuelPrice: number;
  companyId?: string;
}

export const vehicleTypeOptions = [
  { value: "heavy_truck", label: "Poids lourds (>12T)" },
  { value: "medium_truck", label: "Camions moyens (3.5-12T)" },
  { value: "light_utility", label: "Utilitaires légers (<3.5T)" },
  { value: "bus", label: "Autobus/Autocars" },
] as const;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-CA').format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800";
    case "under_review":
      return "bg-yellow-100 text-yellow-800";
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "accepted":
      return "Acceptée";
    case "under_review":
      return "En révision";
    case "sent":
      return "Envoyée";
    case "draft":
      return "Brouillon";
    case "rejected":
      return "Rejetée";
    default:
      return "Inconnu";
  }
};
