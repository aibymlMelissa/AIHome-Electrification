import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { getEnergyAdvice } from '../services/geminiService';
import { Bot, Loader2, MessageSquare } from 'lucide-react';

const Advisor: React.FC = () => {
  const { gameState, availableUpgrades } = useGame();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAdvice(null);
    const result = await getEnergyAdvice(gameState, availableUpgrades);
    setAdvice(result);
    setLoading(false);
  };

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 z-50 flex items-center gap-2 font-semibold"
          >
              <Bot size={24} />
              <span>Ask Advisor</span>
          </button>
      )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col animate-fade-in-up">
        <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Bot size={20} />
                <div>
                    <h3 className="font-bold leading-tight">Eco Advisor</h3>
                    <p className="text-[10px] opacity-80 font-medium">Synced with Aus Gov Policy</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white">
                ✕
            </button>
        </div>
        
        <div className="p-6 bg-gray-50 min-h-[150px] flex flex-col justify-center">
            {!advice && !loading && (
                <div className="text-center text-gray-500">
                    <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="text-sm">Click below to analyze your current energy setup and get personalized recommendations based on Australian energy mandates.</p>
                </div>
            )}
            
            {loading && (
                <div className="flex flex-col items-center justify-center text-emerald-600">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-sm font-medium">Analyzing simulation data...</span>
                </div>
            )}

            {advice && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed">{advice}</p>
                </div>
            )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
            <button 
                onClick={handleAsk}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Thinking...' : (advice ? 'Get New Advice' : 'Analyze My Home')}
            </button>
        </div>
    </div>
  );
};

export default Advisor;