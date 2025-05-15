
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, Bell, User, Settings, LogOut, Users } from 'lucide-react';
import KondoLogo from './KondoLogo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';

interface SidebarProps {
  className?: string;
  isCompact?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "", isCompact = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user) {
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Erro ao verificar papel do usuário:', error);
        return;
      }
      
      setIsAdmin(data?.role === 'sindico');
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: AlertTriangle, label: 'Incidentes', path: '/incidents' },
    { icon: Bell, label: 'Avisos', path: '/alerts' },
  ];

  // Incluir item de menu de usuários apenas para síndico
  if (isAdmin) {
    menuItems.push({ icon: Users, label: 'Usuários', path: '/users' });
  }
  
  const bottomMenuItems = [
    { icon: User, label: 'Usuário', path: '/profile' },
    { icon: Settings, label: 'Configurações', path: '/settings' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Erro ao sair: ' + error.message);
        return;
      }
      
      toast.success('Você saiu com sucesso');
      navigate('/login');
    } catch (error) {
      toast.error('Ocorreu um erro ao sair');
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`flex flex-col bg-slate-100 h-screen ${isCompact ? 'w-16' : 'w-64'} fixed transition-all duration-300 ${className}`}>
      <div className={`p-4 border-b border-gray-200 ${isCompact ? 'flex justify-center' : ''}`}>
        <KondoLogo size={isCompact ? "sm" : "lg"} />
      </div>
      
      <nav className="flex flex-col flex-1 pt-5 overflow-y-auto">
        <ul className={`space-y-1 ${isCompact ? 'px-1' : 'px-3'}`}>
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 ${isCompact ? 'justify-center' : ''} px-4 py-3 rounded-md transition-all ${
                  isActive(item.path) 
                    ? 'bg-kondo-primary text-white font-medium'
                    : 'hover:bg-kondo-light text-gray-700'
                }`}
                title={isCompact ? item.label : undefined}
              >
                <item.icon size={20} />
                {!isCompact && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className={`mt-auto mb-6 ${isCompact ? 'px-1' : 'px-3'}`}>
          <div className="border-t border-gray-200 pt-4 mt-6"></div>
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 ${isCompact ? 'justify-center' : ''} px-4 py-3 rounded-md transition-all ${
                    isActive(item.path)
                      ? 'bg-kondo-primary text-white font-medium'
                      : 'hover:bg-kondo-light text-gray-700'
                  }`}
                  title={isCompact ? item.label : undefined}
                >
                  <item.icon size={20} />
                  {!isCompact && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className={`flex w-full items-center ${isCompact ? 'justify-center' : ''} gap-3 px-4 py-3 rounded-md transition-all hover:bg-red-100 text-red-600`}
                title={isCompact ? "Sair" : undefined}
              >
                <LogOut size={20} />
                {!isCompact && <span>Sair</span>}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
