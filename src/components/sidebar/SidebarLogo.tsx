
import React from 'react';
import KondoLogo from '../KondoLogo';

interface SidebarLogoProps {
  className?: string;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ className = '' }) => {
  return (
    <div className={`p-4 flex items-center justify-start ${className}`}>
      <KondoLogo size="md" />
      <span className="ml-2 font-bold text-xl">Kondo</span>
    </div>
  );
};
