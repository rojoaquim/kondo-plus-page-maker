
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import KondoLogo from '@/components/KondoLogo';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Por favor preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock successful login for demo
      setIsLoading(false);
      toast.success('Login realizado com sucesso');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-kondo-gradient px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <KondoLogo size="lg" className="mb-8" />
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="username">
              USUÁRIO
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-gray-300 focus:border-kondo-primary focus:ring-kondo-primary"
              placeholder="Digite seu usuário"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              SENHA
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 focus:border-kondo-primary focus:ring-kondo-primary"
              placeholder="Digite sua senha"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-kondo-primary hover:bg-kondo-secondary transition-colors text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'LOGIN'}
          </Button>
        </form>
        
        <div className="mt-4 flex justify-between text-sm">
          <button 
            type="button"
            className="text-kondo-primary hover:underline"
            onClick={() => toast.info('Funcionalidade não implementada')}
          >
            Esqueci a senha
          </button>
          
          <button 
            type="button"
            className="text-kondo-primary hover:underline"
            onClick={() => toast.info('Funcionalidade não implementada')}
          >
            CADASTRE-SE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
