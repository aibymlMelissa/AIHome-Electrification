export enum UpgradeType {
  SOLAR = 'SOLAR',
  BATTERY = 'BATTERY',
  EFFICIENCY = 'EFFICIENCY',
  HEATING = 'HEATING',
}

export interface Upgrade {
  id: string;
  name: string;
  type: UpgradeType;
  cost: number;
  description: string;
  productionBonus?: number; // kW added to solar capacity
  capacityBonus?: number; // kWh added to battery capacity
  consumptionReduction?: number; // Multiplier (e.g., 0.1 means 10% reduction)
  replacesGasAppliance?: boolean; // If true, buying this reduces gasAppliancesCount
  icon: string;
}

export interface Subsidy {
  id: string;
  name: string;
  description: string;
  appliesTo: UpgradeType[];
  amount: number;
}

export interface EnergyPoint {
  hour: number;
  production: number;
  consumption: number;
  batteryLevel: number;
  gridImport: number;
  gridExport: number;
}

export interface GameState {
  money: number;
  co2Saved: number; // kg
  subsidySavings: number; // Total money saved via subsidies
  totalDays: number;
  targetDays: number; // The simulation goal duration
  currentHour: number;
  batteryCurrentCharge: number; // kWh
  gasAppliancesCount: number; // Number of gas appliances remaining
  resellToGrid: boolean; // Whether to sell excess energy back to grid

  // House Stats
  solarCapacity: number; // kW
  batteryCapacity: number; // kWh
  baseConsumption: number; // Avg kW load

  inventory: string[]; // List of Upgrade IDs
  history: EnergyPoint[]; // Last 24 hours of data for charts
}

export interface SimulationContextType {
  gameState: GameState;
  availableUpgrades: Upgrade[];
  availableSubsidies: Subsidy[];
  buyUpgrade: (upgrade: Upgrade) => void;
  togglePause: () => void;
  isPaused: boolean;
  isGameOver: boolean;
  gameSpeed: number;
  setGameSpeed: (speed: number) => void;
  setTargetDays: (days: number) => void;
  setMoney: (amount: number) => void;
  setSubsidySavings: (amount: number) => void;
  setGasAppliancesCount: (count: number) => void;
  setResellToGrid: (enabled: boolean) => void;
}