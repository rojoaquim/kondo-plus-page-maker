
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import KondoLogo from "@/components/KondoLogo";

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-kondo-gradient p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
        <KondoLogo size="lg" className="mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        
        <p className="text-gray-500 mb-6">
          Não foi possível encontrar a página "{location.pathname}"
        </p>
        
        <Link to="/">
          <Button className="bg-kondo-primary hover:bg-kondo-secondary">
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
