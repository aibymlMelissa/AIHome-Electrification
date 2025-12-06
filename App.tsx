import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Store from './components/Store';
import Reports from './components/Reports';
import Advisor from './components/Advisor';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'store': return <Store />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <GameProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      <Advisor />
    </GameProvider>
  );
};

export default App;
