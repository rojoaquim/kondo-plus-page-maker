
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, Bell, User, Settings, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KondoLogo } from './KondoLogo';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export const Sidebar = () => {
  const location = useLocation();
  const [isCompact, setIsCompact] = useState(() => {
    // Verificar se existe uma configuração salva no localStorage
    const savedCompactSidebar = localStorage.getItem('compactSidebar');
    return savedCompactSidebar ? JSON.parse(savedCompactSidebar) : false;
  });
  const { user } = useAuth();
  const [isSindico, setIsSindico] = useState(false);

  useEffect(() => {
    // Adicionar event listener para mudanças na configuração de compacto
    const handleCompactChange = (event: CustomEvent) => {
      setIsCompact(event.detail.compact);
    };

    window.addEventListener('sidebarCompactChange', handleCompactChange as EventListener);

    return () => {
      window.removeEventListener('sidebarCompactChange', handleCompactChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        console.log("Checking user role for:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
          return;
        }
        
        console.log("User role:", data.role);
        setIsSindico(data.role === 'sindico');
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
    { path: '/profile', icon: <User size={20} />, text: 'Perfil' },
    { path: '/settings', icon: <Settings size={20} />, text: 'Configurações' },
  ];

  return (
    <div
      className={`bg-white border-r h-full flex flex-col transition-all duration-300 ${
        isCompact ? 'w-16' : 'w-60'
      }`}
    >
      <div className={`p-4 flex items-center ${isCompact ? 'justify-center' : 'justify-start'}`}>
        <KondoLogo height={isCompact ? 30 : 40} />
        {!isCompact && <span className="ml-2 font-bold text-xl">Kondo</span>}
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
                        className={`w-full flex ${
                          isCompact ? 'justify-center' : 'justify-start'
                        } items-center px-3 py-2 ${
                          isActive(item.path)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center">
                          {React.cloneElement(item.icon, {
                            className: isActive(item.path) ? 'text-primary' : '',
                          })}
                          {!isCompact && <span className="ml-2">{item.text}</span>}
                        </div>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCompact && <TooltipContent side="right">{item.text}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-2 mb-6">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={`w-full flex ${
                  isCompact ? 'justify-center' : 'justify-start'
                } items-center px-3 py-2`}
                onClick={handleLogout}
              >
                <LogOut size={20} />
                {!isCompact && <span className="ml-2">Sair</span>}
              </Button>
            </TooltipTrigger>
            {isCompact && <TooltipContent side="right">Sair</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
