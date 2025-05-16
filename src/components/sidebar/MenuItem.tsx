
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MenuItemProps {
  path: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ path, icon, text, isActive }) => {
  return (
    <li>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={path}>
              <Button
                variant="ghost"
                className={`w-full flex justify-start items-center px-3 py-2 ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center">
                  {React.cloneElement(icon as React.ReactElement, {
                    className: isActive ? 'text-primary' : '',
                  })}
                  <span className="ml-2">{text}</span>
                </div>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{text}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};
