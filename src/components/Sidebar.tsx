
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, Bell, User, Settings } from 'lucide-react';
import KondoLogo from './KondoLogo';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: AlertTriangle, label: 'Incidentes', path: '/incidents' },
    { icon: Bell, label: 'Avisos', path: '/alerts' },
  ];
  
  const bottomMenuItems = [
    { icon: User, label: 'Usuário', path: '/profile' },
    { icon: Settings, label: 'Configurações', path: '/settings' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`flex flex-col bg-slate-100 h-screen w-64 fixed ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <KondoLogo size="lg" />
      </div>
      
      <nav className="flex flex-col flex-1 pt-5 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                  isActive(item.path) 
                    ? 'bg-kondo-primary text-white font-medium'
                    : 'hover:bg-kondo-light text-gray-700'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto mb-6 px-3">
          <div className="border-t border-gray-200 pt-4 mt-6"></div>
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                    isActive(item.path)
                      ? 'bg-kondo-primary text-white font-medium'
                      : 'hover:bg-kondo-light text-gray-700'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
