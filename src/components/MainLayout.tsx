
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  return (
    <div className="flex h-screen bg-kondo-gradient">
      <Sidebar className={cn(
        isMobile ? "fixed z-20 transition-transform duration-300 ease-in-out transform" : "",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )} />
      
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64 transition-all duration-300">
        <header className="flex items-center justify-between p-4 lg:p-6 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu />
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* Add user profile button or notifications here */}
          </div>
        </header>
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
