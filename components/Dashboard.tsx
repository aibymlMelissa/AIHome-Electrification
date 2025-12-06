import React from 'react';
import { useGame } from '../contexts/GameContext';
import EnergyFlow from './EnergyFlow';
import { TrendingUp, DollarSign, CloudRain, Landmark } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { gameState, setMoney } = useGame();
  
  // Calculate daily stats from history
  const todaysProduction = gameState.history.reduce((acc, curr) => acc + curr.production, 0);
  const todaysConsumption = gameState.history.reduce((acc, curr) => acc + curr.consumption, 0);
  const net = todaysProduction - todaysConsumption;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="w-full">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2" title="Cost and Saving for Improvements">
                   Cost & Saving (Funds)
                </p>
                <div className="relative flex items-center">
                    <span className="text-2xl font-bold text-gray-800 mr-1">$</span>
                    <input 
                        type="number"
                        className="text-3xl font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none w-full transition-colors"
                        value={Math.floor(gameState.money)}
                        onChange={(e) => setMoney(Number(e.target.value))}
                    />
                </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full text-green-600 ml-2 shrink-0">
                <DollarSign size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Net Energy (24h)</p>
                <p className={`text-3xl font-bold mt-1 ${net >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                    {net > 0 ? '+' : ''}{net.toFixed(1)} <span className="text-sm text-gray-400">kWh</span>
                </p>
            </div>
            <div className={`p-3 rounded-full ${net >= 0 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                <TrendingUp size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Subsidies</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">${gameState.subsidySavings.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <Landmark size={24} />
            </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Self Sufficiency</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                    {todaysConsumption > 0 ? Math.min(100, (todaysProduction / todaysConsumption) * 100).toFixed(0) : 0}%
                </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <CloudRain size={24} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
             <EnergyFlow gameState={gameState} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-800 font-bold mb-4">Simulation Control</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Day: {gameState.totalDays}</span>
                    <span>Hour: {gameState.currentHour}:00</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${(gameState.currentHour / 24) * 100}%` }}
                    />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
                    <p className="font-semibold mb-1">Status:</p>
                    {gameState.currentHour >= 6 && gameState.currentHour <= 19 
                        ? "Daytime. Solar panels are generating energy." 
                        : "Nighttime. Relying on battery or grid."}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;