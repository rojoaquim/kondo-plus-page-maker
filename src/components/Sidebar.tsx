
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, AlertTriangle, Bell, User, Settings, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { SidebarLogo } from './sidebar/SidebarLogo';
import { MenuSection } from './sidebar/MenuSection';
import { useUserRole } from '@/hooks/useUserRole';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirection will happen automatically due to auth state change
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: <Home size={20} />, text: 'Home' },
    { path: '/incidents', icon: <AlertTriangle size={20} />, text: 'Incidentes' },
    { path: '/alerts', icon: <Bell size={20} />, text: 'Avisos' },
    // Only show Users option for síndicos
    ...(isAdmin ? [{ path: '/users', icon: <Users size={20} />, text: 'Usuários' }] : []),
  ];

  // Separate array for profile and settings
  const userMenuItems = [
    { path: '/profile', icon: <User size={20} />, text: 'Perfil' },
    { path: '/settings', icon: <Settings size={20} />, text: 'Configurações' },
  ];

  return (
    <div
      className={`bg-white border-r h-full flex flex-col transition-all duration-300 w-60 ${className}`}
    >
      <SidebarLogo />

      <nav className="flex-1 mt-10 px-2">
        <MenuSection items={menuItems} isActive={isActive} />
      </nav>

      <div className="mt-auto p-2">
        <MenuSection items={userMenuItems} isActive={isActive} />
        
        <div className="mt-2 mb-4">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-start items-center px-3 py-2"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  <span className="ml-2">Sair</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
