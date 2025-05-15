
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { Settings as SettingsIcon } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

interface MainLayoutContext {
  setIsCompactSidebar: (value: boolean) => void;
}

const Settings: React.FC = () => {
  const [compactSidebar, setCompactSidebar] = useState(false);
  const { setIsCompactSidebar } = useOutletContext<MainLayoutContext>();

  // Aplicar preferências salvas no carregamento
  useEffect(() => {
    const savedSettings = localStorage.getItem('kondo_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setCompactSidebar(settings.compactSidebar || false);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  // Atualizar a preferência de sidebar compacta
  const handleCompactSidebarChange = (value: boolean) => {
    setCompactSidebar(value);
    
    // Salvar configuração
    const currentSettings = localStorage.getItem('kondo_settings');
    let settings = { compactSidebar: value };
    
    if (currentSettings) {
      try {
        settings = { ...JSON.parse(currentSettings), compactSidebar: value };
      } catch (error) {
        console.error('Erro ao analisar configurações:', error);
      }
    }
    
    localStorage.setItem('kondo_settings', JSON.stringify(settings));
    
    // Propagar alteração para o componente pai
    setIsCompactSidebar(value);
    
    toast.success(`Sidebar ${value ? 'compacta' : 'expandida'} aplicada`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <SettingsIcon size={18} className="text-kondo-primary" />
            Preferências de Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-sidebar">Sidebar Compacta</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe apenas os ícones na barra lateral
                </p>
              </div>
              <Switch
                id="compact-sidebar"
                checked={compactSidebar}
                onCheckedChange={handleCompactSidebarChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
