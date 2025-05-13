
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { User } from 'lucide-react';

const Profile: React.FC = () => {
  const [name, setName] = useState('Carlos Silva');
  const [email, setEmail] = useState('carlos.silva@example.com');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Simulate save
    toast.success('Perfil atualizado com sucesso');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setName('Carlos Silva');
    setEmail('carlos.silva@example.com');
  };

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
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  disabled={!isEditing}
                />
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
