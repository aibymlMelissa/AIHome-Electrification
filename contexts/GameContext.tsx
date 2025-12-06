import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Upgrade, SimulationContextType, EnergyPoint } from '../types';
import { 
  INITIAL_MONEY, 
  INITIAL_CO2, 
  INITIAL_SOLAR_CAPACITY, 
  INITIAL_BATTERY_CAPACITY, 
  INITIAL_BASE_CONSUMPTION, 
  INITIAL_GAS_APPLIANCES,
  AVAILABLE_UPGRADES,
  AVAILABLE_SUBSIDIES,
  GRID_COST_PER_KWH,
  FEED_IN_TARIFF,
  CO2_PER_KWH_GRID
} from '../constants';

const GameContext = createContext<SimulationContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1000); // ms per tick (1 hour)
  const [isGameOver, setIsGameOver] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    money: INITIAL_MONEY,
    co2Saved: INITIAL_CO2,
    subsidySavings: 0,
    totalDays: 0,
    targetDays: 365,
    currentHour: 6,
    batteryCurrentCharge: 0,
    solarCapacity: INITIAL_SOLAR_CAPACITY,
    batteryCapacity: INITIAL_BATTERY_CAPACITY,
    baseConsumption: INITIAL_BASE_CONSUMPTION,
    gasAppliancesCount: INITIAL_GAS_APPLIANCES,
    resellToGrid: true,
    inventory: [],
    history: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        production: 0,
        consumption: 0,
        batteryLevel: 0,
        gridImport: 0,
        gridExport: 0
    })),
  });

  const buyUpgrade = (upgrade: Upgrade) => {
    const subsidy = AVAILABLE_SUBSIDIES.find(s => s.appliesTo.includes(upgrade.type));
    const finalCost = Math.max(0, upgrade.cost - (subsidy ? subsidy.amount : 0));

    if (gameState.money >= finalCost && !gameState.inventory.includes(upgrade.id)) {
      setGameState(prev => {
        let newSolar = prev.solarCapacity;
        let newBattery = prev.batteryCapacity;
        let newConsumption = prev.baseConsumption;
        let newGasCount = prev.gasAppliancesCount;

        if (upgrade.productionBonus) newSolar += upgrade.productionBonus;
        if (upgrade.capacityBonus) newBattery += upgrade.capacityBonus;
        if (upgrade.consumptionReduction) newConsumption = newConsumption * (1 - upgrade.consumptionReduction);
        if (upgrade.replacesGasAppliance && newGasCount > 0) newGasCount -= 1;

        return {
          ...prev,
          money: prev.money - finalCost,
          inventory: [...prev.inventory, upgrade.id],
          solarCapacity: newSolar,
          batteryCapacity: newBattery,
          baseConsumption: newConsumption,
          gasAppliancesCount: newGasCount,
          subsidySavings: prev.subsidySavings + (subsidy ? subsidy.amount : 0),
        };
      });
    }
  };

  const togglePause = () => setIsPaused(!isPaused);
  
  const setTargetDays = (days: number) => {
    setGameState(prev => ({ ...prev, targetDays: days }));
  };

  const setMoney = (amount: number) => {
    setGameState(prev => ({ ...prev, money: amount }));
  };

  const setSubsidySavings = (amount: number) => {
    setGameState(prev => ({ ...prev, subsidySavings: amount }));
  };

  const setGasAppliancesCount = (count: number) => {
    setGameState(prev => ({ ...prev, gasAppliancesCount: count }));
  };

  const setResellToGrid = (enabled: boolean) => {
    setGameState(prev => ({ ...prev, resellToGrid: enabled }));
  };

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.totalDays >= prev.targetDays) {
          setIsGameOver(true);
          return prev;
        }

        const nextHour = (prev.currentHour + 1) % 24;
        const nextDay = nextHour === 0 ? prev.totalDays + 1 : prev.totalDays;
        
        // Solar Calculation
        let production = 0;
        if (nextHour > 5 && nextHour < 19) { // Sunlight hours
           const peak = prev.solarCapacity;
           // Simple parabolic curve centered at 12
           const x = nextHour;
           if (peak > 0) {
             production = (-peak / 36) * Math.pow(x - 12, 2) + peak;
             production = Math.max(0, production);
             production *= (0.7 + Math.random() * 0.4); // Weather variance
           }
        }

        // Consumption Calculation
        let consumption = prev.baseConsumption;
        if ((nextHour >= 7 && nextHour <= 9) || (nextHour >= 17 && nextHour <= 21)) {
            consumption *= 1.4; // Peak usage
        } else if (nextHour >= 23 || nextHour <= 5) {
            consumption *= 0.6; // Night usage
        }
        consumption *= (0.9 + Math.random() * 0.2); // Random variance

        // Energy Logic
        const netEnergy = production - consumption;
        let newBatteryCharge = prev.batteryCurrentCharge;
        let gridImport = 0;
        let gridExport = 0;

        if (netEnergy > 0) {
            const space = prev.batteryCapacity - prev.batteryCurrentCharge;
            if (space > 0) {
                const charge = Math.min(netEnergy, space);
                newBatteryCharge += charge;
                gridExport = netEnergy - charge;
            } else {
                gridExport = netEnergy;
            }
        } else {
            const needed = Math.abs(netEnergy);
            if (prev.batteryCurrentCharge > 0) {
                const discharge = Math.min(needed, prev.batteryCurrentCharge);
                newBatteryCharge -= discharge;
                gridImport = needed - discharge;
            } else {
                gridImport = needed;
            }
        }

        // Stats
        const gridExportRevenue = prev.resellToGrid ? (gridExport * FEED_IN_TARIFF) : 0;
        const moneyChange = gridExportRevenue - (gridImport * GRID_COST_PER_KWH);
        
        // CO2 Savings
        const cleanEnergyUsed = consumption - gridImport;
        const co2SavedThisTick = (cleanEnergyUsed + gridExport) * CO2_PER_KWH_GRID;

        const newPoint: EnergyPoint = {
            hour: nextHour,
            production,
            consumption,
            batteryLevel: newBatteryCharge,
            gridImport,
            gridExport
        };

        const newHistory = [...prev.history.slice(1), newPoint];

        return {
            ...prev,
            currentHour: nextHour,
            totalDays: nextDay,
            money: prev.money + moneyChange,
            co2Saved: prev.co2Saved + co2SavedThisTick,
            batteryCurrentCharge: newBatteryCharge,
            history: newHistory
        };
      });
    }, gameSpeed);

    return () => clearInterval(interval);
  }, [isPaused, isGameOver, gameSpeed]);

  return (
    <GameContext.Provider value={{
      gameState,
      availableUpgrades: AVAILABLE_UPGRADES,
      availableSubsidies: AVAILABLE_SUBSIDIES,
      buyUpgrade,
      togglePause,
      isPaused,
      isGameOver,
      gameSpeed,
      setGameSpeed,
      setTargetDays,
      setMoney,
      setSubsidySavings,
      setGasAppliancesCount,
      setResellToGrid
    }}>
      {children}
    </GameContext.Provider>
  );
};