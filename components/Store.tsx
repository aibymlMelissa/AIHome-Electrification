import React from 'react';
import { useGame } from '../contexts/GameContext';
import { UpgradeType } from '../types';
import { Sun, Battery, Lightbulb, Thermometer, Home, CheckCircle, BadgeCheck, Landmark, Zap, Flame } from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  'Sun': Sun,
  'Battery': Battery,
  'BatteryCharging': Battery,
  'Lightbulb': Lightbulb,
  'Thermometer': Thermometer,
  'Home': Home,
  'Zap': Zap,
  'Flame': Flame,
};

const Store: React.FC = () => {
  const { gameState, availableUpgrades, availableSubsidies, buyUpgrade } = useGame();

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Home;
    return <Icon size={24} />;
  };

  const categories = [UpgradeType.SOLAR, UpgradeType.BATTERY, UpgradeType.EFFICIENCY, UpgradeType.HEATING];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Upgrade Marketplace</h2>
        <p className="text-gray-500">Invest in your home. Prices include government subsidies where applicable.</p>
      </div>

      {/* Subsidy Summary Section */}
      <div className="p-6 bg-emerald-50 border-b border-emerald-100">
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="text-emerald-700" size={24} />
          <h3 className="text-lg font-bold text-emerald-900">Available Government Incentives</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSubsidies.map((sub) => (
            <div key={sub.id} className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-emerald-900 text-sm">{sub.name}</h4>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                  -${sub.amount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-emerald-700 mb-3 flex-grow leading-relaxed">{sub.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {sub.appliesTo.map((type) => (
                  <span key={type} className="text-[10px] uppercase font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 tracking-wide">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        {categories.map(category => (
          <div key={category} className="mb-8 last:mb-0">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">{category.toLowerCase()} Upgrades</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableUpgrades.filter(u => u.type === category).map(upgrade => {
                const isOwned = gameState.inventory.includes(upgrade.id);
                const subsidy = availableSubsidies.find(s => s.appliesTo.includes(upgrade.type));
                const finalCost = Math.max(0, upgrade.cost - (subsidy ? subsidy.amount : 0));
                const canAfford = gameState.money >= finalCost;

                return (
                  <div key={upgrade.id} className={`relative p-5 rounded-lg border-2 transition-all ${isOwned ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-blue-300'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-3 rounded-lg ${isOwned ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {getIcon(upgrade.icon)}
                      </div>
                      {isOwned && <CheckCircle className="text-green-500" size={20} />}
                    </div>
                    
                    <h4 className="font-bold text-gray-800 mb-1">{upgrade.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{upgrade.description}</p>
                    
                    {subsidy && !isOwned && (
                      <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-md p-2 flex items-start gap-2">
                        <BadgeCheck className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-xs font-bold text-emerald-700">{subsidy.name}</p>
                          <p className="text-xs text-emerald-600">Save ${subsidy.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-900">${finalCost.toLocaleString()}</span>
                        {subsidy && !isOwned && (
                           <span className="text-xs text-gray-400 line-through">${upgrade.cost.toLocaleString()}</span>
                        )}
                      </div>
                      
                      {isOwned ? (
                         <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed">
                          Installed
                        </button>
                      ) : (
                        <button 
                          onClick={() => buyUpgrade(upgrade)}
                          disabled={!canAfford}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            canAfford 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Buy Now
                        </button>
                      )}
                    </div>

                    {/* Stats Pill */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {upgrade.productionBonus && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">+{upgrade.productionBonus}kW Solar</span>}
                        {upgrade.capacityBonus && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+{upgrade.capacityBonus}kWh Batt</span>}
                        {upgrade.consumptionReduction && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">-{upgrade.consumptionReduction * 100}% Load</span>}
                        {upgrade.replacesGasAppliance && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1"><Flame size={10}/>Replaces Gas</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;