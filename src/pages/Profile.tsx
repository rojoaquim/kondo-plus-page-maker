
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';

const Profile: React.FC = () => {
  const { refreshUser } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleSave = async (data: any) => {
    const result = await updateProfile(data);
    if (!result.error) {
      setIsEditing(false);
      refreshUser();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        Carregando informações do perfil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        Erro ao carregar o perfil. Por favor, tente novamente.
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
          <ProfileForm
            profile={profile}
            isEditing={isEditing}
            onSave={handleSave}
            onCancel={handleCancel}
            onEditClick={() => setIsEditing(true)}
          />

          {/* Add change password button when not editing */}
          {!isEditing && (
            <div className="flex justify-end space-x-3 mt-4">
              <Button 
                variant="outline"
                onClick={() => setChangePasswordOpen(true)}
              >
                Alterar Senha
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ChangePasswordDialog 
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </div>
  );
};

export default Profile;
