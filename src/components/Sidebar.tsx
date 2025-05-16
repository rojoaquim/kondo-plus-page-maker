
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, Bell, User, Settings, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import KondoLogo from './KondoLogo';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSindico, setIsSindico] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        console.log("Checking user role for:", user.id);
        
        // Use proper typing for the RPC function with both parameters
        type RoleResponse = { role: string | null };
        
        // Call the RPC function without specific type parameters
        const { data, error } = await supabase.functions.invoke('get_current_user_role');
        
        if (error) {
          console.error("Error fetching user role:", error);
          return;
        }
        
        const response = data as RoleResponse;
        console.log("User role:", response?.role);
        
        // Check if response contains role and compare it
        if (response && response.role) {
          setIsSindico(response.role === 'sindico');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    checkUserRole();
  }, [user]);

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
    ...(isSindico ? [{ path: '/users', icon: <Users size={20} />, text: 'Usuários' }] : []),
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
      <div className={`p-4 flex items-center justify-start`}>
        <KondoLogo size="md" />
        <span className="ml-2 font-bold text-xl">Kondo</span>
      </div>

      <nav className="flex-1 mt-10">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.path}>
                      <Button
                        variant="ghost"
                        className={`w-full flex justify-start items-center px-3 py-2 ${
                          isActive(item.path)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center">
                          {React.cloneElement(item.icon, {
                            className: isActive(item.path) ? 'text-primary' : '',
                          })}
                          <span className="ml-2">{item.text}</span>
                        </div>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.text}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-2">
        <ul className="space-y-1">
          {userMenuItems.map((item) => (
            <li key={item.path}>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.path}>
                      <Button
                        variant="ghost"
                        className={`w-full flex justify-start items-center px-3 py-2 ${
                          isActive(item.path)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center">
                          {React.cloneElement(item.icon, {
                            className: isActive(item.path) ? 'text-primary' : '',
                          })}
                          <span className="ml-2">{item.text}</span>
                        </div>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.text}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
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
