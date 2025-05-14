
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

interface Profile {
  id: string;
  full_name: string;
  email: string;
  apartment: string;
  block: string;
  role: 'sindico' | 'morador';
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Campos editáveis
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [apartment, setApartment] = useState('');
  const [block, setBlock] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Erro ao carregar perfil');
          return;
        }
        
        setProfile(data as Profile);
        setFullName(data.full_name);
        setEmail(data.email);
        setApartment(data.apartment);
        setBlock(data.block);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Ocorreu um erro ao carregar o perfil');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          email,
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
        email,
        apartment,
        block,
      });
      
      toast.success('Perfil atualizado com sucesso');
      setIsEditing(false);
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
              
              {isEditing && (
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
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
