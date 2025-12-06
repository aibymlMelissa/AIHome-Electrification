import { Upgrade, UpgradeType, Subsidy } from './types';

export const INITIAL_MONEY = 15000;
export const INITIAL_CO2 = 0;
export const INITIAL_SOLAR_CAPACITY = 0; // Starts with no solar
export const INITIAL_BATTERY_CAPACITY = 0;
export const INITIAL_BASE_CONSUMPTION = 1.5; // kW average
export const INITIAL_GAS_APPLIANCES = 2; // Default gas appliances (e.g. Stove, Heater)
export const GRID_COST_PER_KWH = 0.30; // $0.30/kWh
export const FEED_IN_TARIFF = 0.05; // $0.05/kWh
export const CO2_PER_KWH_GRID = 0.85; // kg CO2 per kWh from grid (brown coal heavy)

export const SIMULATION_PERIODS = [
  { label: '1 quarter', days: 90 },
  { label: '4 quarters', days: 365 },
  { label: '2 years', days: 730 },
  { label: '5 years', days: 1825 },
];

export const AVAILABLE_UPGRADES: Upgrade[] = [
  {
    id: 'solar-3kw',
    name: '3kW Solar System',
    type: UpgradeType.SOLAR,
    cost: 3500,
    description: 'Entry level solar system. Great for reducing daytime bills.',
    productionBonus: 3,
    icon: 'Sun',
  },
  {
    id: 'solar-6kw',
    name: '6kW Solar System',
    type: UpgradeType.SOLAR,
    cost: 6000,
    description: 'Standard family sized system. Generates surplus energy.',
    productionBonus: 6,
    icon: 'Sun',
  },
  {
    id: 'batt-5kwh',
    name: '5kWh Home Battery',
    type: UpgradeType.BATTERY,
    cost: 4500,
    description: 'Store excess solar for the evening peak.',
    capacityBonus: 5,
    icon: 'Battery',
  },
  {
    id: 'batt-10kwh',
    name: '10kWh Premium Battery',
    type: UpgradeType.BATTERY,
    cost: 8500,
    description: 'Go off-grid for most of the night.',
    capacityBonus: 10,
    icon: 'BatteryCharging',
  },
  {
    id: 'led-lights',
    name: 'LED Lighting Upgrade',
    type: UpgradeType.EFFICIENCY,
    cost: 200,
    description: 'Replace all old bulbs with efficient LEDs.',
    consumptionReduction: 0.05,
    icon: 'Lightbulb',
  },
  {
    id: 'heat-pump',
    name: 'Heat Pump Hot Water',
    type: UpgradeType.HEATING,
    cost: 3000,
    description: 'Efficient electric water heating. Replaces gas.',
    consumptionReduction: 0.15,
    replacesGasAppliance: true,
    icon: 'Thermometer',
  },
  {
    id: 'elec-hot-water-sys',
    name: 'Electric Hot Water System',
    type: UpgradeType.HEATING,
    cost: 1200,
    description: 'Standard electric hot water storage system.',
    consumptionReduction: 0.05,
    replacesGasAppliance: true,
    icon: 'Thermometer',
  },
  {
    id: 'home-warming-sys',
    name: 'Home Warming System',
    type: UpgradeType.HEATING,
    cost: 4500,
    description: 'Whole-home reverse cycle electric heating.',
    consumptionReduction: 0.12,
    replacesGasAppliance: true,
    icon: 'Home',
  },
  {
    id: 'induction-cooktop',
    name: 'Induction Cooktop',
    type: UpgradeType.EFFICIENCY,
    cost: 1500,
    description: 'Replace gas stove with efficient induction cooking.',
    consumptionReduction: 0.02,
    replacesGasAppliance: true,
    icon: 'Zap',
  },
  {
    id: 'insulation',
    name: 'Roof Insulation',
    type: UpgradeType.EFFICIENCY,
    cost: 1500,
    description: 'Keep the heat in winter and out in summer.',
    consumptionReduction: 0.20,
    icon: 'Home',
  }
];

export const AVAILABLE_SUBSIDIES: Subsidy[] = [
  {
    id: 'sub-solar',
    name: 'Solar Homes Rebate',
    description: 'Government rebate for new solar panel installations.',
    appliesTo: [UpgradeType.SOLAR],
    amount: 1400,
  },
  {
    id: 'sub-battery',
    name: 'Battery Storage Loan',
    description: 'Incentive to support home energy storage.',
    appliesTo: [UpgradeType.BATTERY],
    amount: 1000,
  },
  {
    id: 'sub-eff',
    name: 'Energy Efficiency Grant',
    description: 'Rebate for upgrading to energy-efficient appliances.',
    appliesTo: [UpgradeType.HEATING, UpgradeType.EFFICIENCY],
    amount: 250,
  }
];