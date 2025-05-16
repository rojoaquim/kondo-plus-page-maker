
import React from 'react';
import { MenuItem } from './MenuItem';

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  text: string;
}

interface MenuSectionProps {
  items: MenuItem[];
  isActive: (path: string) => boolean;
  className?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ items, isActive, className = '' }) => {
  return (
    <ul className={`space-y-1 ${className}`}>
      {items.map((item) => (
        <MenuItem
          key={item.path}
          path={item.path}
          icon={item.icon}
          text={item.text}
          isActive={isActive(item.path)}
        />
      ))}
    </ul>
  );
};
