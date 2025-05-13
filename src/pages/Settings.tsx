
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por e-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas e atualizações por e-mail
                </p>
              </div>
              <Switch
                id="email-notifications"
                defaultChecked
                onCheckedChange={() => toast.success('Configuração salva')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Notificações no navegador</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações em tempo real no navegador
                </p>
              </div>
              <Switch
                id="browser-notifications"
                defaultChecked
                onCheckedChange={() => toast.success('Configuração salva')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sidebar-compact">Sidebar compacta</Label>
                <p className="text-sm text-muted-foreground">
                  Reduz o tamanho da barra lateral
                </p>
              </div>
              <Switch
                id="sidebar-compact"
                onCheckedChange={() => toast.success('Configuração salva')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => toast.info('Funcionalidade não implementada')}
            >
              Alterar senha
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => toast.info('Funcionalidade não implementada')}
            >
              Configurar autenticação de dois fatores
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
