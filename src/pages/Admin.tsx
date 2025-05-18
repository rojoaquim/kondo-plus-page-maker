
import React, { useState } from 'react';
import UserManagement from '@/components/UserManagement';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [apartment, setApartment] = useState<string>('');
  const [block, setBlock] = useState<string>('');

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName || !apartment || !block) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            apartment,
            block,
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      // 2. Set the user role to 'sindico' in the profiles table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'sindico' })
          .eq('id', authData.user.id);
        
        if (profileError) {
          throw profileError;
        }
        
        toast.success(`Usuário administrador criado: ${email}`);
        // Reset form
        setEmail('');
        setPassword('');
        setFullName('');
        setApartment('');
        setBlock('');
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast.error(`Erro ao criar usuário admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <Alert>
        <AlertTitle>Importante!</AlertTitle>
        <AlertDescription>
          Esta página permite gerenciar usuários quando eles não conseguem se registrar por causa de conflitos. 
          Use com cuidado, pois a exclusão de usuários é irreversível.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="manage">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Gerenciar Usuários</TabsTrigger>
          <TabsTrigger value="create">Criar Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="mt-4">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="create" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Usuário Síndico</CardTitle>
              <CardDescription>
                Use este formulário para criar um novo usuário com privilégios de síndico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createAdminUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="exemplo@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="********" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Nome completo" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartamento</Label>
                    <Input 
                      id="apartment" 
                      type="text" 
                      placeholder="101" 
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="block">Bloco</Label>
                    <Input 
                      id="block" 
                      type="text" 
                      placeholder="A" 
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-kondo-primary hover:bg-kondo-secondary" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Usuário Síndico
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
