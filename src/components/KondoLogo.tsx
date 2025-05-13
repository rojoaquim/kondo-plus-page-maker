
import React from 'react';

interface KondoLogoProps {
  className?: string;
  withText?: boolean;
  size?: "sm" | "md" | "lg";
}

const KondoLogo: React.FC<KondoLogoProps> = ({ 
  className = "", 
  withText = true, 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`font-bold flex items-center ${className}`}>
      <span className={`${sizeClasses[size]} flex items-center`}>
        <span className="text-blue-500">k</span>
        <span className="text-purple-500">o</span>
        <span className="text-pink-500">n</span>
        <span className="text-orange-500">d</span>
        <span className="text-teal-500">o</span>
        <span className="text-kondo-accent font-bold">+</span>
      </span>
    </div>
  );
};

export default KondoLogo;
