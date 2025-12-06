import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGame } from '../contexts/GameContext';

const Reports: React.FC = () => {
  const { gameState } = useGame();

  // Prepare data for chart
  const data = gameState.history.map(point => ({
    time: `${point.hour}:00`,
    Solar: parseFloat(point.production.toFixed(2)),
    Usage: parseFloat(point.consumption.toFixed(2)),
    Grid: parseFloat(point.gridImport.toFixed(2)),
    Battery: parseFloat(point.batteryLevel.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Energy Performance (Last 24 Hours)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{fontSize: 12}} interval={3} />
              <YAxis tick={{fontSize: 12}} label={{ value: 'kW', angle: -90, position: 'insideLeft' }} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Area type="monotone" dataKey="Solar" stroke="#fbbf24" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={2} />
              <Area type="monotone" dataKey="Usage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total CO2 Savings</h3>
            <p className="text-4xl font-bold text-green-600">{gameState.co2Saved.toFixed(1)} <span className="text-lg text-gray-400 font-normal">kg</span></p>
            <p className="text-sm text-gray-500 mt-2">Equivalent to planting {Math.ceil(gameState.co2Saved / 20)} trees.</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Battery Health</h3>
            <p className="text-4xl font-bold text-blue-600">{gameState.batteryCapacity} <span className="text-lg text-gray-400 font-normal">kWh</span></p>
            <p className="text-sm text-gray-500 mt-2">Total installed capacity.</p>
         </div>
      </div>
    </div>
  );
};

export default Reports;
