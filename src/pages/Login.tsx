
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import KondoLogo from '@/components/KondoLogo';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Login: React.FC = () => {
  // Estado para o login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para o cadastro
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [apartment, setApartment] = useState('');
  const [block, setBlock] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const navigate = useNavigate();

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    
    if (error) {
      toast.error('Erro ao fazer login: ' + error.message);
      return;
    }
    
    if (data.user) {
      toast.success('Login realizado com sucesso');
      navigate('/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos
    if (!registerEmail || !registerPassword || !confirmPassword || !fullName || !apartment || !block) {
      toast.error('Por favor preencha todos os campos');
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsRegistering(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: {
          full_name: fullName,
          apartment,
          block
        }
      }
    });

    setIsRegistering(false);
    
    if (error) {
      toast.error('Erro ao criar conta: ' + error.message);
      return;
    }
    
    toast.success('Conta criada com sucesso! Faça login para continuar.');
    
    // Limpar os campos de registro
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setFullName('');
    setApartment('');
    setBlock('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword);
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
        
        <Tabs defaultValue="login" className="px-8 pb-8">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase font-medium text-gray-500 tracking-wider" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-100 border-gray-200"
                  placeholder="exemplo@email.com"
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
                    placeholder="••••••••"
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
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-100 border-gray-200"
                  placeholder="Nome Completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email</Label>
                <Input
                  id="registerEmail"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="bg-gray-100 border-gray-200"
                  placeholder="exemplo@email.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartamento</Label>
                  <Input
                    id="apartment"
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="bg-gray-100 border-gray-200"
                    placeholder="Ex: 101"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="block">Bloco</Label>
                  <Input
                    id="block"
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="bg-gray-100 border-gray-200"
                    placeholder="Ex: A"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerPassword">Senha</Label>
                <div className="relative">
                  <Input
                    id="registerPassword"
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="bg-gray-100 border-gray-200 pr-10"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={toggleRegisterPasswordVisibility}
                  >
                    {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showRegisterPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-100 border-gray-200 pr-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertTitle className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Informação
                </AlertTitle>
                <AlertDescription>
                  Ao se cadastrar, você concorda com os termos de uso e políticas de privacidade do condomínio.
                </AlertDescription>
              </Alert>
              
              <Button
                type="submit"
                className="w-full bg-kondo-primary hover:bg-kondo-secondary transition-colors text-white font-medium"
                disabled={isRegistering}
              >
                {isRegistering ? 'Processando...' : 'CRIAR CONTA'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="text-white text-xs absolute bottom-4 left-4">
        Tela Inicial - Modo Normal
      </div>
    </div>
  );
};

export default Login;
