
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Search, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  apartment: string;
  block: string;
  created_at: string;
}

const Users: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  
  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  const checkAdminAndLoadUsers = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        toast.error('Erro ao verificar permissões');
        navigate('/');
        return;
      }
      
      if (data.role !== 'sindico') {
        toast.error('Você não tem permissão para acessar esta página');
        navigate('/');
        return;
      }
      
      fetchUsers();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao verificar permissões');
      navigate('/');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar usuários:', error);
        toast.error('Erro ao carregar usuários');
        return;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    try {
      setResettingPassword(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(selectedUser.email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        console.error('Erro ao resetar senha:', error);
        toast.error('Erro ao enviar e-mail de redefinição de senha');
        return;
      }
      
      toast.success(`E-mail de redefinição de senha enviado para ${selectedUser.email}`);
      setUserDialogOpen(false);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar solicitação de redefinição de senha');
    } finally {
      setResettingPassword(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.apartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">USUÁRIOS</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={fetchUsers}
        >
          <RefreshCcw size={16} />
          Atualizar
        </Button>
      </div>

      <div className="flex items-center relative mb-4">
        <Search size={20} className="absolute left-3 text-gray-400" />
        <Input
          placeholder="Buscar por nome, email, apartamento ou bloco..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <User size={18} className="text-kondo-accent" />
              Moradores
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Nome</th>
                  <th className="text-left pb-2">Email</th>
                  <th className="text-left pb-2">Apto</th>
                  <th className="text-left pb-2">Bloco</th>
                  <th className="text-left pb-2">Cadastro</th>
                  <th className="text-left pb-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">Carregando...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">Nenhum usuário encontrado</td>
                  </tr>
                ) : (
                  filteredUsers.map((profile) => (
                    <tr key={profile.id} className="border-b last:border-0">
                      <td className="py-3">{profile.full_name}</td>
                      <td className="py-3">{profile.email}</td>
                      <td className="py-3">{profile.apartment}</td>
                      <td className="py-3">{profile.block}</td>
                      <td className="py-3">{formatDate(profile.created_at)}</td>
                      <td className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Ações
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUserClick(profile)}>
                              Ver detalhes
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para visualizar detalhes do usuário */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-gray-500">Nome completo</p>
                  <p className="font-medium">{selectedUser.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Apartamento</p>
                  <p className="font-medium">{selectedUser.apartment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bloco</p>
                  <p className="font-medium">{selectedUser.block}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Data de cadastro</p>
                  <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setUserDialogOpen(false)}
                >
                  Fechar
                </Button>
                <Button
                  className="bg-kondo-primary hover:bg-kondo-secondary"
                  onClick={handleResetPassword}
                  disabled={resettingPassword}
                >
                  {resettingPassword ? 'Enviando...' : 'Redefinir senha'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
