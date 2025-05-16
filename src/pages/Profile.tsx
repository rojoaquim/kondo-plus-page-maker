import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  apartment: string;
  block: string;
  role: string;
}

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Campos editáveis
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [apartment, setApartment] = useState('');
  const [block, setBlock] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching profile for user:", user.id);
        
        // Call the RPC without type assertions
        const { data: role, error: roleError } = await supabase.rpc('get_current_user_role', {}, {
          count: 'exact'
        });
        
        if (roleError) {
          console.error('Error fetching user role:', roleError);
          toast.error('Erro ao carregar perfil: ' + roleError.message);
          return;
        }
        
        // Convert role to string if not null
        const roleStr = role !== null ? String(role) : '';
        
        // Get user email from auth
        const email = user.email || '';
        
        // Get additional profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, apartment, block')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile data:', error);
          toast.error('Erro ao carregar dados do perfil: ' + error.message);
          return;
        }
        
        const profileData: Profile = {
          id: user.id,
          email: email,
          full_name: data.full_name,
          apartment: data.apartment,
          block: data.block,
          role: roleStr
        };
        
        console.log("Profile data received:", profileData);
        setProfile(profileData);
        setFullName(profileData.full_name);
        setEmail(profileData.email);
        setApartment(profileData.apartment);
        setBlock(profileData.block);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Ocorreu um erro ao carregar o perfil');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    } else {
      console.log("No user available for profile fetch");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          apartment,
          block,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Erro ao atualizar perfil');
        return;
      }
      
      // Atualizar o estado do perfil
      setProfile({
        ...(profile as Profile),
        full_name: fullName,
        apartment,
        block,
      });
      
      toast.success('Perfil atualizado com sucesso');
      setIsEditing(false);
      refreshUser();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocorreu um erro ao atualizar o perfil');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    
    // Restaurar valores originais
    if (profile) {
      setFullName(profile.full_name);
      setEmail(profile.email);
      setApartment(profile.apartment);
      setBlock(profile.block);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setChangingPassword(true);
      
      // Verificar senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password
      });
      
      if (signInError) {
        toast.error('Senha atual incorreta');
        setChangingPassword(false);
        return;
      }
      
      // Atualizar senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error('Erro ao atualizar senha');
        return;
      }
      
      toast.success('Senha atualizada com sucesso');
      setChangePasswordOpen(false);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocorreu um erro ao atualizar a senha');
    } finally {
      setChangingPassword(false);
    }
  };
  
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        Carregando informações do perfil...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil de usuário</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Informações pessoais</CardTitle>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline"
              >
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="bg-kondo-primary text-white">
                  <User size={36} />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="link" className="mt-2 text-kondo-primary">
                  Alterar foto
                </Button>
              )}
              {profile?.role === 'sindico' && (
                <span className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Síndico
                </span>
              )}
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing || true} // Email sempre desabilitado pois é gerenciado pelo auth
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartamento</Label>
                  <Input
                    id="apartment"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="block">Bloco</Label>
                  <Input
                    id="block"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              {isEditing ? (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="bg-kondo-primary hover:bg-kondo-secondary"
                  >
                    Salvar
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    Alterar Senha
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para alterar senha */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input
                id="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleChangePassword}
              className="bg-kondo-primary hover:bg-kondo-secondary"
              disabled={changingPassword}
            >
              {changingPassword ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
