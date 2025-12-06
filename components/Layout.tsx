import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { LayoutDashboard, ShoppingBag, BarChart2, Pause, Play, Zap, Settings, Flame, X } from 'lucide-react';
import { SIMULATION_PERIODS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { isPaused, togglePause, gameSpeed, setGameSpeed, gameState, setTargetDays, setSubsidySavings, setGasAppliancesCount, setResellToGrid } = useGame();
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'store', label: 'Marketplace', icon: ShoppingBag },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
  ];

  const SettingsContent = () => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
       <div className="flex items-center gap-2 mb-3 text-gray-700">
          <Settings size={16} />
          <p className="text-xs font-bold uppercase">Settings</p>
       </div>

       {/* Simulation Period Dropdown */}
       <div className="mb-4">
         <label className="text-xs text-gray-500 font-semibold mb-1 block">Simulation Period</label>
         <select
           className="w-full text-sm p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
           value={SIMULATION_PERIODS.find(p => p.days === gameState.targetDays)?.days || 365}
           onChange={(e) => setTargetDays(Number(e.target.value))}
         >
           {SIMULATION_PERIODS.map(period => (
             <option key={period.label} value={period.days}>
               {period.label}
             </option>
           ))}
         </select>
       </div>

       {/* Government Subsidies Input */}
       <div className="mb-4">
         <label className="text-xs text-gray-500 font-semibold mb-1 block">Gov. Subsidies ($)</label>
         <div className="relative">
           <span className="absolute left-2 top-1.5 text-gray-400 text-xs">$</span>
           <input
             type="number"
             className="w-full text-sm pl-5 p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
             value={gameState.subsidySavings}
             onChange={(e) => setSubsidySavings(Number(e.target.value))}
           />
         </div>
       </div>

       {/* Gas Appliances Input */}
       <div className="mb-4">
         <label className="text-xs text-gray-500 font-semibold mb-1 block flex items-center gap-1">
            Gas Appliances
            <Flame size={12} className="text-orange-500" />
         </label>
         <input
           type="number"
           min="0"
           className="w-full text-sm p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
           value={gameState.gasAppliancesCount}
           onChange={(e) => setGasAppliancesCount(Math.max(0, parseInt(e.target.value) || 0))}
         />
       </div>

       {/* Resell back to Grid Toggle */}
       <div className="mb-4">
         <label className="text-xs text-gray-500 font-semibold mb-1 block">Resell back to Grid</label>
         <select
           className="w-full text-sm p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
           value={gameState.resellToGrid ? "YES" : "NO"}
           onChange={(e) => setResellToGrid(e.target.value === "YES")}
         >
           <option value="YES">YES</option>
           <option value="NO">NO</option>
         </select>
       </div>

       {/* Simulation Speed */}
       <div className="mb-2">
          <label className="text-xs text-gray-500 font-semibold mb-1 block">Simulation Speed</label>
          <div className="flex items-center gap-2 mb-2">
              <button
                  onClick={togglePause}
                  className={`p-2 rounded-md ${isPaused ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-600'}`}
              >
                  {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
              </button>
              <div className="text-xs text-gray-600 font-medium">
                  {isPaused ? 'PAUSED' : `${(1000/gameSpeed).toFixed(1)}x Speed`}
              </div>
          </div>
          <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={2100 - gameSpeed}
              onChange={(e) => setGameSpeed(2100 - parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
       </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-10 flex-col overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Zap size={20} fill="white" />
            </div>
            <span className="font-bold text-xl text-gray-800">EcoHome</span>
          </div>
          <p className="text-xs text-gray-500 ml-11">Buy from marketplace to save</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Configuration Section */}
        <div className="p-4 flex-1">
          <SettingsContent />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Zap size={18} fill="white" />
            </div>
            <span className="font-bold text-lg text-gray-800">EcoHome</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile Settings Modal */}
      {showSettings && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowSettings(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <SettingsContent />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                activeTab === item.id
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0">
        <div className="max-w-6xl mx-auto">
             {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
