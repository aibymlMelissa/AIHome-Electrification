'use client';

import { useState } from 'react';
import { Providers } from './providers';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import Store from '../components/Store';
import Reports from '../components/Reports';

function GameContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'store':
        return <Store />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function Home() {
  return (
    <Providers>
      <GameContent />
    </Providers>
  );
}
