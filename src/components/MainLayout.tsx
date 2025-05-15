
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const MainLayout: React.FC = () => {
  const [isCompactSidebar, setIsCompactSidebar] = useState(false);
  
  // Carregar preferências ao iniciar
  useEffect(() => {
    const savedSettings = localStorage.getItem('kondo_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsCompactSidebar(settings.compactSidebar || false);
      } catch (error) {
        console.error('Erro ao carregar configurações de layout:', error);
      }
    }
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCompact={isCompactSidebar} className="z-50" />
      <main className={`flex-1 overflow-auto p-6 ${isCompactSidebar ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <div className="container mx-auto">
          <Outlet context={{ setIsCompactSidebar }} />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
