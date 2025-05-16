
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { UserProfile } from '@/hooks/useUserProfile';

interface ProfileFormProps {
  profile: UserProfile;
  isEditing: boolean;
  onSave: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
  onEditClick: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isEditing,
  onSave,
  onCancel,
  onEditClick,
}) => {
  const [fullName, setFullName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [apartment, setApartment] = useState(profile.apartment);
  const [block, setBlock] = useState(profile.block);

  const handleSave = () => {
    onSave({
      full_name: fullName,
      apartment,
      block,
    });
  };

  const handleCancel = () => {
    // Reset form values
    setFullName(profile.full_name);
    setEmail(profile.email);
    setApartment(profile.apartment);
    setBlock(profile.block);
    onCancel();
  };

  return (
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
        {profile.role === 'sindico' && (
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
            disabled={true} // Email sempre desabilitado pois é gerenciado pelo auth
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
              onClick={onEditClick}
              variant="outline"
            >
              Editar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
