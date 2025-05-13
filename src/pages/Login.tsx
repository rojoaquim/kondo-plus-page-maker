
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import KondoLogo from '@/components/KondoLogo';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      localStorage.setItem('auth_token', 'mock-token-123');
      setIsLoading(false);
      toast.success('Login realizado com sucesso');
      navigate('/');
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600">
      <div className="text-white text-sm absolute top-4 left-4">
        Tela login
      </div>
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-md shadow-xl overflow-hidden">
        <div className="flex flex-col items-center pt-10 px-8 pb-6">
          <KondoLogo size="lg" className="mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">kondo<span className="text-kondo-accent">+</span></h2>
        </div>
        
        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase font-medium text-gray-500 tracking-wider" htmlFor="username">
              USUÁRIO
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-100 border-gray-200"
              placeholder=""
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase font-medium text-gray-500 tracking-wider" htmlFor="password">
              SENHA
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 border-gray-200 pr-10"
                placeholder=""
              />
              <button 
                type="button" 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <input type="checkbox" id="remember" className="rounded border-gray-300" />
              <label htmlFor="remember" className="text-gray-600">Lembrar Login?</label>
            </div>
            
            <button 
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => toast.info('Funcionalidade não implementada')}
            >
              Esqueci a senha?
            </button>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-kondo-primary hover:bg-kondo-secondary transition-colors text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'LOGIN'}
          </Button>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => toast.info('Funcionalidade não implementada')}
            >
              LOGIN TÉCNICO
            </Button>
          </div>
        </form>
      </div>
      
      <div className="text-white text-xs absolute bottom-4 left-4">
        Tela Inicial - Modo Normal
      </div>
    </div>
  );
};

export default Login;
