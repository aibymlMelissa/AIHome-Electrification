import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Battery, Home, Zap, UtilityPole } from 'lucide-react';
import { GameState } from '../types';

interface EnergyFlowProps {
  gameState: GameState;
}

const EnergyFlow: React.FC<EnergyFlowProps> = ({ gameState }) => {
  const latest = gameState.history[gameState.history.length - 1];
  
  // Determine flow direction and intensity
  const isProducing = latest.production > 0.1;
  const isCharging = latest.batteryLevel > (gameState.history[gameState.history.length - 2]?.batteryLevel || 0);
  const isDischarging = latest.batteryLevel < (gameState.history[gameState.history.length - 2]?.batteryLevel || 0);
  const isImporting = latest.gridImport > 0.1;
  const isExporting = latest.gridExport > 0.1;

  // Helper for animated path
  const FlowLine = ({ active, reverse = false, vertical = false }: { active: boolean, reverse?: boolean, vertical?: boolean }) => {
    if (!active) return <div className={`bg-gray-200 ${vertical ? 'w-1 h-24' : 'h-1 w-24'}`} />;
    
    return (
        <div className={`relative bg-gray-200 ${vertical ? 'w-1 h-24' : 'h-1 w-24'} overflow-hidden rounded-full`}>
            <motion.div 
                className={`absolute bg-green-500 ${vertical ? 'w-full h-1/2' : 'h-full w-1/2'}`}
                animate={{ 
                    x: vertical ? 0 : (reverse ? ['100%', '-100%'] : ['-100%', '100%']),
                    y: vertical ? (reverse ? ['100%', '-100%'] : ['-100%', '100%']) : 0
                }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
        </div>
    )
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative min-h-[300px]">
        <h3 className="text-gray-500 text-sm font-semibold absolute top-4 left-4 uppercase tracking-wider">Real-time Energy Flow</h3>
        
        <div className="grid grid-cols-3 gap-8 items-center justify-items-center w-full max-w-lg">
            {/* Top Row: Solar */}
            <div className="col-start-2 flex flex-col items-center">
                <div className={`p-4 rounded-full ${isProducing ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Sun size={32} />
                </div>
                <p className="text-xs mt-2 font-medium">{latest.production.toFixed(2)} kW</p>
                <FlowLine active={isProducing} vertical reverse={false} />
            </div>

            {/* Middle Row: Battery - House - Grid */}
            <div className="col-start-1 flex flex-row items-center gap-2">
                <div className="flex flex-col items-center">
                     <div className={`p-4 rounded-full ${gameState.batteryCapacity > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-300'}`}>
                        <Battery size={32} />
                    </div>
                     <p className="text-xs mt-2 font-medium">{(gameState.batteryCurrentCharge / (gameState.batteryCapacity || 1) * 100).toFixed(0)}%</p>
                </div>
                <FlowLine active={isCharging || isDischarging} reverse={isCharging} />
            </div>

            <div className="col-start-2 flex flex-col items-center z-10">
                <div className="p-6 bg-green-100 text-green-700 rounded-full shadow-lg border-4 border-white">
                    <Home size={40} />
                </div>
                <p className="text-sm mt-2 font-bold text-gray-700">{latest.consumption.toFixed(2)} kW</p>
            </div>

            <div className="col-start-3 flex flex-row-reverse items-center gap-2">
                 <div className="flex flex-col items-center">
                    <div className={`p-4 rounded-full ${isImporting ? 'bg-red-100 text-red-600' : (isExporting ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400')}`}>
                        <UtilityPole size={32} />
                    </div>
                    <p className="text-xs mt-2 font-medium">Grid</p>
                 </div>
                 <FlowLine active={isImporting || isExporting} reverse={isImporting} />
            </div>
        </div>
        
        <div className="absolute bottom-4 right-4 flex gap-2">
            {isExporting && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Zap size={12}/> Selling</span>}
            {isImporting && <span className="text-xs font-bold text-red-500 flex items-center gap-1"><Zap size={12}/> Buying</span>}
        </div>
    </div>
  );
};

export default EnergyFlow;
